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
          DEFAULT: '#03045e', // Updated to new Navy Blue
          dark: '#020344',    // Darker shade for hover states
          light: '#e6e7f5',   // Light variant for backgrounds
        }
      }
    },
  },
  plugins: [],
}