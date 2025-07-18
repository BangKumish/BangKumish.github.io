/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./public/**/*.{html,js}"],
  theme: {
    container:{
      center: true,
      padding: '16px',
    },

    extend: {
      colors: {
        primary: "#14b8a6",
        secondary: "#64748b",
        dark: "#18181b",
      },
      screens: {
        '2xl': '1320px',
      }
    },
  },
  plugins: [],
};
