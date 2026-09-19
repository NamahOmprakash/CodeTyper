import React, { useEffect, useState } from 'react';
import { AppView, Language, Lesson, LessonResult } from './types';
import { pythonLessons } from './data/curriculum/python';
import { cppLessons } from './data/curriculum/cpp';
import { useTheme } from './hooks/useTheme';
import { useAudio } from './hooks/useAudio';
import { useProgress } from './hooks/useProgress';
import { useFullscreen } from './hooks/useFullscreen';
import { useCustomCode } from './hooks/useCustomCode';
import { Header } from './components/Header';
import { LessonList } from './components/LessonList';
import { TypingView } from './components/TypingView';
import { ResultsScreen } from './components/ResultsScreen';
import { CustomCodeView } from './components/CustomCodeView';
import { MobileDashboard } from './components/MobileDashboard';

export function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [currentView, setCurrentView] = useState<AppView>('lesson-list');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(pythonLessons[0]);
  const [lastResult, setLastResult] = useState<LessonResult | null>(null);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Dynamic mobile viewport detection
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });
  const [hasDismissedMobileNotice, setHasDismissedMobileNotice] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileViewport(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { isDark, toggleTheme } = useTheme();
  const { isMuted, toggleMute, playClick, playError } = useAudio();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const progressHook = useProgress();
  const customCodeHook = useCustomCode();

  const lessons = selectedLanguage === 'python' ? pythonLessons : cppLessons;

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    setCurrentView('lesson-list');
    setSelectedLesson(lang === 'python' ? pythonLessons[0] : cppLessons[0]);
    setIsFocusMode(false);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('typing');
  };

  const handleSelectCustomSnippet = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedLanguage(lesson.language);
    setCurrentView('typing');
  };

  const handleLessonComplete = (result: LessonResult) => {
    if (result.lessonId.startsWith('custom-') || result.lessonId.startsWith('tree-')) {
      customCodeHook.updateSnippetStats(result.lessonId, result.wpm, result.accuracy, result.stars);
    } else {
      progressHook.saveLessonResult(result);
    }
    setLastResult(result);
    setIsFocusMode(false);
    setCurrentView('results');
  };

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      setSelectedLesson(nextLesson);
      setCurrentView('typing');
    } else {
      setCurrentView('lesson-list');
    }
  };

  const handleRetry = () => {
    setCurrentView('typing');
  };

  const handleBackToCurriculum = () => {
    setIsFocusMode(false);
    setCurrentView('lesson-list');
  };

  const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
  const hasNextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1;

  // Show mobile dashboard automatically on mobile screens unless user explicitly dismissed notice
  const shouldShowMobileDashboard = isMobileViewport && !hasDismissedMobileNotice && currentView !== 'typing';

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col font-sans transition-colors duration-200 overflow-x-hidden">
      {/* Header is hidden during Focus Mode */}
      {(!isFocusMode || currentView !== 'typing') && (
        <Header
          currentView={currentView}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleSelectLanguage}
          onNavigateHome={handleBackToCurriculum}
          onNavigateCustomCode={() => {
            setIsFocusMode(false);
            setHasDismissedMobileNotice(true);
            setCurrentView('custom-code');
          }}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      )}

      {/* Main View Area */}
      <main className={`flex-1 ${isFocusMode && currentView === 'typing' ? 'p-2 sm:p-4' : 'pb-8 sm:pb-12'}`}>
        {shouldShowMobileDashboard ? (
          <MobileDashboard
            progressHook={progressHook}
            customCodeHook={customCodeHook}
            pythonLessons={pythonLessons}
            cppLessons={cppLessons}
            onBackToDesktop={() => setHasDismissedMobileNotice(true)}
          />
        ) : (
          <>
            {currentView === 'lesson-list' && (
              <LessonList
                language={selectedLanguage}
                lessons={lessons}
                onSelectLesson={handleSelectLesson}
                progressHook={progressHook}
              />
            )}

            {currentView === 'custom-code' && (
              <CustomCodeView
                customCodeHook={customCodeHook}
                onSelectSnippetForTyping={handleSelectCustomSnippet}
                onBackToCurriculum={handleBackToCurriculum}
              />
            )}

            {currentView === 'typing' && (
              <TypingView
                key={selectedLesson.id}
                lesson={selectedLesson}
                onComplete={handleLessonComplete}
                onBackToLessons={handleBackToCurriculum}
                playClick={playClick}
                playError={playError}
                isFocusMode={isFocusMode}
                onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
              />
            )}

            {currentView === 'results' && lastResult && (
              <ResultsScreen
                lesson={selectedLesson}
                result={lastResult}
                hasNextLesson={hasNextLesson}
                onNextLesson={handleNextLesson}
                onRetry={handleRetry}
                onBackToCurriculum={handleBackToCurriculum}
              />
            )}
          </>
        )}
      </main>

      {/* Footer is hidden in Focus Mode */}
      {(!isFocusMode || currentView !== 'typing') && (
        <footer className="border-t border-theme-border/60 py-3 sm:py-4 px-4 text-center text-[11px] sm:text-xs text-theme-text-muted select-none">
          <p>
            CodeTyper — Building coding muscle memory and programming fluency one key at a time.
          </p>
        </footer>
      )}
    </div>
  );
}

export default App;
