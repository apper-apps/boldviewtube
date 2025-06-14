/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF0042',
        secondary: '#1A1A1A',
        accent: '#00D4FF',
        surface: '#2A2A2A',
        background: '#0F0F0F',
        success: '#00FF88',
        warning: '#FFB800',
        error: '#FF3B3B',
        info: '#0099FF'
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