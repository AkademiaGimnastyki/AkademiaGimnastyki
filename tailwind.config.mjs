/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'mag-pink': '#e3a1a1',
        'mag-blue': '#00b3d4',
        'mag-gray': '#4a4a4a',
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
