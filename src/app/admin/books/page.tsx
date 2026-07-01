import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPrisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/utils";

export const metadata = { title: "Admin · Books" };

const STATUS_VARIANT: Record<string, "gold" | "secondary" | "outline" | "destructive"> = {
  PUBLISHED: "gold",
  DRAFT: "outline",
  PENDING_REVIEW: "secondary",
  SCHEDULED: "secondary",
  ARCHIVED: "outline",
  REJECTED: "destructive",
};

export default async function AdminBooksPage() {
  const prisma = await getPrisma();
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { category: true, translations: { where: { language: { code: "en" } } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">Books</h1>
        <Button variant="gold" asChild>
          <Link href="/admin/books/new">
            <Plus className="h-4 w-4" /> New book
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-t border-border">
                <td className="p-3 font-medium">{book.translations[0]?.title ?? book.slug}</td>
                <td className="p-3 text-muted-foreground">{book.category.name}</td>
                <td className="p-3">{formatUsd(book.priceCents)}</td>
                <td className="p-3">
                  <Badge variant={STATUS_VARIANT[book.status] ?? "outline"}>{book.status}</Badge>
                </td>
                <td className="p-3 text-right">
                  <Link href={`/admin/books/${book.id}/edit`} className="text-accent hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
