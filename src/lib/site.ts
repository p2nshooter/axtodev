// Per-site brand config — the one file (plus tailwind colors, globals.css
// variables and content/articles.ts) that changes between sibling sites.
export const SITE = {
  id: 'axto-dev',
  name: 'AXTO.dev',
  domain: 'axto.dev',
  url: 'https://axto.dev',
  tagline: 'Build better software',
  description:
    'Practical, hype-free guides for developers: languages, tooling, web performance, DevOps and the craft of shipping real software. Written for people who build.',
  locale: 'en',
  heroLead: 'Build better',
  heroAccent: 'software',
  // 19 Oct 2026 (owner): "Ubah adsense axto.dev dengan kode ini" — google.com, pub-6381187608934514.
  adClient: 'ca-pub-6381187608934514',
  analyticsEndpoint: 'https://api.ulyah.com/track',
} as const;
