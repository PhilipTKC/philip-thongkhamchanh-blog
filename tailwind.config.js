// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["./src/**/*.html", "./src/**/*.ts"],
  },
  theme: {
    fontWeight: {
      hairline: 100,
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
      black: 900,
    },
    extend: {
      fontFamily: {
        sans: ["'Noto Sans TC', sans-serif", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/ui")],
};
