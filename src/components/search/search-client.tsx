"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, BookOpen, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface SearchDoc {
  type: "book" | "article";
  slug: string;
  title: string;
  description: string;
  extra: string; // author / minutes label
}

/**
 * Client-side search over the whole (code-shipped) catalog. The index arrives
 * with the page bundle — a few dozen small entries — so searching costs the
 * server nothing at all: no worker invocation, no database, no Error 1102.
 */
export function SearchClient({ docs }: { docs: SearchDoc[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.extra.toLowerCase().includes(q)
    );
  }, [query, docs]);

  return (
    <div>
      <div className="relative mb-8 max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books and articles…"
          className="pl-9"
          autoFocus
        />
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        {results.length} result{results.length === 1 ? "" : "s"}
        {query.trim() ? ` for "${query.trim()}"` : ""}
      </p>

      {results.length === 0 ? (
        <p className="text-muted-foreground">Nothing matched. Try a different keyword.</p>
      ) : (
        <ul className="space-y-3">
          {results.map((d) => (
            <li key={`${d.type}-${d.slug}`}>
              <Link
                href={d.type === "book" ? `/books/${d.slug}` : `/blog/${d.slug}`}
                className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-gold-400/50"
              >
                {d.type === "book" ? (
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                ) : (
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                )}
                <span>
                  <span className="font-medium group-hover:text-accent">{d.title}</span>
                  <span className="block text-xs text-muted-foreground">{d.extra}</span>
                  <span className="mt-1 line-clamp-2 block text-xs text-muted-foreground">{d.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
