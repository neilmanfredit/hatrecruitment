import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0d1b3e',
          deep: '#080f22',
          mid: '#122240',
          light: '#1a2f55',
          line: '#263a6b',
        },
        gold: {
          DEFAULT: '#c8a82c',
          light: '#e0c050',
          dim: '#7a6418',
        },
        'hat-cyan': '#22d3ee',
        'hat-ok': '#22c55e',
        'hat-warn': '#f87171',
        'hat-amber': '#f59e0b',
        'hat-text': '#E8ECF5',
        'hat-muted': '#9AA6C4',
        'hat-dim': 'rgba(232,236,245,0.35)',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        pill: '20px',
      },
      boxShadow: {
        low: '0 2px 4px rgba(0,0,0,0.10)',
        card: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
        hover: '0 8px 32px rgba(0,0,0,0.16)',
        glow: '0 0 24px rgba(200,168,44,0.20)',
      },
    },
  },
  plugins: [],
} satisfies Config
