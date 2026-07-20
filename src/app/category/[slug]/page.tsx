import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Headphones } from "lucide-react";
import { LIBRARY_CATEGORIES, getEbooksByCategory } from "@/content/library";

// Static category pages from the code catalog — no database, no per-request
// compute (the old Prisma version was a main source of Error 1102).

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LIBRARY_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = LIBRARY_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = LIBRARY_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const books = getEbooksByCategory(category.slug);

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">{category.name}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
        <p className="mt-2 text-sm font-medium text-accent">
          Every book is free to read and listen to — no account needed.
        </p>
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

      <p className="mt-10 text-sm text-muted-foreground">
        Looking for shorter reads?{" "}
        <Link href="/blog" className="text-accent hover:underline">
          Browse the articles
        </Link>
        .
      </p>
    </div>
  );
}
