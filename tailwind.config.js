/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './renderer/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
  ],
};
