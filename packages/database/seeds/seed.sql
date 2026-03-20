-- ══════════════════════════════════════════════════════════
--  AXTO — Seed Data
-- ══════════════════════════════════════════════════════════

-- Demo users
-- Passwords: creator1→pass123, admin→nexus@admin2025
-- (pbkdf2 hashes — replace with real hashes from scripts/hash-password.mjs)
INSERT OR IGNORE INTO users (id, username, email, password_hash, role, plan, credits, is_active, created_at, updated_at) VALUES
  ('usr_001', 'creator1',   'creator1@axto.dev',   'pbkdf2:REPLACE_WITH_REAL_HASH', 'client', 'creator',    5000,   1, datetime('now'), datetime('now')),
  ('usr_002', 'creator2',   'creator2@axto.dev',   'pbkdf2:REPLACE_WITH_REAL_HASH', 'client', 'starter',    1200,   1, datetime('now'), datetime('now')),
  ('usr_003', 'brandagency','ops@brand.agency',     'pbkdf2:REPLACE_WITH_REAL_HASH', 'client', 'enterprise', 60000,  1, datetime('now'), datetime('now')),
  ('usr_adm', 'admin',      'admin@axto.dev',       'pbkdf2:REPLACE_WITH_REAL_HASH', 'admin',  'enterprise', 999999, 1, datetime('now'), datetime('now'));

-- Pricing rules (100× default markup — never shown to clients)
INSERT OR IGNORE INTO pricing_rules (id, workspace, tool, real_cost, markup_x, updated_at, updated_by) VALUES
  ('pr_001', 'image',   'sdxl_turbo',    0.0008, 100, datetime('now'), 'usr_adm'),
  ('pr_002', 'image',   'flux_pro',      0.0025, 100, datetime('now'), 'usr_adm'),
  ('pr_003', 'image',   'dalle3',        0.0400, 50,  datetime('now'), 'usr_adm'),
  ('pr_004', 'image',   'stable35',      0.0020, 100, datetime('now'), 'usr_adm'),
  ('pr_005', 'video',   'kling_5s',      0.1800, 120, datetime('now'), 'usr_adm'),
  ('pr_006', 'video',   'runway_gen3',   0.1200, 150, datetime('now'), 'usr_adm'),
  ('pr_007', 'video',   'pika',          0.0800, 100, datetime('now'), 'usr_adm'),
  ('pr_008', 'text',    'gpt4o_1k',      0.0050, 100, datetime('now'), 'usr_adm'),
  ('pr_009', 'text',    'claude35_1k',   0.0030, 100, datetime('now'), 'usr_adm'),
  ('pr_010', 'code',    'o1_pro_1k',     0.0150, 80,  datetime('now'), 'usr_adm'),
  ('pr_011', 'audio',   'elevenlabs_min',0.1800, 100, datetime('now'), 'usr_adm'),
  ('pr_012', 'audio',   'suno_track',    0.0500, 200, datetime('now'), 'usr_adm'),
  ('pr_013', '3d',      'triposr',       0.0800, 200, datetime('now'), 'usr_adm'),
  ('pr_014', 'enhance', 'realesrgan',    0.0020, 500, datetime('now'), 'usr_adm');

-- GPU Nodes
INSERT OR IGNORE INTO gpu_nodes (id, name, gpu_type, provider, status, gpu_util, mem_util, net_mbps, cost_per_hr, region, is_idle_od, created_at) VALUES
  ('gpu_001', 'A100-01', 'A100-80G',   'Lambda Labs',  'busy',    92, 78, 45, 3.80, 'us-east-1', 0, datetime('now')),
  ('gpu_002', 'A100-02', 'A100-80G',   'Lambda Labs',  'busy',    88, 72, 38, 3.80, 'us-east-1', 0, datetime('now')),
  ('gpu_003', 'H100-01', 'H100-SXM5',  'CoreWeave',    'busy',    97, 89, 62, 5.60, 'us-west-2', 0, datetime('now')),
  ('gpu_004', 'H100-02', 'H100-SXM5',  'CoreWeave',    'scaling', 45, 40, 20, 5.60, 'us-west-2', 0, datetime('now')),
  ('gpu_005', 'A10G-01', 'A10G-24G',   'AWS',          'active',  44, 38, 18, 1.40, 'us-east-1', 0, datetime('now')),
  ('gpu_006', 'RTX-01',  'RTX 4090',   'Vast.ai',      'idle_od',  8, 12,  5, 0.60, 'eu-west-1', 1, datetime('now')),
  ('gpu_007', 'RTX-02',  'RTX 4090',   'Vast.ai',      'idle_od',  5,  8,  3, 0.60, 'eu-west-1', 1, datetime('now'));

-- AI Models
INSERT OR IGNORE INTO ai_models (id, name, provider, workspace, is_enabled, instances, avg_latency, cost_per_unit, created_at) VALUES
  ('ai_001', 'GPT-4o',             'OpenAI',         'text',  1, 8, '118ms', '$0.005/1K', datetime('now')),
  ('ai_002', 'Claude 3.5 Sonnet',  'Anthropic',      'text',  1, 6, '142ms', '$0.003/1K', datetime('now')),
  ('ai_003', 'Gemini 1.5 Pro',     'Google',         'text',  1, 4, '98ms',  '$0.004/1K', datetime('now')),
  ('ai_004', 'o1 Pro',             'OpenAI',         'code',  1, 3, '3.2s',  '$0.015/1K', datetime('now')),
  ('ai_005', 'Flux Pro',           'Black Forest',   'image', 1, 5, '4.8s',  'GPU-based', datetime('now')),
  ('ai_006', 'Runway Gen-3',       'Runway',         'video', 1, 2, '45s',   'GPU-based', datetime('now')),
  ('ai_007', 'ElevenLabs Turbo',   'ElevenLabs',     'audio', 0, 4, '280ms', '$0.18/min', datetime('now')),
  ('ai_008', 'Suno v3.5',          'Suno',           'audio', 1, 2, '12s',   '$0.05/trk', datetime('now')),
  ('ai_009', 'TripoSR',            'Stability AI',   '3d',    1, 2, '18s',   'GPU-based', datetime('now')),
  ('ai_010', 'Whisper Large',      'OpenAI',         'audio', 1, 4, '2.1s',  '$0.006/min',datetime('now'));
