import type { Article } from './types';

/**
 * Consolidation, switched off. Every article keeps its own URL.
 *
 * This file briefly merged 91 overlapping articles into 23. The owner's
 * decision is the opposite — "jgn di gabungin, tp lu tambahin textnya biar
 * lebih panjang" — so MERGES is empty and buildMerged() absorbs nothing. The
 * machinery is kept rather than deleted because articles.ts calls it, and
 * because the problem it was written for has not gone away.
 *
 * THE PROBLEM, recorded because it is still true. The library repeats itself:
 *
 *   syscall abstraction        8 articles
 *   observability / logging    7
 *   microservices security     3
 *   CI/CD                      3
 *   CORS, cookies, debouncing, recursion, mutability, async,
 *   code review, containers, env vars, terminal, git branches   2 each
 *
 * The slug suffixes show how. `-abg4`, `-bjgd`, `-vi91`, `-exf7`, `-3u3w`,
 * `-83gr` are the content bot's collision guard firing: it produced a title
 * that already existed and published anyway, because the prompt showed it only
 * the last forty titles. 92 files, about 23 subjects, at a median of 360 words.
 *
 * That prompt window is fixed now — it sees every title — so no new duplicates
 * are being written. The existing ones are being answered by making each
 * article a full treatment of its own subject instead of a fragment of a
 * subject shared with seven others. Two articles about system calls that each
 * go deep in a different direction are not duplication; two that each skim the
 * same 400 words are. Length is what separates them, and it is being added by
 * hand.
 */

/** One consolidated article, declared rather than rewritten. */
interface Merge {
  slug: string;
  category: Article['category'];
  title: string;
  excerpt: string;
  intro: string[];
  from: string[];
}

/** Empty by decision. See the note above. */
export const MERGES: Merge[] = [];

/**
 * Fold each merge group into one article, carrying the prose across.
 *
 * With MERGES empty this returns nothing and absorbs nothing, so articles.ts
 * publishes its library unchanged. The implementation is left intact so the
 * decision can be revisited by adding entries above rather than by rewriting
 * anything.
 */
export function buildMerged(all: Article[]): { merged: Article[]; absorbed: Set<string> } {
  const bySlug = new Map(all.map((a) => [a.slug, a]));
  const absorbed = new Set<string>();
  const merged: Article[] = [];

  for (const m of MERGES) {
    const sections: Article['sections'] = [{ h: '', p: m.intro }];
    let newest = '';
    let author = 'The AXTO.dev Desk';
    for (const slug of m.from) {
      const src = bySlug.get(slug);
      if (!src) continue;
      absorbed.add(slug);
      if (src.date > newest) newest = src.date;
      author = src.author ?? author;
      for (const [i, s] of src.sections.entries()) {
        sections.push({ h: i === 0 ? src.title : s.h, p: s.p });
      }
    }
    if (sections.length === 1) continue;
    merged.push({
      slug: m.slug,
      category: m.category,
      title: m.title,
      excerpt: m.excerpt,
      date: newest || new Date().toISOString().slice(0, 10),
      minutes: 1,
      author,
      sections,
    });
  }
  return { merged, absorbed };
}
