import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";
import { EDITORIAL_POSTS, getEditorialPost } from "@/content/editorial-posts";
import { ArticleReader, type ReaderBlock } from "@/components/reader/article-reader";

// Fully static: every article is prerendered at build time and served from
// the CDN (no per-request compute — the Error 1102 fix). The reader detects
// the visitor's language client-side, so auto-language still works.

export function generateStaticParams() {
  return EDITORIAL_POSTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

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

  return (
    <article className="container max-w-2xl py-12">
      <ArticleReader title={post.title} blocks={blocks} />
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
