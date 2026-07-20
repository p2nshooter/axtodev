import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, BookOpen, Headphones, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArticleReader, type ReaderBlock } from "@/components/reader/article-reader";
import { LIBRARY, LIBRARY_CATEGORIES, getEbook, getEbooksByCategory } from "@/content/library";

// Fully static: every book page is prerendered at build time and served
// straight from the CDN — no per-request compute, so it can never hit the
// Worker CPU limit (the Error 1102 the old Prisma-per-request pages caused).

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LIBRARY.map((b) => ({ slug: b.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = getEbook(slug);
  if (!book) return {};
  return {
    title: book.title,
    description: book.description,
    alternates: { canonical: `/books/${slug}` },
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = getEbook(slug);
  if (!book) notFound();

  const category = LIBRARY_CATEGORIES.find((c) => c.slug === book.categorySlug);
  const related = getEbooksByCategory(book.categorySlug).filter((b) => b.slug !== slug).slice(0, 3);

  // Flatten chapters into reader blocks: chapter titles as headings, prose as
  // paragraphs — the reader adds voice, per-word pointer, and auto-language.
  const blocks: ReaderBlock[] = book.chapters.flatMap((ch) => [
    { type: "h2" as const, text: ch.title },
    ...ch.paragraphs.map((p) => ({ type: "p" as const, text: p })),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.description,
    author: { "@type": "Organization", name: "AXTO.dev" },
    about: book.basedOn,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  };

  return (
    <div className="container max-w-2xl py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {category && (
          <Link href={`/category/${category.slug}`}>
            <Badge variant="outline">{category.name}</Badge>
          </Link>
        )}
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {book.minutes} min read
        </span>
        <span className="flex items-center gap-1 text-accent">
          <Headphones className="h-3.5 w-3.5" /> Free to read &amp; listen
        </span>
      </div>

      <ArticleReader title={book.title} blocks={blocks} />

      <p className="mt-4 text-sm italic text-muted-foreground">{book.subtitle}</p>

      <div className="mt-8 rounded-lg border border-border p-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5 font-medium text-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" /> About this edition
        </p>
        <p className="mt-1">
          An original AXTO.dev reader&apos;s companion to <em>{book.basedOn}</em> by {book.author} ({book.era}).
          All commentary is written for this library; the classic it discusses is in the public domain.
        </p>
      </div>

      {related.length > 0 && (
        <>
          <Separator className="my-10" />
          <h2 className="font-serif text-xl font-semibold">Keep reading</h2>
          <ul className="mt-4 space-y-3">
            {related.map((b) => (
              <li key={b.slug}>
                <Link href={`/books/${b.slug}`} className="group flex items-start gap-2 text-sm">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    <span className="font-medium group-hover:text-accent">{b.title}</span>
                    <span className="block text-xs text-muted-foreground">{b.subtitle}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
