"use client";

import { BookOpen, Headphones } from "lucide-react";

interface LanguageOption {
  id: string;
  code: string;
  nativeName: string;
}

/**
 * Downloads have been retired across axto.dev — every book is now free to READ
 * and LISTEN to online, in the reader's own language, with no purchase and no
 * download (owner: "matikan download, semua gratis dibaca & didengar"). The
 * old download/entitlement UI is replaced by this warm, professional note so
 * the page never dangles a disabled button. The prop shape is kept so callers
 * don't need to change.
 */
export function LanguageDownloadPanel({
  languages,
}: {
  bookId?: string;
  languages: LanguageOption[];
  grantedLanguageIds?: string[];
  formats?: string[];
}) {
  return (
    <div className="rounded-xl border border-gold-400/25 bg-gold-400/5 p-4">
      <p className="flex items-center gap-2 font-serif text-base font-semibold">
        <BookOpen className="h-4 w-4 text-gold-500" /> Free to read
        <Headphones className="ml-2 h-4 w-4 text-gold-500" /> Free to listen
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Every book here is open to everyone — read it online and let it be read aloud to you in your own language,
        with no account and no cost. Downloads are turned off so the whole library stays free and always up to date.
      </p>
      {languages.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Available in {languages.length} language{languages.length > 1 ? "s" : ""} — the reader follows your language automatically.
        </p>
      )}
    </div>
  );
}
