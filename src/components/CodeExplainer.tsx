import React, { useEffect, useMemo, useState } from 'react';
import {
  Terminal,
  Lightbulb,
  ChevronRight,
  BookOpen,
  Volume2,
  Pause,
  Square,
  Radio,
  Settings,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import { ExplanationBlock, Lesson } from '../types';
import { getFingerForChar } from '../data/fingerMap';
import { useTTS } from '../hooks/useTTS';
import { buildLessonNarration, buildBlockNarration } from '../utils/naturalNarrator';

interface CodeExplainerProps {
  lesson?: Lesson;
  explanation: ExplanationBlock[];
  expectedOutput: string;
  keyFocus: string[];
  currentLine: number;
  currentExpectedChar?: string;
}

export const CodeExplainer: React.FC<CodeExplainerProps> = ({
  lesson,
  explanation,
  expectedOutput,
  keyFocus,
  currentLine,
  currentExpectedChar,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTipsCollapsed, setIsTipsCollapsed] = useState(true);

  // Auto-expand tips if the student is currently typing one of the tricky focus keys
  useEffect(() => {
    if (currentExpectedChar && keyFocus.includes(currentExpectedChar)) {
      setIsTipsCollapsed(false);
    }
  }, [currentExpectedChar, keyFocus]);

  const {
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
  } = useTTS();

  // Stop speech if unmounting or switching lessons
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop, lesson?.id]);

  // Read the full lesson explanation with coherent natural teacher narrative
  const handleListenAll = () => {
    if (isSpeaking && !isPaused) {
      pause();
      return;
    }
    if (isPaused) {
      resume();
      return;
    }

    if (lesson) {
      const script = buildLessonNarration(lesson);
      speak(script);
    } else {
      const script = explanation.map((block) => buildBlockNarration(block)).join(' ');
      speak(script);
    }
  };

  // Read a single concept block
  const handleListenBlock = (e: React.MouseEvent, block: ExplanationBlock) => {
    e.stopPropagation();
    speak(buildBlockNarration(block));
  };

  // Sort voices with English first, system default at the very top
  const sortedVoices = useMemo(() => {
    if (!voices || voices.length === 0) return [];
    const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    const otherVoices = voices.filter((v) => !v.lang.toLowerCase().startsWith('en'));

    enVoices.sort((a, b) => {
      if (a.default && !b.default) return -1;
      if (!a.default && b.default) return 1;
      return a.name.localeCompare(b.name);
    });

    otherVoices.sort((a, b) => a.name.localeCompare(b.name));

    return [...enVoices, ...otherVoices];
  }, [voices]);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Concept Breakdown Card with TTS */}
      <div className="bg-theme-surface border border-theme-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-theme-primary" />
            <h3 className="font-semibold text-sm text-theme-text">Code Breakdown</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-theme-text-muted">
              Line {currentLine}
            </span>
          </div>
        </div>

        {/* TTS Audio Player & Customization Bar */}
        {isSupported && (
          <div className="mb-3 p-3 rounded-xl bg-theme-bg/90 border border-theme-border flex flex-col gap-2.5 shadow-sm">
            {/* Playback & Status Controls */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={handleListenAll}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                    isSpeaking && !isPaused
                      ? 'bg-theme-primary text-black font-bold ring-2 ring-theme-primary/30'
                      : 'bg-theme-surface border border-theme-border text-theme-text hover:border-theme-primary/60'
                  }`}
                  title={isSpeaking && !isPaused ? 'Pause narration' : 'Listen to lesson breakdown (TTS)'}
                >
                  {isSpeaking && !isPaused ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-theme-primary" />
                      <span>{isPaused ? 'Resume' : 'Listen to Breakdown'}</span>
                    </>
                  )}
                </button>

                {(isSpeaking || isPaused) && (
                  <button
                    onClick={stop}
                    className="p-1.5 rounded-lg bg-theme-surface border border-theme-border text-theme-text-muted hover:text-theme-incorrect transition-colors"
                    title="Stop audio"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Audio Controls & Settings Gear */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !isSettingsOpen;
                    setIsSettingsOpen(next);
                    if (next) refreshVoices();
                  }}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isSettingsOpen
                      ? 'bg-theme-primary/15 border-theme-primary text-theme-primary'
                      : 'bg-theme-surface border-theme-border text-theme-text-muted hover:text-theme-text'
                  }`}
                  title={isSettingsOpen ? 'Hide Voice & Speed settings' : 'Voice & Speed settings'}
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>

                {/* Live Audio Status */}
                {isSpeaking && !isPaused ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-theme-primary font-mono bg-theme-primary/10 px-2 py-0.5 rounded-full border border-theme-primary/20 animate-pulse">
                    <Radio className="w-3 h-3" />
                    <span className="hidden sm:inline">Speaking</span>
                  </div>
                ) : isPaused ? (
                  <div className="text-[11px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Paused
                  </div>
                ) : (
                  <span className="text-[10px] text-theme-text-muted font-mono truncate max-w-[110px]" title={systemVoiceName}>
                    {systemVoiceName}
                  </span>
                )}
              </div>
            </div>

            {/* Collapsible Voice Dropdown and Speed Controls */}
            {isSettingsOpen && (
              <div className="pt-2.5 mt-2 border-t border-theme-border/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs animate-in fade-in duration-150">
                {/* Voice Dropdown */}
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="text-[10px] uppercase font-mono text-theme-text-muted tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span>Voice</span>
                      <button
                        onClick={() => refreshVoices()}
                        className="text-theme-text-muted hover:text-theme-primary transition-colors p-0.5"
                        title="Re-scan system voices"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <span className="text-[9px] text-theme-primary truncate max-w-[80px]">
                      {sortedVoices.find((v) => v.voiceURI === selectedVoiceURI)?.lang || ''}
                    </span>
                  </div>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="w-full bg-theme-surface border border-theme-border text-theme-text text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-theme-primary transition-colors cursor-pointer truncate"
                    title="Select narration voice"
                  >
                    {sortedVoices.length > 0 ? (
                      sortedVoices.map((voice) => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name} {voice.default ? '★ (Default)' : ''} ({voice.lang})
                        </option>
                      ))
                    ) : (
                      <option value="">{systemVoiceName || 'Default System Voice'}</option>
                    )}
                  </select>
                </div>

                {/* Speed Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-theme-text-muted uppercase tracking-wider">
                    <span>Speed</span>
                    <button
                      onClick={() => setRate(1.0)}
                      className="text-theme-primary hover:underline font-semibold"
                      title="Reset speed to 1.00x"
                    >
                      {rate.toFixed(2)}x (reset)
                    </button>
                  </div>
                  <div className="flex items-center gap-2 h-[30px]">
                    <input
                      type="range"
                      min="0.25"
                      max="4.00"
                      step="0.05"
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-theme-surface rounded-lg appearance-none cursor-pointer accent-theme-primary"
                      title={`Narration speed: ${rate.toFixed(2)}x`}
                    />
                    <span className="text-[11px] font-mono text-theme-text w-9 text-right font-medium">
                      {rate.toFixed(2)}x
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Concept Blocks */}
        <div className="space-y-3">
          {explanation.map((block, idx) => {
            const isRelevant =
              block.lineRange &&
              currentLine >= block.lineRange[0] &&
              currentLine <= block.lineRange[1];

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs transition-all duration-200 ${
                  isRelevant
                    ? 'bg-theme-bg border-theme-primary/60 shadow-sm'
                    : 'bg-theme-bg/40 border-theme-border/60 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 font-semibold text-theme-text mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isRelevant && <ChevronRight className="w-3.5 h-3.5 text-theme-primary shrink-0" />}
                    <span className="truncate">{block.heading}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Block-level TTS button */}
                    <button
                      onClick={(e) => handleListenBlock(e, block)}
                      className="p-1 rounded hover:bg-theme-surface text-theme-text-muted hover:text-theme-primary transition-colors"
                      title="Read this concept aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>

                    {block.lineRange && (
                      <span className="text-[10px] font-mono text-theme-text-muted">
                        L{block.lineRange[0]}
                        {block.lineRange[1] !== block.lineRange[0] ? `-L${block.lineRange[1]}` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-theme-text-muted leading-relaxed">
                  {block.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Touch-Typing Key Focus Tips (Collapsible) */}
      {keyFocus.length > 0 && (
        <div className="bg-theme-surface border border-theme-border rounded-xl p-3 sm:p-4 shadow-sm transition-all">
          <button
            onClick={() => setIsTipsCollapsed(!isTipsCollapsed)}
            className="w-full flex items-center justify-between text-left select-none group"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-xs sm:text-sm text-theme-text flex items-center gap-1.5">
                <span>Tricky Symbol Tips</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {keyFocus.length}
                </span>
              </h3>
            </div>
            <div className="p-1 rounded text-theme-text-muted group-hover:text-theme-text">
              {isTipsCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </div>
          </button>

          {!isTipsCollapsed && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-theme-border animate-in fade-in duration-150">
              {keyFocus.map((key, i) => {
                const finger = getFingerForChar(key);
                const isCurrentKey = currentExpectedChar === key;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-colors ${
                      isCurrentKey
                        ? 'bg-amber-500/10 border-amber-400/80 ring-1 ring-amber-400/30'
                        : 'bg-theme-bg border-theme-border'
                    }`}
                  >
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-theme-surface border border-theme-border text-theme-primary">
                      {key === '\t' ? 'Tab' : key}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-theme-text font-medium truncate">
                          {finger.fingerLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Expected Terminal Output Card */}
      <div className="bg-theme-surface border border-theme-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-theme-border">
          <Terminal className="w-4 h-4 text-theme-terminal" />
          <h3 className="font-semibold text-sm text-theme-text">Expected Output</h3>
          <span className="ml-auto text-[10px] text-theme-text-muted uppercase tracking-wider font-mono">
            stdout
          </span>
        </div>
        <div className="bg-black/80 rounded-lg p-3 font-mono text-xs text-theme-terminal overflow-x-auto border border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mb-1.5 select-none">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <span className="w-2 h-2 rounded-full bg-green-500/80" />
            <span className="ml-2">terminal expected stdout</span>
          </div>
          <pre className="whitespace-pre-wrap">{expectedOutput}</pre>
        </div>
      </div>
    </div>
  );
};
