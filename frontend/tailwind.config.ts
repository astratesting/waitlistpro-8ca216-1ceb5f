import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        brand: '#2563eb',
        mint: '#10b981',
      },
      boxShadow: {
        glow: '0 20px 80px rgba(37, 99, 235, 0.18)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
