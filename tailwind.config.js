/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'hsl(0,73%,41.8%)',
        secondary: 'hsl(0,84.2%,60.2%)',
        blackish: '#222222',
        whiteish: '#f2f2f2',
        redcooler: '#D9583B',
        redcoolerLite: '#F28F79',
        dark: {
          black: 'hsl(0,5%,3%)',
          primaryText: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}
