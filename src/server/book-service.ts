import "server-only";
import { getPrisma } from "@/lib/prisma";

const PUBLISHED = { status: "PUBLISHED" as const, deletedAt: null };

export async function listCategories() {
  const prisma = await getPrisma();
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getFeaturedBooks(limit = 8, languageCode = "en") {
  const prisma = await getPrisma();
  return prisma.book.findMany({
    where: { ...PUBLISHED, isFeatured: true },
    take: limit,
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      translations: { where: { language: { code: languageCode } } },
    },
  });
}

export async function getBestSellers(limit = 8, languageCode = "en") {
  const prisma = await getPrisma();
  return prisma.book.findMany({
    where: { ...PUBLISHED, isBestSeller: true },
    take: limit,
    include: { category: true, translations: { where: { language: { code: languageCode } } } },
  });
}

export async function getBooksByCategorySlug(categorySlug: string, languageCode = "en") {
  const prisma = await getPrisma();
  return prisma.book.findMany({
    where: { ...PUBLISHED, category: { slug: categorySlug } },
    orderBy: { publishedAt: "desc" },
    include: { category: true, translations: { where: { language: { code: languageCode } } } },
  });
}

export async function getBookBySlug(slug: string) {
  const prisma = await getPrisma();
  return prisma.book.findFirst({
    where: { slug, ...PUBLISHED },
    include: {
      category: true,
      translations: { include: { language: true } },
      files: true,
      tags: { include: { tag: true } },
      reviews: { where: { approved: true }, include: { user: true }, orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
}

export async function searchBooks(params: {
  query?: string;
  categorySlug?: string;
  languageCode?: string;
  minCents?: number;
  maxCents?: number;
  page?: number;
  pageSize?: number;
}) {
  const prisma = await getPrisma();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;

  const where = {
    ...PUBLISHED,
    ...(params.categorySlug ? { category: { slug: params.categorySlug } } : {}),
    ...(params.minCents !== undefined || params.maxCents !== undefined
      ? { priceCents: { gte: params.minCents ?? 0, lte: params.maxCents ?? Number.MAX_SAFE_INTEGER } }
      : {}),
    ...(params.query
      ? {
          translations: {
            some: {
              OR: [
                { title: { contains: params.query } },
                { description: { contains: params.query } },
                { keywords: { contains: params.query } },
              ],
            },
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
        translations: { where: { language: { code: params.languageCode ?? "en" } } },
      },
    }),
    prisma.book.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}
