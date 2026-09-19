import { Language, MistakeInfo } from '../../types';

export type CoachProviderId = 'local' | 'nano' | 'gemini' | 'openai' | 'ollama' | 'lmstudio';

export type MistakeCategory =
  | 'shift_missed'
  | 'wrong_key'
  | 'adjacent_key'
  | 'swap'
  | 'bracket_confusion'
  | 'quotes_confusion';

export interface MistakePattern {
  char: string;
  count: number;
  lastTyped: string[];
  category: MistakeCategory;
  wordContext?: string;
  line?: number;
  lastTimestamp: number;
}

export type CoachTrigger =
  | 'repeated_mistake'
  | 'struggling'
  | 'streak'
  | 'lesson_complete'
  | 'user_ask';

export interface CoachingContext {
  language: Language;
  lessonTitle: string;
  currentCode: string;
  currentLine: number;
  wpm: number;
  accuracy: number;
  mistakes: MistakePattern[];
  sessionDuration: number;
  trigger: CoachTrigger;
  userQuestion?: string;
}

export interface CoachMessage {
  id: string;
  text: string;
  source: CoachProviderId;
  sourceLabel: string;
  trigger: CoachTrigger;
  timestamp: number;
  char?: string;
}

export interface ProviderConfig {
  providerId: CoachProviderId;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  enabled: boolean;
}

export interface LLMProvider {
  id: CoachProviderId;
  name: string;
  type: 'local' | 'cloud';
  requiresApiKey: boolean;
  defaultBaseUrl?: string;
  defaultModel: string;
  availableModels: string[];
  isAvailable: (config: ProviderConfig) => Promise<{ ok: boolean; message?: string }>;
  generateCoaching: (context: CoachingContext, config: ProviderConfig) => Promise<string>;
}
