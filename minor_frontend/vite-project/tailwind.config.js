// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        "fade-slide": "fadeSlide 15s infinite",
      },
      keyframes: {
        fadeSlide: {
          "0%": { opacity: "1" },
          "33%": { opacity: "0" },
          "66%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
