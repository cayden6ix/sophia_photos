/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        safari: {
          // Tons de verde (árvores da imagem)
          green: '#5A7247',
          'green-dark': '#3D5A30',
          'green-light': '#9CB88E',
          // Tons de marrom (troncos)
          brown: '#8B7355',
          'brown-dark': '#6D5D4E',
          'brown-light': '#A89880',
          // Tons de bege/creme (fundo suave)
          cream: '#F5F2E8',
          'cream-dark': '#E8E4D4',
          sand: '#E8D4A8',
          'sand-dark': '#D4C494',
          // Tons especiais para detalhes
          leaf: '#7A9B5E',
          vine: '#8BA872',
        }
      },
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      },
      backgroundImage: {
        'safari-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CB88E' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
