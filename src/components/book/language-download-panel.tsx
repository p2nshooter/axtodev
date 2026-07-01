"use client";

import { useState, useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MAX_LANGUAGE_DOWNLOADS_PER_BOOK } from "@/lib/constants";

interface LanguageOption {
  id: string;
  code: string;
  nativeName: string;
}

export function LanguageDownloadPanel({
  bookId,
  languages,
  grantedLanguageIds,
  formats,
}: {
  bookId: string;
  languages: LanguageOption[];
  grantedLanguageIds: string[];
  formats: string[];
}) {
  const [granted, setGranted] = useState(grantedLanguageIds);
  const [pending, startTransition] = useTransition();

  function selectLanguage(languageId: string) {
    if (granted.includes(languageId)) return;
    if (granted.length >= MAX_LANGUAGE_DOWNLOADS_PER_BOOK) {
      toast.error(`You can only select ${MAX_LANGUAGE_DOWNLOADS_PER_BOOK} languages for this book.`);
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/library/select-language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, languageId }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(body.error ?? "Could not select this language.");
        return;
      }
      setGranted((prev) => [...prev, languageId]);
      toast.success("Language unlocked for download.");
    });
  }

  async function download(languageId: string, format: string) {
    const res = await fetch(
      `/api/library/download-url?bookId=${bookId}&languageId=${languageId}&format=${format}`,
    );
    if (!res.ok) {
      toast.error("Could not generate a download link.");
      return;
    }
    const { url } = (await res.json()) as { url: string };
    window.location.href = url;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => {
          const isGranted = granted.includes(lang.id);
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => selectLanguage(lang.id)}
              disabled={pending || isGranted}
              className="focus:outline-none"
            >
              <Badge variant={isGranted ? "gold" : "outline"} className="cursor-pointer">
                {pending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                {lang.nativeName}
              </Badge>
            </button>
          );
        })}
      </div>
      {granted.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {granted.map((languageId) =>
            formats.map((format) => (
              <Button key={`${languageId}-${format}`} size="sm" variant="secondary" onClick={() => download(languageId, format)}>
                <Download className="h-3.5 w-3.5" /> {format}
              </Button>
            )),
          )}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Select up to {MAX_LANGUAGE_DOWNLOADS_PER_BOOK} languages for this e-book. Choices are permanent.
      </p>
    </div>
  );
}
