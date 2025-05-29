/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Scans all JS/TSX files in src for Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        'vansiii-black': '#101010',
        'vansiii-white': '#FAFAF9',
        'vansiii-accent': '#FF5A73',
      },
    },
  },
  plugins: [],
};