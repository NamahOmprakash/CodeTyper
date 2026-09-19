import React from 'react';
import {
  AlertTriangle,
  Star,
  Zap,
  Target,
  BookOpen,
  Lock,
  ArrowLeft,
  Smartphone,
  Laptop,
  CheckCircle2,
  FileCode2,
} from 'lucide-react';
import { Language, Lesson } from '../types';
import { useProgress } from '../hooks/useProgress';
import { useCustomCode } from '../hooks/useCustomCode';

interface MobileDashboardProps {
  progressHook: ReturnType<typeof useProgress>;
  customCodeHook: ReturnType<typeof useCustomCode>;
  pythonLessons: Lesson[];
  cppLessons: Lesson[];
  onBackToDesktop: () => void;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  progressHook,
  customCodeHook,
  pythonLessons,
  cppLessons,
  onBackToDesktop,
}) => {
  const { getLanguageSummary, getLessonStats } = progressHook;
  const { snippets } = customCodeHook;

  const pySummary = getLanguageSummary('python', pythonLessons.length);
  const cppSummary = getLanguageSummary('cpp', cppLessons.length);

  const totalStars = pySummary.totalStars + cppSummary.totalStars;
  const maxStars = pySummary.maxStars + cppSummary.maxStars;
  const totalCompleted = pySummary.completedCount + cppSummary.completedCount;
  const totalLessons = pySummary.totalLessons + cppSummary.totalLessons;

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Top Banner Notice: Not optimized for Android */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 sm:p-5 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h2 className="font-bold text-xs sm:text-base text-amber-500 flex items-center gap-1.5 flex-wrap">
            <span>Mobile Device Notice</span>
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
              Not Optimized for Android
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-theme-text-muted mt-1 leading-relaxed">
            Key Script is built for typing on a physical keyboard and is <strong>not optimized for Android or mobile touchscreens</strong>.
            Please visit on a <strong>laptop or desktop</strong> to practice typing. You can review your progress and stats below.
          </p>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="bg-theme-surface border border-theme-border rounded-xl p-3.5 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm sm:text-base text-theme-text flex items-center gap-2">
            <Zap className="w-4 h-4 text-theme-primary" />
            Your Coding Progress
          </h3>
          <span className="text-[11px] sm:text-xs font-mono text-theme-text-muted">
            {totalCompleted} / {totalLessons} Lessons
          </span>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-theme-bg p-3 rounded-xl border border-theme-border text-center">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 mx-auto mb-1" />
            <div className="font-mono text-lg font-bold text-theme-text">
              {totalStars}
              <span className="text-xs text-theme-text-muted font-normal">/{maxStars}</span>
            </div>
            <span className="text-[10px] text-theme-text-muted uppercase">Stars</span>
          </div>

          <div className="bg-theme-bg p-3 rounded-xl border border-theme-border text-center">
            <Zap className="w-5 h-5 text-theme-primary mx-auto mb-1" />
            <div className="font-mono text-lg font-bold text-theme-text">
              {Math.max(pySummary.avgWpm, cppSummary.avgWpm) || 0}
            </div>
            <span className="text-[10px] text-theme-text-muted uppercase">Best WPM</span>
          </div>

          <div className="bg-theme-bg p-3 rounded-xl border border-theme-border text-center">
            <FileCode2 className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="font-mono text-lg font-bold text-theme-text">
              {snippets.length}
            </div>
            <span className="text-[10px] text-theme-text-muted uppercase">Snippets</span>
          </div>
        </div>

        {/* Python Track Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-theme-text mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Python Track
            </span>
            <span className="text-theme-text-muted font-mono">{pySummary.completedCount}/{pySummary.totalLessons}</span>
          </div>
          <div className="space-y-1.5">
            {pythonLessons.map((l) => {
              const stats = getLessonStats('python', l.id);
              return (
                <div
                  key={l.id}
                  className="flex items-center justify-between bg-theme-bg/60 p-2.5 rounded-lg border border-theme-border/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {stats ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-theme-border" />
                    )}
                    <span className="font-medium text-theme-text">{l.title}</span>
                  </div>
                  {stats ? (
                    <span className="font-mono text-theme-primary font-semibold">
                      {stats.bestWpm} WPM • {stats.stars}★
                    </span>
                  ) : (
                    <span className="text-theme-text-muted">Not completed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* C++ Track Status */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-theme-text mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              C++ Track
            </span>
            <span className="text-theme-text-muted font-mono">{cppSummary.completedCount}/{cppSummary.totalLessons}</span>
          </div>
          <div className="space-y-1.5">
            {cppLessons.map((l) => {
              const stats = getLessonStats('cpp', l.id);
              return (
                <div
                  key={l.id}
                  className="flex items-center justify-between bg-theme-bg/60 p-2.5 rounded-lg border border-theme-border/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {stats ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-theme-border" />
                    )}
                    <span className="font-medium text-theme-text">{l.title}</span>
                  </div>
                  {stats ? (
                    <span className="font-mono text-theme-primary font-semibold">
                      {stats.bestWpm} WPM • {stats.stars}★
                    </span>
                  ) : (
                    <span className="text-theme-text-muted">Not completed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Account Connection (Disabled / No OAuth as requested) */}
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-theme-text-muted" />
          <h3 className="font-bold text-sm text-theme-text">Account & Cloud Sync</h3>
        </div>
        <p className="text-xs text-theme-text-muted mb-4">
          Third-party authentication (Google OAuth / Email connection) is currently disabled. All your progress is stored privately in your device's local storage.
        </p>

        <div className="space-y-2.5 opacity-60 pointer-events-none">
          <button
            disabled
            className="w-full py-2.5 px-4 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-center gap-2 text-xs font-semibold text-theme-text-muted cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google (Connection Disabled)</span>
          </button>

          <button
            disabled
            className="w-full py-2.5 px-4 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-center gap-2 text-xs font-semibold text-theme-text-muted cursor-not-allowed"
          >
            <span>Continue with Email (Connection Disabled)</span>
          </button>
        </div>
      </div>

      {/* Switch to Desktop Button */}
      <div className="pt-2 text-center">
        <button
          onClick={onBackToDesktop}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-black font-bold text-xs transition-all shadow-md shadow-theme-primary/10"
        >
          <Laptop className="w-4 h-4" />
          <span>Switch to Desktop Typing Mode</span>
        </button>
      </div>
    </div>
  );
};
