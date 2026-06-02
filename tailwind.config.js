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
        deep: "#050518",
        "muted-text": "#5f5d6c",
        "secondary-text": "#9794a1",
        "border-secondary": "#d9d7de",
        "badge-bg": "#f5ebdc",
        "success": "#57b77a",
        "error": "#ff4e4e",
        "info": "#1877eb"
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"]
      },
      borderRadius: {
        "btn": "10px",
        "card": "20px",
        "panel": "12px",
        "subtle": "8px"
      },
      height: {
        "btn-sm": "48px",
        "btn-md": "54px",
        "btn-lg": "56px"
      },
      width: {
        "container-xl": "1728px",
        "container-lg": "1512px",
        "container-md": "1320px",
        "form-default": "430px",
        "form-lg": "540px"
      },
      boxShadow: {
        glow: "0 10px 18px rgba(255, 128, 17, 0.24)"
      }
    }
  },
  plugins: []
};
