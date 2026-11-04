/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        barber: {
          dark: '#121214',
          card: '#202024',
          border: '#323238',
          gold: '#C59B27',
          goldHover: '#D4A836',
          textMuted: '#A8A8B3',
        }
      }
    },
  },
  plugins: [],
}
