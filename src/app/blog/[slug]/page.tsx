import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { getEditorialPost } from "@/content/editorial-posts";

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

  return (
    <article className="container max-w-2xl py-12">
      <h1 className="font-serif text-3xl font-bold">{post.title}</h1>
      {post.dateLabel && <p className="mt-1 text-sm text-muted-foreground">{post.dateLabel}</p>}
      <div className="prose prose-invert prose-sm mt-8 max-w-none text-sm leading-relaxed text-muted-foreground">
        {post.content.split(/\n\n+/).map((para, i) =>
          para.startsWith("## ") ? (
            <h2 key={i} className="mt-8 font-serif text-xl font-semibold text-foreground">
              {para.slice(3)}
            </h2>
          ) : (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
          )
        )}
      </div>
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
