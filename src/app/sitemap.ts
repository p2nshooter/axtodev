import type { MetadataRoute } from "next";
import { getPrisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/site-url";
import { EDITORIAL_POSTS } from "@/content/editorial-posts";

export const runtime = "edge";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getAppUrl();
  const prisma = await getPrisma();

  const [books, categories, posts] = await Promise.all([
    prisma.book.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  return [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/search`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.3 },
    ...categories.map((c) => ({ url: `${baseUrl}/category/${c.slug}`, changeFrequency: "daily" as const, priority: 0.7 })),
    ...books.map((b) => ({ url: `${baseUrl}/books/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...posts.map((p) => ({ url: `${baseUrl}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.4 })),
    ...EDITORIAL_POSTS.filter((e) => !posts.some((p) => p.slug === e.slug)).map((e) => ({
      url: `${baseUrl}/blog/${e.slug}`,
      lastModified: new Date(e.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
