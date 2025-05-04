/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#00b3d4', // Akcent: Dynamika
        'brand-accent': '#e3a1a1',  // Akcent: Czułość
        'brand-text-main': '#4a4a4a', // Grafit
        'brand-bg': '#ffffff', // Biel
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      dropShadow: {
        'mag': '0 4px 6px rgba(0, 179, 212, 0.25)',
      },
    },
  },
  plugins: [],
}
