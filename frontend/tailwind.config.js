/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        gray: '#E8E8E8',
        black_50: '#00000080',
        text: '#0A0A0A',
        bluer_20: '#A0B2E5',
        red: '#F96E91'
      },
      backgroundImage: {
        violet_7: 'linear-gradient(90deg, rgba(154, 112, 177, 0.07) 0%, rgba(237, 148, 148, 0.07) 100%)',
        blue: 'linear-gradient(90deg, #6FDBB8 0%, #6EBFF9 100%)',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        heading1: ['40px', { lineHeight: 'auto', fontWeight: '600' }],
        heading2: ['34px', { lineHeight: '1.2', fontWeight: '500' }],
        heading3: ['18px', { lineHeight: 'auto', fontWeight: '400' }],
        heading4: ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        subtitle1: ['16px', { lineHeight: 'auto', fontWeight: '400' }],
        subtitle2: ['12px', { lineHeight: 'auto', fontWeight: '400' }],
        body1: ['14px', { lineHeight: '1.3', fontWeight: '400' }],
        body2: ['24px', { lineHeight: 'auto', fontWeight: '500' }],
        button: ['14px', { lineHeight: 'auto', fontWeight: '500' }],
      },
      backgroundImage: {
        'start-page': "url('/src/assets/images/first_page.png')",
        'home-page': "url('/src/assets/images/home_page.png')",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
    function ({ addComponents }) {
      addComponents({
        ".custom-scrollbar::-webkit-scrollbar": {
          width: "6px",        },
        ".custom-scrollbar::-webkit-scrollbar-track": {
          background: "#f1f1f1", // Цвет фона трека
          borderRadius: "8px",
        },
        ".custom-scrollbar::-webkit-scrollbar-thumb": {
          background: "linear-gradient(90deg, #6FDBB8 0%, #6EBFF9 100%)", // Градиентный скролл
          borderRadius: "8px",
        },
        ".custom-scrollbar::-webkit-scrollbar-thumb:hover": {
          background: "#5ca8e6",
        },
      });
    },
  ],
}