/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E5FAF4', // Lightest shade of chalkboard green
          200: '#BFEDDF',
          300: '#99E0CA',
          400: '#73D3B5',
          500: '#4DC6A0', // Default chalkboard green
          600: '#27B98B',
          700: '#01AC76',
          800: '#008A5E',
          900: '#006846'  // Darkest shade of chalkboard green
        },
        secondary: {
          100: '#FDECEB', // Lightest shade of secondary
          200: '#FBD1D0',
          300: '#F9B6B5',
          400: '#F79B9A',
          500: '#F5807F', // Default secondary color
          600: '#F36564',
          700: '#F14A49',
          800: '#D1322E',
          900: '#B01A13'  // Darkest shade of secondary
        }
      }
    },
  },
  plugins: [],
}
