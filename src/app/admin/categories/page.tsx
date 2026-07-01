import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPrisma } from "@/lib/prisma";
import { createCategoryAction } from "@/server/admin-actions";

export const metadata = { title: "Admin · Categories" };

export default async function AdminCategoriesPage() {
  const prisma = await getPrisma();
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { books: true } } } });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="font-serif text-2xl font-bold">Categories</h1>
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Books</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-muted-foreground">{c.slug}</td>
                  <td className="p-3">{c._count.books}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form action={createCategoryAction} className="h-fit space-y-4 rounded-lg border border-border p-5">
        <h2 className="font-serif text-lg font-semibold">New category</h2>
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <textarea id="description" name="description" rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" /> Featured on homepage
        </label>
        <Button type="submit" variant="gold" className="w-full">
          Create category
        </Button>
      </form>
    </div>
  );
}
