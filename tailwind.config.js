/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        olive: {
          50: '#f6f7f4',
          100: '#e9ebe5',
          200: '#d4d8cc',
          300: '#b2b9a6',
          400: '#8a9378',
          500: '#6b7556',
          600: '#555e44',
          700: '#444c37',
          800: '#393f30',
          900: '#2f3427',
          950: '#1c2015',
        },
        ivory: {
          50: '#fefefb',
          100: '#fbfaf3',
          200: '#f6f3e6',
          300: '#ede8d0',
          400: '#e0d9be',
        },
        beige: {
          50: '#fdfbf7',
          100: '#f9f5ec',
          200: '#f0e9d8',
          300: '#e4d9c1',
        },
        ink: {
          900: '#1a1d1b',
          800: '#262a27',
          700: '#3a403c',
          600: '#5c635f',
          500: '#7a827d',
          400: '#9ba39e',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
