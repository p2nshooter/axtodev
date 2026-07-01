import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPrisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/utils";
import { updateBookStatusAction } from "@/server/admin-actions";

export const metadata = { title: "Admin · Edit Book" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: Props) {
  const { id } = await params;
  const prisma = await getPrisma();
  const book = await prisma.book.findUnique({
    where: { id },
    include: { category: true, translations: { include: { language: true } }, files: true, statusHistory: { orderBy: { createdAt: "desc" } } },
  });
  if (!book) notFound();

  const t = book.translations[0];

  const publish = updateBookStatusAction.bind(null, book.id, "PUBLISHED");
  const archive = updateBookStatusAction.bind(null, book.id, "ARCHIVED");
  const review = updateBookStatusAction.bind(null, book.id, "PENDING_REVIEW");
  const draft = updateBookStatusAction.bind(null, book.id, "DRAFT");

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">{t?.title}</h1>
        <Badge variant="outline">{book.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {book.category.name} · {formatUsd(book.priceCents)} · {book.translations.length} language(s) · {book.files.length} file(s) uploaded
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <form action={draft}>
          <Button type="submit" variant="outline" size="sm">
            Set draft
          </Button>
        </form>
        <form action={review}>
          <Button type="submit" variant="outline" size="sm">
            Submit for review
          </Button>
        </form>
        <form action={publish}>
          <Button type="submit" variant="gold" size="sm">
            Publish
          </Button>
        </form>
        <form action={archive}>
          <Button type="submit" variant="destructive" size="sm">
            Archive
          </Button>
        </form>
      </div>

      {book.files.length === 0 && (
        <p className="mt-4 text-sm text-amber-500">
          No PDF/EPUB files uploaded yet for any language — this book cannot be sold until at least one file exists.
        </p>
      )}

      <div className="mt-8">
        <h2 className="font-serif text-lg font-semibold">Status history</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {book.statusHistory.map((h) => (
            <li key={h.id}>
              {h.status} — {new Date(h.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
