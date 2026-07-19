import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { EDITORIAL_POSTS } from "@/content/editorial-posts";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  description:
    "Original articles on legal e-books, the public domain, resale licensing, digital reading habits, and building a library you truly own.",
};

interface ListItem {
  slug: string;
  title: string;
  excerpt: string | null;
  dateLabel: string | null;
  sortKey: string;
}

export default async function BlogIndexPage() {
  // Admin-authored posts (database) merged with the editorial posts that
  // ship with the codebase — the blog is never empty and always carries
  // substantial original content.
  let dbItems: ListItem[] = [];
  try {
    const prisma = await getPrisma();
    const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
    dbItems = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      dateLabel: post.publishedAt ? formatDate(post.publishedAt) : null,
      sortKey: post.publishedAt ? new Date(post.publishedAt).toISOString() : "0000",
    }));
  } catch {
    /* database unavailable — editorial posts still render */
  }

  const dbSlugs = new Set(dbItems.map((i) => i.slug));
  const editorialItems: ListItem[] = EDITORIAL_POSTS.filter((p) => !dbSlugs.has(p.slug)).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    dateLabel: formatDate(new Date(p.date)),
    sortKey: p.date,
  }));

  const items = [...dbItems, ...editorialItems].sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1));

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="font-serif text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Reading culture, publishing rights, and the craft of a legal digital library.
      </p>
      <div className="mt-8 space-y-6">
        {items.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-lg border border-border p-5 hover:border-gold-400/50"
          >
            <h2 className="font-serif text-xl font-semibold">{post.title}</h2>
            {post.dateLabel && <p className="mt-1 text-xs text-muted-foreground">{post.dateLabel}</p>}
            {post.excerpt && <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>}
          </Link>
        ))}
        {items.length === 0 && <p className="text-muted-foreground">No posts published yet.</p>}
      </div>
    </div>
  );
}
