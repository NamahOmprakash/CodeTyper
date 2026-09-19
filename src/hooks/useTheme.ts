import { useEffect, useState } from 'react';
import { THEMES } from '../data/themes';

export function useTheme() {
  const [themeId, setThemeId] = useState<string>(() => {
    const saved = localStorage.getItem('keyscript-theme') || localStorage.getItem('codetyper-theme');
    return saved && THEMES[saved] ? saved : 'midnight';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeId);
    localStorage.setItem('keyscript-theme', themeId);
  }, [themeId]);

  const toggleTheme = () => {
    setThemeId((prev) => (prev === 'midnight' ? 'daylight' : 'midnight'));
  };

  return {
    themeId,
    setThemeId,
    toggleTheme,
    isDark: themeId === 'midnight',
  };
}
