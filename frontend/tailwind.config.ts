import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        kavivanar: ['Kavivanar', 'cursive'],
        almarai: ['Almarai', 'sans-serif'],
        doto: ['Doto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
