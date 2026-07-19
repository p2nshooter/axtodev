import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/book/book-card";
import { TierIcon } from "@/components/site/tier-icon";
import { Reveal } from "@/components/site/reveal";
import { PRICE_TIERS, POPULAR_CATEGORIES, SITE } from "@/lib/constants";
import { formatUsd } from "@/lib/utils";
import { getFeaturedBooks, getBestSellers } from "@/server/book-service";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, bestSellers] = await Promise.all([getFeaturedBooks(8), getBestSellers(8)]);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <TrustBar />
      <PriceTierGrid />
      <FeaturedSection title="Featured E-books" subtitle="Hand-picked, always original or properly licensed." books={featured} />
      <FeaturedSection title="Best Sellers" subtitle="What readers are transforming their lives with this week." books={bestSellers} />
      <PopularCategoriesSection />
      <ComplianceSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-black via-[#120e08] to-background text-[#f5ecce]">
      {/* Ambient glow blobs — pure CSS, cheap on mobile */}
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
          Access knowledge that <span className="gold-gradient-text">transforms</span> and opens{" "}
          <span className="gold-gradient-text">opportunities</span>.
        </h1>
        <p
          className="max-w-xl text-balance text-sm text-gold-100/80 sm:text-base animate-fade-in-up"
          style={{ animationDelay: "160ms" }}
        >
          {SITE.description}
        </p>
        <div
          className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row animate-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          <Button variant="gold" size="lg" asChild className="w-full sm:w-auto">
            <Link href="/search">
              Browse the library <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full border-gold-400/40 text-gold-100 hover:bg-white/5 sm:w-auto" asChild>
            <Link href="#tiers">See pricing tiers</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    "100% Original / Public Domain / Properly Licensed",
    "8 Languages Supported",
    "Secure, Expiring Downloads",
    "PayPal & Live-Rate Crypto Payments",
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

function PriceTierGrid() {
  return (
    <section id="tiers" className="container py-12 sm:py-16">
      <Reveal className="mb-8 text-center sm:mb-10">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">E-books for every budget</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Six curated tiers, from a $1 quick-start guide to $150+ mastery collections.</p>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {PRICE_TIERS.map((tier, i) => (
          <Reveal key={tier.key} delayMs={i * 60}>
            <Link
              href={`/category/${tier.categoryName.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`}
              className="group flex h-full flex-col gap-2.5 rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-lg hover:shadow-gold-500/10 sm:gap-3 sm:p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-accent transition-colors duration-300 group-hover:gold-gradient group-hover:text-black sm:h-10 sm:w-10">
                <TierIcon name={tier.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">{tier.label}</p>
                <p className="font-serif text-base font-bold sm:text-lg">{tier.categoryName}</p>
              </div>
              <p className="text-xs font-medium text-accent sm:text-sm">
                {formatUsd(tier.minCents)}
                {tier.maxCents ? ` – ${formatUsd(tier.maxCents)}` : "+"}
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">{tier.badge}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FeaturedSection({
  title,
  subtitle,
  books,
}: {
  title: string;
  subtitle: string;
  books: Awaited<ReturnType<typeof getFeaturedBooks>>;
}) {
  if (books.length === 0) return null;
  return (
    <section className="border-t border-border/60 py-12 sm:py-16">
      <div className="container">
        <Reveal className="mb-6 flex items-end justify-between sm:mb-8">
          <div>
            <h2 className="font-serif text-xl font-bold sm:text-2xl">{title}</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          </div>
          <Link href="/search" className="hidden text-sm text-accent hover:underline md:block">
            View all
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {books.map((book, i) => (
            <Reveal key={book.id} delayMs={i * 50}>
              <BookCard
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularCategoriesSection() {
  return (
    <section className="border-t border-border/60 bg-secondary/20 py-12 sm:py-16">
      <div className="container">
        <Reveal className="mb-6 text-center sm:mb-8">
          <h2 className="font-serif text-xl font-bold sm:text-2xl">Tambahan Kategori Populer</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">More ways to grow — health, faith, family, career, and tech.</p>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {POPULAR_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} delayMs={i * 40}>
              <Link
                href={`/category/${cat.slug}`}
                className="block rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:shadow-md sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-semibold sm:text-base">{cat.name}</h3>
                  <span className="shrink-0 text-xs text-accent">
                    {formatUsd(cat.minCents)}–{formatUsd(cat.maxCents)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{cat.sampleTitles.join(" · ")}</p>
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
    "Konten original buatan sendiri / data & pengalaman pribadi",
    "Lisensi PLR/MRR dengan hak jual kembali",
    "Materi Public Domain (>70 tahun atau lisensi bebas)",
    "Tidak menyalin konten berhak cipta milik orang lain",
  ];
  return (
    <section className="border-t border-border/60 py-10 sm:py-14">
      <div className="container">
        <Reveal className="rounded-xl border border-gold-400/20 bg-gradient-to-br from-black via-[#141009] to-background p-6 text-gold-100 sm:p-8">
          <h2 className="font-serif text-lg font-bold text-gold-200 sm:text-xl">Aman dari klaim, jika:</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-gold-100/80">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
