import type { MiddlewareHandler } from 'hono'
import type { Env, Variables } from '../types'

// ── Request ID ────────────────────────────────────────────
export function requestId(): MiddlewareHandler<{ Bindings: Env; Variables: Variables }> {
  return async (c, next) => {
    const id = crypto.randomUUID()
    c.set('requestId', id)
    c.header('X-Request-Id', id)
    await next()
  }
}

// ── Sliding-window rate limiter (KV-backed) ───────────────
export function rateLimit(opts: {
  windowSecs:  number
  maxRequests: number
  keyPrefix?:  string
}): MiddlewareHandler<{ Bindings: Env; Variables: Variables }> {
  return async (c, next) => {
    const user = c.get('user')
    const ip   = c.req.header('CF-Connecting-IP') ?? 'unknown'
    const id   = user?.userId ?? ip
    const key  = `rl:${opts.keyPrefix ?? 'global'}:${id}`
    const now  = Date.now()
    const win  = opts.windowSecs * 1000

    const raw = await c.env.RATE_LIMIT.get(key)
    const entry: { count: number; windowStart: number } = raw
      ? (JSON.parse(raw) as { count: number; windowStart: number })
      : { count: 0, windowStart: now }

    if (now - entry.windowStart > win) { entry.count = 0; entry.windowStart = now }
    entry.count++

    await c.env.RATE_LIMIT.put(key, JSON.stringify(entry), { expirationTtl: opts.windowSecs + 30 })

    c.header('X-RateLimit-Limit',     String(opts.maxRequests))
    c.header('X-RateLimit-Remaining', String(Math.max(0, opts.maxRequests - entry.count)))
    c.header('X-RateLimit-Reset',     String(Math.ceil((entry.windowStart + win) / 1000)))

    if (entry.count > opts.maxRequests) {
      return c.json({
        error:      'rate_limited',
        message:    `Too many requests — max ${opts.maxRequests} per ${opts.windowSecs}s`,
        retryAfter: Math.ceil((entry.windowStart + win - now) / 1000),
      }, 429)
    }
    await next()
  }
}
