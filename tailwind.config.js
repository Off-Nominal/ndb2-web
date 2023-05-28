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
      "moss-green-dark": "#6c8235",
      "silver-chalice-grey": "#B2AFA1",
      "jet-grey": "#2d2d2d",
      "quartz-grey": "#4b4b4b",
      "deep-chestnut-red": "#B64E45",
      "california-gold": "#B2893A",
      "platinum-grey": "#E8E8E8",
      "discord-purple": "#7983f5",
      black: "#000000",
      "button-gray": "#b2afa1",
      transparent: "transparent",
      "line-grey": "#a0a0a0"

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
