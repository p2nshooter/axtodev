import type { Config } from 'tailwindcss';

// axto.dev — 'Brass observatory': midnight blue, star-chart paper and brass
// (docs/ADSENSE-BLUEPRINT.md §4 in ulyah.com). Unique to this site.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#060a18', 900: '#0c1330', 800: '#18224a', 700: '#283463' },
        ivory: { 50: '#f5f2e9', 100: '#e9e3d1', 200: '#d8cfb4' },
        gold: { 300: '#f0d590', 400: '#d9b45c', 500: '#b8893a', 600: '#8a6222' }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif']
      },
      maxWidth: { prose2: '44rem' }
    }
  },
  plugins: []
};
export default config;
