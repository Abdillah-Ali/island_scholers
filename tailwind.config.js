/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0F7',
          100: '#C3D9EB',
          200: '#9BC1DE',
          300: '#72A9D1',
          400: '#4A91C4',
          500: '#2A6B9F', // Main primary color
          600: '#215680',
          700: '#184160',
          800: '#0F2B40',
          900: '#071620'
        },
        secondary: {
          50: '#E6F7EF',
          100: '#C3EBD7',
          200: '#9BDEBE',
          300: '#72D1A5',
          400: '#4AC48C',
          500: '#27AE60', // Main secondary color
          600: '#208B4D',
          700: '#19693A',
          800: '#114627',
          900: '#082313'
        },
        accent: {
          50: '#FFEEEE',
          100: '#FFD6D6',
          200: '#FFB9B9',
          300: '#FF9C9C',
          400: '#FF8484',
          500: '#FF6B6B', // Main accent color
          600: '#CC5656',
          700: '#994040',
          800: '#662B2B',
          900: '#331515'
        },
        neutral: {
          50: '#F5F0E1',
          100: '#EBE2C3',
          200: '#D6CA96',
          300: '#C2B169',
          400: '#AD993C',
          500: '#8C7B30',
          600: '#706226',
          700: '#54491D',
          800: '#383113',
          900: '#1C180A'
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
      },
      animation: {
        'wave': 'wave 8s linear infinite',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      }
    },
  },
  plugins: [],
}