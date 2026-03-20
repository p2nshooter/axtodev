# 🔐 AXTO — Environment Variables & Secrets Setup

> Read this **before** your first deploy.

---

## Step 1 — GitHub Repository Secrets

Go to: `github.com/YOUR_ORG/axto-dev` → **Settings → Secrets → Actions**

| Secret Name | How to Get It |
|---|---|
| `CLOUDFLARE_API_TOKEN` | CF Dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template + add D1, R2, Pages permissions |
| `CLOUDFLARE_ACCOUNT_ID` | CF Dashboard → right sidebar (32-char hex) |
| `D1_DATABASE_ID` | Output from `node scripts/setup.mjs` |
| `KV_NAMESPACE_ID` | Output from `node scripts/setup.mjs` |
| `R2_BUCKET_NAME` | `axto-outputs` |
| `JWT_SECRET` | `openssl rand -hex 64` |
| `ADMIN_TOTP_SECRET` | `openssl rand -hex 32` (save in your TOTP app) |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `REPLICATE_API_TOKEN` | replicate.com → Account → API Tokens |
| `RUNWAYML_API_KEY` | app.runwayml.com → Settings → API |
| `ELEVENLABS_API_KEY` | elevenlabs.io → Profile → API Key |
| `SUNO_API_KEY` | suno.com → API access |

---

## Step 2 — CF API Token Permissions

Your `CLOUDFLARE_API_TOKEN` needs:
- [x] Workers Scripts → **Edit**
- [x] D1 → **Edit**
- [x] R2 Storage → **Edit**
- [x] Cloudflare Pages → **Edit**
- [x] DNS → **Edit** (zone: axto.dev)
- [x] Workers Routes → **Edit**

---

## Step 3 — CF Pages Environment Variables

CF Dashboard → Pages → `axto-web` → Settings → Environment Variables:

| Variable | Production | Preview |
|---|---|---|
| `VITE_API_URL` | `https://api.axto.dev` | `https://api-staging.axto.dev` |
| `VITE_APP_ENV` | `production` | `preview` |

---

## Step 4 — DNS Records (one-time)

CF Dashboard → DNS for `axto.dev`:

```
CNAME  @    →  axto-web.pages.dev              [Proxied ✅]
CNAME  api  →  axto-api.*.workers.dev          [Proxied ✅]
CNAME  www  →  axto-web.pages.dev              [Proxied ✅]
```

---

## Step 5 — Local Dev

```bash
# apps/api/.env.local
JWT_SECRET=local_dev_secret_min_32chars
ADMIN_TOTP_SECRET=local_totp_secret
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
REPLICATE_API_TOKEN=r8_...

# apps/web/.env.local
VITE_API_URL=http://localhost:8787
VITE_APP_ENV=development
```

---

## ✅ Pre-Deploy Checklist

- [ ] All 13 GitHub Secrets added
- [ ] CF API Token has correct permissions
- [ ] DNS records configured for `axto.dev`
- [ ] `node scripts/setup.mjs` completed
- [ ] D1_DATABASE_ID + KV_NAMESPACE_ID added to secrets
- [ ] `pnpm db:migrate` run (creates schema)
- [ ] `pnpm db:seed` run (inserts pricing, nodes, demo users)
- [ ] Admin TOTP secret saved in authenticator app
