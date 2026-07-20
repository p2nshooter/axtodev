import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { SITE } from "@/lib/constants";

const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Free Library",
    links: [
      { href: "/books", label: "The Library" },
      { href: "/category/belajar-dasar", label: "Foundations" },
      { href: "/category/bisnis-keuangan", label: "Money & Work" },
      { href: "/category/expert-mastery", label: "Strategy & Mastery" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/support", label: "Support Center" },
      { href: "/legal/refund-policy", label: "Refund Policy" },
      { href: "/legal/copyright", label: "Copyright & DMCA" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/privacy", label: "Privacy Policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{SITE.description}</p>
          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            {SITE.acronym.map((a) => (
              <li key={a.letter}>
                <span className="gold-gradient-text font-bold">{a.letter}</span> — {a.word}
              </li>
            ))}
          </ul>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-serif text-sm font-semibold text-foreground">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} AXTO.dev — Ilmu untuk semua, peluang untuk selamanya.</p>
          <p>Every e-book is original, public-domain, or properly licensed — never pirated.</p>
        </div>
      </div>
    </footer>
  );
}
