/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F0',
          200: '#F5EFE3',
          300: '#EFE7D6',
          400: '#E4D8C1',
        },
        alabaster: {
          DEFAULT: '#FBF9F5',
          dark: '#F3EFE8',
        },
        linen: '#F4EFEA',
        sand: '#EBE3D7',
        noir: {
          DEFAULT: '#191614',
          subtle: '#2A2522',
          card: '#1F1B19',
        },
        taupe: {
          DEFAULT: '#6B6259',
          light: '#8F857B',
          muted: '#ABA298',
        },
        champagne: {
          light: '#F8F3E8',
          DEFAULT: '#C5A059',
          dark: '#A6823C',
        },
        sage: {
          light: '#EEF3EE',
          DEFAULT: '#526E55',
          dark: '#3D5440',
        },
        terracotta: {
          light: '#F8ECE7',
          DEFAULT: '#B8583E',
          dark: '#934029',
        },
        blush: {
          light: '#FCF5F3',
          DEFAULT: '#E5C5BB',
          dark: '#C89F93',
        },
        lavender: {
          50: '#FAF8FD',
          100: '#F3EEF9',
          200: '#E8DEF4',
          300: '#D9CBEB',
          DEFAULT: '#C5B2E3',
          soft: '#E4DAF5',
          button: '#D8CAF0',
          buttonHover: '#CDBBEA',
          accent: '#8264B8',
          dark: '#4F3978',
        },
        tealScan: '#38BDF8',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(28, 23, 19, 0.04), 0 2px 6px -1px rgba(28, 23, 19, 0.02)',
        'medium': '0 12px 36px -4px rgba(28, 23, 19, 0.06), 0 4px 12px -2px rgba(28, 23, 19, 0.03)',
        'editorial': '0 24px 60px -12px rgba(28, 23, 19, 0.08), 0 8px 24px -4px rgba(28, 23, 19, 0.04)',
        'card-lavender': '0 30px 70px -15px rgba(113, 93, 150, 0.12), 0 10px 25px -5px rgba(28, 23, 19, 0.04)',
        'glow-lavender': '0 0 30px 2px rgba(197, 178, 227, 0.45)',
        'glow-teal': '0 0 20px 2px rgba(56, 189, 248, 0.5)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      keyframes: {
        pulseGently: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      },
      animation: {
        'pulse-gentle': 'pulseGently 4s ease-in-out infinite',
        'scan': 'scanLine 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.8s infinite linear',
      }
    },
  },
  plugins: [],
}
