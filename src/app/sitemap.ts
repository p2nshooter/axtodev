import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/site-url";
import { EDITORIAL_POSTS } from "@/content/editorial-posts";
import { LIBRARY, LIBRARY_CATEGORIES } from "@/content/library";

// Static sitemap generated at build time from the code catalog — no database.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppUrl();

  return [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/books`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/search`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/blog`, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.3 },
    ...LIBRARY_CATEGORIES.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...LIBRARY.map((b) => ({
      url: `${baseUrl}/books/${b.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...EDITORIAL_POSTS.map((e) => ({
      url: `${baseUrl}/blog/${e.slug}`,
      lastModified: new Date(e.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
