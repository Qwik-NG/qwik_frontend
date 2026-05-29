/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#f3f3f3",
        ink: "#1f1f29",
        muted: "#6c6a74",
        orange: "#ff7f11",
        amber: "#ffad00",
        card: "#ededed",
        deep: "#050518"
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"]
      },
      boxShadow: {
        glow: "0 10px 18px rgba(255, 128, 17, 0.24)"
      }
    }
  },
  plugins: []
};
