/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safari: {
          green: '#7CB342',
          'green-dark': '#558B2F',
          brown: '#8D6E63',
          'brown-dark': '#6D4C41',
          yellow: '#FFD54F',
          'yellow-dark': '#FFC107',
          sky: '#87CEEB',
          sand: '#F5F5DC',
          'sand-dark': '#E8E4C9',
        }
      },
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
