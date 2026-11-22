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
  // 7 Nov 2026 (owner): one of the sixteen stacked accounts (src/lib/adsense.ts) and this site's primary — the only loader.
  // 22 Nov 2026 (pemilik): „hapus seluruh kode adsense tumpuk dan meta tag nya … sisakan 3 adsense saja“: akun utama = ca-pub-4906992051458194 (adsense-stack.json di ulyah.com).
  adClient: 'ca-pub-4906992051458194',
  analyticsEndpoint: 'https://api.ulyah.com/track',
} as const;
