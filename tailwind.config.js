/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vulseBlue: "#061A55",
        vulseCyan: "#2AE2DF",
        vulsePurple: "#8155FF",
        vulseRed: "#F34C50",
        vulseOrange: "#F9995B",
      },
    },
  },
  plugins: [],
};
