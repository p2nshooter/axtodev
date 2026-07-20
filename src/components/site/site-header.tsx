"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Public header for a free reading site: no Sign in, no cart, no account —
// everything is readable without registering (owner: "tanpa ada register").
// The admin dashboard stays reachable directly at /login for the owner.
const NAV_LINKS = [
  { href: "/books", label: "Library" },
  { href: "/category/belajar-dasar", label: "Foundations" },
  { href: "/category/bisnis-keuangan", label: "Money & Work" },
  { href: "/category/expert-mastery", label: "Mastery" },
  { href: "/blog", label: "Articles" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-6">
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <form action="/search" className="hidden max-w-sm flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" placeholder="Search books & articles…" className="pl-9" />
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="gold" size="sm" asChild className="ml-0.5 shrink-0 whitespace-nowrap px-2.5 sm:ml-1 sm:px-4">
            <Link href="/books">Read free</Link>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-border/60 transition-all duration-300 ease-out md:hidden",
          mobileOpen ? "grid-rows-[1fr] border-t opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <nav className="flex min-h-0 flex-col gap-1 px-4 pb-4 pt-2">
          <form action="/search" className="relative mb-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" placeholder="Search books & articles…" className="pl-9" />
          </form>
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="animate-fade-in-up rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              style={{ animationDelay: mobileOpen ? `${i * 40}ms` : "0ms" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
