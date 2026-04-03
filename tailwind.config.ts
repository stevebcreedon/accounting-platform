import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        charcoal: '#1C1917',
        'burnt-orange': {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#E8720C',
          600: '#C2590A',
          700: '#9A3412',
          800: '#7C2D12',
          900: '#431407',
        },
      },
      fontFamily: {
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: [
          '4.5rem',
          {
            lineHeight: '1.05',
            letterSpacing: '-0.03em',
            fontWeight: '700',
          },
        ],
        hero: [
          '3.5rem',
          {
            lineHeight: '1.1',
            letterSpacing: '-0.025em',
            fontWeight: '700',
          },
        ],
        h1: [
          '2.5rem',
          {
            lineHeight: '1.15',
            letterSpacing: '-0.02em',
            fontWeight: '700',
          },
        ],
        h2: [
          '2rem',
          {
            lineHeight: '1.2',
            letterSpacing: '-0.015em',
            fontWeight: '600',
          },
        ],
        h3: [
          '1.5rem',
          {
            lineHeight: '1.3',
            letterSpacing: '-0.01em',
            fontWeight: '600',
          },
        ],
        h4: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        body: ['1rem', { lineHeight: '1.7' }],
        sm: ['0.875rem', { lineHeight: '1.6' }],
        xs: ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        article: '48rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover':
          '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#44403C',
            '--tw-prose-headings': '#1C1917',
            '--tw-prose-links': '#E8720C',
            '--tw-prose-bold': '#1C1917',
            '--tw-prose-counters': '#57534E',
            '--tw-prose-bullets': '#57534E',
            '--tw-prose-hr': '#E7E5E4',
            '--tw-prose-quotes': '#1C1917',
            '--tw-prose-quote-borders': '#E8720C',
            '--tw-prose-code': '#1C1917',
            '--tw-prose-th-borders': '#D6D3D1',
            '--tw-prose-td-borders': '#E7E5E4',
            maxWidth: '48rem',
            h1: { fontFamily: 'var(--font-satoshi)' },
            h2: { fontFamily: 'var(--font-satoshi)' },
            h3: { fontFamily: 'var(--font-satoshi)' },
            h4: { fontFamily: 'var(--font-satoshi)' },
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              '&:hover': { color: '#C2590A' },
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
