# AXTO.dev

> **Knowledge. Transform. Opportunity.**
> A premium marketplace for original, public-domain, and properly licensed digital e-books.

AXTO.dev sells **only legal** digital e-books, worldwide. Every title is either 100% original,
public domain, or distributed under a license (PLR/MRR/royalty-free) that explicitly permits
commercial redistribution — see [`docs/CONTENT_POLICY.md`](docs/CONTENT_POLICY.md).

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript, strict mode |
| UI | TailwindCSS + shadcn/ui-style component primitives |
| Database | Cloudflare D1 (SQLite) via Prisma ORM + `@prisma/adapter-d1` |
| Storage | Cloudflare R2 (private e-book files, public assets) |
| Auth | Better Auth (email/password, sessions, roles) |
| Payments | PayPal (Orders v2 API + webhooks) and live-rate crypto (BTC/ETH/BNB/SOL/USDT/DOGE) |
| Email | Resend |
| Hosting | Cloudflare Pages + Workers (`@cloudflare/next-on-pages`) |

## Getting started

```bash
pnpm install
cp .env.example .env        # fill in local values; DATABASE_URL="file:./dev.db" works out of the box
pnpm exec prisma migrate dev
pnpm db:seed
pnpm dev
```

Then register an account with the email you set as `ADMIN_BOOTSTRAP_EMAIL`, re-run `pnpm db:seed`
to promote it to `SUPER_ADMIN`, and visit `/admin`.

## Project structure

```
src/
  app/                 # Next.js App Router routes (pages + API route handlers)
    admin/             # Admin dashboard (books, categories, orders, coupons, blog, DMCA)
    api/                # REST-ish route handlers: auth, checkout, webhooks, downloads
    books/[slug]/       # Book detail page
    category/[slug]/    # Category browse page
    checkout/           # Cart → payment method → PayPal / crypto → success
    library/, orders/   # Customer digital library & order history
    legal/               # Terms, privacy, refund policy, copyright/DMCA
  components/
    ui/                # shadcn-style primitives (button, card, dialog, select, …)
    site/               # Header, footer, logo, legal page shell
    book/               # Book card, cover, language/download panel
    checkout/           # Cart store, PayPal button, crypto checkout flow
  lib/                  # Framework-agnostic utilities: prisma, auth, r2, paypal,
                         # crypto-payment, rate-limit, download-token, wallet-address
  server/               # Server-only business logic: book/library/order services,
                         # admin & public server actions
prisma/
  schema.prisma          # Full data model (catalog, orders, payments, downloads, audit log, DMCA…)
  seed.ts                 # Idempotent seed: languages, categories, sample original e-books
docs/                    # Deployment, environment, database, and payment-wallet docs
```

## Key design decisions

- **No hardcoded secrets or wallet addresses.** Everything payment-related is read from
  environment variables (GitHub Secrets in CI, Cloudflare Pages env vars in production). See
  [`docs/ENV_SETUP.md`](docs/ENV_SETUP.md) and [`docs/PAYMENT_WALLETS.md`](docs/PAYMENT_WALLETS.md).
- **Server-verified downloads.** Every download URL is signed + expiring
  (`src/lib/download-token.ts`), re-checks purchase + language-entitlement server-side
  (`src/server/library-service.ts`), and is capped at 2 languages per purchased book.
- **Payment safety.** PayPal captures are verified server-side and reconciled via a signature-
  verified webhook (`src/app/api/webhooks/paypal/route.ts`); crypto payments are quoted at a
  live rate for 20 minutes and only marked paid after manual on-chain verification by an admin
  (`src/lib/crypto-payment.ts`) — client-reported transaction hashes are never trusted blindly.
- **Modular payment providers.** Adding a new crypto asset or payment gateway means adding an
  entry to `src/lib/constants.ts` + one provider module — no core checkout logic changes.

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full Cloudflare Pages + D1 + R2 setup and
the CI/CD pipeline in `.github/workflows/deploy.yml`.

## Content & legal compliance

See [`docs/CONTENT_POLICY.md`](docs/CONTENT_POLICY.md) for the originality, licensing, and DMCA
rules every published e-book must satisfy.
