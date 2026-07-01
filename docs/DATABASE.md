# Database Schema

Full source of truth: `prisma/schema.prisma`. Runs on Cloudflare D1 (SQLite) in production via
`@prisma/adapter-d1`, and a local SQLite file (`DATABASE_URL`) in development — see
`src/lib/prisma.ts`.

## Domains

- **Auth** (`User`, `Session`, `Account`, `Verification`) — Better Auth's own tables, extended
  with a `role` field for RBAC (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `SUPPORT`, `CUSTOMER`).
- **Catalog** (`Category`, `Tag`, `Language`, `Book`, `BookTranslation`, `BookFile`,
  `BookVersion`, `BookStatusHistory`) — a `Book` is the sellable product; per-language content
  lives in `BookTranslation`, and per-language files in `BookFile`. `BookStatusHistory` gives a
  full audit trail of draft → review → published → archived transitions.
- **Commerce** (`Order`, `OrderItem`, `Payment`, `Refund`, `Coupon`) — `Payment` supports both
  PayPal and six crypto assets; crypto rows additionally store the locked live-rate quote
  (`cryptoAmount`, `cryptoRateUsd`, `quoteExpiresAt`).
- **Delivery & anti-piracy** (`DownloadToken`, `DownloadLog`, `LanguageEntitlement`,
  `ReadingProgress`) — `LanguageEntitlement` is the server-side source of truth for the
  "max 2 languages per purchased book" rule; `DownloadToken` rows back the signed, expiring,
  single-use download URLs.
- **Reviews & content** (`Review`, `WishlistItem`, `BlogPost`, `Notification`).
- **Compliance** (`AuditLog`, `DmcaClaim`, `SiteSetting`).

## Migrations

```bash
pnpm exec prisma migrate dev --name <change>     # local development
pnpm exec wrangler d1 migrations apply axto-dev-db --remote   # production (see docs/DEPLOYMENT.md)
```

Never edit a migration that has already been applied to production — create a new one instead.

## Known limitation: D1 has no transactions

Cloudflare D1 does not yet support SQL transactions. When Prisma runs on the D1 adapter,
`prisma.$transaction(...)` calls (e.g. `markOrderPaid` in `src/server/order-service.ts`) execute
as sequential individual queries rather than an atomic unit — each statement still runs and
succeeds/fails independently, but a partial failure won't roll back earlier statements in the
same "transaction". Keep transaction blocks short and idempotent-safe until D1 adds native
transaction support.

## Soft delete

`User` and `Book` use `deletedAt` for soft delete; catalog queries (`src/server/book-service.ts`)
always filter `deletedAt: null` alongside `status: PUBLISHED`.
