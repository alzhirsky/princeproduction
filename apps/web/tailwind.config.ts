import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#070707',
        surface: 'rgba(20,20,24,0.72)',
        accent: '#5B8CFF',
        success: '#3ddc97',
        warning: '#f8c537',
        danger: '#ff5f6d'
      },
      borderRadius: {
        xl: '1.5rem'
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0, 0, 0, 0.45)',
        glow: '0 0 30px rgba(91,140,255,0.4)'
      },
      backdropBlur: {
        xs: '2px'
      },
      fontFamily: {
        sans: ['"SF Pro Display"', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
