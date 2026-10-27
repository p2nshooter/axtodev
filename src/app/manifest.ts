import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

// The web app manifest (owner, 27 Oct 2026: SEO "file2 lain yg d butuhkan"): the icons Android, Chrome
// and search show for the site. A plain "browser" display — this is a reading site, not an app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    lang: 'en',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: '#f5f2e9',
    theme_color: '#060a18',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
