/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0F172A', // Deep Navy Blue
          light: '#1E293B',
          dark: '#020617',
        },
        accent: {
          blue: '#3B82F6',
          teal: '#14B8A6',
        },
        neutral: {
          bg: '#F3F4F6',
          card: '#FFFFFF',
          text: '#1F2937',
          muted: '#6B7280',
        },
        status: {
          success: '#10B981',
          pending: '#F59E0B',
          failed: '#EF4444',
          info: '#3B82F6',
        },
        dark: {
          bg: '#0B1120',
          card: '#1E293B',
          text: '#F9FAFB',
          muted: '#9CA3AF', // lighter gray for dark mode text
        }
      }
    },
  },
  plugins: [],
}

