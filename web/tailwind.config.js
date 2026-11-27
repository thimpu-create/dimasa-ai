/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dimasa: {
          50: '#fdf8f4',
          100: '#faeee5',
          200: '#f4dcce',
          300: '#ebc0ab',
          400: '#de9b7d',
          500: '#d07353',
          600: '#c15a3a',
          700: '#a1462d',
          800: '#823b28',
          900: '#6c3324',
          950: '#3a180f',
        }
      }
    },
  },
  plugins: [],
}
