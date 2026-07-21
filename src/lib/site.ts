// Per-site brand config — the one file (plus tailwind colors, globals.css
// variables and content/articles.ts) that changes between sibling sites.
export const SITE = {
  id: 'axto-dev',
  name: 'AXTO.dev',
  domain: 'axto.dev',
  url: 'https://axto.dev',
  tagline: 'Build better software',
  description:
    'Practical, hype-free guides for developers — programming languages, developer tooling, web performance, DevOps and the craft of shipping real software. Written for people who build.',
  locale: 'en',
  heroLead: 'Build better',
  heroAccent: 'software',
  adClient: 'ca-pub-6371903555702163',
  analyticsEndpoint: 'https://api.ulyah.com/track',
  adConfigEndpoint: 'https://api.ulyah.com/content/ad-config',
} as const;
