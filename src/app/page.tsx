import Link from "next/link";
import { ArrowRight, ShieldCheck, BookOpen, Headphones, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { SITE } from "@/lib/constants";
import { LIBRARY, LIBRARY_CATEGORIES, getEbooksByCategory } from "@/content/library";
import { EDITORIAL_POSTS } from "@/content/editorial-posts";

// Fully static home page: everything renders from code content at build time
// and is served from the CDN. No database, no per-request compute — the pages
// can no longer hit Worker resource limits (Error 1102).

export default function HomePage() {
  const latestArticles = [...EDITORIAL_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <TrustBar />
      <CollectionsSection />
      <LibrarySection />
      <ArticlesSection articles={latestArticles} />
      <ComplianceSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-black via-[#120e08] to-background text-[#f5ecce]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl animate-pulse-glow sm:h-96 sm:w-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-20 h-56 w-56 rounded-full bg-gold-400/10 blur-3xl animate-float sm:h-80 sm:w-80"
      />
      <div className="container relative flex flex-col items-center gap-5 py-16 text-center sm:gap-6 sm:py-24">
        <span className="animate-fade-in-up rounded-full border border-gold-400/30 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold-300 sm:px-4 sm:text-xs sm:tracking-[0.3em]">
          {SITE.tagline}
        </span>
        <h1
          className="max-w-3xl text-balance font-serif text-3xl font-bold leading-[1.15] sm:text-4xl md:text-6xl md:leading-tight animate-fade-in-up"
          style={{ animationDelay: "80ms" }}
        >
          A free library of <span className="gold-gradient-text">great books</span>, read aloud{" "}
          <span className="gold-gradient-text">in your language</span>.
        </h1>
        <p
          className="max-w-xl text-balance text-sm text-gold-100/80 sm:text-base animate-fade-in-up"
          style={{ animationDelay: "160ms" }}
        >
          Reader&apos;s companions to the classics and original long-form guides — every one free to read and
          listen to, with no account, in six languages.
        </p>
        <div
          className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row animate-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          <Button variant="gold" size="lg" asChild className="w-full sm:w-auto">
            <Link href="/books">
              Browse the library <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full border-gold-400/40 text-gold-100 hover:bg-white/5 sm:w-auto" asChild>
            <Link href="/blog">Read the articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    "100% Original Writing / Public Domain Classics",
    "Read Aloud in 6 Languages",
    "Free to Read & Listen",
    "No Account Needed",
  ];
  return (
    <div className="border-b border-border/60 bg-secondary/30">
      <div className="container flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-[11px] font-medium text-muted-foreground sm:gap-x-8 sm:py-4 sm:text-xs">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent" /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function CollectionsSection() {
  return (
    <section id="tiers" className="container py-12 sm:py-16">
      <Reveal className="mb-8 text-center sm:mb-10">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">Four collections — all free</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Foundations, skills, money, and mastery. Every book and article is free to read and listen to.
        </p>
      </Reveal>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {LIBRARY_CATEGORIES.map((cat, i) => (
          <Reveal key={cat.slug} delayMs={i * 60}>
            <Link
              href={`/category/${cat.slug}`}
              className="group flex h-full flex-col gap-2.5 rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-lg hover:shadow-gold-500/10 sm:gap-3 sm:p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-accent transition-colors duration-300 group-hover:gold-gradient group-hover:text-black sm:h-10 sm:w-10">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p className="font-serif text-base font-bold sm:text-lg">{cat.name}</p>
              <p className="text-xs text-muted-foreground">{cat.description}</p>
              <p className="mt-auto pt-1 text-xs font-medium text-accent">
                {getEbooksByCategory(cat.slug).length} books · Free
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function LibrarySection() {
  return (
    <section className="border-t border-border/60 py-12 sm:py-16">
      <div className="container">
        <Reveal className="mb-6 flex items-end justify-between sm:mb-8">
          <div>
            <h2 className="font-serif text-xl font-bold sm:text-2xl">The library</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Original reader&apos;s companions to the great public-domain classics.
            </p>
          </div>
          <Link href="/books" className="hidden text-sm text-accent hover:underline md:block">
            View all
          </Link>
        </Reveal>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {LIBRARY.slice(0, 9).map((book, i) => (
            <Reveal key={book.slug} delayMs={i * 40}>
              <Link
                href={`/books/${book.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-lg hover:shadow-gold-500/10"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-accent">{book.author}</p>
                <h3 className="mt-1 font-serif text-base font-semibold leading-snug group-hover:text-accent">
                  {book.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{book.description}</p>
                <p className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {book.minutes} min
                  </span>
                  <span className="flex items-center gap-1 font-medium text-accent">
                    <Headphones className="h-3 w-3" /> Free to read &amp; listen
                  </span>
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticlesSection({
  articles,
}: {
  articles: Array<{ slug: string; title: string; excerpt: string; minutes: number }>;
}) {
  return (
    <section className="border-t border-border/60 bg-secondary/20 py-12 sm:py-16">
      <div className="container">
        <Reveal className="mb-6 flex items-end justify-between sm:mb-8">
          <div>
            <h2 className="font-serif text-xl font-bold sm:text-2xl">Latest articles</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Original long reads on books, reading, and the honest e-book world.
            </p>
          </div>
          <Link href="/blog" className="hidden text-sm text-accent hover:underline md:block">
            View all
          </Link>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {articles.map((post, i) => (
            <Reveal key={post.slug} delayMs={i * 40}>
              <Link
                href={`/blog/${post.slug}`}
                className="block h-full rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:shadow-md sm:p-5"
              >
                <h3 className="font-serif text-sm font-semibold leading-snug sm:text-base">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{post.excerpt}</p>
                <p className="mt-3 text-xs text-accent">{post.minutes} min read · Free</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComplianceSection() {
  const points = [
    "Original writing produced for this library",
    "Public-domain classics, clearly identified",
    "No scraped or copied copyrighted content",
    "Free access — no paywall, no registration",
  ];
  return (
    <section className="border-t border-border/60 py-12 sm:py-16">
      <div className="container max-w-3xl text-center">
        <Reveal>
          <h2 className="font-serif text-xl font-bold sm:text-2xl">An honest library</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything published here is either written for this site or openly in the public domain — and it
            stays free.
          </p>
          <ul className="mx-auto mt-6 grid max-w-xl gap-2 text-start sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
