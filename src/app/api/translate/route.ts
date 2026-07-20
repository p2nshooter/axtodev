import { NextResponse } from "next/server";
import { isReaderLocale } from "@/lib/reader-locale";

export const runtime = "edge";

/**
 * Free, on-the-fly translation for the register-free voice reader (owner: "auto
 * translate text ... mengikuti IP pengunjung"). The browser sends the English
 * article paragraphs and a target language; we translate server-side (so there
 * is no CORS problem and no key in the client) and cache each paragraph at the
 * edge, so popular articles are translated once and served instantly after.
 *
 * English text is what gets server-rendered for SEO/AdSense; this endpoint only
 * powers the in-page language switch and the read-aloud voice.
 */

// Brand names / acronyms that must survive translation untouched. Masked with
// sentinels that Google's endpoint leaves alone, then restored.
const PROTECTED = [
  "AXTO.dev",
  "AXTO",
  "PLR",
  "MRR",
  "CC0",
  "DMCA",
  "DRM",
  "ISBN",
  "EPUB",
  "PDF",
  "SEO",
  "HTML",
  "URL",
  "AI",
];

function mask(text: string): { masked: string; map: string[] } {
  const map: string[] = [];
  let masked = text;
  for (const term of PROTECTED) {
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    masked = masked.replace(re, () => {
      const token = `@@${map.length}@@`;
      map.push(term);
      return token;
    });
  }
  return { masked, map };
}

function unmask(text: string, map: string[]): string {
  let out = text;
  map.forEach((term, i) => {
    out = out.replace(new RegExp(`@@\\s*${i}\\s*@@`, "g"), term);
  });
  return out;
}

async function translateOne(text: string, target: string): Promise<string> {
  if (!text.trim()) return text;
  const { masked, map } = mask(text);
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t&tl=" +
    encodeURIComponent(target);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: "q=" + encodeURIComponent(masked),
  });
  if (!res.ok) throw new Error(`gtx ${res.status}`);
  const data = (await res.json()) as unknown;
  // Shape: [[["translated","source",...], ...], ...]
  const segments = Array.isArray(data) && Array.isArray(data[0]) ? (data[0] as unknown[]) : [];
  const joined = segments
    .map((s) => (Array.isArray(s) && typeof s[0] === "string" ? (s[0] as string) : ""))
    .join("");
  return unmask(joined, map);
}

// Small hash for cache keys (djb2).
function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

function edgeCache(): Cache | null {
  try {
    const c = (caches as unknown as { default?: Cache }).default;
    return c ?? null;
  } catch {
    return null;
  }
}

async function translateCached(text: string, target: string): Promise<string> {
  const cache = edgeCache();
  const key = `https://cache.axto.dev/tr/${target}/${hash(text)}`;
  if (cache) {
    const hit = await cache.match(key);
    if (hit) return hit.text();
  }
  const translated = await translateOne(text, target);
  if (cache) {
    // Translations are stable — cache for a long time.
    await cache.put(
      key,
      new Response(translated, { headers: { "Cache-Control": "public, max-age=31536000" } })
    );
  }
  return translated;
}

// Cap concurrency so a long article doesn't fire 40 requests at once.
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i] as T);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

export async function POST(req: Request) {
  let body: { q?: unknown; target?: unknown };
  try {
    body = (await req.json()) as { q?: unknown; target?: unknown };
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const target = typeof body.target === "string" ? body.target : "";
  const q = Array.isArray(body.q) ? body.q.filter((x): x is string => typeof x === "string") : [];

  if (!isReaderLocale(target) || q.length === 0) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  // English needs no translation.
  if (target === "en") {
    return NextResponse.json({ t: q });
  }
  if (q.length > 200) {
    return NextResponse.json({ error: "too_many" }, { status: 413 });
  }

  try {
    const t = await mapPool(q, 6, (text) => translateCached(text, target).catch(() => text));
    return NextResponse.json(
      { t },
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  } catch {
    // On any failure, degrade gracefully to the original English text.
    return NextResponse.json({ t: q });
  }
}
