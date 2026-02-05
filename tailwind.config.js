/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#003da5', // rgb(0, 61, 165)
          dark: '#002a72',
          light: '#e6ecf6',
        }
      }
    },
  },
  plugins: [],
}