import Link from "next/link";
import { Star } from "lucide-react";
import { BookCover } from "@/components/book/book-cover";
import { Badge } from "@/components/ui/badge";
import { formatUsd } from "@/lib/utils";

export interface BookCardData {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  priceCents: number;
  compareAtCents?: number | null;
  coverImageUrl?: string | null;
  isBestSeller?: boolean;
  isNew?: boolean;
  avgRating?: number;
}

export function BookCard({ book }: { book: BookCardData }) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-xl hover:shadow-gold-500/10"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
          <BookCover title={book.title} seed={book.id} coverImageUrl={book.coverImageUrl} />
        </div>
        <div className="absolute left-2 top-2 flex gap-1.5">
          {book.isBestSeller && <Badge variant="gold">Best Seller</Badge>}
          {book.isNew && !book.isBestSeller && <Badge variant="secondary">New</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">{book.categoryName}</span>
        <h3 className="line-clamp-2 font-serif text-sm font-semibold leading-snug text-foreground group-hover:text-accent">
          {book.title}
        </h3>
        {typeof book.avgRating === "number" && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-accent text-accent" />
            {book.avgRating.toFixed(1)}
          </div>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-semibold text-foreground">{formatUsd(book.priceCents)}</span>
          {book.compareAtCents && book.compareAtCents > book.priceCents && (
            <span className="text-xs text-muted-foreground line-through">{formatUsd(book.compareAtCents)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
