/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Blue 600
          gradientStart: '#2563EB',
          gradientEnd: '#10B981', // Emerald 500
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald 500
        },
        neutral: {
          bg: '#F8FAFC', // Slate 50
          card: '#FFFFFF',
          border: '#E2E8F0', // Slate 200
          text: {
            DEFAULT: '#0F172A', // Slate 900
            secondary: '#94A3B8', // Slate 400
          },
          800: '#1E293B', // Slate 800
          900: '#0F172A', // Slate 900
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
