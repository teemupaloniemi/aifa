/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E5F2FA', // Lightest shade of primary
          200: '#BFDFF5',
          300: '#99CCF0',
          400: '#73B9EB',
          500: '#4DA6E6', // Default primary color
          600: '#2783E1',
          700: '#0160DC',
          800: '#0048A7',
          900: '#003073'  // Darkest shade of primary
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
