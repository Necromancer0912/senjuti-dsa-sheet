/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Clash Display', 'sans-serif'],
        display: ['Clash Display', 'sans-serif'],
      },
      colors: {
        bg:      '#121212', // Material Dark Theme background
        surface: '#1e1e1e', // Elevation 1
        card:    '#242424', // Elevation 2
        'card-hover': '#2c2c2c', // Hover state
        border:  'transparent', // We are removing borders mostly

        accent: {
          DEFAULT: '#f472b6', // Soft pink
          dim:     '#ec4899', // Slightly darker pink for hover/dim
          bg:      '#311624', // Neutral tinted background for chips
          border:  '#4a241c', 
        },

        // Restore Monochromatic Pink/Rose Semantic colors
        easy:   { DEFAULT: '#fbcfe8', bg: '#3b1c2b' }, // Light pink
        medium: { DEFAULT: '#f472b6', bg: '#311624' }, // Primary pink
        hard:   { DEFAULT: '#be185d', bg: '#240f1a' }, // Deep pink

        txt: {
          primary: '#e0e0e0', // Material soft white
          dim:     '#b0b0b0',
          muted:   '#9e9e9e', // Material disabled/muted text
        },
      },
      boxShadow: {
        'elevation-1': '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
        'elevation-2': '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
        'elevation-3': '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        pill: '9999px',
        card: '24px', // Highly rounded design for cards and large elements
      },
    },
  },
  plugins: [],
};
