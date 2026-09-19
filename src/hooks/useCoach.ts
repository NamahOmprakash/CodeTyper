import { useCallback, useEffect, useRef, useState } from 'react';
import { CoachMessage, CoachProviderId, CoachTrigger, CoachingContext, ProviderConfig } from '../utils/coaching/types';
import { getProvider } from '../utils/coaching/providers';
import { useMistakeTracker } from './useMistakeTracker';
import { Language } from '../types';

const STORAGE_KEY_CONFIG = 'keyscript-coach-config';
const LEGACY_STORAGE_KEY_CONFIG = 'codetyper-coach-config';
const STORAGE_KEY_ENABLED = 'keyscript-coach-enabled';
const LEGACY_STORAGE_KEY_ENABLED = 'codetyper-coach-enabled';
const STORAGE_KEY_AUTOSPEAK = 'keyscript-coach-autospeak';
const LEGACY_STORAGE_KEY_AUTOSPEAK = 'codetyper-coach-autospeak';
const STORAGE_KEY_COACH_VOICE = 'keyscript-coach-voice';
const LEGACY_STORAGE_KEY_COACH_VOICE = 'codetyper-coach-voice';
const STORAGE_KEY_COACH_RATE = 'keyscript-coach-rate';
const LEGACY_STORAGE_KEY_COACH_RATE = 'codetyper-coach-rate';

const DEFAULT_CONFIG: ProviderConfig = {
  providerId: 'lmstudio',
  baseUrl: 'http://localhost:1234/v1',
  model: 'local-model',
  enabled: true,
};

interface UseCoachProps {
  language: Language;
  lessonTitle: string;
  currentCode: string;
  currentLine: number;
  wpm: number;
  accuracy: number;
  mistakeTracker: ReturnType<typeof useMistakeTracker>;
  speak?: (text: string, options?: { voiceURI?: string; rate?: number }) => void;
}

