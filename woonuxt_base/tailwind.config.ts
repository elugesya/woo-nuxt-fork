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
          light: '#B7A6E7',
          DEFAULT: process.env.PRIMARY_COLOR || '#7F54B2',
          dark: '#6C479C',
        },
        background: '#F8F9FB',
        foreground: '#23272F',
        border: '#E5E7EB',
        input: '#F3F4F6',
        ring: '#B7A6E7',
        secondary: {
          DEFAULT: '#F3F4F6',
          foreground: '#23272F',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#fff',
        },
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },
        accent: {
          DEFAULT: '#E0E7FF',
          foreground: '#23272F',
        },
        popover: {
          DEFAULT: '#fff',
          foreground: '#23272F',
        },
        card: {
          DEFAULT: '#fff',
          foreground: '#23272F',
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
