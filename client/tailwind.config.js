/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily : {
           serifDisplay: ['"DM Serif Display"', 'serif'],
      },
    },
  },
  plugins: [],
};

