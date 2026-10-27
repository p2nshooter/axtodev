import { ARTICLES, CATEGORIES } from '@/content/articles';
import { SITE } from '@/lib/site';

// /llms.txt (llmstxt.org) — what AXTO.dev is and where its articles are, for AI search engines and
// assistants: the same pages as the sitemap, with their summaries.
export const dynamic = 'force-static';

export function GET() {
  const text = [
    `# ${SITE.name} — ${SITE.tagline}`,
    '',
    `> ${SITE.description}`,
    '',
    ...CATEGORIES.flatMap((c) => [
      `## ${c.name}`,
      '',
      ...ARTICLES.filter((a) => a.category === c.slug).map((a) => `- [${a.title}](${SITE.url}/articles/${a.slug}): ${a.excerpt}`),
      '',
    ]),
    '## Optional',
    '',
    ...['about', 'contact', 'editorial-policy', 'privacy', 'terms', 'disclaimer'].map((p) => `- [${p}](${SITE.url}/${p})`),
    '',
  ].join('\n');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
