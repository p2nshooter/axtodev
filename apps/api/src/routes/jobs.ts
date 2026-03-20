import { Hono }       from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z }          from 'zod'
import { authMiddleware } from '../middleware/auth'
import { rateLimit }     from '../middleware/ratelimit'
import type { Env, Variables, Job, PricingRule } from '../types'

export const jobsRouter = new Hono<{ Bindings: Env; Variables: Variables }>()

const createJobSchema = z.object({
  workspace: z.enum(['image', 'video', 'text', 'code', 'audio', '3d', 'enhance']),
  tool:      z.string().min(1).max(64),
  prompt:    z.string().max(4096).optional(),
  params:    z.record(z.unknown()).optional(),
})

// ── POST /v1/jobs — submit a new generation job ───────────
jobsRouter.post('/',
  authMiddleware(),
  rateLimit({ windowSecs: 60, maxRequests: 30, keyPrefix: 'jobs' }),
  zValidator('json', createJobSchema),
  async c => {
    const { workspace, tool, prompt, params } = c.req.valid('json')
    const session = c.get('user')

    // Get pricing rule
    const rule = await c.env.DB.prepare(
      `SELECT * FROM pricing_rules WHERE workspace = ? AND tool = ? LIMIT 1`
    ).bind(workspace, tool).first<PricingRule>()

    if (!rule) return c.json({ error: 'invalid_tool', message: 'Tool not found or unavailable' }, 400)

    const creditCost = Math.ceil(rule.credit_price)

    // Atomic credit deduction (server-side only — clients cannot influence this)
    const result = await c.env.DB.prepare(
      `UPDATE users SET credits = credits - ? WHERE id = ? AND credits >= ? RETURNING credits`
    ).bind(creditCost, session.userId, creditCost).first<{ credits: number }>()

    if (!result) return c.json({ error: 'insufficient_credits', message: 'Not enough credits' }, 402)

    // Log credit transaction
    await c.env.DB.prepare(
      `INSERT INTO credit_transactions (id, user_id, type, amount, balance_after, note, created_at)
       VALUES (?,?,?,?,?,?,?)`
    ).bind(crypto.randomUUID(), session.userId, 'spend', -creditCost, result.credits,
      `${workspace}/${tool}`, new Date().toISOString()).run()

    // Create job record
    const jobId    = crypto.randomUUID()
    const now      = new Date().toISOString()
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString() // 72 hours

    await c.env.DB.prepare(
      `INSERT INTO jobs (id, user_id, workspace, tool, status, credits_cost, real_cost, prompt, meta, expires_at, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(jobId, session.userId, workspace, tool, 'queued', creditCost, rule.real_cost,
      prompt ?? null, JSON.stringify(params ?? {}), expiresAt, now).run()

    // In production: dispatch to queue / AI provider here
    // ctx.waitUntil(dispatchJob(jobId, workspace, tool, prompt, params, c.env))

    return c.json({ jobId, status: 'queued', creditCost, creditsRemaining: result.credits, expiresAt }, 201)
  }
)

// ── GET /v1/jobs — list user's jobs ───────────────────────
jobsRouter.get('/', authMiddleware(), async c => {
  const session  = c.get('user')
  const limit    = Math.min(parseInt(c.req.query('limit') ?? '20'), 100)
  const offset   = parseInt(c.req.query('offset') ?? '0')
  const workspace = c.req.query('workspace')

  let query = `SELECT id, workspace, tool, status, credits_cost, prompt, result_url, expires_at, created_at, completed_at
               FROM jobs WHERE user_id = ?`
  const binds: unknown[] = [session.userId]

  if (workspace) { query += ' AND workspace = ?'; binds.push(workspace) }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  binds.push(limit, offset)

  const jobs = await c.env.DB.prepare(query).bind(...binds).all<Partial<Job>>()
  return c.json({ jobs: jobs.results, total: jobs.results.length })
})

// ── GET /v1/jobs/:id — get single job + signed URL ────────
jobsRouter.get('/:id', authMiddleware(), async c => {
  const session = c.get('user')
  const job = await c.env.DB.prepare(
    `SELECT * FROM jobs WHERE id = ? AND user_id = ?`
  ).bind(c.req.param('id'), session.userId).first<Job>()

  if (!job) return c.json({ error: 'not_found' }, 404)

  // Generate fresh signed URL if file still exists
  let signedUrl: string | null = null
  if (job.result_key) {
    try {
      signedUrl = await c.env.OUTPUTS.createPresignedUrl(job.result_key, { expiresIn: 3600 })
    } catch { /* file may have been deleted */ }
  }

  return c.json({ ...job, result_url: signedUrl })
})
