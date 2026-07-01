import { cn } from "@/lib/utils";

const PALETTES = [
  "from-[#1c1712] via-[#2a2116] to-[#0d0b08]",
  "from-[#241a10] via-[#3a2a17] to-[#120d08]",
  "from-[#1a1a1c] via-[#2b2b30] to-[#0c0c0e]",
];

function paletteFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}

/**
 * Generative placeholder cover (no external image dependency): gradient
 * background derived from the book id + the title set in gold serif type.
 * Swapped automatically for `coverImageUrl` once a real cover is uploaded.
 */
export function BookCover({
  title,
  seed,
  coverImageUrl,
  className,
}: {
  title: string;
  seed: string;
  coverImageUrl?: string | null;
  className?: string;
}) {
  if (coverImageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={coverImageUrl} alt={title} className={cn("h-full w-full object-cover", className)} />;
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br p-4 text-[#e0bd67]",
        paletteFor(seed),
        className,
      )}
    >
      <div className="absolute inset-0 border border-gold-400/10" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300/70">AXTO.dev</span>
      <p className="line-clamp-5 font-serif text-lg font-semibold leading-snug text-gold-100">{title}</p>
      <span className="h-px w-10 gold-gradient" />
    </div>
  );
}
