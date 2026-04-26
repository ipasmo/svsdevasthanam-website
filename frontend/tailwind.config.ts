import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Temple Brand Colors
        saffron: {
          DEFAULT: "#FB9C1B",
          50: "#FFF8EC",
          100: "#FEEFD4",
          200: "#FDDBA3",
          300: "#FCC76E",
          400: "#FBB33A",
          500: "#FB9C1B",
          600: "#E07D07",
          700: "#A85F05",
          800: "#6F3F03",
          900: "#3A2102",
        },
        rust: {
          DEFAULT: "#C83A00",
          50: "#FFF0EB",
          100: "#FFD9CC",
          200: "#FFB099",
          300: "#FF8466",
          400: "#F55A33",
          500: "#C83A00",
          600: "#A03000",
          700: "#762400",
          800: "#4D1800",
          900: "#260C00",
        },
        golden: {
          DEFAULT: "#FFCA32",
          50: "#FFFAEC",
          100: "#FFF4CC",
          200: "#FFE88A",
          300: "#FFDA47",
          400: "#FFCA32",
          500: "#FFBB18",
          600: "#E09300",
          700: "#A86E00",
          800: "#704900",
          900: "#382500",
        },
        teal: {
          DEFAULT: "#11AD99",
          50: "#EAFAF8",
          100: "#C6F2ED",
          200: "#8DE4DA",
          300: "#54D6C7",
          400: "#1EC8B4",
          500: "#11AD99",
          600: "#0D8F7E",
          700: "#096B5E",
          800: "#06473E",
          900: "#03231F",
        },
        offwhite: "#F7F6E5",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        playfair: ["Playfair Display", "serif"],
        noto: ["Noto Sans", "sans-serif"],
        "noto-telugu": ["Noto Sans Telugu", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "temple-gradient": "linear-gradient(135deg, #FB9C1B 0%, #C83A00 100%)",
        "golden-gradient": "linear-gradient(135deg, #FFCA32 0%, #FB9C1B 100%)",
        "sacred-pattern": "url('/images/sacred-pattern.svg')",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "diya-flicker": "diyaFlicker 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 5px #FFCA32, 0 0 10px #FFCA32" },
          "50%": { boxShadow: "0 0 20px #FFCA32, 0 0 40px #FB9C1B" },
        },
        diyaFlicker: {
          "0%, 100%": { opacity: "1", transform: "scaleY(1)" },
          "50%": { opacity: "0.85", transform: "scaleY(0.95)" },
        },
      },
      boxShadow: {
        "temple-card": "0 4px 24px rgba(251, 156, 27, 0.15)",
        "admin-card": "0 2px 16px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
