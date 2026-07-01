# Deployment

AXTO.dev deploys to **Cloudflare Pages** with a **D1** database, **R2** storage, and a **KV**
namespace for rate limiting / caching, via `@cloudflare/next-on-pages`.

## One-time setup

1. `npx wrangler login`
2. Provision resources (see `docs/ENV_SETUP.md` for exact commands): D1 database, two R2
   buckets, one KV namespace.
3. Update `wrangler.toml` with the real D1 `database_id` and KV `id`.
4. Create a Cloudflare Pages project named `axto-dev` connected to this repository, or let the
   `deploy` job in `.github/workflows/deploy.yml` create/update it via `wrangler pages deploy`.
5. Add all secrets/env vars listed in `docs/ENV_SETUP.md` to the Pages project settings.
6. Run the initial migration + seed against the remote D1 database:
   ```bash
   npx wrangler d1 migrations apply axto-dev-db --remote
   DATABASE_URL="<remote d1 proxy or local>" pnpm db:seed
   ```

## CI/CD pipeline (`.github/workflows/deploy.yml`)

1. **lint-and-typecheck** — `next lint` + `tsc --noEmit` on every push/PR.
2. **build** — `pnpm run cf:build` (runs `@cloudflare/next-on-pages`), uploads the
   `.vercel/output/static` artifact.
3. **migrate-database** — applies any new Prisma migrations to the remote D1 database
   (`main` branch only).
4. **deploy** — `wrangler pages deploy` (`main` branch only).

Pull requests run steps 1–2 only, so every PR is type-checked and build-verified without
touching production data.

## Zero-downtime / rollback

Cloudflare Pages keeps every deployment addressable — to roll back, redeploy a previous
successful build from the Pages dashboard or re-run the `deploy` job against an older commit.
Because migrations run as a separate, additive step before deploy, always write migrations that
are safe to run ahead of the new code being live (add columns/tables first, remove old ones in a
follow-up release).

## Local development against Cloudflare bindings

```bash
pnpm dev            # plain Next.js dev server, falls back to local SQLite (DATABASE_URL)
pnpm cf:build        # build the Pages-compatible output
pnpm cf:preview       # run the built output locally against real D1/R2/KV bindings via wrangler
```
