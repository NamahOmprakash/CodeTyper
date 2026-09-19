export type Language = 'python' | 'cpp';

export interface ExplanationBlock {
  heading: string;
  body: string;
  lineRange?: [number, number]; // 1-based [startLine, endLine]
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  description: string;
  language: Language;
  code: string;
  explanation: ExplanationBlock[];
  expectedOutput: string;
  keyFocus: string[]; // e.g. ["(", ")", "\"", ":"]
}

export interface LessonResult {
  lessonId: string;
  language: Language;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  stars: number; // 0 to 3
  timeSeconds: number;
  errorsCount: number;
  trickyKeys: { [char: string]: number };
  completedAt: string;
}

export interface StoredProgress {
  [language: string]: {
    [lessonId: string]: {
      bestWpm: number;
      bestAccuracy: number;
      stars: number;
      completedAt: string;
    };
  };
}

export type FingerName =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb';

export interface FingerInfo {
  finger: FingerName;
  hand: 'left' | 'right';
  fingerLabel: string;
  color: string;
  shiftFinger?: FingerName;
  shiftHand?: 'left' | 'right';
}

export type CharStatus = 'pending' | 'correct' | 'incorrect' | 'current';

export interface TypingChar {
  char: string;
  status: CharStatus;
  userTyped?: string;
}

export interface CustomSnippet {
  id: string;
  title: string;
  language: Language;
  code: string;
  description?: string;
  createdAt: string;
  bestWpm?: number;
  bestAccuracy?: number;
  stars?: number;
}

export interface MistakeInfo {
  type: 'shift_missed' | 'wrong_key';
  expectedChar: string;
  typedChar: string;
  keyCode?: string;
  timestamp: number;
}

export type AppView = 'lesson-list' | 'typing' | 'results' | 'custom-code' | 'mobile-dashboard';
