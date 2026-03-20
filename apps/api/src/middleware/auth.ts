import type { MiddlewareHandler } from 'hono'
import type { Env, Variables, Session } from '../types'

// ── JWT (CF-native SubtleCrypto, no external deps) ────────
export async function signJWT(payload: Record<string, unknown>, secret: string): Promise<string> {
  const enc  = (s: string) => btoa(JSON.stringify(s)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')
  const hdr  = btoa(JSON.stringify({ alg:'HS256', typ:'JWT' })).replace(/=/g,'')
  const body = btoa(JSON.stringify(payload)).replace(/=/g,'')
  const data = `${hdr}.${body}`
  const key  = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign'])
  const sig  = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const b64  = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')
  return `${data}.${b64}`
}

export async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [hdr, body, sig] = parts as [string, string, string]
  const data = `${hdr}.${body}`
  const key  = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['verify'])
  const rawSig = Uint8Array.from(atob(sig.replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0))
  const valid  = await crypto.subtle.verify('HMAC', key, rawSig, new TextEncoder().encode(data))
  if (!valid) return null
  try { return JSON.parse(atob(body + '==')) as Record<string, unknown> } catch { return null }
}

// ── Auth middleware ────────────────────────────────────────
export function authMiddleware(requireRole?: 'admin'): MiddlewareHandler<{ Bindings: Env; Variables: Variables }> {
  return async (c, next) => {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return c.json({ error:'unauthorized', message:'Missing bearer token' }, 401)

    const payload = await verifyJWT(auth.slice(7), c.env.JWT_SECRET)
    if (!payload) return c.json({ error:'unauthorized', message:'Invalid or expired token' }, 401)

    const session = payload as unknown as Session
    if (session.expiresAt < Date.now()) return c.json({ error:'token_expired', message:'Session expired' }, 401)

    // ── Single-session enforcement via KV ──────────────────
    const sessionId = c.req.header('X-Session-Id') ?? ''
    const activeId  = await c.env.SESSIONS.get(`sess:${session.userId}:active`)
    if (activeId && activeId !== sessionId) {
      return c.json({ error:'duplicate_session', message:'Another session is active. Refresh to claim.', code:'TAB_CONFLICT' }, 409)
    }

    if (requireRole && session.role !== requireRole) return c.json({ error:'forbidden', message:'Insufficient permissions' }, 403)

    c.set('user', session)
    await next()
  }
}

// ── TOTP (RFC 6238) ───────────────────────────────────────
export async function verifyTOTP(token: string, secret: string): Promise<boolean> {
  const step = Math.floor(Date.now() / 30000)
  for (const drift of [-1, 0, 1]) {
    const counter = step + drift
    const key = await crypto.subtle.importKey('raw', base32Decode(secret), { name:'HMAC', hash:'SHA-1' }, false, ['sign'])
    const buf = new DataView(new ArrayBuffer(8))
    buf.setUint32(4, counter, false)
    const sig    = await crypto.subtle.sign('HMAC', key, buf.buffer)
    const arr    = new Uint8Array(sig)
    const offset = (arr[19] ?? 0) & 0x0f
    const otp    = (
      ((arr[offset]   ?? 0) & 0x7f) << 24 |
      ((arr[offset+1] ?? 0) & 0xff) << 16 |
      ((arr[offset+2] ?? 0) & 0xff) << 8  |
      ((arr[offset+3] ?? 0) & 0xff)
    ) % 1_000_000
    if (otp.toString().padStart(6, '0') === token) return true
  }
  return false
}

// ── PBKDF2 password verify ────────────────────────────────
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!hash.startsWith('pbkdf2:')) return false
  const [, salt, iters, stored] = hash.split(':')
  if (!salt || !iters || !stored) return false
  const key     = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const derived = await crypto.subtle.deriveBits({ name:'PBKDF2', salt:hexToBytes(salt), iterations:parseInt(iters), hash:'SHA-256' }, key, 256)
  return timingSafeEq(bytesToHex(new Uint8Array(derived)), stored)
}

export async function hashPassword(password: string): Promise<string> {
  const salt   = bytesToHex(crypto.getRandomValues(new Uint8Array(16)))
  const iters  = 100_000
  const key    = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const derived = await crypto.subtle.deriveBits({ name:'PBKDF2', salt:hexToBytes(salt), iterations:iters, hash:'SHA-256' }, key, 256)
  return `pbkdf2:${salt}:${iters}:${bytesToHex(new Uint8Array(derived))}`
}

function hexToBytes(h: string): Uint8Array { return new Uint8Array(h.match(/.{2}/g)!.map(b => parseInt(b, 16))) }
function bytesToHex(b: Uint8Array): string { return Array.from(b).map(x => x.toString(16).padStart(2,'0')).join('') }
function timingSafeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return d === 0
}
function base32Decode(s: string): Uint8Array {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const clean = s.replace(/=+$/, '').toUpperCase()
  let bits = 0, val = 0
  const out: number[] = []
  for (const c of clean) {
    val = (val << 5) | alpha.indexOf(c); bits += 5
    if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8 }
  }
  return new Uint8Array(out)
}
