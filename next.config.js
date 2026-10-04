/** @type {import('next').NextConfig} */
// 43 bot articles shared one title, "The Power of Syscall Abstraction:
// Simplifying Low-Level System Interactions", and one outline. Owner decision
// (4 Oct 2026): remove the twins, keep the syscall guides that each take their
// own angle. Each old url goes to the kept guide closest to what it covered.
const REMOVED_SYSCALL_TWINS = {
  'syscall-abstraction-5pcr': 'syscall-abstraction',
  'syscall-abstraction-benefits-and-trade-offs': 'syscall-abstraction-101',
  'syscall-abstraction-for-simplified-low-level-interactions': 'syscall-abstraction',
  'syscall-abstraction-yahe': 'syscall-abstraction-for-simplified-system-interactions',
  'syscall-abstraction-qhj5': 'syscall-abstraction',
  'syscall-abstraction-5ufp': 'syscall-abstraction-101',
  'syscall-abstraction-4zdy': 'syscall-abstraction-for-better-software',
  'syscall-abstraction-03mk': 'syscall-abstraction',
  'syscall-abstraction-yq0r': 'syscall-abstraction',
  'syscall-abstraction-e16b': 'syscall-abstraction-bjgd',
  'syscall-abstraction-aqnd': 'syscall-abstraction-for-simplified-system-interactions',
  'syscall-abstraction-oqmx': 'syscall-abstraction',
  'syscall-abstraction-in-practice': 'syscall-abstraction',
  'syscall-abstraction-simplified': 'syscall-abstraction',
  'syscall-abstraction-jsfv': 'syscall-abstraction-for-simplified-system-interactions',
  'syscall-abstraction-isyf': 'syscall-abstraction-simplifying-low-level-system-interactions-6ki9',
  'syscall-abstraction-v3kv': 'syscall-abstraction-for-simplified-system-interactions',
  'syscall-abstraction-101-9ddb': 'syscall-abstraction',
  'syscall-abstraction-2s06': 'syscall-abstraction-simplifying-low-level-system-interactions',
  'syscall-abstraction-in-practice-ftyx': 'syscall-abstraction',
  'syscall-abstraction-eoof': 'syscall-abstraction-101',
  'syscall-abstraction-c518': 'syscall-abstraction-101',
  'syscall-abstraction-for-simplified-low-level-interactions-ouhj': 'syscall-abstraction',
  'syscall-abstraction-mfk0': 'syscall-abstraction',
  'syscall-abstraction-simplified-l6gu': 'syscall-abstraction',
  'syscall-abstraction-simplified-c75a': 'syscall-abstraction',
  'syscall-abstraction-simplified-5i90': 'syscall-abstraction-abg4',
  'syscall-abstraction-4h98': 'syscall-abstraction',
  'syscall-abstraction-34sy': 'syscall-abstraction',
  'syscall-abstraction-for-modern-systems': 'syscall-abstraction',
  'syscall-abstraction-explained': 'syscall-abstraction',
  'syscall-abstraction-simplified-v4zw': 'syscall-abstraction',
  'syscall-abstraction-v30r': 'embracing-syscall-abstraction',
  'syscall-abstraction-r46o': 'syscall-abstraction',
  'syscall-abstraction-m85v': 'embracing-syscall-abstraction',
  'syscall-abstraction-l3dk': 'syscall-abstraction-for-better-software',
  'syscall-abstraction-t1gb': 'embracing-syscall-abstraction',
  'syscall-abstraction-gk8m': 'syscall-abstraction-101',
  'syscall-abstraction-uuou': 'syscall-abstraction',
  'syscall-abstraction-ahoe': 'syscall-abstraction-simplifying-low-level-system-interactions-6ki9',
  'syscall-abstraction-pto4': 'syscall-abstraction',
  'syscall-abstraction-2fop': 'syscall-abstraction',
  'syscall-abstraction-1e87': 'syscall-abstraction',
};
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async redirects() {
    return Object.entries(REMOVED_SYSCALL_TWINS).map(([from, to]) => ({
      source: `/articles/${from}`,
      destination: `/articles/${to}`,
      permanent: true,
    }));
  },
};
module.exports = nextConfig;
const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
initOpenNextCloudflareForDev();
