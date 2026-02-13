/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './pages/_sites/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {
      animation: {
          "slide-tl": "slide-tl 0.5s infinite both"
      },
      keyframes: {
          "slide-tl": {
              "0%": {
                  transform: "translateX(0)"
              },
              to: {
                  transform: "translateX(-600px)"
              }
          },
      },
      animation: {
        'slide-tl': 'slide-tl 15s linear infinite',
      },
      backgroundImage: {
        'smooth-bg': "linear-gradient(-240deg, #ffffff 0%, #ffffff 40%, #83d8ff 100%)",
        'smooth-bgr': "linear-gradient(-240deg, #83d8ff 0%, #83d8ff 40%, #ffffff 100%)",
      },
      boxShadow: {
        'perfect': '0 0 60px -15px rgba(0, 0, 0, 0.3)',
        'good': '0 0 35px -15px rgba(0, 0, 0, 0.3)',
      },
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
