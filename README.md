# ⚡ AXTO — AI Execution & Tools Orchestration
> **axto.dev** · Enterprise GPU & AI Creative Studio

## 🚀 One-Command Auto Deploy
```bash
git add . && git commit -m "feat: update" && git push origin main
# → GitHub Actions deploys everything in ~90 seconds
```

## 🏗 Monorepo Structure
```
axto-dev/
├── index.html                    # ← Full platform demo (open in browser)
├── .github/workflows/
│   ├── deploy.yml                # Push → production deploy
│   └── preview.yml               # PR → preview deploy
├── apps/
│   ├── api/                      # Cloudflare Worker — api.axto.dev
│   │   ├── wrangler.toml
│   │   ├── src/index.ts          # Hono app entry
│   │   ├── src/routes/           # auth, credits, jobs, admin, pool, webhooks
│   │   ├── src/middleware/       # auth (JWT+TOTP), ratelimit, request-id
│   │   └── src/types/            # Env, User, Session, Job types
│   └── web/                      # Cloudflare Pages — axto.dev
│       └── src/
├── packages/
│   ├── database/
│   │   ├── migrations/           # D1 SQL migrations
│   │   └── seeds/                # Seed data
│   └── shared/src/               # Shared types & utilities
├── docs/
│   ├── ENV_SETUP.md              # ← READ FIRST before deploying
│   └── DEPLOYMENT.md
└── scripts/setup.mjs             # One-time CF resource provisioning
```

## 🔐 Quick Start
1. **Read** `docs/ENV_SETUP.md` — add all GitHub Secrets
2. **Run** `node scripts/setup.mjs` — provision CF D1, KV, R2
3. **Run** `pnpm db:migrate` — create database schema
4. **Push** `git push origin main` — auto-deploys

## 📦 Stack
| Layer | Technology |
|---|---|
| API | Cloudflare Workers (Hono v4) |
| Frontend | Cloudflare Pages (React 18 + Vite 5) |
| Database | Cloudflare D1 (SQLite edge) |
| Sessions | Cloudflare KV |
| Files | Cloudflare R2 (72h TTL) |
| CI/CD | GitHub Actions (7-job pipeline) |
| Monorepo | pnpm + Turborepo |
| Auth | JWT + TOTP (RFC 6238) |

## 🌐 Domains
| URL | Service |
|---|---|
| `axto.dev` | Web Platform |
| `api.axto.dev` | REST API |

## ⏳ 72-Hour Output Auto-Delete
All client outputs (images, videos, audio, 3D models) are **automatically and permanently deleted from Cloudflare R2 after 72 hours**.
- Cron Worker runs every 30 minutes
- Clients notified at 48h and 24h before deletion
- No recovery possible after expiration
