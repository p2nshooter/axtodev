import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prisma = await getPrisma();
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const prisma = await getPrisma();
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  return (
    <article className="container max-w-2xl py-12">
      <h1 className="font-serif text-3xl font-bold">{post.title}</h1>
      {post.publishedAt && <p className="mt-1 text-sm text-muted-foreground">{formatDate(post.publishedAt)}</p>}
      <div className="prose prose-invert prose-sm mt-8 max-w-none whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        {post.content}
      </div>
    </article>
  );
}
