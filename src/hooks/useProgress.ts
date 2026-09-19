import { useCallback, useState } from 'react';
import { Language, LessonResult, StoredProgress } from '../types';

const STORAGE_KEY = 'codetyper-progress';

export function calculateStars(accuracy: number, wpm: number): number {
  if (accuracy >= 95 && wpm >= 30) return 3;
  if (accuracy >= 85) return 2;
  return 1;
}

export function useProgress() {
  const [progress, setProgress] = useState<StoredProgress>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : {};
    } catch {
      return {};
    }
  });

  const saveLessonResult = useCallback((result: LessonResult) => {
    setProgress((prev) => {
      const langProgress = prev[result.language] || {};
      const existing = langProgress[result.lessonId];

      const newStars = calculateStars(result.accuracy, result.wpm);
      const bestStars = Math.max(existing?.stars || 0, newStars);
      const bestWpm = Math.max(existing?.bestWpm || 0, Math.round(result.wpm));
      const bestAccuracy = Math.max(existing?.bestAccuracy || 0, Math.round(result.accuracy));

      const updated: StoredProgress = {
        ...prev,
        [result.language]: {
          ...langProgress,
          [result.lessonId]: {
            bestWpm,
            bestAccuracy,
            stars: bestStars,
            completedAt: new Date().toISOString(),
          },
        },
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist progress:', err);
      }

      return updated;
    });
  }, []);

  const getLessonStats = useCallback(
    (language: Language, lessonId: string) => {
      return progress[language]?.[lessonId] || null;
    },
    [progress]
  );

  const getLanguageSummary = useCallback(
    (language: Language, totalLessons: number) => {
      const langProgress = progress[language] || {};
      const completedCount = Object.keys(langProgress).length;
      let totalStars = 0;
      let totalWpm = 0;

      Object.values(langProgress).forEach((item) => {
        totalStars += item.stars;
        totalWpm += item.bestWpm;
      });

      const avgWpm = completedCount > 0 ? Math.round(totalWpm / completedCount) : 0;

      return {
        completedCount,
        totalLessons,
        percentComplete: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
        totalStars,
        maxStars: totalLessons * 3,
        avgWpm,
      };
    },
    [progress]
  );

  return {
    progress,
    saveLessonResult,
    getLessonStats,
    getLanguageSummary,
    calculateStars,
  };
}
