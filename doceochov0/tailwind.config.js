/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        petroleum: {
          dark: '#0D1F1C',
          DEFAULT: '#1D4A45',
        },
        gold: '#C9A84C',
        cream: '#F5EFE6',
        sand: '#D4C5B0',
        background: '#F5EFE6',
        foreground: '#0D1F1C',
        card: {
          DEFAULT: '#F5EFE6',
          foreground: '#0D1F1C',
        },
        popover: {
          DEFAULT: '#F5EFE6',
          foreground: '#0D1F1C',
        },
        primary: {
          DEFAULT: '#0D1F1C',
          foreground: '#F5EFE6',
        },
        secondary: {
          DEFAULT: '#1D4A45',
          foreground: '#F5EFE6',
        },
        muted: {
          DEFAULT: '#D4C5B0',
          foreground: '#6B5E4E',
        },
        accent: {
          DEFAULT: '#C9A84C',
          foreground: '#0D1F1C',
        },
        destructive: {
          DEFAULT: 'oklch(0.577 0.245 27.325)',
          foreground: '#F5EFE6',
        },
        border: 'rgba(13, 31, 28, 0.12)',
        input: 'rgba(13, 31, 28, 0.12)',
        ring: '#C9A84C',
      },
      borderRadius: {
        DEFAULT: '0rem',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
