/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './<custom-folder>/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fef6e4',
        secondary: '#ff8e3c',
        black: {
          DEFAULT: '#000',
          100: '#1E1E2D',
          200: '#232533',
        },
        gray: {
          100: '#CDCDE0',
        },
        headline: '#0d0d0d',
        paragraph: '#2a2a2a',
        button: '#ff8e3c',
        button_text: '#0d0d0d',
        stroke: '#4b5563',
        highlight: '#ff8e3c',
        third: '#fffffe',
        tertiary: '#d9376e',
      },
      fontFamily: {
        pthin: ['Poppins-Thin', 'sans-serif'],
        pextralight: ['Poppins-ExtraLight', 'sans-serif'],
        plight: ['Poppins-Light', 'sans-serif'],
        pregular: ['Poppins-Regular', 'sans-serif'],
        pmedium: ['Poppins-Medium', 'sans-serif'],
        psemibold: ['Poppins-SemiBold', 'sans-serif'],
        pbold: ['Poppins-Bold', 'sans-serif'],
        pextrabold: ['Poppins-ExtraBold', 'sans-serif'],
        pblack: ['Poppins-Black', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
