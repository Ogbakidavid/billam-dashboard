/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: { DEFAULT: 'var(--background)' },
        foreground: { DEFAULT: 'var(--foreground)' },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          bright: 'var(--primary-bright)',
          deep: 'var(--primary-deep)',
          soft: 'var(--primary-soft)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: { DEFAULT: 'var(--border)' },
        input: { DEFAULT: 'var(--input)' },
        ring: { DEFAULT: 'var(--ring)' },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 0.25rem)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 0.25rem)',
        xl: 'calc(var(--radius) + 0.5rem)',
        '2xl': 'calc(var(--radius) + 1rem)',
        '3xl': 'calc(var(--radius) + 1.5rem)',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-sans)', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': 'clamp(2.5rem, 6vw, 4.5rem)',
        'display': 'clamp(2rem, 4vw, 3.5rem)',
        'section': 'clamp(1.75rem, 3vw, 2.75rem)',
      },
      animation: {
        'float': 'floatCard 4s ease-in-out infinite',
        'float-delayed': 'floatCard 4s ease-in-out 1.5s infinite',
        'float-slow': 'floatCard 6s ease-in-out 0.8s infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-lg': '0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.08)',
        'card-xl': '0 8px 16px rgba(0,0,0,0.04), 0 24px 64px rgba(0,0,0,0.10)',
        'green-glow': '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)',
        'green-glow-lg': '0 0 0 1px rgba(25,214,107,0.3), 0 8px 40px rgba(25,214,107,0.25)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};