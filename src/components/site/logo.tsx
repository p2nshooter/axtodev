import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex shrink-0 items-center gap-1.5 font-serif text-base font-bold tracking-wide sm:gap-2 sm:text-xl", className)}>
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/60 gold-gradient-text text-base font-black"
        style={{ background: "linear-gradient(135deg,#111 0%,#1c1712 100%)" }}
      >
        <span className="gold-gradient-text">A</span>
      </span>
      <span>
        AXTO<span className="gold-gradient-text">.dev</span>
      </span>
    </Link>
  );
}
