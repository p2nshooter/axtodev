# Content & Legal Compliance Policy

AXTO.dev sells **only** legal digital e-books. This document is the operational checklist behind
`prisma/schema.prisma`'s `licenseType`, `licenseSource`, `licenseProof`, and `BookStatusHistory`
fields, and the `DmcaClaim` model.

## Every published e-book must be one of

- 100% original, written specifically for AXTO.dev (`ORIGINAL`)
- Public domain (`PUBLIC_DOMAIN`)
- PLR with commercial redistribution rights (`PLR`)
- MRR with redistribution rights (`MRR`)
- Royalty-free / company-owned educational content (`ROYALTY_FREE`, `COMPANY_OWNED`)
- AI-assisted original writing that does not substantially reproduce copyrighted works
  (`AI_ASSISTED_ORIGINAL`)

## Never publish

Pirated books, leaked PDFs, copyrighted books without permission, courses/PDFs copied from other
creators, hacking/fraud/weapons/drug-production content, or anything else listed in the project
brief's Content Policy section. When in doubt, keep the book in `PENDING_REVIEW` instead of
publishing it.

## Before publishing (admin workflow)

1. Set `licenseType`, `licenseSource`, and (if applicable) `licenseProof` on the `Book` record.
2. Move status through `DRAFT` → `PENDING_REVIEW` before `PUBLISHED` (`src/server/admin-actions.ts`
   → `updateBookStatusAction`, logged in `BookStatusHistory`).
3. Check for duplicate/near-duplicate titles and descriptions in the existing catalog — the
   no-duplicate policy is a hard requirement (spec §NO DUPLICATE POLICY). `Book.similarityScore`
   is reserved for a future automated originality-check job.

## DMCA / copyright claims

Public submission form: `/legal/copyright` → `submitDmcaClaimAction` → `DmcaClaim` table.
Admin review queue: `/admin/dmca`. Upholding a claim means setting the book's status to
`ARCHIVED` (via `/admin/books/[id]/edit`) and recording the resolution on the claim.

## Watermarking

Downloaded files should carry an unobtrusive "Distributed by AXTO.dev" footer for distribution
tracking only — never implying ownership over public-domain or licensed third-party content, and
never overwriting the original author's copyright notice. File generation/watermarking is a
publishing-pipeline concern (outside this repo's runtime) — `BookFile.checksum` verifies the
uploaded file hasn't been tampered with after that step.
