import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default <Partial<Config>>{
  darkMode: ['class'],
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}', './app.vue'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          light: '#00A8CC', // Teal/Cyan
          DEFAULT: '#003366', // Deep Ocean Blue
          dark: '#002244',
          foreground: '#FFFFFF',
        },
        background: '#FAFAFA', // Clean Off-White
        foreground: '#0F172A', // Slate 900
        border: '#E2E8F0', // Slate 200
        input: '#F1F5F9', // Slate 100
        ring: '#00A8CC', // Teal
        secondary: {
          DEFAULT: '#F0F4F8', // Soft Grey/Blue
          foreground: '#0F172A',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#fff',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B', // Slate 500
        },
        accent: {
          DEFAULT: '#E0F2F1', // Light Teal
          foreground: '#003366',
        },
        popover: {
          DEFAULT: '#fff',
          foreground: '#0F172A',
        },
        card: {
          DEFAULT: '#fff',
          foreground: '#0F172A',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      aspectRatio: {
        '9/8': '1 / 1.125',
      },
      screens: {
        '2xl': '1400px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), animate],
};
