// ══════════════════════════════════════════════════════════
//  AXTO API — Credits, Admin, Pool, Webhooks Routes
// ══════════════════════════════════════════════════════════
import { Hono }          from 'hono'
import { zValidator }    from '@hono/zod-validator'
import { z }             from 'zod'
import { authMiddleware } from '../middleware/auth'
import type { Env, Variables } from '../types'

// ── CREDITS ───────────────────────────────────────────────
export const creditsRouter = new Hono<{ Bindings: Env; Variables: Variables }>()

creditsRouter.get('/balance', authMiddleware(), async c => {
  const { userId } = c.get('user')
  const row = await c.env.DB.prepare('SELECT credits FROM users WHERE id = ?').bind(userId).first<{ credits: number }>()
  return c.json({ credits: row?.credits ?? 0 })
})

creditsRouter.get('/history', authMiddleware(), async c => {
  const { userId } = c.get('user')
  const txs = await c.env.DB.prepare(
    `SELECT id, type, amount, balance_after, note, created_at FROM credit_transactions
     WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`
  ).bind(userId).all()
  return c.json({ transactions: txs.results })
})

// ── ADMIN ─────────────────────────────────────────────────
export const adminRouter = new Hono<{ Bindings: Env; Variables: Variables }>()

// All admin routes require admin role
adminRouter.use('*', authMiddleware('admin'))

adminRouter.get('/stats', async c => {
  const [users, jobs, revenue] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN is_active=1 THEN 1 ELSE 0 END) as active FROM users').first(),
    c.env.DB.prepare("SELECT COUNT(*) as total, SUM(CASE WHEN status='done' THEN 1 ELSE 0 END) as done, SUM(CASE WHEN status='running' THEN 1 ELSE 0 END) as running FROM jobs").first(),
    c.env.DB.prepare("SELECT SUM(credits_cost) as total_credits, SUM(real_cost) as total_real_cost FROM jobs WHERE status='done' AND created_at >= datetime('now','-1 day')").first(),
  ])
  return c.json({ users, jobs, revenue })
})

adminRouter.get('/users', async c => {
  const limit  = Math.min(parseInt(c.req.query('limit') ?? '50'), 200)
  const offset = parseInt(c.req.query('offset') ?? '0')
  const users  = await c.env.DB.prepare(
    `SELECT id, username, email, role, plan, credits, is_active, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).bind(limit, offset).all()
  return c.json({ users: users.results })
})

adminRouter.patch('/users/:id/credits', zValidator('json', z.object({ delta: z.number(), note: z.string().optional() })), async c => {
  const { delta, note } = c.req.valid('json')
  const result = await c.env.DB.prepare(
    `UPDATE users SET credits = credits + ? WHERE id = ? RETURNING credits`
  ).bind(delta, c.req.param('id')).first<{ credits: number }>()
  if (!result) return c.json({ error: 'not_found' }, 404)
  await c.env.DB.prepare(
    `INSERT INTO credit_transactions (id, user_id, type, amount, balance_after, note, created_at) VALUES (?,?,?,?,?,?,?)`
  ).bind(crypto.randomUUID(), c.req.param('id'), 'admin_grant', delta, result.credits, note ?? 'Admin adjustment', new Date().toISOString()).run()
  return c.json({ credits: result.credits })
})

adminRouter.patch('/users/:id/status', zValidator('json', z.object({ is_active: z.number().min(0).max(1) })), async c => {
  await c.env.DB.prepare('UPDATE users SET is_active = ? WHERE id = ?').bind(c.req.valid('json').is_active, c.req.param('id')).run()
  if (c.req.valid('json').is_active === 0) {
    await c.env.SESSIONS.delete(`sess:${c.req.param('id')}:active`)
  }
  return c.json({ success: true })
})

adminRouter.get('/pricing', async c => {
  const rules = await c.env.DB.prepare('SELECT * FROM pricing_rules ORDER BY workspace, tool').all()
  return c.json({ rules: rules.results })
})

adminRouter.patch('/pricing/:id', zValidator('json', z.object({ markup_x: z.number().min(2).max(1000) })), async c => {
  const { markup_x } = c.req.valid('json')
  const { userId } = c.get('user')
  await c.env.DB.prepare(
    `UPDATE pricing_rules SET markup_x = ?, updated_at = ?, updated_by = ? WHERE id = ?`
  ).bind(markup_x, new Date().toISOString(), userId, c.req.param('id')).run()
  return c.json({ success: true })
})

adminRouter.get('/security/events', async c => {
  const events = await c.env.DB.prepare(
    `SELECT * FROM security_events ORDER BY created_at DESC LIMIT 100`
  ).all()
  return c.json({ events: events.results })
})

adminRouter.delete('/sessions/:userId', async c => {
  await c.env.SESSIONS.delete(`sess:${c.req.param('userId')}:active`)
  return c.json({ success: true, message: 'Session terminated' })
})

// ── GPU POOL ──────────────────────────────────────────────
export const poolRouter = new Hono<{ Bindings: Env; Variables: Variables }>()

poolRouter.use('*', authMiddleware('admin'))

poolRouter.get('/gpu', async c => {
  const nodes = await c.env.DB.prepare('SELECT * FROM gpu_nodes ORDER BY name').all()
  return c.json({ nodes: nodes.results })
})

poolRouter.post('/gpu/scale', zValidator('json', z.object({ action: z.enum(['up','down']), count: z.number().min(1).max(10).optional() })), async c => {
  const { action, count = 1 } = c.req.valid('json')
  // In production: call GPU provider API (Lambda, CoreWeave, RunPod, etc.)
  return c.json({ success: true, action, count, message: `Scale ${action} initiated for ${count} node(s)` })
})

poolRouter.get('/ai', async c => {
  const models = await c.env.DB.prepare('SELECT * FROM ai_models ORDER BY name').all()
  return c.json({ models: models.results })
})

poolRouter.patch('/ai/:id/toggle', zValidator('json', z.object({ enabled: z.boolean() })), async c => {
  await c.env.DB.prepare('UPDATE ai_models SET is_enabled = ? WHERE id = ?').bind(c.req.valid('json').enabled ? 1 : 0, c.req.param('id')).run()
  return c.json({ success: true })
})

// ── WEBHOOKS ──────────────────────────────────────────────
export const webhookRouter = new Hono<{ Bindings: Env; Variables: Variables }>()

// Called by AI providers when a job completes
webhookRouter.post('/job-complete', async c => {
  const body = await c.req.json<{ jobId: string; resultKey: string; provider: string }>()

  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
  await c.env.DB.prepare(
    `UPDATE jobs SET status='done', result_key=?, expires_at=?, completed_at=? WHERE id=?`
  ).bind(body.resultKey, expiresAt, new Date().toISOString(), body.jobId).run()

  return c.json({ received: true })
})
