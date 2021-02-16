// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: {
    enabled: process.env.NETLIFY === "true",
    content: ["./src/**/*.html", "./src/**/*.ts", "./src/**/*.md"],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Varela", ...defaultTheme.fontFamily.sans],
      },
    }
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
};
