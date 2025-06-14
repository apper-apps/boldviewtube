/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: '#FF0042',
        secondary: {
          DEFAULT: '#1A1A1A',
          light: '#F8F9FA'
        },
        accent: '#00D4FF',
        surface: {
          DEFAULT: '#2A2A2A',
          light: '#FFFFFF'
        },
        background: {
          DEFAULT: '#0F0F0F',
          light: '#F5F5F5'
        },
        success: '#00FF88',
        warning: '#FFB800',
        error: '#FF3B3B',
        info: '#0099FF',
        text: {
          primary: {
            DEFAULT: '#FFFFFF',
            light: '#1A1A1A'
          },
          secondary: {
            DEFAULT: '#B3B3B3',
            light: '#6B7280'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Bebas Neue', 'Arial Black', 'ui-sans-serif', 'system-ui'],
        display: ['Bebas Neue', 'Arial Black', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
}