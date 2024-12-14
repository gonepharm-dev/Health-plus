import type { Config } from 'tailwindcss';


  export default {
    darkMode: 'class',
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Helvetica', 'Arial', 'sans-serif'],
          'helvetica-condensed': ['Helvetica Condensed', 'Arial', 'sans-serif'],
        },
        colors: {
          background: '#dbeafe',
          primary: '#60a5fa',
          secondary: '#22c55e',
          text: '#1f2937',
          'dark-background': '#1a202c',
          'dark-primary': '#3b82f6',
          'dark-secondary': '#10b981',
          'dark-text': '#e2e8f0',
        },
        height: {
          '100': '100px',
          '200': '200px',
          '150': '150px',
        },
        keyframes: {
          'fade-in-up': {
            '0%': {
              opacity: '0',
              transform: 'translateY(20px)'
            },
            '100%': {
              opacity: '1',
              transform: 'translateY(0)'
            },
          }
        },
        animation: {
          'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        }
      },
    },
  plugins: [
    require('@tailwindcss/forms')
  ],
} satisfies Config;