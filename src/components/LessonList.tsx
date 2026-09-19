import React from 'react';
import { Star, ChevronRight, CheckCircle2, Play, Zap, Target } from 'lucide-react';
import { Language, Lesson } from '../types';
import { useProgress } from '../hooks/useProgress';

interface LessonListProps {
  language: Language;
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
  progressHook: ReturnType<typeof useProgress>;
}

export const LessonList: React.FC<LessonListProps> = ({
  language,
  lessons,
  onSelectLesson,
  progressHook,
}) => {
  const { getLessonStats, getLanguageSummary } = progressHook;
  const summary = getLanguageSummary(language, lessons.length);

  // Find the first uncompleted lesson or default to first
  const nextLessonIndex = lessons.findIndex(
    (l) => !getLessonStats(language, l.id)
  );
  const activeIndex = nextLessonIndex >= 0 ? nextLessonIndex : 0;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Curriculum Banner / Summary */}
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-theme-primary">
                Curriculum Track
              </span>
              <span className="text-xs text-theme-text-muted">•</span>
              <span className="text-[10px] sm:text-xs text-theme-text-muted font-medium">
                {language === 'python' ? 'Python from Scratch' : 'C++ Fundamentals'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold font-mono tracking-tight text-theme-text">
              {language === 'python' ? 'Python Code Typing' : 'C++ Code Typing'}
            </h1>
          </div>

          {/* Quick Metrics - Grid on mobile so it never overflows */}
          <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-4 bg-theme-bg/60 border border-theme-border/60 p-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-1" title="Total Stars Earned">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
              <div className="font-semibold text-theme-text text-xs sm:text-sm">
                {summary.totalStars}
                <span className="text-[10px] text-theme-text-muted font-normal">/{summary.maxStars}</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-4 bg-theme-border" />

            <div className="flex flex-col sm:flex-row items-center gap-1" title="Average Typing Speed">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-theme-primary" />
              <div className="font-semibold text-theme-text text-xs sm:text-sm">
                {summary.avgWpm} <span className="text-[10px] text-theme-text-muted font-normal">WPM</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-4 bg-theme-border" />

            <div className="flex flex-col sm:flex-row items-center gap-1" title="Lessons Completed">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <div className="font-semibold text-theme-text text-xs sm:text-sm">
                {summary.completedCount}
                <span className="text-[10px] text-theme-text-muted font-normal">/{summary.totalLessons}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[11px] text-theme-text-muted mb-1.5 font-medium">
            <span>Overall Progress</span>
            <span>{summary.percentComplete}% Complete</span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-theme-bg rounded-full overflow-hidden border border-theme-border">
            <div
              className="h-full bg-gradient-to-r from-theme-primary to-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${summary.percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lesson List Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-theme-text-muted">
          Linear Lesson Path
        </h2>
        <span className="text-[11px] text-theme-text-muted hidden sm:inline">
          Click any lesson to begin practice
        </span>
      </div>

      {/* Linear Lessons Column */}
      <div className="space-y-2.5 sm:space-y-3">
        {lessons.map((lesson, idx) => {
          const stats = getLessonStats(language, lesson.id);
          const isCompleted = !!stats;
          const isCurrentTarget = idx === activeIndex && !isCompleted;
          const stars = stats ? stats.stars : 0;

          return (
            <div
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-5 rounded-xl border transition-all duration-150 cursor-pointer ${
                isCurrentTarget
                  ? 'bg-theme-surface border-theme-primary/60 shadow-md shadow-theme-primary/5 hover:border-theme-primary'
                  : isCompleted
                  ? 'bg-theme-surface/70 border-theme-border hover:border-theme-border/80 hover:bg-theme-surface'
                  : 'bg-theme-surface/40 border-theme-border/60 hover:border-theme-border hover:bg-theme-surface/80'
              }`}
            >
              {/* Left Side: Number, Title, Description, Key tags */}
              <div className="flex items-start gap-3 mb-2.5 sm:mb-0">
                {/* Lesson number badge */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs sm:text-sm shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : isCurrentTarget
                      ? 'bg-theme-primary/20 border border-theme-primary text-theme-primary'
                      : 'bg-theme-bg border border-theme-border text-theme-text-muted'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  ) : (
                    `#${lesson.number}`
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm sm:text-base text-theme-text group-hover:text-theme-primary transition-colors truncate">
                      {lesson.title}
                    </h3>
                    {isCurrentTarget && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-theme-primary/20 text-theme-primary border border-theme-primary/30">
                        Up Next
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-theme-text-muted mt-0.5 line-clamp-1">
                    {lesson.description}
                  </p>

                  {/* Key Focus Tags */}
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-theme-text-muted/80">Focus:</span>
                    {lesson.keyFocus.map((k, i) => (
                      <span
                        key={i}
                        className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-theme-bg border border-theme-border/70 text-theme-text-muted"
                      >
                        {k === '\t' ? 'Tab' : k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Stars & Best Stats & Launch */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-theme-border/40">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        starIdx <= stars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-theme-border fill-transparent'
                      }`}
                    />
                  ))}
                </div>

                {/* Best Stats */}
                {stats ? (
                  <div className="text-right font-mono text-xs">
                    <div className="font-semibold text-theme-text">
                      {stats.bestWpm} <span className="text-theme-text-muted font-normal text-[10px]">WPM</span>
                    </div>
                    <div className="text-[10px] text-theme-text-muted">
                      {stats.bestAccuracy}% Acc
                    </div>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-theme-bg border border-theme-border text-theme-text group-hover:border-theme-primary/40 transition-colors">
                      <Play className="w-3 h-3 text-theme-primary fill-theme-primary" />
                      Start
                    </span>
                  </div>
                )}

                <ChevronRight className="w-4 h-4 text-theme-text-muted group-hover:text-theme-primary group-hover:translate-x-0.5 transition-all hidden sm:block" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
