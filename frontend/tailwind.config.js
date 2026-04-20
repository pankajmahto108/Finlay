/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050a15', // even darker blue/black
        surface: '#0f172a', // slate-900 equivalent for surface
        primary: '#00ff66', // Neon green
        primaryHover: '#00cc52',
        accent: '#3b82f6', // Blueprint blue
        success: '#10b981', 
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
