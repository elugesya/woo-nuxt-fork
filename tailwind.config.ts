/**
 * 🌊 SEA TOYS & MARINE WEB SHOP - Tailwind Theme Configuration
 *
 * This config extends the base woonuxt theme with a premium marine/nautical color palette.
 * Colors are inspired by ocean luxury: deep navy, turquoise, seafoam, and coral accents.
 */
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default <Partial<Config>>{
  darkMode: ['class'],
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    './app/**/*.{js,vue,ts}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // 🌊 Primary - Deep Ocean Navy
        primary: {
          50: '#E6F0FA',
          100: '#CCE0F5',
          200: '#99C1EB',
          300: '#66A2E0',
          400: '#3383D6',
          500: '#0A2540', // Main primary color
          600: '#081E33',
          700: '#061726',
          800: '#040F1A',
          900: '#02080D',
          DEFAULT: '#0A2540',
          foreground: '#FFFFFF',
          light: '#3383D6', // Light variant for gradients
        },

        // 🐬 Secondary - Vibrant Turquoise
        secondary: {
          50: '#E6F9FC',
          100: '#CCF3F9',
          200: '#99E7F3',
          300: '#66DBED',
          400: '#33CFE7',
          500: '#00B4D8', // Main secondary color
          600: '#0090AD',
          700: '#006C82',
          800: '#004857',
          900: '#00242B',
          DEFAULT: '#00B4D8',
          foreground: '#0A2540',
          light: '#33CFE7', // Light variant for gradients
        },

        // 🪸 Accent - Coral (for CTAs and highlights)
        accent: {
          50: '#FFE8E8',
          100: '#FFD1D1',
          200: '#FFA3A3',
          300: '#FF7575',
          400: '#FF6B6B', // Main accent color
          500: '#FF4747',
          600: '#CC3939',
          700: '#992B2B',
          800: '#661D1D',
          900: '#330E0E',
          DEFAULT: '#FF6B6B',
          foreground: '#FFFFFF',
          light: '#FF8A80', // Light variant for gradients
        },

        // Coral light variant (for gradient usage)
        'coral-light': '#FF8A80',

        // 🏖️ Background colors
        background: '#F8F9FA', // Soft white (sand)
        foreground: '#0A2540', // Deep navy text

        // 🌊 Seafoam - Light accent for cards and sections
        seafoam: {
          50: '#F0F7FA',
          100: '#E6F0FA',
          200: '#CCE0F5',
          300: '#99C1EB',
          400: '#66A2E0',
          500: '#E6F0FA', // Main seafoam
          DEFAULT: '#E6F0FA',
        },

        // Border and input colors
        border: '#D1E3F0', // Light blue-gray
        input: '#F0F7FA', // Very light seafoam
        ring: '#00B4D8', // Turquoise focus ring

        // Card colors
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0A2540',
        },

        // Popover colors
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0A2540',
        },

        // Muted colors for secondary text
        muted: {
          DEFAULT: '#E6F0FA',
          foreground: '#4A6B8A', // Muted navy
        },

        // Destructive colors for errors
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },

        // Success colors
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },

        // Warning colors
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#0A2540',
        },
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      aspectRatio: {
        '9/8': '1 / 1.125',
        '4/3': '4 / 3',
        '3/4': '3 / 4',
      },

      screens: {
        'xs': '375px',
        '2xl': '1400px',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        'ocean': '0 4px 20px rgba(0, 180, 216, 0.1)',
        'ocean-lg': '0 8px 30px rgba(0, 180, 216, 0.15)',
        'card': '0 2px 8px rgba(10, 37, 64, 0.08)',
        'card-hover': '0 8px 24px rgba(10, 37, 64, 0.12)',
      },

      backgroundImage: {
        'gradient-ocean': 'linear-gradient(135deg, #0A2540 0%, #00B4D8 100%)',
        'gradient-ocean-reverse': 'linear-gradient(135deg, #00B4D8 0%, #0A2540 100%)',
        'gradient-seafoam': 'linear-gradient(180deg, #E6F0FA 0%, #FFFFFF 100%)',
        'gradient-coral': 'linear-gradient(135deg, #FF6B6B 0%, #FF8A80 100%)',
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
        // 🌊 Marine animations
        'wave-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'wave-shadow': {
          '0%, 100%': { boxShadow: '0 4px 20px rgba(0, 180, 216, 0.1)' },
          '50%': { boxShadow: '0 8px 30px rgba(0, 180, 216, 0.25)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // 🌊 Marine animations
        'wave-float': 'wave-float 3s ease-in-out infinite',
        'wave-shadow': 'wave-shadow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'ripple': 'ripple 0.6s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), animate],
};
