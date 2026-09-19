import { useCallback, useMemo, useRef, useState } from 'react';
import { MistakeInfo } from '../types';
import { MistakeCategory, MistakePattern } from '../utils/coaching/types';

// Physical keyboard layout adjacencies for QWERTY
const ADJACENT_KEYS: Record<string, string[]> = {
  q: ['w', 'a', '1', '2'],
  w: ['q', 'e', 's', '2', '3'],
  e: ['w', 'r', 'd', '3', '4'],
  r: ['e', 't', 'f', '4', '5'],
  t: ['r', 'y', 'g', '5', '6'],
  y: ['t', 'u', 'h', '6', '7'],
  u: ['y', 'i', 'j', '7', '8'],
  i: ['u', 'o', 'k', '8', '9'],
  o: ['i', 'p', 'l', '9', '0'],
  p: ['o', '[', '-', '0'],
  a: ['q', 's', 'z'],
  s: ['w', 'a', 'd', 'x', 'z'],
  d: ['e', 's', 'f', 'c', 'x'],
  f: ['r', 'd', 'g', 'v', 'c'],
  g: ['t', 'f', 'h', 'b', 'v'],
  h: ['y', 'g', 'j', 'n', 'b'],
  j: ['u', 'h', 'k', 'm', 'n'],
  k: ['i', 'j', 'l', ',', 'm'],
  l: ['o', 'k', ';', '.', ','],
  ';': ['p', 'l', "'", '/', '.'],
};

function classifyCategory(
  mistake: MistakeInfo,
  nextExpectedChar?: string
): MistakeCategory {
  if (mistake.type === 'shift_missed') return 'shift_missed';

  const exp = mistake.expectedChar.toLowerCase();
  const typ = mistake.typedChar.toLowerCase();

  // Character swap lookahead: student typed next character early
  if (nextExpectedChar && mistake.typedChar === nextExpectedChar) {
    return 'swap';
  }

  // Bracket confusion
  const brackets = new Set(['(', ')', '[', ']', '{', '}', '<', '>']);
  if (brackets.has(mistake.expectedChar) && brackets.has(mistake.typedChar)) {
    return 'bracket_confusion';
  }

  // Quotes confusion
  if (
    (mistake.expectedChar === '"' && mistake.typedChar === "'") ||
    (mistake.expectedChar === "'" && mistake.typedChar === '"')
  ) {
    return 'quotes_confusion';
  }

  // Adjacent key error
  if (ADJACENT_KEYS[exp]?.includes(typ)) {
    return 'adjacent_key';
  }

  return 'wrong_key';
}

function extractWordContext(code: string, index: number): string {
  if (!code || index < 0 || index >= code.length) return '';

  let start = index;
  while (start > 0 && /[a-zA-Z0-9_]/.test(code[start - 1])) {
    start--;
  }

  let end = index;
  while (end < code.length && /[a-zA-Z0-9_]/.test(code[end])) {
    end++;
  }

  return code.slice(start, end).trim();
}

export function useMistakeTracker() {
  const [patterns, setPatterns] = useState<Record<string, MistakePattern>>({});
  const historyRef = useRef<MistakeInfo[]>([]);
  const correctStreakRef = useRef<number>(0);
  const bestStreakRef = useRef<number>(0);

  const reset = useCallback(() => {
    setPatterns({});
    historyRef.current = [];
    correctStreakRef.current = 0;
    bestStreakRef.current = 0;
  }, []);

  const recordCorrectKey = useCallback(() => {
    correctStreakRef.current += 1;
    if (correctStreakRef.current > bestStreakRef.current) {
      bestStreakRef.current = correctStreakRef.current;
    }
  }, []);

  const recordMistake = useCallback(
    (mistake: MistakeInfo, code: string, index: number, line: number) => {
      correctStreakRef.current = 0;
      historyRef.current.push(mistake);

      const nextExpected = index + 1 < code.length ? code[index + 1] : undefined;
      const category = classifyCategory(mistake, nextExpected);
      const wordContext = extractWordContext(code, index);

      setPatterns((prev) => {
        const existing = prev[mistake.expectedChar];
        const lastTyped = existing ? [mistake.typedChar, ...existing.lastTyped.slice(0, 4)] : [mistake.typedChar];

        return {
          ...prev,
          [mistake.expectedChar]: {
            char: mistake.expectedChar,
            count: (existing?.count || 0) + 1,
            lastTyped,
            category,
            wordContext: wordContext || existing?.wordContext,
            line,
            lastTimestamp: Date.now(),
          },
        };
      });
    },
    []
  );

  const getTopPatterns = useCallback((limit: number = 3): MistakePattern[] => {
    return Object.values(patterns)
      .sort((a, b) => b.count - a.count || b.lastTimestamp - a.lastTimestamp)
      .slice(0, limit);
  }, [patterns]);

  return useMemo(
    () => ({
      patterns,
      reset,
      recordCorrectKey,
      recordMistake,
      getTopPatterns,
      currentStreak: correctStreakRef.current,
      bestStreak: bestStreakRef.current,
    }),
    [patterns, reset, recordCorrectKey, recordMistake, getTopPatterns]
  );
}
