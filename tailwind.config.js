/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'rose-pink': '#FF69B4',
        'soft-pink': '#FFB6C1',
        'blush': '#FFC0CB',
        'cream': '#FFF8DC',
        'lavender': '#E6E6FA',
        'coral': '#FF7F7F',
        'mint': '#98FB98',
        'peach': '#FFCCCB',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
