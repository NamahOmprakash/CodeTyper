/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-hover': 'var(--color-surface-hover)',
          border: 'var(--color-border)',
          text: 'var(--color-text)',
          'text-muted': 'var(--color-text-muted)',
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          correct: 'var(--color-correct)',
          incorrect: 'var(--color-incorrect)',
          caret: 'var(--color-caret)',
          terminal: 'var(--color-terminal)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(1.12)' },
        },
      },
      animation: {
        'glow-pulse': 'glowPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
