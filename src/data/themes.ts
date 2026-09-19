export interface ThemeConfig {
  id: string;
  name: string;
  variables: Record<string, string>;
}

export const THEMES: Record<string, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight (Dark)',
    variables: {
      '--color-bg': '#191b22',
      '--color-surface': '#21252d',
      '--color-surface-hover': '#2a303a',
      '--color-border': '#343c49',
      '--color-text': '#e2e8f0',
      '--color-text-muted': '#64748b',
      '--color-primary': '#f59e0b', // warm amber / gold (Monkeytype feel)
      '--color-primary-hover': '#d97706',
      '--color-correct': '#4ade80', // soft emerald
      '--color-incorrect': '#f87171', // soft red
      '--color-caret': '#f59e0b',
      '--color-terminal': '#10b981',
    },
  },
  daylight: {
    id: 'daylight',
    name: 'Daylight (Light)',
    variables: {
      '--color-bg': '#f8fafc',
      '--color-surface': '#ffffff',
      '--color-surface-hover': '#f1f5f9',
      '--color-border': '#e2e8f0',
      '--color-text': '#0f172a',
      '--color-text-muted': '#94a3b8',
      '--color-primary': '#2563eb', // bold blue
      '--color-primary-hover': '#1d4ed8',
      '--color-correct': '#16a34a',
      '--color-incorrect': '#dc2626',
      '--color-caret': '#2563eb',
      '--color-terminal': '#059669',
    },
  },
};
