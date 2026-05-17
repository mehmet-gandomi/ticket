/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Ravi is declared via @font-face in index.css; falls back to Tahoma / system fonts.
        sans: ['Ravi', 'Tahoma', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Mirrors the Figma palette
        ink: {
          900: '#16161D', // primary text
          700: '#3D4350',
          500: '#737377',
          400: '#A2A2A5',
        },
        line: {
          DEFAULT: '#E0E2E7',
          soft: '#EBEDF2',
        },
        surface: {
          0: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F6F6F7',
        },
        brand: {
          DEFAULT: '#0068FF',
          dark: '#005FE8',
          tint: '#E6F0FF',
          soft: '#B0D0FF',
          ring: '#257CFF',
        },
        success: {
          DEFAULT: '#02927A',
          tint: 'rgba(2,146,122,0.10)',
        },
        warning: '#FFBE15',
        danger: '#EB0000',
        violet: '#9747FF',
      },
      borderRadius: {
        '3xl': '24px',
      },
      boxShadow: {
        focus: '0 0 0 4px rgba(0,104,255,0.15)',
      },
    },
  },
  plugins: [],
};
