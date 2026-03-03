/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(50px, 50px) rotate(90deg)' },
          '50%': { transform: 'translate(0, 100px) rotate(180deg)' },
          '75%': { transform: 'translate(-50px, 50px) rotate(270deg)' },
        },
        'homescreen-float': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(2%, 2%) rotate(5deg)' },
          '66%': { transform: 'translate(-2%, 1%) rotate(-5deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        float: 'float 20s infinite',
        'homescreen-float': 'homescreen-float 15s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-in forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        slideIn: 'slideIn 3s infinite',
      },
      animationDelay: {
        300: '300ms',
        600: '600ms',
        900: '900ms',
      },
      transitionDuration: {
        120: '120ms',
        130: '130ms',
        150: '150ms',
        180: '180ms',
        200: '200ms',
        250: '250ms',
        1500: '1500ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
