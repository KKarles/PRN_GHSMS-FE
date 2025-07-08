/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f4f43',
          light: '#e8f3f1',
          50: '#e8f3f1',
          500: '#0f4f43',
          600: '#0d4239',
          700: '#0b352f',
        },
        secondary: {
          DEFAULT: '#f9f8f6',
          50: '#f9f8f6',
          100: '#f2f1ee',
        },
        accent: {
          DEFAULT: '#f2a99e',
          50: '#fef7f6',
          500: '#f2a99e',
        },
        text: {
          dark: '#333333',
          light: '#ffffff',
        },
        background: {
          light: '#fcfcfc',
        },
        border: {
          subtle: '#e1e1e1',
        }
      },
      fontFamily: {
        'primary': ['Poppins', 'sans-serif'],
        'secondary': ['Lato', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

