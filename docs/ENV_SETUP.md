# Environment Setup

All secrets are provided via **GitHub Secrets** (CI/build time) and **Cloudflare Pages
environment variables** (runtime) — never commit a real `.env` file. `.env.example` documents
every variable; copy it to `.env` for local development only.

## Already configured (per project instructions — do not re-request)

- Cloudflare Database (D1) credentials
- Cloudflare R2 credentials
- Cloudflare API credentials (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)
- PayPal Client ID / Secret / Webhook ID

These are read directly from GitHub Secrets in `.github/workflows/deploy.yml` and from
Cloudflare Pages' own environment variable settings at runtime — nothing to do here.

## Required GitHub Secrets

| Secret | Used for |
|---|---|
| `CLOUDFLARE_API_TOKEN` | D1 migrations + Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID` | D1 migrations + Pages deploy |
| `BETTER_AUTH_SECRET` | Session signing (32+ random bytes) |

## Required Cloudflare Pages environment variables (Production + Preview)

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Not used at runtime on Cloudflare (D1 binding is used instead) — set to any placeholder |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Auth session secret + canonical URL |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Transactional email |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_ENV` | PayPal Orders API + webhook verification |
| `COINGECKO_API_KEY` | Optional — raises the live-price rate limit |
| `CRYPTO_ADDRESS_BTC`, `CRYPTO_ADDRESS_ETH`, `CRYPTO_ADDRESS_BNB`, `CRYPTO_ADDRESS_SOL`, `CRYPTO_ADDRESS_USDT_TRC20`, `CRYPTO_ADDRESS_DOGE` | Receiving wallet addresses — **verify each one yourself**, see `docs/PAYMENT_WALLETS.md` |
| `DOWNLOAD_TOKEN_SECRET`, `CRYPTO_WEBHOOK_SECRET` | Signing secrets (32+ random bytes each) |
| `DOWNLOAD_LINK_TTL_SECONDS` | Default `900` (15 minutes) |
| `R2_PUBLIC_ASSETS_URL` | Public CDN URL for the assets bucket |
| `ADMIN_BOOTSTRAP_EMAIL` | Email that `pnpm db:seed` promotes to `SUPER_ADMIN` |
| `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME` | Public site URL/name |

Generate random secrets with:

```bash
openssl rand -base64 32
```

## Cloudflare resources to provision once

```bash
npx wrangler d1 create axto-dev-db
npx wrangler r2 bucket create axto-dev-ebooks
npx wrangler r2 bucket create axto-dev-assets
npx wrangler kv namespace create CACHE
```

Copy the resulting IDs into `wrangler.toml` (replacing the `REPLACE_WITH_…` placeholders) and
into the Cloudflare Pages project's binding settings.
