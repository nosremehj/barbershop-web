/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // "Brass & Ember" — inspired by real barbershop materials:
        // aged leather, warm brass fixtures, amber lighting, dark mahogany wood
        ember: {
          50:  '#FDF5EE',
          100: '#F5E6D3',
          200: '#E8CBA8',
          300: '#D4A574',
          400: '#C48B50',
          500: '#8B2500',  // deep rust-red (vintage signage)
          600: '#6B1D00',
          700: '#4A1400',
          800: '#2D0C00',
          900: '#1A0700',
        },
        brass: {
          light: '#E8C47C',
          DEFAULT: '#C9A14E',
          dark: '#A07D34',
          muted: '#8A7245',
        },
        surface: {
          void: '#060504',     // near-black with warm undertone
          deep: '#0E0C0A',     // main bg
          card: '#171311',     // card surfaces
          raised: '#211D18',   // elevated elements
          border: '#2E2822',   // subtle warm borders
          borderHover: '#4A3F33',
        },
        ink: {
          primary: '#F2E8DB',  // warm cream (never cold white)
          secondary: '#B8A898',
          muted: '#7A6F65',
          faint: '#4A423A',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'ember-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 37, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 37, 0, 0.5), 0 0 60px rgba(201, 161, 78, 0.15)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        'ember-glow': 'ember-glow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
