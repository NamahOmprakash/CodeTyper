import React from 'react';
import {
  Code2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  BookOpen,
  Maximize,
  Minimize,
  FileCode2,
} from 'lucide-react';
import { AppView, Language } from '../types';

interface HeaderProps {
  currentView: AppView;
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onNavigateHome: () => void;
  onNavigateCustomCode: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedLanguage,
  onSelectLanguage,
  onNavigateHome,
  onNavigateCustomCode,
  isDark,
  onToggleTheme,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="border-b border-theme-border bg-theme-surface/90 backdrop-blur sticky top-0 z-30 px-3 sm:px-8 py-2 sm:py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Top / Main Row: Brand & Quick Settings */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          {/* Brand Logo & Title */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-left group hover:opacity-90 transition-opacity"
            title="Return to Curriculum"
          >
            <div className="w-8 h-8 rounded-lg bg-theme-primary/15 border border-theme-primary/30 flex items-center justify-center text-theme-primary shadow-sm group-hover:scale-105 transition-transform">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono font-bold text-base leading-tight tracking-tight flex items-center gap-1">
                <span>Key</span>
                <span className="text-theme-primary">Script</span>
              </div>
            </div>
          </button>

          {/* Quick Icons on Mobile (Audio, Theme, Fullscreen) */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-bg transition-colors"
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              aria-label="Toggle sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-theme-incorrect" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-bg transition-colors"
              title={isDark ? 'Switch to Daylight' : 'Switch to Midnight'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Navigation & Language Selector */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Language Selector (Pill Switcher) */}
          <div className="flex items-center bg-theme-bg p-0.5 rounded-lg border border-theme-border shadow-inner">
            <button
              type="button"
              onClick={() => onSelectLanguage('python')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                selectedLanguage === 'python'
                  ? 'bg-theme-primary text-black shadow-sm font-bold'
                  : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
              Python
            </button>
            <button
              type="button"
              onClick={() => onSelectLanguage('cpp')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                selectedLanguage === 'cpp'
                  ? 'bg-theme-primary text-black shadow-sm font-bold'
                  : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block"></span>
              C++
            </button>
          </div>

          {/* Desktop Right Nav Links */}
          <div className="flex items-center gap-1">
            {/* Lessons */}
            <button
              onClick={onNavigateHome}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors border ${
                currentView === 'lesson-list'
                  ? 'bg-theme-bg text-theme-primary border-theme-border font-semibold'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface border-transparent'
              }`}
              title="View lessons"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lessons</span>
            </button>

            {/* Custom Code */}
            <button
              onClick={onNavigateCustomCode}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors border ${
                currentView === 'custom-code'
                  ? 'bg-theme-bg text-theme-primary border-theme-border font-semibold'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface border-transparent'
              }`}
              title="Custom Code & Uploads"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Custom</span>
            </button>

            {/* Desktop-only toggles */}
            <div className="hidden sm:flex items-center gap-1 border-l border-theme-border/60 pl-1.5 ml-1">
              <button
                onClick={onToggleMute}
                className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-surface transition-colors"
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-theme-incorrect" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onToggleTheme}
                className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-surface transition-colors"
                title={isDark ? 'Switch to Daylight' : 'Switch to Midnight'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              <button
                onClick={onToggleFullscreen}
                className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-surface transition-colors"
                title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4 text-theme-primary" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
