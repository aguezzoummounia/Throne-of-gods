import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: "#171717",
        primary: "#f5f5f5",
      },
      transitionTimingFunction: {
        "custom-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      //   screens: {
      //     xs: "400px",
      //     xxs: "350px",
      //   },
      //   backgroundImage: {
      //     "blue-gradient":
      //       "radial-gradient(circle at 50.3% 44.5%, rgb(116, 147, 179) 0%, rgb(62, 83, 104) 100.2%)",
      //   },
      //   fontFamily: {
      //     genath: ["var(--genath)"],
      //     grotesk: ["var(--grotesk)"],
      //   },

      //   minHeight: {
      //     screen: "var(--screen-height, 100vh)",
      //     "no-nav": "calc(var(--screen-height, 100vh) - var(--height-nav))",
      //     "screen-dynamic": "var(--screen-height-dynamic, 100vh)",
      //   },
      //   maxHeight: {
      //     screen: "var(--screen-height, 100vh)",
      //     "no-nav": "calc(var(--screen-height, 100vh) - var(--height-nav))",
      //     "screen-dynamic": "var(--screen-height-dynamic, 100vh)",
      //   },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
