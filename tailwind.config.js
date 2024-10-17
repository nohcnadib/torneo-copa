/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colorPrimary: "rgb(0, 104, 183)",
        colorPrimaryDark: "rgb(0, 94, 173)",
        colorSecondary: "rgb(255, 255, 255)",
        colorSecondaryDark: "rgb(245, 245, 245)"
      }
    },
  },
  plugins: [],
}
