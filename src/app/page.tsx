import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/book/book-card";
import { TierIcon } from "@/components/site/tier-icon";
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
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #e0bd67 0, transparent 45%)" }} />
      <div className="container relative flex flex-col items-center gap-6 py-24 text-center">
        <span className="rounded-full border border-gold-400/30 px-4 py-1 text-xs uppercase tracking-[0.3em] text-gold-300">
          {SITE.tagline}
        </span>
        <h1 className="max-w-3xl text-balance font-serif text-4xl font-bold leading-tight md:text-6xl">
          Access knowledge that <span className="gold-gradient-text">transforms</span> and opens{" "}
          <span className="gold-gradient-text">opportunities</span>.
        </h1>
        <p className="max-w-xl text-balance text-gold-100/80">{SITE.description}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button variant="gold" size="lg" asChild>
            <Link href="/search">
              Browse the library <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="border-gold-400/40 text-gold-100 hover:bg-white/5" asChild>
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
      <div className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-xs font-medium text-muted-foreground">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PriceTierGrid() {
  return (
    <section id="tiers" className="container py-16">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl font-bold">E-books for every budget</h2>
        <p className="mt-2 text-muted-foreground">Six curated tiers, from a $1 quick-start guide to $150+ mastery collections.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {PRICE_TIERS.map((tier) => (
          <Link
            key={tier.key}
            href={`/category/${tier.categoryName.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`}
            className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-accent group-hover:gold-gradient group-hover:text-black">
              <TierIcon name={tier.icon} className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tier.label}</p>
              <p className="font-serif text-lg font-bold">{tier.categoryName}</p>
            </div>
            <p className="text-sm font-medium text-accent">
              {formatUsd(tier.minCents)}
              {tier.maxCents ? ` – ${formatUsd(tier.maxCents)}` : "+"}
            </p>
            <p className="text-xs text-muted-foreground">{tier.badge}</p>
          </Link>
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
    <section className="border-t border-border/60 py-16">
      <div className="container">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <Link href="/search" className="hidden text-sm text-accent hover:underline md:block">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {books.map((book) => (
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
      </div>
    </section>
  );
}

function PopularCategoriesSection() {
  return (
    <section className="border-t border-border/60 bg-secondary/20 py-16">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl font-bold">Tambahan Kategori Populer</h2>
          <p className="text-sm text-muted-foreground">More ways to grow — health, faith, family, career, and tech.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-gold-400/50"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-semibold">{cat.name}</h3>
                <span className="text-xs text-accent">
                  {formatUsd(cat.minCents)}–{formatUsd(cat.maxCents)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{cat.sampleTitles.join(" · ")}</p>
            </Link>
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
    <section className="border-t border-border/60 py-14">
      <div className="container">
        <div className="rounded-xl border border-gold-400/20 bg-gradient-to-br from-black via-[#141009] to-background p-8 text-gold-100">
          <h2 className="font-serif text-xl font-bold text-gold-200">Aman dari klaim, jika:</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-gold-100/80">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
