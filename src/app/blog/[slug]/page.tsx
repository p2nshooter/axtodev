import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { getEditorialPost } from "@/content/editorial-posts";
import { ArticleReader, type ReaderBlock } from "@/components/reader/article-reader";
import { pickReaderLocale } from "@/lib/reader-locale";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

interface RenderPost {
  title: string;
  dateLabel: string | null;
  isoDate: string | null;
  excerpt: string | null;
  content: string;
}

async function resolvePost(slug: string): Promise<RenderPost | null> {
  // Database post wins on slug collision; editorial posts (shipped with the
  // codebase) fill the rest — and keep the blog alive even if D1 is down.
  try {
    const prisma = await getPrisma();
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (post && post.published) {
      return {
        title: post.title,
        dateLabel: post.publishedAt ? formatDate(post.publishedAt) : null,
        isoDate: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
        excerpt: post.excerpt,
        content: post.content,
      };
    }
  } catch {
    /* fall through to editorial */
  }
  const editorial = getEditorialPost(slug);
  if (!editorial) return null;
  return {
    title: editorial.title,
    dateLabel: formatDate(new Date(editorial.date)),
    isoDate: editorial.date,
    excerpt: editorial.excerpt,
    content: editorial.content,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) notFound();

  // Structure the article into blocks the reader can highlight word-by-word.
  const blocks: ReaderBlock[] = post.content
    .split(/\n\n+/)
    .map((para) => (para.startsWith("## ") ? { type: "h2", text: para.slice(3) } : { type: "p", text: para }));

  // Auto-pick the reader's language from their IP (Cloudflare cf-ipcountry),
  // then Accept-Language, then English. English text is still what the server
  // renders, so search engines and AdSense always see real content.
  const hdrs = await headers();
  const initialLocale = pickReaderLocale(hdrs.get("cf-ipcountry"), hdrs.get("accept-language"));

  return (
    <article className="container max-w-2xl py-12">
      <ArticleReader title={post.title} blocks={blocks} initialLocale={initialLocale} />
      {post.dateLabel && <p className="mt-8 text-sm text-muted-foreground">{post.dateLabel}</p>}
      {post.isoDate && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.excerpt ?? undefined,
              datePublished: post.isoDate,
              author: { "@type": "Organization", name: "AXTO.dev" },
            }),
          }}
        />
      )}
    </article>
  );
}
