-- ══════════════════════════════════════════════════════════
--  AXTO D1 Schema — Migration 001
--  Cloudflare D1 (SQLite-compatible)
-- ══════════════════════════════════════════════════════════

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client','admin')),
  plan          TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter','creator','studio','enterprise')),
  credits       INTEGER NOT NULL DEFAULT 0,
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email    ON users(email);

-- Jobs (outputs auto-deleted after 72h via cron)
CREATE TABLE IF NOT EXISTS jobs (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  workspace     TEXT NOT NULL,
  tool          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','done','failed')),
  credits_cost  INTEGER NOT NULL DEFAULT 0,
  real_cost     REAL NOT NULL DEFAULT 0,
  prompt        TEXT,
  result_key    TEXT,          -- R2 object key (NULL after 72h deletion)
  result_url    TEXT,          -- ephemeral signed URL
  expires_at    TEXT NOT NULL, -- 72 hours after creation
  meta          TEXT NOT NULL DEFAULT '{}',
  created_at    TEXT NOT NULL,
  completed_at  TEXT
);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id   ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status    ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_expires   ON jobs(expires_at);
CREATE INDEX IF NOT EXISTS idx_jobs_workspace ON jobs(workspace);

-- Credit transactions (ledger)
CREATE TABLE IF NOT EXISTS credit_transactions (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  type          TEXT NOT NULL CHECK (type IN ('purchase','spend','refund','admin_grant')),
  amount        INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  note          TEXT,
  created_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_credit_tx_user ON credit_transactions(user_id);

-- Pricing rules (real cost × markup = client credit price)
CREATE TABLE IF NOT EXISTS pricing_rules (
  id            TEXT PRIMARY KEY,
  workspace     TEXT NOT NULL,
  tool          TEXT NOT NULL,
  real_cost     REAL NOT NULL,   -- USD per unit (never shown to clients)
  markup_x      INTEGER NOT NULL DEFAULT 100,  -- 2–1000×
  credit_price  REAL GENERATED ALWAYS AS (real_cost * markup_x) STORED,
  updated_at    TEXT NOT NULL,
  updated_by    TEXT NOT NULL,
  UNIQUE(workspace, tool)
);

-- GPU nodes
CREATE TABLE IF NOT EXISTS gpu_nodes (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  gpu_type      TEXT NOT NULL,
  provider      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'offline',
  gpu_util      INTEGER NOT NULL DEFAULT 0,
  mem_util      INTEGER NOT NULL DEFAULT 0,
  net_mbps      INTEGER NOT NULL DEFAULT 0,
  cost_per_hr   REAL NOT NULL DEFAULT 0,
  region        TEXT NOT NULL,
  is_idle_od    INTEGER NOT NULL DEFAULT 0,  -- 1 = idle-on-demand simulated
  created_at    TEXT NOT NULL
);

-- AI models
CREATE TABLE IF NOT EXISTS ai_models (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  provider      TEXT NOT NULL,
  workspace     TEXT NOT NULL,
  is_enabled    INTEGER NOT NULL DEFAULT 1,
  instances     INTEGER NOT NULL DEFAULT 1,
  avg_latency   TEXT,
  cost_per_unit TEXT,
  created_at    TEXT NOT NULL
);

-- Security events log
CREATE TABLE IF NOT EXISTS security_events (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  event      TEXT NOT NULL,
  ip         TEXT NOT NULL,
  meta       TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sec_events_user ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_sec_events_time ON security_events(created_at);
