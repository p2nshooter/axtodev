// Reader languages for the free, register-free voice reader. English is the
// SSR/base language (best for SEO + AdSense crawling); the reader can switch to
// any of these and the read-aloud voice follows. Kept deliberately small so the
// UI and voice list stay tidy.
export const READER_LOCALES = ['en', 'id', 'es', 'fr', 'ar', 'ja'] as const;
export type ReaderLocale = (typeof READER_LOCALES)[number];

export const DEFAULT_READER_LOCALE: ReaderLocale = 'en';

export function isReaderLocale(v: string | undefined | null): v is ReaderLocale {
  return !!v && (READER_LOCALES as readonly string[]).includes(v);
}

// Human labels (in their own language) for the language switcher.
export const READER_LOCALE_LABELS: Record<ReaderLocale, string> = {
  en: 'English',
  id: 'Indonesia',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية',
  ja: '日本語',
};

// The BCP-47 tag handed to the browser's speech engine per language, so the
// narration voice matches the text.
export const READER_SPEECH_LANG: Record<ReaderLocale, string> = {
  en: 'en-US',
  id: 'id-ID',
  es: 'es-ES',
  fr: 'fr-FR',
  ar: 'ar-SA',
  ja: 'ja-JP',
};

export const RTL_READER_LOCALES: ReaderLocale[] = ['ar'];

// Map a visitor's country (Cloudflare's cf-ipcountry header) to the closest
// supported reading language, so a first-time visitor sees — and can hear — the
// article in their own language automatically (owner: "auto bahasa mengikuti IP
// pengunjung"). Anything not listed falls through to Accept-Language, then EN.
const COUNTRY_TO_LOCALE: Record<string, ReaderLocale> = {
  ID: 'id', MY: 'id', BN: 'id',
  SA: 'ar', AE: 'ar', EG: 'ar', QA: 'ar', KW: 'ar', BH: 'ar', OM: 'ar',
  JO: 'ar', IQ: 'ar', SY: 'ar', LB: 'ar', LY: 'ar', DZ: 'ar', MA: 'ar',
  TN: 'ar', YE: 'ar', SD: 'ar', PS: 'ar',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es',
  SV: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es',
  FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr', SN: 'fr', CI: 'fr', CM: 'fr',
  JP: 'ja',
};

/**
 * Pick the reader language for a request from Cloudflare's country header,
 * then the browser's Accept-Language, then English. Pure function so it's easy
 * to unit-test; the caller passes the header values.
 */
export function pickReaderLocale(cfCountry?: string | null, acceptLanguage?: string | null): ReaderLocale {
  const country = (cfCountry ?? '').toUpperCase();
  const byCountry = COUNTRY_TO_LOCALE[country];
  if (byCountry) return byCountry;

  const preferred = (acceptLanguage ?? '').split(',')[0]?.split('-')[0];
  if (isReaderLocale(preferred)) return preferred;

  return DEFAULT_READER_LOCALE;
}
