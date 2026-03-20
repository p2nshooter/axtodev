# 🚀 AXTO Deployment Guide

## Auto Deploy Flow

```
git push origin main
        │
        ▼
  GitHub Actions
        │
  ┌─────┴──────┐
  │            │
 🔍 Quality   ───► 🏗 Build
  │                    │
  │              ┌─────┴──────┐
  │              │            │
  │           🗄 D1        (web artifact)
  │           Migrate         │
  │              │            │
  │        ┌─────┴──────┐     │
  │        │            │     │
  │      ⚡ API       🌐 Web ──┘
  │      Worker      Pages
  │        │            │
  └────────┴──── 🧪 Smoke ────► 📣 Summary
```

**Total time: ~60–90 seconds**

---

## Manual Deploy

```bash
# Deploy everything
pnpm deploy

# Deploy API only
pnpm deploy:api

# Deploy web only
pnpm deploy:web

# Run migrations
pnpm db:migrate

# Watch API logs live
npx wrangler tail axto-api
```

---

## Branch Strategy

| Branch | Environment | URL |
|---|---|---|
| `main` | Production | `axto.dev` / `api.axto.dev` |
| `staging` | Staging | `staging.axto.dev` |
| `feat/*` / PR | Preview | `<hash>.axto-web.pages.dev` |

---

## Rollback

```bash
# List Worker deployments
npx wrangler deployments list --name axto-api

# Roll back to previous Worker version
npx wrangler rollback --name axto-api

# Pages rollback:
# CF Dashboard → Pages → axto-web → Deployments → (pick version) → Rollback
```

---

## 72h Output Auto-Delete

The scheduled Worker cron runs every 30 minutes:
1. Queries `jobs` table for records where `expires_at < now()`
2. Deletes the R2 object (`result_key`)
3. Nulls out `result_key` and `result_url` in DB
4. Clients are notified via in-app banner + email at 48h and 24h before expiry

To test locally:
```bash
npx wrangler dev --test-scheduled
# then curl http://localhost:8787/__scheduled
```

---

## Monitoring

- **Worker logs:** `npx wrangler tail axto-api`
- **D1 insights:** CF Dashboard → D1 → axto-db → Insights
- **R2 usage:** CF Dashboard → R2 → axto-outputs → Metrics
- **Pages analytics:** CF Dashboard → Pages → axto-web → Analytics
