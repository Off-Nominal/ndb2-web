/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      white: "#FFFFFF",
      "moonstone-blue": "#73A6C4",
      "moss-green": "#8AA644",
      "silver-chalice-grey": "#B2AFA1",
      "jet-grey": "#2d2d2d",
      "deep-chestnut-red": "#B64E45",
      "california-gold": "#B2893A",
      "platinum-grey": "#E8E8E8",
    },
    fontFamily: {
      header: ["urbane", "sans-serif"],
      sans: ["Helvetica Neue", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
