import React from 'react';
import { Star, RotateCcw, ArrowRight, BookOpen, Trophy, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Lesson, LessonResult } from '../types';
import { getFingerForChar } from '../data/fingerMap';

interface ResultsScreenProps {
  lesson: Lesson;
  result: LessonResult;
  hasNextLesson: boolean;
  onNextLesson: () => void;
  onRetry: () => void;
  onBackToCurriculum: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  lesson,
  result,
  hasNextLesson,
  onNextLesson,
  onRetry,
  onBackToCurriculum,
}) => {
  const trickyKeyEntries = Object.entries(result.trickyKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-300">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-10 shadow-lg text-center">
        {/* Lesson Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-bg border border-theme-border text-xs font-semibold text-theme-text-muted mb-4">
          <span>Lesson #{lesson.number}</span>
          <span>•</span>
          <span>{lesson.title}</span>
        </div>

        {/* Big Star Display (TypingClub style) */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-3 rounded-2xl transition-all duration-300 transform ${
                starIdx <= result.stars
                  ? 'bg-amber-400/15 border border-amber-400/40 text-amber-400 scale-110'
                  : 'bg-theme-bg/60 border border-theme-border text-theme-border'
              }`}
            >
              <Star
                className={`w-8 h-8 sm:w-10 sm:h-10 ${
                  starIdx <= result.stars ? 'fill-amber-400 text-amber-400' : 'fill-transparent'
                }`}
              />
            </div>
          ))}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-theme-text mt-2 mb-1">
          {result.stars === 3
            ? 'Flawless Execution!'
            : result.stars === 2
            ? 'Great Job!'
            : 'Lesson Completed!'}
        </h2>
        <p className="text-sm text-theme-text-muted mb-8 max-w-md mx-auto">
          {result.accuracy >= 95
            ? 'Incredible typing accuracy and muscle memory control.'
            : 'Keep practicing to build instinct for symbols like braces and colons.'}
        </p>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 text-left">
          <div className="bg-theme-bg p-4 rounded-xl border border-theme-border">
            <span className="text-xs text-theme-text-muted font-medium">Typing Speed</span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-theme-primary mt-1">
              {result.wpm} <span className="text-xs text-theme-text-muted font-normal">WPM</span>
            </div>
            <span className="text-[11px] text-theme-text-muted">Raw: {result.rawWpm} WPM</span>
          </div>

          <div className="bg-theme-bg p-4 rounded-xl border border-theme-border">
            <span className="text-xs text-theme-text-muted font-medium">Accuracy</span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
              {result.accuracy}%
            </div>
            <span className="text-[11px] text-theme-text-muted">
              {result.errorsCount === 0 ? 'Zero mistakes!' : `${result.errorsCount} typo(s)`}
            </span>
          </div>

          <div className="bg-theme-bg p-4 rounded-xl border border-theme-border">
            <span className="text-xs text-theme-text-muted font-medium">Time</span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-theme-text mt-1">
              {result.timeSeconds}s
            </div>
            <span className="text-[11px] text-theme-text-muted">Elapsed</span>
          </div>

          <div className="bg-theme-bg p-4 rounded-xl border border-theme-border">
            <span className="text-xs text-theme-text-muted font-medium">Rating</span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
              {result.stars}/3
            </div>
            <span className="text-[11px] text-theme-text-muted">Stars earned</span>
          </div>
        </div>

        {/* Tricky Keys / Error Breakdown */}
        {trickyKeyEntries.length > 0 && (
          <div className="bg-theme-bg/60 border border-theme-border rounded-xl p-4 mb-8 text-left">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-text-muted">
                Keys to Review
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {trickyKeyEntries.map(([char, count]) => {
                const finger = getFingerForChar(char);
                return (
                  <div
                    key={char}
                    className="flex items-center gap-2.5 bg-theme-surface p-2.5 rounded-lg border border-theme-border"
                  >
                    <span className="w-7 h-7 rounded bg-theme-bg border border-theme-border font-mono font-bold text-sm flex items-center justify-center text-theme-incorrect">
                      {char === ' ' ? '␣' : char === '\n' ? '↵' : char === '\t' ? '⇥' : char}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-theme-text truncate">
                        {count} mistake{count > 1 ? 's' : ''}
                      </div>
                      <div className="text-[10px] text-theme-text-muted truncate">
                        {finger.fingerLabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-theme-border bg-theme-bg hover:bg-theme-surface hover:border-theme-text-muted/40 font-semibold text-sm text-theme-text flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={onBackToCurriculum}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-theme-border bg-theme-bg hover:bg-theme-surface hover:border-theme-text-muted/40 font-semibold text-sm text-theme-text flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            All Lessons
          </button>

          {hasNextLesson && (
            <button
              onClick={onNextLesson}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-black font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-theme-primary/20 transition-all"
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
