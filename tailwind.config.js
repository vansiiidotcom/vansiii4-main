/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
  darkMode: 'class', // Enable dark mode support
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