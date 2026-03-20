// ══════════════════════════════════════════════════════════
//  AXTO API — Type Definitions
// ══════════════════════════════════════════════════════════

export interface Env {
  // Cloudflare bindings
  DB:         D1Database
  SESSIONS:   KVNamespace
  RATE_LIMIT: KVNamespace
  OUTPUTS:    R2Bucket

  // Secrets
  JWT_SECRET:          string
  ADMIN_TOTP_SECRET:   string
  OPENAI_API_KEY:      string
  ANTHROPIC_API_KEY:   string
  REPLICATE_API_TOKEN: string
  RUNWAYML_API_KEY:    string
  ELEVENLABS_API_KEY:  string
  SUNO_API_KEY:        string

  // Vars
  APP_ENV:          string
  APP_DOMAIN:       string
  API_DOMAIN:       string
  SESSION_TTL_SECS: string
  OUTPUT_TTL_SECS:  string
}

export interface Variables {
  user:      Session
  requestId: string
}

export interface User {
  id:            string
  username:      string
  email:         string
  role:          'client' | 'admin'
  credits:       number
  plan:          'starter' | 'creator' | 'studio' | 'enterprise'
  is_active:     number   // SQLite 0/1
  password_hash: string
  created_at:    string
  updated_at:    string
}

export interface Session {
  userId:    string
  username:  string
  role:      'client' | 'admin'
  plan:      string
  sessionId: string
  tabId:     string
  createdAt: number
  expiresAt: number
  ip:        string
}

export type Workspace = 'image' | 'video' | 'text' | 'code' | 'audio' | '3d' | 'enhance'
export type JobStatus  = 'queued' | 'running' | 'done' | 'failed'

export interface Job {
  id:           string
  user_id:      string
  workspace:    Workspace
  tool:         string
  status:       JobStatus
  credits_cost: number
  real_cost:    number
  prompt:       string | null
  result_key:   string | null   // R2 object key
  result_url:   string | null   // signed URL (short-lived)
  expires_at:   string          // ISO — 72h after creation
  meta:         string          // JSON
  created_at:   string
  completed_at: string | null
}

export interface CreditTx {
  id:            string
  user_id:       string
  type:          'purchase' | 'spend' | 'refund' | 'admin_grant'
  amount:        number
  balance_after: number
  note:          string | null
  created_at:    string
}

export interface PricingRule {
  id:           string
  workspace:    Workspace
  tool:         string
  real_cost:    number   // USD per unit
  markup_x:     number   // 2–1000
  credit_price: number
  updated_at:   string
  updated_by:   string
}

export interface GpuNode {
  id:           string
  name:         string
  gpu_type:     string
  provider:     string
  status:       'online' | 'busy' | 'scaling' | 'idle_od' | 'offline'
  gpu_util:     number
  mem_util:     number
  net_mbps:     number
  cost_per_hr:  number
  region:       string
  is_idle_od:   number   // 1 = idle-on-demand simulated node
  created_at:   string
}
