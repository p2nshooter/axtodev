import type { Metadata } from 'next';
import { SiteBeacon } from "@/components/SiteBeacon";
import { Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import './copa2026.css';
import { SITE } from '@/lib/site';
import { SiteHeader, SiteFooter } from '@/components/Site';
import { Copa2026 } from '@/components/Copa2026';
import { Analytics } from '@/components/Analytics';

// Brass observatory (docs/ADSENSE-BLUEPRINT.md §4 in ulyah.com): Fraunces for
// the engraved headings, JetBrains Mono for the developer's reading voice.
const serif = Fraunces({ subsets: ['latin'], weight: ['500', '600', '700', '800', '900'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: '/' },
  icons: { icon: '/icon.svg?v=2', shortcut: '/icon.svg?v=2', apple: '/icon.svg?v=2' },
  robots: { index: true, follow: true },
  openGraph: { siteName: SITE.name, type: 'website', locale: 'en_US' },
  other: { 'google-adsense-account': SITE.adClient }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <head>
        {/* Google AdSense — verification + loader on every page. */}
        <meta name="google-adsense-account" content={SITE.adClient} />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adClient}`}
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                { '@type': 'Organization', '@id': `${SITE.url}#org`, name: SITE.name, url: SITE.url, logo: `${SITE.url}/icon.svg` },
                { '@type': 'WebSite', '@id': `${SITE.url}#site`, name: SITE.name, url: SITE.url, publisher: { '@id': `${SITE.url}#org` }, inLanguage: 'en' },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans">
        <SiteBeacon />
        <Copa2026 />
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
