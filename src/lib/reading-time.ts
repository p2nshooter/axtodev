import type { Article } from '@/content/types';

/**
 * How long an article actually takes to read, measured from the article.
 *
 * Every piece on this site carried a hand-set `minutes` field, and 66 of the 70
 * hand-written ones were out by three minutes or more. "Big-O Notation in Plain
 * English" is about 520 words and claimed nine minutes; a reader finishes it in
 * three. The generated batch was worse in a different way — all 32 said "7 min"
 * regardless of length, because the model was asked for a number in a range and
 * returned the middle of it every time.
 *
 * The page already counted the real words for its schema.org `wordCount`, so
 * the structured data and the visible byline were contradicting each other on
 * the same page — a machine-readable inconsistency, sitting under an AdSense
 * review that came back "Low value content".
 *
 * Counting is cheap and it cannot drift, so nothing is trusted: the number is
 * derived at render, and the same count feeds `wordCount` so the two can never
 * disagree again.
 */

/** Words a reader meets, headings included — they are read too. */
export function countArticleWords(article: Pick<Article, 'sections'>): number {
  let n = 0;
  for (const s of article.sections) {
    for (const text of [s.h, ...s.p]) {
      n += text.trim().match(/\S+/g)?.length ?? 0;
    }
  }
  return n;
}

/**
 * 200 words a minute — the usual figure for ordinary adult prose. Rounded, and
 * never below one, so a short piece reads "1 min" rather than "0 min".
 */
export function readingMinutes(article: Pick<Article, 'sections'>): number {
  return Math.max(1, Math.round(countArticleWords(article) / 200));
}
