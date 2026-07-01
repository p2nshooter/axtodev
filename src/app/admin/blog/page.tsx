import { Badge } from "@/components/ui/badge";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Blog" };

export default async function AdminBlogPage() {
  const prisma = await getPrisma();
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Blog</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage posts via Prisma Studio or the (future) rich editor — schema is ready.</p>
      <div className="mt-6 space-y-2">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <span>{post.title}</span>
            <div className="flex items-center gap-2">
              <Badge variant={post.published ? "gold" : "outline"}>{post.published ? "Published" : "Draft"}</Badge>
              <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
      </div>
    </div>
  );
}
