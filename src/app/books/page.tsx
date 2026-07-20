import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Headphones } from "lucide-react";
import { LIBRARY, LIBRARY_CATEGORIES, getEbooksByCategory } from "@/content/library";

export const metadata: Metadata = {
  title: "The Library — free books, read aloud",
  description:
    "Original reader's companions to the great public-domain classics. Free to read and listen to, in six languages, with no account.",
  alternates: { canonical: "/books" },
};

// Static: prerendered at build, served from CDN.
export default function BooksIndexPage() {
  return (
    <div className="container py-12">
      <h1 className="font-serif text-3xl font-bold">The Library</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Every book below is free to read and free to listen to — the reader follows your language
        automatically and reads aloud with a moving word pointer.
      </p>

      {LIBRARY_CATEGORIES.map((cat) => {
        const books = getEbooksByCategory(cat.slug);
        if (books.length === 0) return null;
        return (
          <section key={cat.slug} className="mt-10">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-xl font-semibold">{cat.name}</h2>
              <Link href={`/category/${cat.slug}`} className="text-sm text-accent hover:underline">
                View collection
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <Link
                  key={book.slug}
                  href={`/books/${book.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-lg hover:shadow-gold-500/10"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-accent">{book.author}</p>
                  <h3 className="mt-1 font-serif text-base font-semibold leading-snug group-hover:text-accent">
                    {book.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{book.description}</p>
                  <p className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {book.minutes} min
                    </span>
                    <span className="flex items-center gap-1 font-medium text-accent">
                      <Headphones className="h-3 w-3" /> Free
                    </span>
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
