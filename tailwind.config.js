/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vedha: {
          navy: '#0B192C',
          dark: '#07101C',
          ocean: '#1E3E62',
          blue: '#0066CC',
          sky: '#0284C7',
          cyan: '#06B6D4',
          orange: '#FF6500',
          orangeHover: '#E55A00',
          amber: '#F59E0B',
          emerald: '#10B981',
          slate: '#1E293B',
          card: '#0E2238',
          cardLight: '#FFFFFF',
          border: 'rgba(255, 255, 255, 0.08)',
          borderLight: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        'hero-mesh': 'radial-gradient(at 10% 20%, rgba(0, 102, 204, 0.2) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(255, 101, 0, 0.15) 0px, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
