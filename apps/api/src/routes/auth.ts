import { Hono }       from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z }          from 'zod'
import { signJWT, verifyPassword, verifyTOTP, authMiddleware } from '../middleware/auth'
import { rateLimit }  from '../middleware/ratelimit'
import type { Env, Variables, User, Session } from '../types'

export const authRouter = new Hono<{ Bindings: Env; Variables: Variables }>()

const loginSchema = z.object({
  username: z.string().min(2).max(64),
  password: z.string().min(6).max(128),
  totp:     z.string().length(6).optional(),
  tabId:    z.string().uuid(),
})

// ── POST /v1/auth/login ───────────────────────────────────
authRouter.post('/login',
  rateLimit({ windowSecs: 60, maxRequests: 10, keyPrefix: 'login' }),
  zValidator('json', loginSchema),
  async c => {
    const { username, password, totp, tabId } = c.req.valid('json')
    const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'

    const user = await c.env.DB.prepare(
      `SELECT * FROM users WHERE username = ? AND is_active = 1 LIMIT 1`
    ).bind(username).first<User>()

    // Timing-safe: always run password check even if user not found
    const dummyHash = 'pbkdf2:00000000000000000000000000000000:100000:0000000000000000000000000000000000000000000000000000000000000000'
    const passwordOk = await verifyPassword(password, user?.password_hash ?? dummyHash)

    if (!user || !passwordOk) {
      await logEvent(c.env.DB, user?.id ?? 'unknown', 'login_failed', ip)
      return c.json({ error: 'invalid_credentials', message: 'Invalid username or password' }, 401)
    }

    // Admin requires TOTP
    if (user.role === 'admin') {
      if (!totp) return c.json({ error: 'totp_required', message: '2FA code required for admin' }, 403)
      const ok = await verifyTOTP(totp, c.env.ADMIN_TOTP_SECRET)
      if (!ok) {
        await logEvent(c.env.DB, user.id, 'totp_failed', ip)
        return c.json({ error: 'totp_invalid', message: 'Invalid 2FA code' }, 403)
      }
    }

    const sessionId = crypto.randomUUID()
    const now       = Date.now()
    const expiresAt = now + parseInt(c.env.SESSION_TTL_SECS) * 1000

    const session: Session = {
      userId: user.id, username: user.username, role: user.role,
      plan: user.plan, sessionId, tabId,
      createdAt: now, expiresAt, ip,
    }

    // Single-session: store active sessionId in KV
    await c.env.SESSIONS.put(`sess:${user.id}:active`, sessionId, {
      expirationTtl: parseInt(c.env.SESSION_TTL_SECS) + 120,
    })

    const token = await signJWT(session as unknown as Record<string, unknown>, c.env.JWT_SECRET)
    await logEvent(c.env.DB, user.id, 'login_success', ip)

    return c.json({
      token, expiresAt,
      user: { id: user.id, username: user.username, role: user.role, plan: user.plan, credits: user.credits },
    })
  }
)

// ── POST /v1/auth/logout ──────────────────────────────────
authRouter.post('/logout', authMiddleware(), async c => {
  const { userId } = c.get('user')
  await c.env.SESSIONS.delete(`sess:${userId}:active`)
  return c.json({ success: true })
})

// ── POST /v1/auth/claim-tab — take over active session ────
authRouter.post('/claim-tab', authMiddleware(), async c => {
  const session   = c.get('user')
  const sessionId = crypto.randomUUID()
  const newTabId  = c.req.header('X-Tab-Id') ?? crypto.randomUUID()

  await c.env.SESSIONS.put(`sess:${session.userId}:active`, sessionId, {
    expirationTtl: parseInt(c.env.SESSION_TTL_SECS) + 120,
  })

  const newSession: Session = { ...session, sessionId, tabId: newTabId, expiresAt: Date.now() + parseInt(c.env.SESSION_TTL_SECS) * 1000 }
  const token = await signJWT(newSession as unknown as Record<string, unknown>, c.env.JWT_SECRET)
  return c.json({ token, sessionId, tabId: newTabId })
})

// ── GET /v1/auth/me ───────────────────────────────────────
authRouter.get('/me', authMiddleware(), async c => {
  const { userId } = c.get('user')
  const user = await c.env.DB.prepare(
    `SELECT id, username, email, role, plan, credits, created_at FROM users WHERE id = ?`
  ).bind(userId).first<Partial<User>>()
  if (!user) return c.json({ error: 'not_found' }, 404)
  return c.json({ user })
})

async function logEvent(db: D1Database, userId: string, event: string, ip: string) {
  await db.prepare(
    `INSERT INTO security_events (id, user_id, event, ip, created_at) VALUES (?,?,?,?,?)`
  ).bind(crypto.randomUUID(), userId, event, ip, new Date().toISOString()).run()
}
