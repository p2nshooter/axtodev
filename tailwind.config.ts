import type { Config } from 'tailwindcss';

// xad.es — modern tech theme: deep slate-navy, cool paper, electric blue.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#0a0f1c', 900: '#131a2b', 800: '#1d2740', 700: '#2b3a5f' },
        ivory: { 50: '#f5f7fb', 100: '#e9eef7', 200: '#d5deee' },
        gold: { 300: '#8fb4ff', 400: '#5a90fe', 500: '#3a7afe', 600: '#2960d8' }
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
