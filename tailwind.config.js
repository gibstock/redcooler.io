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
          dark: '#000000',
          primaryText: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}
