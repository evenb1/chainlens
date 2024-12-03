import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "SF Pro Text",
          "SF Pro Icons",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        textHeadline: "var(--sk-headline-text-color, rgb(29, 29, 31))",

        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        customGradient:
          "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120,119,198,0.3), rgba(255,255,255,0))",
      },
    },
  },
  plugins: [],
} satisfies Config;
