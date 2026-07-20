import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Clock, BarChart3, Globe, ShieldCheck, BookOpen, Headphones } from "lucide-react";
import { BookCover } from "@/components/book/book-cover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getBookBySlug } from "@/server/book-service";
import { formatDate } from "@/lib/utils";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return {};
  const t = book.translations.find((tr) => tr.language.code === "en") ?? book.translations[0];
  return {
    title: t?.metaTitle ?? t?.title,
    description: t?.metaDescription ?? t?.description?.slice(0, 160),
    openGraph: { images: book.coverImageUrl ? [book.coverImageUrl] : [] },
  };
}

const LICENSE_LABEL: Record<string, string> = {
  ORIGINAL: "100% Original",
  PUBLIC_DOMAIN: "Public Domain",
  PLR: "PLR — Redistribution Licensed",
  MRR: "MRR — Resale Rights",
  ROYALTY_FREE: "Royalty-Free",
  COMPANY_OWNED: "AXTO.dev Original",
  AI_ASSISTED_ORIGINAL: "AI-Assisted Original",
};

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const t = book.translations.find((tr) => tr.language.code === "en") ?? book.translations[0];
  if (!t) notFound();

  const avgRating = book.reviews.length
    ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
    : null;

  const toc: string[] = t.tableOfContents ? JSON.parse(t.tableOfContents) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: t.title,
    description: t.description,
    author: { "@type": "Organization", name: book.author },
    inLanguage: book.translations.map((tr) => tr.language.code),
    // Free to read and listen — no purchase.
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  };

  return (
    <div className="container grid gap-10 py-12 lg:grid-cols-[320px_1fr]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="space-y-4">
        <div className="aspect-[3/4] overflow-hidden rounded-lg border border-border shadow-lg">
          <BookCover title={t.title} seed={book.id} coverImageUrl={book.coverImageUrl} />
        </div>
        <div className="rounded-lg border border-gold-400/30 bg-gold-400/5 p-4">
          <p className="flex items-center gap-2 font-serif text-base font-semibold">
            <BookOpen className="h-4 w-4 text-gold-500" /> Free to read
            <Headphones className="ml-1 h-4 w-4 text-gold-500" /> Free to listen
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Open to everyone — read it online and let it be read aloud in your own language, with no account and no cost.
            Reading is free across AXTO.dev; downloads are turned off so the whole library stays free and always up to date.
          </p>
          <Link
            href="/blog"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-gold-400"
          >
            <BookOpen className="h-4 w-4" /> Start reading free
          </Link>
        </div>
        <div className="rounded-lg border border-border p-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5 font-medium text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" /> {LICENSE_LABEL[book.licenseType] ?? book.licenseType}
          </p>
          <p className="mt-1">Published and distributed by AXTO.dev.</p>
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">{book.category.name}</span>
        <h1 className="mt-1 font-serif text-3xl font-bold">{t.title}</h1>
        {t.subtitle && <p className="mt-1 text-lg text-muted-foreground">{t.subtitle}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {avgRating && (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" /> {avgRating.toFixed(1)} ({book.reviews.length} reviews)
            </span>
          )}
          {book.readingTimeMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {book.readingTimeMinutes} min read
            </span>
          )}
          {book.difficultyLevel && (
            <span className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" /> {book.difficultyLevel}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Globe className="h-4 w-4" /> {book.translations.length} languages
          </span>
        </div>

        <Separator className="my-6" />

        <section>
          <h2 className="font-serif text-xl font-semibold">About this e-book</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{t.description}</p>
        </section>

        {toc.length > 0 && (
          <section className="mt-8">
            <h2 className="font-serif text-xl font-semibold">Table of Contents</h2>
            <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {toc.map((chapter, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> {chapter}
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold">Available languages</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {book.translations.map((tr) => (
              <Badge key={tr.id} variant="outline">
                {tr.language.nativeName}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Read and listen in any of these languages — the reader follows your language automatically.
          </p>
        </section>

        {book.reviews.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-semibold">Reader reviews</h2>
            <div className="mt-4 space-y-4">
              {book.reviews.map((review) => (
                <div key={review.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{review.user.name}</span>
                    <span className="flex items-center gap-1 text-xs text-accent">
                      <Star className="h-3.5 w-3.5 fill-accent" /> {review.rating}/5
                    </span>
                  </div>
                  {review.title && <p className="mt-1 text-sm font-medium">{review.title}</p>}
                  {review.body && <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
