"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Languages, Headphones } from "lucide-react";
import {
  READER_LOCALES,
  READER_LOCALE_LABELS,
  READER_SPEECH_LANG,
  RTL_READER_LOCALES,
  type ReaderLocale,
} from "@/lib/reader-locale";

export type ReaderBlock = { type: "h2" | "p"; text: string };

/**
 * Free, register-free voice reader for axto.dev articles (owner: everything is
 * free to READ and LISTEN, in the visitor's own language, with no account and
 * no download). It:
 *   - renders the article (English on the server for SEO/AdSense),
 *   - auto-picks the reader's language from their IP on first load and lets
 *     them switch it, translating on the fly,
 *   - reads aloud with a moving per-WORD pointer, auto-scrolling the active
 *     word into view and auto-advancing paragraph to paragraph until the whole
 *     article is finished, then stops — or stops the moment the reader wants.
 */
export function ArticleReader({
  title,
  blocks,
  initialLocale,
}: {
  title: string;
  blocks: ReaderBlock[];
  // When omitted (fully static pages, prerendered at build time with no
  // request headers available), the reader detects the visitor's language in
  // the browser instead — same auto-language behaviour, zero server compute.
  initialLocale?: ReaderLocale;
}) {
  // Item 0 is the title; items 1..n are the body blocks. Reading and
  // highlighting treat them as one linear sequence.
  const englishItems = useMemo(() => [title, ...blocks.map((b) => b.text)], [title, blocks]);

  const [locale, setLocale] = useState<ReaderLocale>(initialLocale ?? "en");
  const [items, setItems] = useState<string[]>(englishItems);
  const [translating, setTranslating] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [charIndex, setCharIndex] = useState(0);

  const autoAdvance = useRef(false);
  const keepAlive = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);
  const itemsRef = useRef<string[]>(englishItems);
  itemsRef.current = items;

  const rtl = RTL_READER_LOCALES.includes(locale);
  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  const stopKeepAlive = useCallback(() => {
    if (keepAlive.current) {
      clearInterval(keepAlive.current);
      keepAlive.current = null;
    }
  }, []);

  // Full stop + reset — used on unmount and when the language changes.
  const stop = useCallback(() => {
    autoAdvance.current = false;
    stopKeepAlive();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
    setActiveItem(null);
    setCharIndex(0);
  }, [stopKeepAlive]);

  // Pause — stops the voice but remembers the paragraph, so Listen resumes from
  // where the reader left off rather than the top.
  const pause = useCallback(() => {
    autoAdvance.current = false;
    stopKeepAlive();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
  }, [stopKeepAlive]);

  // Speak one item; on natural end, roll on to the next until the article ends.
  const speakItem = useCallback(
    (index: number) => {
      const list = itemsRef.current;
      if (index < 0 || index >= list.length) {
        stop();
        return;
      }
      const text = list[index] ?? "";
      if (!text.trim()) {
        // Skip empties but keep the chain going.
        if (autoAdvance.current) speakItemRef.current(index + 1);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = READER_SPEECH_LANG[locale];
      u.rate = 0.98;
      u.onboundary = (e) => {
        if (typeof e.charIndex === "number") setCharIndex(e.charIndex);
      };
      u.onend = () => {
        if (!autoAdvance.current) return;
        if (index + 1 < list.length) {
          speakItemRef.current(index + 1);
        } else {
          stop();
        }
      };
      setActiveItem(index);
      setCharIndex(0);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    },
    [locale, stop]
  );

  // Stable ref so onend can call the latest speakItem without stale closures.
  const speakItemRef = useRef(speakItem);
  speakItemRef.current = speakItem;

  const play = useCallback(() => {
    if (!speechSupported) return;
    autoAdvance.current = true;
    setPlaying(true);
    stopKeepAlive();
    // Chrome silently pauses long utterances after ~15s; a periodic resume()
    // keeps continuous reading alive.
    keepAlive.current = setInterval(() => {
      if (typeof window !== "undefined" && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
      }
    }, 8000);
    speakItemRef.current(activeItem ?? 0);
  }, [speechSupported, stopKeepAlive, activeItem]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, play, pause]);

  // Cleanup on unmount.
  useEffect(() => () => stop(), [stop]);

  // Keep the currently-spoken word centered in view.
  useEffect(() => {
    if (playing && activeWordRef.current) {
      activeWordRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [charIndex, activeItem, playing]);

  // Fetch a translation for the chosen language (English is the base).
  const applyLocale = useCallback(
    async (next: ReaderLocale) => {
      stop();
      setLocale(next);
      if (next === "en") {
        setItems(englishItems);
        return;
      }
      setTranslating(true);
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: englishItems, target: next }),
        });
        const data = (await res.json()) as { t?: string[] };
        setItems(Array.isArray(data.t) && data.t.length === englishItems.length ? data.t : englishItems);
      } catch {
        setItems(englishItems);
      } finally {
        setTranslating(false);
      }
    },
    [englishItems, stop]
  );

  // On first mount, pick the visitor's language automatically. A server-passed
  // locale (from cf-ipcountry) wins; on static pages, fall back to the
  // browser's own language — either way, non-English visitors get the article
  // and its voice in their language without touching anything.
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    let target = initialLocale;
    if (!target && typeof navigator !== "undefined") {
      const nav = (navigator.language || "").split("-")[0];
      target = READER_LOCALES.includes(nav as ReaderLocale) ? (nav as ReaderLocale) : "en";
    }
    if (target && target !== "en") void applyLocale(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayTitle = items[0] ?? title;
  const bodyItems = items.slice(1);

  return (
    <div dir={rtl ? "rtl" : "ltr"}>
      {/* Controls */}
      <div className="sticky top-16 z-20 -mx-4 mb-6 flex flex-wrap items-center gap-2 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur">
        <button
          onClick={toggle}
          disabled={!speechSupported || translating}
          className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-gold-400 disabled:opacity-50"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause" : "Listen"}
        </button>

        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Headphones className="h-3.5 w-3.5" /> Free to read &amp; listen
        </span>

        <span className="ms-auto inline-flex items-center gap-1.5">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <select
            value={locale}
            onChange={(e) => void applyLocale(e.target.value as ReaderLocale)}
            disabled={translating}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            aria-label="Reading language"
          >
            {READER_LOCALES.map((l) => (
              <option key={l} value={l}>
                {READER_LOCALE_LABELS[l]}
              </option>
            ))}
          </select>
          {translating && <span className="text-xs text-muted-foreground">…</span>}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl font-bold leading-tight">
        <SpokenText
          text={displayTitle}
          active={activeItem === 0}
          charIndex={charIndex}
          activeWordRef={activeWordRef}
        />
      </h1>

      {/* Body */}
      <div className="prose prose-invert prose-sm mt-8 max-w-none text-base leading-relaxed text-muted-foreground">
        {bodyItems.map((text, i) => {
          const block = blocks[i];
          const itemIndex = i + 1;
          const isActive = activeItem === itemIndex;
          if (block?.type === "h2") {
            return (
              <h2 key={i} className="mt-8 font-serif text-xl font-semibold text-foreground">
                <SpokenText text={text} active={isActive} charIndex={charIndex} activeWordRef={activeWordRef} />
              </h2>
            );
          }
          return (
            <p key={i} className="whitespace-pre-line">
              <SpokenText text={text} active={isActive} charIndex={charIndex} activeWordRef={activeWordRef} />
            </p>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Renders text as words and, while its parent item is the one being read,
 * highlights the single word whose character range contains the speech
 * boundary — the moving per-word pointer.
 */
function SpokenText({
  text,
  active,
  charIndex,
  activeWordRef,
}: {
  text: string;
  active: boolean;
  charIndex: number;
  activeWordRef: React.MutableRefObject<HTMLSpanElement | null>;
}) {
  // Tokenise into words + the whitespace that follows, tracking each word's
  // start offset so we can match it against the speech charIndex.
  const tokens = useMemo(() => {
    const out: { word: string; start: number; after: string }[] = [];
    const re = /(\S+)(\s*)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      out.push({ word: m[1] ?? "", start: m.index, after: m[2] ?? "" });
    }
    return out;
  }, [text]);

  if (!active) return <>{text}</>;

  // The active word is the last one whose start is <= the current charIndex.
  let activeIdx = 0;
  for (let i = 0; i < tokens.length; i++) {
    const tk = tokens[i];
    if (tk && tk.start <= charIndex) activeIdx = i;
    else break;
  }

  return (
    <>
      {tokens.map((tk, i) => (
        <span key={i}>
          <span
            ref={i === activeIdx ? activeWordRef : undefined}
            className={
              i === activeIdx
                ? "rounded bg-gold-500/30 text-foreground ring-1 ring-gold-500/40"
                : undefined
            }
          >
            {tk.word}
          </span>
          {tk.after}
        </span>
      ))}
    </>
  );
}
