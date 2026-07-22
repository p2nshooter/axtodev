// Adsterra direct-tag ad configuration for axto.dev.
// highperformanceformat.com = iframe display banners (isolated per slot);
// effectivecpmnetwork.com = native banner, social bar and smart link.
// Rendered by src/components/Ads.tsx.
export type BannerSlot = 'leaderboard' | 'rectangle' | 'banner468' | 'halfpage' | 'skyscraper' | 'mobile';
type Banner = { key: string; width: number; height: number };
interface AdsConfig {
  banners: Partial<Record<BannerSlot, Banner>>;
  native: { container: string; src: string } | null;
  socialBar: string | null;
  smartLink: string | null;
}

export const ADS: AdsConfig = {
  banners: {
    leaderboard: { key: '1340dd7554f8639dbbf8f245b0351d7c', width: 728, height: 90 },
    rectangle: { key: '0e517501adab5b57855b50bacbe50cf9', width: 300, height: 250 },
    banner468: { key: '7e65fba412bb22fa929f5bff1b8588e0', width: 468, height: 60 },
    halfpage: { key: '46a855606b94d22904ae1aa20466ce76', width: 160, height: 600 },
    skyscraper: { key: '34fbebde92555fc9035eebb34d4efee6', width: 160, height: 300 },
    mobile: { key: 'a7fe35d63ab23af331b06f290b860c68', width: 320, height: 50 },
  },
  native: {
    container: '3851b4825b8717559526ab5128796425',
    src: 'https://pl30478014.effectivecpmnetwork.com/3851b4825b8717559526ab5128796425/invoke.js',
  },
  socialBar: 'https://pl30478021.effectivecpmnetwork.com/57/d9/a7/57d9a7a0e871ab1581224426e5a3364c.js',
  smartLink: 'https://www.effectivecpmnetwork.com/xb6zs9ui?key=62388d97a6448a578b7a089951aeb61c',
};
