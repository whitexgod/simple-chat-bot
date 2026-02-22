/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#daf2ff",
          200: "#bce9ff",
          300: "#8ddcff",
          400: "#57c7ff",
          500: "#2aaeff",
          600: "#1192ff",
          700: "#0b73e0",
          800: "#0f5caf",
          900: "#124d8a"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.2), 0 15px 40px rgba(17,146,255,0.25)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeInUp: "fadeInUp 400ms ease-out both",
        pulseSoft: "pulseSoft 1.4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
