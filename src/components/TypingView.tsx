import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  PanelRightClose,
  PanelRightOpen,
  Zap,
  Target,
  Clock,
  Maximize,
  Minimize,
  Eye,
  Minimize2,
  Play,
  Terminal,
  X,
  Loader2,
  Bot,
} from 'lucide-react';
import { Lesson, LessonResult } from '../types';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useCoach } from '../hooks/useCoach';
import { useTTS } from '../hooks/useTTS';
import { executeCode } from '../utils/codeRunner';
import { CodeDisplay } from './CodeDisplay';
import { KeyboardGuide } from './KeyboardGuide';
import { CodeExplainer } from './CodeExplainer';
import { CoachBubble } from './CoachBubble';
import { AISettings } from './AISettings';

interface TypingViewProps {
  lesson: Lesson;
  onComplete: (result: LessonResult) => void;
  onBackToLessons: () => void;
  playClick: () => void;
  playError: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TypingView: React.FC<TypingViewProps> = ({
  lesson,
  onComplete,
  onBackToLessons,
  playClick,
  playError,
  isFocusMode,
  onToggleFocusMode,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [showExplainer, setShowExplainer] = useState(true);

  // Execution state
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    output: string;
    error?: string;
    time: number;
  } | null>(null);

  const engine = useTypingEngine({
    lesson,
    onComplete,
    playClick,
    playError,
  });

  const {
    chars,
    currentIndex,
    currentLine,
    currentExpectedChar,
    lastMistake,
    wpm,
    accuracy,
    elapsedTime,
    progressPercent,
    handleKeyDown,
    reset,
  } = engine;

  const [pressedKey, setPressedKey] = useState<string>('');
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const {
    speak,
    stop: stopTTS,
    isSpeaking: isTTSSpeaking,
    voices,
    refreshVoices,
  } = useTTS();

  const coach = useCoach({
    language: lesson.language,
    lessonTitle: lesson.title,
    currentCode: lesson.code,
    currentLine,
    wpm,
    accuracy,
    mistakeTracker: engine.mistakeTracker,
    speak,
  });

  const handlePreviewCoachVoice = useCallback(
    (sampleText: string, voiceURI: string, rate: number) => {
      speak(sampleText, { voiceURI, rate });
    },
    [speak]
  );

  const handleRunCode = useCallback(async () => {
    setIsRunningCode(true);
    setExecutionResult(null);
    try {
      const res = await executeCode(lesson.code, lesson.language);
      setExecutionResult({
        output: res.output,
        error: res.error,
        time: res.executionTimeMs,
      });
    } finally {
      setIsRunningCode(false);
    }
  }, [lesson.code, lesson.language]);

  const handleFocusContainer = useCallback(() => {
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement).blur?.();
    }
  }, []);

  // Global window key listener for effortless Monkeytype feel & Cmd+Enter
  useEffect(() => {
    const onWindowKeyDown = (e: KeyboardEvent) => {
      // Run code shortcut: Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
        return;
      }

      // When AI Settings modal is open, let the modal handle all keyboard inputs
      if (isAISettingsOpen) return;

      const target = e.target as HTMLElement;
      const isTextInput =
        target &&
        (target.tagName === 'TEXTAREA' ||
          (target.tagName === 'INPUT' &&
            !['checkbox', 'radio', 'range'].includes((target as HTMLInputElement).type)) ||
          target.isContentEditable);

      if (isTextInput) return;

      // If user had clicked a button or control, blur it so typing flows effortlessly
      if (target && ['BUTTON', 'SELECT'].includes(target.tagName)) {
        target.blur();
      }

      // Ignore other system shortcuts
      if (e.metaKey || e.ctrlKey) return;

      // Escape exits Focus Mode or closes execution drawer
      if (e.key === 'Escape') {
        if (executionResult) {
          e.preventDefault();
          setExecutionResult(null);
          return;
        }
        if (isFocusMode) {
          e.preventDefault();
          onToggleFocusMode();
          return;
        }
      }

      // Prevent default page scrolling when pressing space or tab
      if (e.key === ' ' || e.code === 'Space' || e.key === 'Tab') {
        e.preventDefault();
      }

      setPressedKey(e.code);
      handleKeyDown(e);
    };

    const onWindowKeyUp = () => {
      setPressedKey('');
    };

    window.addEventListener('keydown', onWindowKeyDown);
    window.addEventListener('keyup', onWindowKeyUp);
    return () => {
      window.removeEventListener('keydown', onWindowKeyDown);
      window.removeEventListener('keyup', onWindowKeyUp);
    };
  }, [
    handleKeyDown,
    isFocusMode,
    onToggleFocusMode,
    handleRunCode,
    executionResult,
    isAISettingsOpen,
  ]);

  return (
    <div className={`max-w-7xl mx-auto px-4 ${isFocusMode ? 'py-2 sm:py-3' : 'py-4 sm:py-6'} flex flex-col gap-4 transition-all duration-300`}>
      {/* Top Bar: Standard HUD vs Minimalist Focus HUD */}
      {!isFocusMode ? (
        /* Standard Lesson Header & Live HUD */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-surface border border-theme-border rounded-xl p-3 sm:p-4 shadow-sm">
          {/* Navigation & Lesson Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLessons}
              className="p-2 rounded-lg bg-theme-bg border border-theme-border hover:bg-theme-surface-hover text-theme-text-muted hover:text-theme-text transition-colors"
              title="Back to Lessons"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-theme-primary px-1.5 py-0.5 rounded bg-theme-bg border border-theme-border">
                  #{lesson.number > 0 ? lesson.number : 'Custom'}
                </span>
                <h2 className="font-bold text-base text-theme-text">{lesson.title}</h2>
              </div>
              <p className="text-xs text-theme-text-muted hidden sm:block">
                {lesson.description}
              </p>
            </div>
          </div>

          {/* Live HUD (Monkeytype style) */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-theme-border/50">
            <div className="flex items-center gap-1.5 font-mono text-sm" title="Words Per Minute">
              <Zap className="w-4 h-4 text-theme-primary" />
              <span className="font-bold text-theme-text">{wpm}</span>
              <span className="text-xs text-theme-text-muted">WPM</span>
            </div>

            <div className="w-px h-4 bg-theme-border" />

            <div className="flex items-center gap-1.5 font-mono text-sm" title="Typing Accuracy">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-theme-text">{accuracy}%</span>
              <span className="text-xs text-theme-text-muted">ACC</span>
            </div>

            <div className="w-px h-4 bg-theme-border" />

            <div className="flex items-center gap-1.5 font-mono text-sm" title="Elapsed Time">
              <Clock className="w-4 h-4 text-theme-text-muted" />
              <span className="font-bold text-theme-text">{Math.round(elapsedTime)}s</span>
            </div>

            <div className="flex items-center gap-1.5 ml-2">
              {/* Run Code Button */}
              <button
                onClick={handleRunCode}
                disabled={isRunningCode}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-400 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                title="Run Code (Cmd + Enter or Ctrl + Enter)"
              >
                {isRunningCode ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-emerald-400" />
                )}
                <span>Run</span>
                <kbd className="hidden sm:inline-block font-mono text-[10px] bg-black/40 px-1 rounded opacity-75">
                  ⌘↵
                </kbd>
              </button>

              {/* Focus Mode Button */}
              <button
                onClick={onToggleFocusMode}
                className="p-2 rounded-lg bg-theme-bg border border-theme-border hover:bg-theme-surface-hover text-theme-text-muted hover:text-theme-primary transition-colors flex items-center gap-1 text-xs font-medium"
                title="Enter Focus Mode (shows only code, keyboard, and breakdown)"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden md:inline">Focus</span>
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={onToggleFullscreen}
                className="p-2 rounded-lg bg-theme-bg border border-theme-border hover:bg-theme-surface-hover text-theme-text-muted hover:text-theme-primary transition-colors"
                title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4 text-theme-primary" /> : <Maximize className="w-4 h-4" />}
              </button>

              {/* AI Coach Settings Button */}
              <button
                onClick={() => setIsAISettingsOpen(true)}
                className={`p-2 rounded-lg border transition-colors flex items-center gap-1 text-xs font-medium ${
                  coach.coachEnabled
                    ? 'bg-theme-bg border-theme-border hover:border-theme-primary text-theme-primary'
                    : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                }`}
                title="AI Coach Settings & Providers"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden lg:inline">Coach</span>
              </button>

              {/* Reset Button */}
              <button
                onClick={reset}
                className="p-2 rounded-lg bg-theme-bg border border-theme-border hover:bg-theme-surface-hover text-theme-text-muted hover:text-theme-text transition-colors"
                title="Restart Lesson"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Toggle Explainer Side Panel */}
              <button
                onClick={() => setShowExplainer(!showExplainer)}
                className="p-2 rounded-lg bg-theme-bg border border-theme-border hover:bg-theme-surface-hover text-theme-text-muted hover:text-theme-text transition-colors hidden md:block"
                title={showExplainer ? 'Hide Explanation Panel' : 'Show Explanation Panel'}
              >
                {showExplainer ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Focus Mode Minimal Top Bar */
        <div className="flex items-center justify-between bg-theme-surface/70 border border-theme-border/60 rounded-lg px-4 py-2 text-xs backdrop-blur shadow-sm">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-theme-primary">
              #{lesson.number > 0 ? lesson.number : 'Custom'} {lesson.title}
            </span>
            <span className="text-theme-text-muted hidden sm:inline">•</span>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-theme-text font-semibold">{wpm} WPM</span>
              <span className="text-emerald-400 font-semibold">{accuracy}% ACC</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Run Code in Focus Mode */}
            <button
              onClick={handleRunCode}
              disabled={isRunningCode}
              className="px-2 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-400 font-semibold flex items-center gap-1 text-xs"
              title="Run Code (Cmd + Enter)"
            >
              {isRunningCode ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-emerald-400" />}
              <span>Run <kbd className="text-[10px] opacity-70">⌘↵</kbd></span>
            </button>

            <button
              onClick={reset}
              className="p-1.5 rounded hover:bg-theme-bg text-theme-text-muted hover:text-theme-text transition-colors"
              title="Restart Lesson"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onToggleFullscreen}
              className="p-1.5 rounded hover:bg-theme-bg text-theme-text-muted hover:text-theme-text transition-colors"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-theme-primary" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onToggleFocusMode}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-theme-primary/15 text-theme-primary border border-theme-primary/30 hover:bg-theme-primary/25 font-semibold text-xs transition-colors"
              title="Exit Focus Mode (Esc)"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Focus <kbd className="font-mono text-[10px] opacity-70">Esc</kbd></span>
            </button>
          </div>
        </div>
      )}

      {/* Live Execution Output Drawer / Console */}
      {executionResult && (
        <div className="bg-black/90 border border-emerald-500/40 rounded-xl p-4 shadow-xl text-xs font-mono text-emerald-400 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-zinc-400 text-[11px]">
            <span className="flex items-center gap-2 text-emerald-400 font-bold">
              <Terminal className="w-4 h-4" />
              Live Execution Output ({lesson.language === 'python' ? 'Python' : 'C++'})
            </span>
            <div className="flex items-center gap-3">
              <span>{executionResult.time}ms</span>
              <button
                onClick={() => setExecutionResult(null)}
                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                title="Close terminal output (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {executionResult.error ? (
            <pre className="text-red-400 whitespace-pre-wrap">{executionResult.error}</pre>
          ) : (
            <pre className="whitespace-pre-wrap leading-relaxed">{executionResult.output}</pre>
          )}
        </div>
      )}

      {/* Progress Bar (hidden in focus mode to keep zero distraction) */}
      {!isFocusMode && (
        <div className="w-full h-1.5 bg-theme-surface rounded-full overflow-hidden border border-theme-border/50">
          <div
            className="h-full bg-gradient-to-r from-theme-primary to-emerald-400 transition-all duration-150 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Workspace Layout (Code + Keyboard + Code Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Code Display + Keyboard Visualizer */}
        <div className={`${showExplainer ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col gap-4`}>
          {/* Code Typing Area */}
          <CodeDisplay
            chars={chars}
            currentIndex={currentIndex}
            currentLine={currentLine}
            language={lesson.language}
            title={lesson.title}
            onRunCode={handleRunCode}
            isRunningCode={isRunningCode}
            onFocusContainer={handleFocusContainer}
          />

          {/* AI Teaching Coach Observer Bubble */}
          <CoachBubble
            message={coach.currentMessage}
            isThinking={coach.isThinking}
            onDismiss={coach.dismissMessage}
            onSpeak={(text) => coach.speakCoach(text)}
            onAskTip={() =>
              coach.triggerCoaching(
                'user_ask',
                `How do I position my fingers and type this ${lesson.language.toUpperCase()} line accurately?`
              )
            }
            onOpenSettings={() => setIsAISettingsOpen(true)}
            isCoachEnabled={coach.coachEnabled}
            onToggleCoach={coach.setCoachEnabled}
          />

          {/* TypingClub-Style Dynamic Keyboard & Hand-Placement Guide */}
          <KeyboardGuide
            targetChar={currentExpectedChar}
            pressedKey={pressedKey}
          />
        </div>

        {/* Right Column: Code Explanation & Terminal Output */}
        {showExplainer && (
          <div className="lg:col-span-4">
            <CodeExplainer
              lesson={lesson}
              explanation={lesson.explanation}
              expectedOutput={lesson.expectedOutput}
              keyFocus={lesson.keyFocus}
              currentLine={currentLine}
              currentExpectedChar={currentExpectedChar}
            />
          </div>
        )}
      </div>

      {/* AI Coach Configuration Modal */}
      <AISettings
        isOpen={isAISettingsOpen}
        onClose={() => {
          stopTTS();
          setIsAISettingsOpen(false);
        }}
        config={coach.coachConfig}
        onSaveConfig={coach.saveConfig}
        coachEnabled={coach.coachEnabled}
        onToggleCoach={coach.setCoachEnabled}
        autoSpeak={coach.autoSpeak}
        onToggleAutoSpeak={coach.setAutoSpeak}
        voices={voices}
        coachVoiceURI={coach.coachVoiceURI}
        onSetCoachVoiceURI={coach.setCoachVoiceURI}
        coachRate={coach.coachRate}
        onSetCoachRate={coach.setCoachRate}
        onPreviewCoachVoice={handlePreviewCoachVoice}
        isSpeakingPreview={isTTSSpeaking}
        onStopPreview={stopTTS}
        onRefreshVoices={refreshVoices}
      />
    </div>
  );
};
