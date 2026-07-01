import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = { title: "Blog" };

export default async function BlogIndexPage() {
  const prisma = await getPrisma();
  const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="font-serif text-3xl font-bold">Blog</h1>
      <div className="mt-8 space-y-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="block rounded-lg border border-border p-5 hover:border-gold-400/50">
            <h2 className="font-serif text-xl font-semibold">{post.title}</h2>
            {post.publishedAt && <p className="mt-1 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>}
            {post.excerpt && <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>}
          </Link>
        ))}
        {posts.length === 0 && <p className="text-muted-foreground">No posts published yet.</p>}
      </div>
    </div>
  );
}
