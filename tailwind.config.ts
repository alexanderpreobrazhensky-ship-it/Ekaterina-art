import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: ["from-milk", "from-sand", "from-cream", "from-beige", "to-sand", "to-beige", "to-mist", "to-cream", "to-milk"],
  theme: {
    extend: {
      colors: {
        milk: "#F8F3EA",
        cream: "#FFFDF8",
        graphite: "#292724",
        beige: "#D8C4A5",
        sand: "#EFE3D0",
        gold: "#C8A45D",
        mist: "#EEE9DF"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(41, 39, 36, 0.08)"
      }
    },
  },
  plugins: [],
};

export default config;
