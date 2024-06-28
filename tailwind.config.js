/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        bodyBg: 'var(--bodyBg)',
        textColor: 'var(--textColor)',
      },
      boxShadow: {
        // card: '3px 3px 5px 0 var(--shadowColor)',
      },
    },
  },
  plugins: [],
};