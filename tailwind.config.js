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
        dark: {
          black: 'hsl(0,5%,3%)',
          primaryText: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}
