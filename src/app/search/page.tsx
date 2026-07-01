import Link from "next/link";
import { BookCard } from "@/components/book/book-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchBooks } from "@/server/book-service";
import { cn } from "@/lib/utils";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = { title: "Search e-books" };

interface Props {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const results = await searchBooks({ query: sp.q, categorySlug: sp.category, page });

  return (
    <div className="container py-12">
      <form action="/search" className="mb-8 flex max-w-lg gap-2">
        <Input name="q" defaultValue={sp.q} placeholder="Search by title, topic, keyword…" />
        <Button type="submit" variant="gold">
          Search
        </Button>
      </form>

      <p className="mb-6 text-sm text-muted-foreground">
        {results.total} result{results.total === 1 ? "" : "s"} {sp.q ? `for "${sp.q}"` : ""}
      </p>

      {results.items.length === 0 ? (
        <p className="text-muted-foreground">No e-books matched your search. Try a different keyword.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {results.items.map((book) => (
            <BookCard
              key={book.id}
              book={{
                id: book.id,
                slug: book.slug,
                title: book.translations[0]?.title ?? book.slug,
                categoryName: book.category.name,
                priceCents: book.priceCents,
                compareAtCents: book.compareAtCents,
                coverImageUrl: book.coverImageUrl,
                isBestSeller: book.isBestSeller,
                isNew: book.isNew,
              }}
            />
          ))}
        </div>
      )}

      {results.totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: results.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/search?q=${encodeURIComponent(sp.q ?? "")}&page=${p}`}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm",
                p === page && "gold-gradient text-black font-semibold border-transparent",
              )}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
