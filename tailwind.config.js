/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#b5cff5',
        secondary: '#dbeafe',
        primary: '#3686FF',
        accent: '#1447e6cc',
        'background-dark': '#2e315e',
        'secondary-dark': '#5462a1',
        'primary-dark': '#1463da',
        'accent-dark': '#031c66e0',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
