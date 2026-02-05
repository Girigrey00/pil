/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Google Sans alternative
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'pill': '9999px',
      },
      colors: {
        brand: {
          DEFAULT: '#03045e', // Requested Navy Blue
          light: '#e8eaf6',   // Material 3 Surface Variant (Light Blue tint)
          hover: '#020344',
        },
        surface: {
          DEFAULT: '#f0f4f9', // Google's Light Background Grey
          container: '#ffffff', // Card background
          dim: '#dedede',
        }
      },
      boxShadow: {
        'soft': '0 2px 6px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
        'floating': '0 8px 24px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}