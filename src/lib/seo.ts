// Search titles and snippets (owner, 27 Oct 2026: "perbaiki dulu seluruh SEO websitenya, perkata").
// Google shows about 60 characters of a title and 160 of a description. Every headline here puts its
// keyword first, so a long one is cut at its last clause break that fits, keeping " · <site>" when
// there is room; Open Graph and the page itself keep the full headline. The same rule as the article
// sites in ulyah.com (sites/_engine/build.mjs) and axto.io (lib/seo.ts).
export const MAX_TITLE = 60;
export const MAX_DESCRIPTION = 160;
const TRAILING = new Set([' ', ',', ';', ':', '.', '–', '—', '|', '-', '।']);
const trimTrailing = (t: string) => {
  let end = t.length;
  while (end > 0 && TRAILING.has(t[end - 1])) end -= 1;
  return t.slice(0, end).trim();
};
/** Every prefix of `title` that ends at one of `marks`, longest first ("?" and "!" are kept). */
const cutsAt = (title: string, marks: RegExp) =>
  [...title.matchAll(marks)]
    .map((m) => trimTrailing(title.slice(0, (m.index ?? 0) + (m[0][0] === '?' || m[0][0] === '!' ? 1 : 0))))
    .filter(Boolean)
    .reverse();

/** The full <title> for a headline: with " · <site>" when it fits, otherwise the longest clause that fits. */
export function searchTitle(title: string, site: string): string {
  const branded = (t: string) => (t.includes(site) ? t : `${t} · ${site}`);
  const fits = (t: string) => t.length >= 10 && t.length <= MAX_TITLE;
  if (fits(branded(title))) return branded(title);
  if (fits(title)) return title;
  const clauses = cutsAt(title, /[:?!.।](?=\s)|\s[–—|-]\s/g);
  const commas = cutsAt(title, /,(?=\s)/g);
  for (const group of [clauses, commas]) {
    const withBrand = group.find((c) => fits(branded(c)));
    if (withBrand) return branded(withBrand);
    const alone = group.find(fits);
    if (alone) return alone;
  }
  const head = title.slice(0, MAX_TITLE - 1);
  return `${trimTrailing(head.slice(0, head.lastIndexOf(' ')))}…`;
}

/** The meta description: as it is up to 160 characters, otherwise cut at the last sentence that fits. */
export function snippet(description: string): string {
  const d = description.replace(/\s+/g, ' ').trim();
  if (d.length <= MAX_DESCRIPTION) return d;
  const ends = [...d.matchAll(/[.!?।](?=\s)/g)].map((m) => (m.index ?? 0) + 1).filter((i) => i >= 70 && i <= MAX_DESCRIPTION);
  if (ends.length) return d.slice(0, ends[ends.length - 1]);
  const head = d.slice(0, MAX_DESCRIPTION - 1);
  return `${trimTrailing(head.slice(0, head.lastIndexOf(' ')))}…`;
}
