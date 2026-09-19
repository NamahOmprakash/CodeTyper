import { useCallback, useEffect, useRef, useState } from 'react';
import { formatSpeechText } from '../utils/naturalNarrator';

let globalVoices: SpeechSynthesisVoice[] = [];
const voiceSubscribers = new Set<(voices: SpeechSynthesisVoice[]) => void>();

function syncGlobalVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      globalVoices = list;
      voiceSubscribers.forEach((fn) => fn(list));
    }
  } catch {}
}

// Global voice listener initialization that never unmounts
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  syncGlobalVoices();

  window.speechSynthesis.addEventListener('voiceschanged', syncGlobalVoices);

  // Chromium / Brave / Safari asynchronous voice loader polling
  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    syncGlobalVoices();
    if (globalVoices.length > 0 || attempts >= 25) {
      clearInterval(timer);
    }
  }, 150);
}

export interface SpeakOptions {
  voiceURI?: string;
  rate?: number;
}

const STORAGE_KEY_VOICE = 'keyscript-tts-voice';
const LEGACY_STORAGE_KEY_VOICE = 'codetyper-tts-voice';
const STORAGE_KEY_RATE = 'keyscript-tts-rate';
const LEGACY_STORAGE_KEY_RATE = 'codetyper-tts-rate';

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(globalVoices);

  const [selectedVoiceURI, setSelectedVoiceURIState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_VOICE) || localStorage.getItem(LEGACY_STORAGE_KEY_VOICE) || '';
    }
    return '';
  });

  const [rate, setRateState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_RATE) || localStorage.getItem(LEGACY_STORAGE_KEY_RATE);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0.25 && parsed <= 4.0) {
          return parsed;
        }
      }
    }
    return 1.0;
  });

  const [systemVoiceName, setSystemVoiceName] = useState<string>('System Default');
  const [isSupported, setIsSupported] = useState(true);

  const activeUtterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
  const rateRef = useRef(rate);
  const selectedVoiceURIRef = useRef(selectedVoiceURI);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    selectedVoiceURIRef.current = selectedVoiceURI;
  }, [selectedVoiceURI]);

  // Set and persist rate (clamped 0.25x to 4.0x)
  const setRate = useCallback((newRate: number) => {
    const clamped = Math.max(0.25, Math.min(4.0, parseFloat(newRate.toFixed(2))));
    setRateState(clamped);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_RATE, clamped.toString());
    }
  }, []);

  // Set and persist voice
  const setSelectedVoiceURI = useCallback((uri: string) => {
    setSelectedVoiceURIState(uri);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_VOICE, uri);
    }
  }, []);

  // Subscribe to global voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const handleVoicesUpdate = (availableVoices: SpeechSynthesisVoice[]) => {
      if (availableVoices && availableVoices.length > 0) {
        setVoices(availableVoices);

        const defaultVoice =
          availableVoices.find((v) => v.default) ||
          availableVoices.find((v) => v.lang.startsWith('en') && !v.name.includes('Google')) ||
          availableVoices.find((v) => v.lang.startsWith('en')) ||
          availableVoices[0];

        if (defaultVoice) {
          setSystemVoiceName(defaultVoice.name);
        }

        // Restore saved voice or pick first available English/default voice
        setSelectedVoiceURIState((prev) => {
          const saved =
            typeof window !== 'undefined'
              ? localStorage.getItem(STORAGE_KEY_VOICE) || localStorage.getItem(LEGACY_STORAGE_KEY_VOICE)
              : '';
          const candidate = prev || saved;
          if (candidate && availableVoices.some((v) => v.voiceURI === candidate)) {
            return candidate;
          }
          return defaultVoice ? defaultVoice.voiceURI : '';
        });
      }
    };

    voiceSubscribers.add(handleVoicesUpdate);

    // Initial check
    syncGlobalVoices();
    if (globalVoices.length > 0) {
      handleVoicesUpdate(globalVoices);
    }

    return () => {
      voiceSubscribers.delete(handleVoicesUpdate);
    };
  }, []);

  const refreshVoices = useCallback(() => {
    syncGlobalVoices();
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      activeUtterancesRef.current = [];
    }
  }, []);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    }
  }, []);

  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      window.speechSynthesis.cancel();

      const cleaned = formatSpeechText(text);
      if (!cleaned.trim()) return;

      // Sentence chunking
      const sentenceRegex = /[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g;
      const rawMatches = cleaned.match(sentenceRegex) || [cleaned];
      const sentences = rawMatches
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (sentences.length === 0) return;

      const availableVoices = globalVoices.length > 0 ? globalVoices : window.speechSynthesis.getVoices();
      const currentVoiceURI =
        options?.voiceURI !== undefined && options.voiceURI !== ''
          ? options.voiceURI
          : selectedVoiceURIRef.current;

      const currentRate =
        options?.rate !== undefined
          ? Math.max(0.25, Math.min(4.0, options.rate))
          : rateRef.current;

      const chosenVoice =
        availableVoices.find((v) => v.voiceURI === currentVoiceURI) ||
        availableVoices.find((v) => v.default) ||
        availableVoices.find((v) => v.lang.startsWith('en')) ||
        availableVoices[0];

      const utterances: SpeechSynthesisUtterance[] = [];

      sentences.forEach((sentence, idx) => {
        const utterance = new SpeechSynthesisUtterance(sentence);
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }

        utterance.rate = currentRate;
        utterance.pitch = 1.0;

        if (idx === 0) {
          utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
          };
        }

        if (idx === sentences.length - 1) {
          utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            activeUtterancesRef.current = [];
          };
        }

        utterance.onerror = (e) => {
          if (e.error !== 'canceled') {
            console.warn('TTS error:', e);
          }
          setIsSpeaking(false);
          setIsPaused(false);
          activeUtterancesRef.current = [];
        };

        utterances.push(utterance);
      });

      activeUtterancesRef.current = utterances;
      utterances.forEach((u) => window.speechSynthesis.speak(u));
    },
    []
  );

  return {
    speak,
    stop,
    pause,
    resume,
    voices,
    refreshVoices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    rate,
    setRate,
    isSpeaking,
    isPaused,
    systemVoiceName,
    isSupported,
  };
}
