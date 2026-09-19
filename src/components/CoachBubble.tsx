import React from 'react';
import {
  Bot,
  Sparkles,
  Volume2,
  X,
  Settings,
  HelpCircle,
  Loader2,
  Cpu,
  Brain,
} from 'lucide-react';
import { CoachMessage, CoachProviderId } from '../utils/coaching/types';

interface CoachBubbleProps {
  message: CoachMessage | null;
  isThinking: boolean;
  onDismiss: () => void;
  onSpeak: (text: string) => void;
  onAskTip: () => void;
  onOpenSettings: () => void;
  isCoachEnabled: boolean;
  onToggleCoach: (val: boolean) => void;
}

function getProviderIcon(source: CoachProviderId) {
  switch (source) {
    case 'lmstudio':
      return <Brain className="w-3 h-3 text-pink-400" />;
    case 'ollama':
      return <Brain className="w-3 h-3 text-purple-400" />;
    case 'gemini':
      return <Sparkles className="w-3 h-3 text-blue-400" />;
    case 'openai':
      return <Cpu className="w-3 h-3 text-emerald-400" />;
    default:
      return <Bot className="w-3 h-3 text-emerald-400" />;
  }
}

export const CoachBubble: React.FC<CoachBubbleProps> = ({
  message,
  isThinking,
  onDismiss,
  onSpeak,
  onAskTip,
  onOpenSettings,
  isCoachEnabled,
}) => {
  if (!isCoachEnabled) return null;

  return (
    <div className="w-full transition-all duration-300">
      {message ? (
        <div className="bg-gradient-to-r from-theme-surface via-theme-bg to-theme-surface border border-theme-primary/40 rounded-xl p-3 shadow-lg shadow-theme-primary/5 flex items-start gap-3 relative animate-in slide-in-from-top-2 duration-200">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg bg-theme-primary/15 border border-theme-primary/30 flex items-center justify-center shrink-0 text-theme-primary mt-0.5">
            {isThinking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0 pr-16">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-theme-text flex items-center gap-1.5">
                <span>AI Typing Coach</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-[10px] font-mono text-theme-text-muted">
                {getProviderIcon(message.source)}
                <span>{message.sourceLabel}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-theme-text leading-relaxed">
              {message.text}
            </p>
          </div>

          {/* Actions */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
            <button
              onClick={() => onSpeak(message.text)}
              className="p-1.5 rounded-md hover:bg-theme-bg text-theme-text-muted hover:text-theme-primary transition-colors"
              title="Speak this coaching tip"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-md hover:bg-theme-bg text-theme-text-muted hover:text-theme-text transition-colors"
              title="AI Coach Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onDismiss}
              className="p-1.5 rounded-md hover:bg-theme-bg text-theme-text-muted hover:text-theme-text transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Idle bar with quick prompt action */
        <div className="flex items-center justify-between px-3 py-1.5 bg-theme-surface/60 border border-theme-border/60 rounded-xl text-xs text-theme-text-muted">
          <div className="flex items-center gap-2">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">
              AI Coach is observing your typing rhythm
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAskTip}
              disabled={isThinking}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-theme-bg border border-theme-border text-[11px] text-theme-text hover:border-theme-primary transition-colors"
              title="Ask the coach for a finger placement or typing tip"
            >
              {isThinking ? (
                <Loader2 className="w-3 h-3 animate-spin text-theme-primary" />
              ) : (
                <HelpCircle className="w-3 h-3 text-amber-400" />
              )}
              <span>Ask Coach</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-1 rounded hover:bg-theme-bg text-theme-text-muted hover:text-theme-text transition-colors"
              title="Configure AI Coach (Local, Gemini, OpenAI, Ollama, LM Studio)"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
