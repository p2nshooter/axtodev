import "server-only";
import { getPrisma } from "@/lib/prisma";
import { createDownloadToken } from "@/lib/download-token";
import { MAX_LANGUAGE_DOWNLOADS_PER_BOOK } from "@/lib/constants";

const DOWNLOAD_LINK_TTL_SECONDS = Number(process.env.DOWNLOAD_LINK_TTL_SECONDS ?? 900);

export class EntitlementError extends Error {}

/** True if the user has a PAID order containing this book. */
export async function userOwnsBook(userId: string, bookId: string): Promise<boolean> {
  const prisma = await getPrisma();
  const count = await prisma.orderItem.count({
    where: { bookId, order: { userId, status: "PAID" } },
  });
  return count > 0;
}

export async function getUserLibrary(userId: string) {
  const prisma = await getPrisma();
  const items = await prisma.orderItem.findMany({
    where: { order: { userId, status: "PAID" } },
    distinct: ["bookId"],
    orderBy: { id: "desc" },
    include: {
      book: {
        include: {
          category: true,
          translations: { include: { language: true } },
        },
      },
      order: true,
    },
  });

  const entitlements = await prisma.languageEntitlement.findMany({ where: { userId } });

  const entitlementsByBook = new Map<string, string[]>();
  for (const e of entitlements) {
    const list = entitlementsByBook.get(e.bookId) ?? [];
    list.push(e.languageId);
    entitlementsByBook.set(e.bookId, list);
  }

  return items.map((item) => ({
    ...item,
    grantedLanguageIds: entitlementsByBook.get(item.bookId) ?? [],
  }));
}

/**
 * Grants access to a language version of a purchased book, enforcing the
 * "max two language downloads per purchased e-book" rule server-side
 * (spec: DOWNLOAD SECURITY / DOWNLOAD POLICY). Idempotent for a language
 * already granted.
 */
export async function grantLanguageEntitlement(userId: string, bookId: string, languageId: string) {
  const prisma = await getPrisma();

  if (!(await userOwnsBook(userId, bookId))) {
    throw new EntitlementError("This book has not been purchased.");
  }

  const existing = await prisma.languageEntitlement.findMany({ where: { userId, bookId } });
  const alreadyGranted = existing.some((e) => e.languageId === languageId);
  if (alreadyGranted) return existing;

  if (existing.length >= MAX_LANGUAGE_DOWNLOADS_PER_BOOK) {
    throw new EntitlementError(
      `Maximum of ${MAX_LANGUAGE_DOWNLOADS_PER_BOOK} language downloads reached for this book.`,
    );
  }

  await prisma.languageEntitlement.create({ data: { userId, bookId, languageId } });
  return prisma.languageEntitlement.findMany({ where: { userId, bookId } });
}

/**
 * Issues a signed, short-lived download URL after re-verifying purchase +
 * language entitlement server-side (never trust a client-supplied token
 * alone — spec: PAYMENT SAFETY / ANTI PIRACY).
 */
export async function issueDownloadUrl(params: {
  userId: string;
  bookId: string;
  languageId: string;
  format: "PDF" | "EPUB";
}) {
  const prisma = await getPrisma();

  if (!(await userOwnsBook(params.userId, params.bookId))) {
    throw new EntitlementError("This book has not been purchased.");
  }

  const entitled = await prisma.languageEntitlement.findUnique({
    where: { userId_bookId_languageId: { userId: params.userId, bookId: params.bookId, languageId: params.languageId } },
  });
  if (!entitled) {
    throw new EntitlementError("Select this language for your library before downloading.");
  }

  const file = await prisma.bookFile.findUnique({
    where: {
      bookId_languageId_format: { bookId: params.bookId, languageId: params.languageId, format: params.format },
    },
  });
  if (!file) throw new EntitlementError("This file is not available yet.");

  const token = await createDownloadToken(
    { userId: params.userId, bookId: params.bookId, languageId: params.languageId, format: params.format },
    DOWNLOAD_LINK_TTL_SECONDS,
  );

  await prisma.downloadToken.create({
    data: {
      userId: params.userId,
      bookId: params.bookId,
      languageId: params.languageId,
      format: params.format,
      token,
      expiresAt: new Date(Date.now() + DOWNLOAD_LINK_TTL_SECONDS * 1000),
    },
  });

  return { url: `/api/download/${token}`, expiresInSeconds: DOWNLOAD_LINK_TTL_SECONDS };
}

export async function logDownload(params: {
  userId: string;
  bookId: string;
  languageId: string;
  format: "PDF" | "EPUB";
  ipAddress?: string;
  userAgent?: string;
}) {
  const prisma = await getPrisma();
  await prisma.downloadLog.create({ data: params });
}
