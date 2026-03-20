import { Hono }          from 'hono'
import { cors }           from 'hono/cors'
import { secureHeaders }  from 'hono/secure-headers'
import { logger }         from 'hono/logger'
import { timing }         from 'hono/timing'
import type { Env, Variables } from './types'

import { authRouter }    from './routes/auth'
import { creditsRouter } from './routes/credits'
import { jobsRouter }    from './routes/jobs'
import { adminRouter }   from './routes/admin'
import { poolRouter }    from './routes/pool'
import { webhookRouter } from './routes/webhooks'
import { requestId }     from './middleware/request-id'
import { rateLimit }     from './middleware/ratelimit'

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

// ── Global middleware ──────────────────────────────────────
app.use('*', timing())
app.use('*', logger())
app.use('*', requestId())
app.use('*', secureHeaders({
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
  xFrameOptions:           'DENY',
  xContentTypeOptions:     'nosniff',
  referrerPolicy:          'strict-origin-when-cross-origin',
}))
app.use('*', cors({
  origin: (origin, c) => {
    const env = c.env as Env
    const allowed = [`https://${env.APP_DOMAIN}`, `https://www.${env.APP_DOMAIN}`, `https://staging.${env.APP_DOMAIN}`]
    if (!origin) return origin
    if (env.APP_ENV !== 'production' && origin.startsWith('http://localhost')) return origin
    // Allow CF Pages preview URLs
    if (/https:\/\/[a-z0-9-]+\.axto-web\.pages\.dev$/.test(origin)) return origin
    return allowed.includes(origin) ? origin : null
  },
  allowMethods:  ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders:  ['Content-Type', 'Authorization', 'X-Tab-Id', 'X-Session-Id'],
  exposeHeaders: ['X-Request-Id', 'X-RateLimit-Remaining'],
  credentials:   true,
  maxAge:        600,
}))

// ── Health check ──────────────────────────────────────────
app.get('/health', c => c.json({ status: 'ok', env: c.env.APP_ENV, ts: Date.now() }))

// ── API routes ────────────────────────────────────────────
app.route('/v1/auth',     authRouter)
app.route('/v1/credits',  creditsRouter)
app.route('/v1/jobs',     jobsRouter)
app.route('/v1/admin',    adminRouter)
app.route('/v1/pool',     poolRouter)
app.route('/v1/webhooks', webhookRouter)

// ── 404 ──────────────────────────────────────────────────
app.notFound(c => c.json({ error: 'not_found', message: 'Route not found' }, 404))

// ── Error handler ─────────────────────────────────────────
app.onError((err, c) => {
  const rid = c.get('requestId') ?? 'unknown'
  console.error(`[${rid}]`, err)
  return c.json({ error: 'internal_error', message: 'Unexpected error', requestId: rid }, 500)
})

// ── Scheduled handler — 72h output TTL cleanup ────────────
const scheduled: ExportedHandlerScheduledHandler<Env> = async (_event, env, _ctx) => {
  console.log('[cron] Running 72h output expiry cleanup...')
  const threshold = new Date(Date.now() - parseInt(env.OUTPUT_TTL_SECS) * 1000).toISOString()
  const expired = await env.DB.prepare(
    `SELECT id, user_id, result_key FROM jobs
     WHERE status = 'done' AND result_key IS NOT NULL AND expires_at < ?`
  ).bind(threshold).all()

  let deleted = 0
  for (const job of (expired.results as { id:string; user_id:string; result_key:string }[])) {
    try {
      await env.OUTPUTS.delete(job.result_key)
      await env.DB.prepare(
        `UPDATE jobs SET result_key = NULL, result_url = NULL WHERE id = ?`
      ).bind(job.id).run()
      deleted++
    } catch (e) {
      console.error(`[cron] Failed to delete ${job.result_key}:`, e)
    }
  }
  console.log(`[cron] Deleted ${deleted} expired output files`)
}

export default { fetch: app.fetch, scheduled }
