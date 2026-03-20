// ══════════════════════════════════════════════════════════
//  AXTO Shared Types — used by both api & web
// ══════════════════════════════════════════════════════════

export type Workspace = 'image' | 'video' | 'text' | 'code' | 'audio' | '3d' | 'enhance'
export type JobStatus  = 'queued' | 'running' | 'done' | 'failed'
export type UserRole   = 'client' | 'admin'
export type UserPlan   = 'starter' | 'creator' | 'studio' | 'enterprise'

export interface PublicUser {
  id:         string
  username:   string
  email:      string
  role:       UserRole
  plan:       UserPlan
  credits:    number
  created_at: string
}

export interface PublicJob {
  id:           string
  workspace:    Workspace
  tool:         string
  status:       JobStatus
  credits_cost: number
  prompt:       string | null
  result_url:   string | null
  expires_at:   string
  created_at:   string
  completed_at: string | null
}

export interface CreditTransaction {
  id:            string
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
  real_cost:    number
  markup_x:     number
  credit_price: number
  updated_at:   string
}

// Credit costs per plan (used for gating on the client)
export const PLAN_CREDITS: Record<UserPlan, number> = {
  starter:    1200,
  creator:    5000,
  studio:     15000,
  enterprise: 60000,
}

export const PLAN_PRICE_USD: Record<UserPlan, number> = {
  starter:    19,
  creator:    59,
  studio:     149,
  enterprise: 499,
}

// Workspace metadata
export const WORKSPACE_META: Record<Workspace, { label: string; icon: string; minPlan: UserPlan }> = {
  image:   { label: 'Image Generation', icon: '🎨', minPlan: 'starter' },
  video:   { label: 'Video Generation', icon: '🎬', minPlan: 'creator' },
  text:    { label: 'AI Copywriting',   icon: '✍️', minPlan: 'starter' },
  code:    { label: 'Code Generation',  icon: '💻', minPlan: 'starter' },
  audio:   { label: 'Voice & Audio',    icon: '🎙', minPlan: 'creator' },
  '3d':    { label: '3D & Rendering',   icon: '🧊', minPlan: 'studio'  },
  enhance: { label: 'Enhancement',      icon: '✨', minPlan: 'starter' },
}
