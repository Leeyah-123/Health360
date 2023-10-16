/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#1a222c',
        light: '#f1f5f9',
        secondary: '#aeb7c0',
        primary: '#FFFFFF',
        darkBlue: '#24303f'
      },
      fontFamily: {
        sans: 'Poppins, sans-serif'
      }
    }
  },
  darkMode: 'class',
  plugins: []
}
