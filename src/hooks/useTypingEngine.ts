import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Lesson, LessonResult, MistakeInfo, TypingChar } from '../types';
import { useMistakeTracker } from './useMistakeTracker';

interface UseTypingEngineProps {
  lesson: Lesson;
  onComplete?: (result: LessonResult) => void;
  playClick?: () => void;
  playError?: () => void;
}

const SHIFTED_PAIRS: Record<string, string> = {
  '~': '`', '!': '1', '@': '2', '#': '3', '$': '4',
  '%': '5', '^': '6', '&': '7', '*': '8', '(': '9',
  ')': '0', '_': '-', '+': '=', '{': '[', '}': ']',
  '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.',
  '?': '/',
};

export function useTypingEngine({
  lesson,
  onComplete,
  playClick,
  playError,
}: UseTypingEngineProps) {
  const code = lesson.code;
  const mistakeTracker = useMistakeTracker();
  const mistakeTrackerRef = useRef(mistakeTracker);
  mistakeTrackerRef.current = mistakeTracker;

  // Initialize characters array from code
  const initialChars = useMemo<TypingChar[]>(() => {
    return code.split('').map((char, i) => ({
      char,
      status: i === 0 ? 'current' : 'pending',
    }));
  }, [code]);

  const [chars, setChars] = useState<TypingChar[]>(initialChars);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [trickyKeys, setTrickyKeys] = useState<{ [key: string]: number }>({});
  const [lastMistake, setLastMistake] = useState<MistakeInfo | null>(null);

  const timerRef = useRef<number | null>(null);
  const hasTriggeredCompleteRef = useRef<boolean>(false);

  // Reset state whenever the lesson changes
  useEffect(() => {
    setChars(
      code.split('').map((char, i) => ({
        char,
        status: i === 0 ? 'current' : 'pending',
      }))
    );
    setCurrentIndex(0);
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setTrickyKeys({});
    setLastMistake(null);
    mistakeTrackerRef.current.reset();
    hasTriggeredCompleteRef.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [code]);

  // Live timer interval
  useEffect(() => {
    if (startTime && !isComplete) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
    } else if (isComplete && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isComplete]);

  // Calculate stats
  const minutes = Math.max(elapsedTime / 60, 0.001);
  const wpm = startTime ? Math.round(correctKeystrokes / 5 / minutes) : 0;
  const rawWpm = startTime ? Math.round(totalKeystrokes / 5 / minutes) : 0;
  const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

  // Calculate current line number (1-based)
  const currentLine = useMemo(() => {
    let line = 1;
    for (let i = 0; i < currentIndex && i < code.length; i++) {
      if (code[i] === '\n') line++;
    }
    return line;
  }, [code, currentIndex]);

  // Total lines count
  const totalLines = useMemo(() => {
    return code.split('\n').length;
  }, [code]);

  // Progress percentage (0 - 100)
  const progressPercent = useMemo(() => {
    if (code.length === 0) return 0;
    return Math.min(100, Math.round((currentIndex / code.length) * 100));
  }, [currentIndex, code.length]);

  // Next expected character
  const currentExpectedChar = currentIndex < code.length ? code[currentIndex] : '';

  // Trigger completion
  const triggerComplete = useCallback(
    (finalCorrect: number, finalTotal: number, finalElapsed: number, finalTricky: { [k: string]: number }) => {
      if (hasTriggeredCompleteRef.current) return;
      hasTriggeredCompleteRef.current = true;
      setIsComplete(true);

      const finalMinutes = Math.max(finalElapsed / 60, 0.001);
      const finalWpm = Math.round(finalCorrect / 5 / finalMinutes);
      const finalRawWpm = Math.round(finalTotal / 5 / finalMinutes);
      const finalAcc = finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 100;

      let stars = 1;
      if (finalAcc >= 95 && finalWpm >= 30) stars = 3;
      else if (finalAcc >= 85) stars = 2;

      const errorsCount = finalTotal - finalCorrect;

      const result: LessonResult = {
        lessonId: lesson.id,
        language: lesson.language,
        wpm: finalWpm,
        rawWpm: finalRawWpm,
        accuracy: finalAcc,
        stars,
        timeSeconds: Math.round(finalElapsed),
        errorsCount: Math.max(0, errorsCount),
        trickyKeys: finalTricky,
        completedAt: new Date().toISOString(),
      };

      if (onComplete) {
        onComplete(result);
      }
    },
    [lesson.id, lesson.language, onComplete]
  );

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      if (isComplete) return;

      // Ignore modifier keys alone
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
      }

      // Handle Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (currentIndex > 0) {
          // Check if previous char was part of a multi-tab indent
          let prevIndex = currentIndex - 1;
          if (code[prevIndex] === '\t') {
            while (prevIndex > 0 && code[prevIndex - 1] === '\t') {
              prevIndex--;
            }
          }

          setChars((prev) => {
            const next = [...prev];
            for (let i = prevIndex; i <= currentIndex; i++) {
              next[i] = { ...next[i], status: i === prevIndex ? 'current' : 'pending', userTyped: undefined };
            }
            return next;
          });
          setCurrentIndex(prevIndex);
          setLastMistake(null);
        }
        return;
      }

      // Prevent default browser shortcuts for Tab and Space (stops page from scrolling down)
      if (e.key === 'Tab' || e.key === ' ' || (e as KeyboardEvent).code === 'Space') {
        e.preventDefault();
      }

      // Start timer on first valid keypress
      let activeStartTime = startTime;
      if (!startTime) {
        activeStartTime = Date.now();
        setStartTime(activeStartTime);
      }

      // Determine typed character
      let typedChar = e.key;
      if (e.key === 'Enter') typedChar = '\n';
      else if (e.key === 'Tab') typedChar = '\t';

      const expectedChar = code[currentIndex];

      // NO DOUBLE TAB HANDLING:
      // If expectedChar is '\t', a single Tab press consumes ALL consecutive '\t' on this line!
      if (typedChar === '\t' && expectedChar === '\t') {
        let tabSpan = 1;
        while (currentIndex + tabSpan < code.length && code[currentIndex + tabSpan] === '\t') {
          tabSpan++;
        }

        playClick?.();
        setLastMistake(null);

        const nextIndex = currentIndex + tabSpan;
        const newTotalKeystrokes = totalKeystrokes + 1;
        const newCorrectKeystrokes = correctKeystrokes + tabSpan;

        setTotalKeystrokes(newTotalKeystrokes);
        setCorrectKeystrokes(newCorrectKeystrokes);

        setChars((prev) => {
          const next = [...prev];
          for (let i = currentIndex; i < nextIndex; i++) {
            next[i] = { ...next[i], status: 'correct', userTyped: '\t' };
          }
          if (nextIndex < code.length) {
            next[nextIndex] = { ...next[nextIndex], status: 'current' };
          }
          return next;
        });

        setCurrentIndex(nextIndex);

        if (nextIndex >= code.length) {
          const finalElapsed = activeStartTime ? (Date.now() - activeStartTime) / 1000 : 1;
          triggerComplete(newCorrectKeystrokes, newTotalKeystrokes, finalElapsed, trickyKeys);
        }
        return;
      }

      // Standard character comparison
      const isMatch = typedChar === expectedChar;

      if (isMatch) {
        playClick?.();
        setLastMistake(null);
        mistakeTrackerRef.current.recordCorrectKey();
      } else {
        playError?.();

        // Check for shift mistake vs wrong key
        const isShiftMissed =
          (SHIFTED_PAIRS[expectedChar] && SHIFTED_PAIRS[expectedChar] === typedChar) ||
          (expectedChar >= 'A' && expectedChar <= 'Z' && expectedChar.toLowerCase() === typedChar) ||
          (SHIFTED_PAIRS[typedChar] && SHIFTED_PAIRS[typedChar] === expectedChar) ||
          (typedChar >= 'A' && typedChar <= 'Z' && typedChar.toLowerCase() === expectedChar);

        const newMistake: MistakeInfo = {
          type: isShiftMissed ? 'shift_missed' : 'wrong_key',
          expectedChar,
          typedChar,
          keyCode: (e as KeyboardEvent).code,
          timestamp: Date.now(),
        };

        setLastMistake(newMistake);
        mistakeTrackerRef.current.recordMistake(newMistake, code, currentIndex, currentLine);
      }

      const nextIndex = currentIndex + 1;
      const newTotalKeystrokes = totalKeystrokes + 1;
      const newCorrectKeystrokes = isMatch ? correctKeystrokes + 1 : correctKeystrokes;

      setTotalKeystrokes(newTotalKeystrokes);
      if (isMatch) {
        setCorrectKeystrokes(newCorrectKeystrokes);
      } else {
        setTrickyKeys((prev) => ({
          ...prev,
          [expectedChar]: (prev[expectedChar] || 0) + 1,
        }));
      }

      // Update character statuses
      setChars((prev) => {
        const next = [...prev];
        next[currentIndex] = {
          ...next[currentIndex],
          status: isMatch ? 'correct' : 'incorrect',
          userTyped: typedChar,
        };
        if (nextIndex < code.length) {
          next[nextIndex] = {
            ...next[nextIndex],
            status: 'current',
          };
        }
        return next;
      });

      setCurrentIndex(nextIndex);

      // Check if finished
      if (nextIndex >= code.length) {
        const finalElapsed = activeStartTime ? (Date.now() - activeStartTime) / 1000 : 1;
        const finalTricky = isMatch
          ? trickyKeys
          : { ...trickyKeys, [expectedChar]: (trickyKeys[expectedChar] || 0) + 1 };

        triggerComplete(newCorrectKeystrokes, newTotalKeystrokes, finalElapsed, finalTricky);
      }
    },
    [
      isComplete,
      currentIndex,
      code,
      startTime,
      totalKeystrokes,
      correctKeystrokes,
      trickyKeys,
      playClick,
      playError,
      triggerComplete,
    ]
  );

  const reset = useCallback(() => {
    setChars(
      code.split('').map((char, i) => ({
        char,
        status: i === 0 ? 'current' : 'pending',
      }))
    );
    setCurrentIndex(0);
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setTrickyKeys({});
    setLastMistake(null);
    mistakeTrackerRef.current.reset();
    hasTriggeredCompleteRef.current = false;
  }, [code]);

  return {
    chars,
    currentIndex,
    currentLine,
    totalLines,
    currentExpectedChar,
    lastMistake,
    mistakeTracker,
    wpm,
    rawWpm,
    accuracy,
    elapsedTime,
    progressPercent,
    isComplete,
    totalKeystrokes,
    correctKeystrokes,
    trickyKeys,
    handleKeyDown,
    reset,
  };
}
