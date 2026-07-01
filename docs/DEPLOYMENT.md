# Deployment

AXTO.dev deploys to **Cloudflare Pages** with a **D1** database, **R2** storage, and a **KV**
namespace for rate limiting / caching, via `@cloudflare/next-on-pages`.

## One-time setup

Provisioning is automated — the `provision-cloudflare` job in `.github/workflows/deploy.yml`
creates the D1 database, both R2 buckets, and the KV namespace on the first push to `main` (using
the already-configured `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secrets), resolves their
real IDs, and patches the `REPLACE_WITH_...` placeholders in `wrangler.toml` in-memory for the
`migrate-database` and `deploy` jobs. You don't need to run `wrangler d1 create` etc. yourself.

What's still manual:

1. Add all secrets/env vars listed in `docs/ENV_SETUP.md` to GitHub Actions (repo Settings →
   Secrets and variables → Actions) — most are already configured per the project instructions.
2. `wrangler pages deploy` auto-creates the `axto-dev` Cloudflare Pages project on first deploy
   if it doesn't already exist.
3. After the first successful deploy, seed the catalog:
   ```bash
   npx wrangler d1 execute axto-dev-db --remote --file=prisma/migrations/<latest>/migration.sql # already applied by CI; only needed for manual recovery
   DATABASE_URL="<remote d1 proxy or local>" pnpm db:seed
   ```
   (Seeding against the live D1 database directly requires a `wrangler`-proxied connection — see
   `scripts/` for a local example, or run it via `wrangler d1 execute --remote --command`.)

## CI/CD pipeline (`.github/workflows/deploy.yml`)

1. **lint-and-typecheck** — `next lint` + `tsc --noEmit` on every push/PR.
2. **build** — `pnpm run cf:build` (runs `@cloudflare/next-on-pages`), uploads the
   `.vercel/output/static` artifact. Runs on every push/PR.
3. **provision-cloudflare** — idempotently creates the D1 database, R2 buckets, and KV
   namespace and outputs their real IDs (`main` branch pushes only).
4. **migrate-database** — patches `wrangler.toml` with the real IDs, then applies any new
   Prisma migrations to the remote D1 database (`main` branch only).
5. **deploy** — patches `wrangler.toml` again, then `wrangler pages deploy` (`main` branch
   only).

Pull requests run steps 1–2 only, so every PR is type-checked and build-verified without
touching production infrastructure or data.

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