export function useCoach({
  language,
  lessonTitle,
  currentCode,
  currentLine,
  wpm,
  accuracy,
  mistakeTracker,
  speak,
}: UseCoachProps) {
  const [currentMessage, setCurrentMessage] = useState<CoachMessage | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const [coachVoiceURI, setCoachVoiceURIState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem(STORAGE_KEY_COACH_VOICE) ||
        localStorage.getItem(LEGACY_STORAGE_KEY_COACH_VOICE) ||
        ''
      );
    }
    return '';
  });

  const [coachRate, setCoachRateState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved =
        localStorage.getItem(STORAGE_KEY_COACH_RATE) ||
        localStorage.getItem(LEGACY_STORAGE_KEY_COACH_RATE);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0.25 && parsed <= 4.0) {
          return parsed;
        }
      }
    }
    return 1.0;
  });

  const [coachConfig, setCoachConfigState] = useState<ProviderConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved =
          localStorage.getItem(STORAGE_KEY_CONFIG) ||
          localStorage.getItem(LEGACY_STORAGE_KEY_CONFIG);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.providerId === 'local' || parsed.providerId === 'nano') {
            parsed.providerId = 'lmstudio';
            parsed.baseUrl = parsed.baseUrl || 'http://localhost:1234/v1';
            parsed.model = parsed.model || 'local-model';
          }
          return parsed;
        }
      } catch {}
    }
    return DEFAULT_CONFIG;
  });

  const [coachEnabled, setCoachEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved =
        localStorage.getItem(STORAGE_KEY_ENABLED) ??
        localStorage.getItem(LEGACY_STORAGE_KEY_ENABLED);
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const [autoSpeak, setAutoSpeakState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved =
        localStorage.getItem(STORAGE_KEY_AUTOSPEAK) ??
        localStorage.getItem(LEGACY_STORAGE_KEY_AUTOSPEAK);
      if (saved !== null) return saved === 'true';
    }
    return false;
  });

  const lastTriggerTimeRef = useRef<number>(0);
  const activeMessageTimerRef = useRef<number | null>(null);
  const lastCoachedCountRef = useRef<number>(0);
  const lastCoachedCharRef = useRef<string>('');

  const saveConfig = useCallback((newConfig: ProviderConfig) => {
    setCoachConfigState(newConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
    }
  }, []);

  const setCoachEnabled = useCallback((val: boolean) => {
    setCoachEnabledState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ENABLED, val ? 'true' : 'false');
    }
  }, []);

  const setAutoSpeak = useCallback((val: boolean) => {
    setAutoSpeakState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_AUTOSPEAK, val ? 'true' : 'false');
    }
  }, []);

  const setCoachVoiceURI = useCallback((uri: string) => {
    setCoachVoiceURIState(uri);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_COACH_VOICE, uri);
    }
  }, []);

  const setCoachRate = useCallback((newRate: number) => {
    const clamped = Math.max(0.25, Math.min(4.0, parseFloat(newRate.toFixed(2))));
    setCoachRateState(clamped);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_COACH_RATE, clamped.toString());
    }
  }, []);

  const speakCoach = useCallback(
    (text: string) => {
      if (speak) {
        speak(text, { voiceURI: coachVoiceURI, rate: coachRate });
      }
    },
    [speak, coachVoiceURI, coachRate]
  );

  const dismissMessage = useCallback(() => {
    setCurrentMessage(null);
    if (activeMessageTimerRef.current) {
      clearTimeout(activeMessageTimerRef.current);
      activeMessageTimerRef.current = null;
    }
  }, []);

  // Central coaching generation pipeline (Tier 3 -> Tier 2 -> Tier 1)
  const triggerCoaching = useCallback(
    async (trigger: CoachTrigger, userQuestion?: string) => {
      if (!coachEnabled) return;

      const now = Date.now();
      // Debounce: don't generate more than once every 3.5 seconds unless user explicitly asked
      if (trigger !== 'user_ask' && now - lastTriggerTimeRef.current < 3500) {
        return;
      }
      lastTriggerTimeRef.current = now;

      const topMistakes = mistakeTracker.getTopPatterns(3);

      const context: CoachingContext = {
        language,
        lessonTitle,
        currentCode,
        currentLine,
        wpm,
        accuracy,
        mistakes: topMistakes,
        sessionDuration: 0,
        trigger,
        userQuestion,
      };

      setIsThinking(true);

      let text: string | null = null;
      const activeProviderId: CoachProviderId =
        coachConfig.providerId === 'local' ? 'lmstudio' : coachConfig.providerId;
      let usedSource: CoachProviderId = activeProviderId;
      let usedLabel = getProvider(activeProviderId)?.name || 'LM Studio (Local)';

      try {
        // Real LLM Provider (LM Studio, Ollama, Gemini, OpenAI)
        const provider = getProvider(activeProviderId);
        if (provider) {
          usedSource = activeProviderId;
          usedLabel = provider.name;
          try {
            text = await provider.generateCoaching(context, coachConfig);
          } catch (providerErr) {
            console.warn(`Provider ${activeProviderId} failed:`, providerErr);
          }
        }

        // If user explicitly asked for advice, but LLM server is unreachable, show a clear connection status
        if (!text && trigger === 'user_ask') {
          text = `Could not connect to ${usedLabel}. Make sure your local server is running or check your API key in Coach Settings.`;
        }

        if (text) {
          const newMsg: CoachMessage = {
            id: `coach-${Date.now()}`,
            text,
            source: usedSource,
            sourceLabel: usedLabel,
            trigger,
            timestamp: Date.now(),
            char: topMistakes[0]?.char,
          };

          setCurrentMessage(newMsg);

          if (autoSpeak && speak) {
            speak(text, { voiceURI: coachVoiceURI, rate: coachRate });
          }

          // Auto-dismiss message after 8 seconds
          if (activeMessageTimerRef.current) {
            clearTimeout(activeMessageTimerRef.current);
          }
          activeMessageTimerRef.current = window.setTimeout(() => {
            setCurrentMessage(null);
            activeMessageTimerRef.current = null;
          }, 8500);
        }
      } finally {
        setIsThinking(false);
      }
    },
    [
      coachEnabled,
      coachConfig,
      language,
      lessonTitle,
      currentCode,
      currentLine,
      wpm,
      accuracy,
      mistakeTracker,
      autoSpeak,
      speak,
      coachVoiceURI,
      coachRate,
    ]
  );

  // Monitor mistakes for automated coaching triggers
  useEffect(() => {
    const top = mistakeTracker.getTopPatterns(1)[0];
    if (!top) return;

    // Trigger coaching whenever student makes a mistake or struggles on a key
    if (
      top.count >= 1 &&
      (top.count !== lastCoachedCountRef.current || top.char !== lastCoachedCharRef.current)
    ) {
      lastCoachedCountRef.current = top.count;
      lastCoachedCharRef.current = top.char;
      triggerCoaching('repeated_mistake');
    }
  }, [mistakeTracker.patterns, triggerCoaching]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (activeMessageTimerRef.current) {
        clearTimeout(activeMessageTimerRef.current);
      }
    };
  }, []);

  return {
    currentMessage,
    isThinking,
    coachConfig,
    saveConfig,
    coachEnabled,
    setCoachEnabled,
    autoSpeak,
    setAutoSpeak,
    coachVoiceURI,
    setCoachVoiceURI,
    coachRate,
    setCoachRate,
    speakCoach,
    dismissMessage,
    triggerCoaching,
  };
}
