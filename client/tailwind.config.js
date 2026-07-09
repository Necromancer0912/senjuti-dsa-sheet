/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Inter', 'sans-serif'],
      },
      colors: {
        bg:       '#0d0d12',
        surface:  '#13131a',
        surface2: '#1a1a24',
        surface3: '#21212e',
        accent:   '#e85d75',
        'accent-dim': '#c94262',
        txt: {
          primary:   '#f0f0f6',
          secondary: '#9999b3',
          muted:     '#5c5c7a',
        },
        easy:   '#22c55e',
        medium: '#f59e0b',
        hard:   '#ef4444',
        border: 'rgba(255,255,255,0.06)',
      },
      borderRadius: {
        card: '18px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 4px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
        glow: '0 0 40px rgba(232,93,117,0.12)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        checkPop: {
          '0%':   { transform: 'scale(0.5)' },
          '70%':  { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% center' },
          to:   { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease forwards',
        'check-pop': 'checkPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
    },
  },
  safelist: [
    'text-easy', 'bg-easy/10', 'border-easy/30',
    'text-medium', 'bg-medium/10', 'border-medium/30',
    'text-hard', 'bg-hard/10', 'border-hard/30',
    'badge-easy', 'badge-medium', 'badge-hard',
  ],
  plugins: [],
};
