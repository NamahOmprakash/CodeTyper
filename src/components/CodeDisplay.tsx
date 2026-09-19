import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Play,
  Loader2,
  GitBranch,
  ChevronRight,
} from 'lucide-react';
import { TypingChar } from '../types';
import { tokenizeCode, getVSCodeTokenStyle } from '../utils/codeTokenizer';

interface CodeDisplayProps {
  chars: TypingChar[];
  currentIndex: number;
  currentLine: number;
  language?: 'python' | 'cpp';
  title?: string;
  onRunCode?: () => void;
  isRunningCode?: boolean;
  onFocusContainer: () => void;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  chars,
  currentIndex,
  currentLine,
  language = 'python',
  title,
  onRunCode,
  isRunningCode,
  onFocusContainer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<'vscode' | 'onecompiler'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('codetyper-editor-view');
      if (saved === 'vscode' || saved === 'onecompiler') {
        return saved;
      }
    }
    return 'vscode';
  });

  const handleToggleView = (mode: 'vscode' | 'onecompiler') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('codetyper-editor-view', mode);
    }
  };

  // Auto-scroll active line into view smoothly
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentLine]);

  // Tokenize the code according to Python or C++ grammar
  const rawCode = useMemo(() => chars.map((c) => c.char).join(''), [chars]);
  const tokenTypes = useMemo(() => tokenizeCode(rawCode, language), [rawCode, language]);

  // Group characters by lines for gutter & code rendering
  const lines: { lineNumber: number; chars: { char: TypingChar; index: number }[] }[] = [];
  let currentLineChars: { char: TypingChar; index: number }[] = [];
  let lineCounter = 1;

  chars.forEach((c, idx) => {
    currentLineChars.push({ char: c, index: idx });
    if (c.char === '\n') {
      lines.push({
        lineNumber: lineCounter,
        chars: currentLineChars,
      });
      lineCounter++;
      currentLineChars = [];
    }
  });

  if (currentLineChars.length > 0) {
    lines.push({
      lineNumber: lineCounter,
      chars: currentLineChars,
    });
  }

  const activeLineObj = lines.find((l) => l.lineNumber === currentLine);
  const lineStartIndex = activeLineObj && activeLineObj.chars.length > 0 ? activeLineObj.chars[0].index : 0;
  const currentCol = Math.max(1, currentIndex - lineStartIndex + 1);

  // Active error count for status bar
  const errorCharsCount = useMemo(() => {
    return chars.filter((c) => c.status === 'incorrect').length;
  }, [chars]);

  const fileName = language === 'python' ? 'main.py' : 'main.cpp';

  return (
    <div
      onClick={onFocusContainer}
      tabIndex={0}
      className="w-full rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#1e1e1e] flex flex-col focus:outline-none focus:ring-1 focus:ring-amber-400/40 select-none transition-all"
    >
      {/* ================= HEADER: VS CODE vs ONECOMPILER ================= */}
      {viewMode === 'vscode' ? (
        /* VS Code Header */
        <div className="bg-[#181818] border-b border-[#2b2b2b] flex flex-col">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-zinc-400">
            {/* macOS Window Controls + Tab */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0 pr-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>

              {/* Active Tab */}
              <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] border-t-2 border-[#007acc] text-zinc-200 rounded-t font-mono text-xs shadow-sm">
                {language === 'python' ? (
                  <span className="text-yellow-400 text-xs font-bold">🐍</span>
                ) : (
                  <span className="text-blue-400 text-xs font-bold">⚡</span>
                )}
                <span className="font-semibold">{fileName}</span>
                <span className="text-zinc-500 hover:text-zinc-300 text-[10px] ml-1">✕</span>
              </div>
            </div>

            {/* View Mode Switcher + Run Shortcut */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleView('vscode');
                  }}
                  className={`px-2 py-0.5 rounded ${
                    viewMode === 'vscode'
                      ? 'bg-[#007acc] text-white font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="VS Code Dark+ View"
                >
                  VS Code
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleView('onecompiler');
                  }}
                  className="px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200"
                  title="OneCompiler View"
                >
                  OneCompiler
                </button>
              </div>

              {onRunCode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunCode();
                  }}
                  disabled={isRunningCode}
                  className="px-2.5 py-1 rounded bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 text-xs font-mono font-medium flex items-center gap-1 transition-colors"
                  title="Run code (Cmd+Enter or Ctrl+Enter)"
                >
                  {isRunningCode ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3 fill-current" />
                  )}
                  <span className="hidden sm:inline">Run</span>
                  <span className="text-[10px] opacity-70 hidden md:inline">⌘⏎</span>
                </button>
              )}
            </div>
          </div>

          {/* Breadcrumb Bar */}
          <div className="px-4 py-1 bg-[#1e1e1e]/60 border-t border-b border-[#2b2b2b] text-[11px] font-mono text-zinc-500 flex items-center gap-1">
            <span>src</span>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-zinc-300">{fileName}</span>
            {title && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span className="text-zinc-500 truncate max-w-[200px]">{title}</span>
              </>
            )}
          </div>
        </div>
      ) : (
        /* OneCompiler Header */
        <div className="bg-[#0b0e14] border-b border-[#1c2433] px-3 py-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 font-bold text-white tracking-tight">
              <span className="text-blue-400">&lt;/&gt;</span>
              <span>OneCompiler</span>
            </div>

            {/* Tab */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#151b26] text-zinc-200 rounded border border-white/10 text-xs">
              <span>{language === 'python' ? '🐍' : '⚙️'}</span>
              <span>{fileName}</span>
              <span className="text-zinc-500 text-[10px]">✕</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              AI
            </div>
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">
              {language === 'python' ? 'Python' : 'C++'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleView('vscode');
                }}
                className="px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200"
              >
                VS Code
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleView('onecompiler');
                }}
                className="px-2 py-0.5 rounded bg-pink-600 text-white font-bold"
              >
                OneCompiler
              </button>
            </div>

            {onRunCode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRunCode();
                }}
                disabled={isRunningCode}
                className="px-3 py-1 rounded-md bg-[#e11d48] text-white hover:bg-[#f43f5e] text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                title="Run code (Cmd+Enter or Ctrl+Enter)"
              >
                {isRunningCode ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Play className="w-3 h-3 fill-current" />
                )}
                <span>Run</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= CODE TYPING CANVAS ================= */}
      <div
        ref={containerRef}
        className={`w-full p-4 sm:p-5 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto overflow-y-auto min-h-[260px] sm:min-h-[290px] max-h-[440px] cursor-text relative transition-colors ${
          viewMode === 'vscode' ? 'bg-[#1e1e1e]' : 'bg-[#0f141c]'
        }`}
      >
        <div className="flex flex-col min-w-full">
          {lines.map((line) => {
            const isCurrentLine = line.lineNumber === currentLine;

            return (
              <div
                key={line.lineNumber}
                ref={isCurrentLine ? activeLineRef : null}
                className={`flex items-baseline py-0.5 rounded px-2 -mx-2 transition-colors duration-100 ${
                  isCurrentLine
                    ? viewMode === 'vscode'
                      ? 'bg-white/[0.04] border-l-2 border-amber-400'
                      : 'bg-white/[0.03] border-l-2 border-blue-400'
                    : 'border-l-2 border-transparent'
                }`}
              >
                {/* Line Gutter */}
                <div
                  className={`w-8 shrink-0 text-right pr-4 text-xs select-none font-mono transition-colors ${
                    isCurrentLine
                      ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                      : 'text-zinc-600'
                  }`}
                >
                  {line.lineNumber}
                </div>

                {/* Line Characters with Syntax Token Differentiation */}
                <div className="flex items-center flex-wrap whitespace-pre">
                  {line.chars.map(({ char, index }, charIdxInLine) => {
                    const isCurrent = index === currentIndex;
                    const tokenType = tokenTypes[index] || 'default';
                    const tokenStyle = getVSCodeTokenStyle(tokenType, char.status);

                    // Render Tab character as a unique, prominent button
                    if (char.char === '\t') {
                      // If previous character in this line was already a tab, skip duplicate button
                      const prevCharInLine = charIdxInLine > 0 ? line.chars[charIdxInLine - 1] : null;
                      if (prevCharInLine && prevCharInLine.char.char === '\t') {
                        return null;
                      }

                      // Count total consecutive tabs in this indent block
                      let tabCount = 1;
                      while (
                        charIdxInLine + tabCount < line.chars.length &&
                        line.chars[charIdxInLine + tabCount].char.char === '\t'
                      ) {
                        tabCount++;
                      }

                      const isAnyTabCurrent = currentIndex >= index && currentIndex < index + tabCount;

                      return (
                        <span
                          key={index}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mx-1 font-mono text-xs font-bold rounded-lg border shadow-sm select-none transition-all duration-150 ${
                            char.status === 'correct'
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                              : char.status === 'incorrect'
                              ? 'bg-red-500/20 border-red-500/50 text-red-400'
                              : isAnyTabCurrent
                              ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 scale-105 shadow-md shadow-amber-400/20 animate-pulse'
                              : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {isAnyTabCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          )}
                          <kbd className="text-[10px] px-1 py-0.5 rounded bg-black/40 border border-white/10 font-mono">
                            ⇥
                          </kbd>
                          <span>TAB{tabCount > 1 ? ` ×${tabCount}` : ''}</span>
                        </span>
                      );
                    }

                    // Render Newline character
                    if (char.char === '\n') {
                      return (
                        <span
                          key={index}
                          className={`inline-block relative text-xs font-mono ml-1 px-1 rounded transition-colors ${
                            isCurrent
                              ? 'bg-amber-400/20 text-amber-400 font-bold animate-pulse'
                              : char.status === 'incorrect'
                              ? 'bg-red-500/20 text-red-400'
                              : 'text-zinc-600'
                          }`}
                        >
                          {isCurrent && (
                            <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-amber-400 animate-pulse" />
                          )}
                          ↵
                        </span>
                      );
                    }

                    // Render standard character with syntax coloring
                    const isTyped = char.status === 'correct';
                    const isError = char.status === 'incorrect';

                    return (
                      <span key={index} className="relative inline-block">
                        {/* Caret */}
                        {isCurrent && (
                          <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-amber-400 caret-pulse z-10 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                        )}

                        {/* Character glyph */}
                        <span
                          style={{
                            color: isError ? '#f44747' : tokenStyle.color,
                            opacity: isError ? 1.0 : isTyped ? 1.0 : tokenStyle.opacity ?? 0.65,
                            fontWeight: isError ? '700' : isTyped ? '600' : tokenStyle.fontWeight || '400',
                            backgroundColor: isError ? 'rgba(244, 71, 71, 0.25)' : 'transparent',
                            borderBottom: isError ? '2px solid #f44747' : 'none',
                            textShadow: isTyped && !isError ? `0 0 6px ${tokenStyle.color}40` : 'none',
                          }}
                          className={`transition-all duration-75 ${
                            isError ? 'rounded-sm px-0.5' : ''
                          }`}
                        >
                          {char.status === 'incorrect' && char.userTyped
                            ? char.userTyped === ' '
                              ? '␣'
                              : char.userTyped
                            : char.char}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= FOOTER: VS CODE / ONECOMPILER STATUS BAR ================= */}
      <div
        className={`px-3 py-0.5 text-[11px] font-mono border-t border-[#2b2b2b] flex items-center justify-between select-none ${
          viewMode === 'vscode'
            ? 'bg-[#007acc] text-white'
            : 'bg-[#0b0e14] text-zinc-400 border-[#1c2433]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-semibold">
            <GitBranch className="w-3 h-3" />
            <span>main*</span>
          </div>
          <div className={`hidden sm:inline ${errorCharsCount > 0 ? 'text-amber-200 font-bold' : ''}`}>
            {errorCharsCount} {errorCharsCount === 1 ? 'error' : 'errors'}
          </div>
          <div className="flex items-center gap-1 font-medium">
            <span>{language === 'python' ? 'Python 3.11' : 'C++ 20'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span>
            Ln {currentLine}, Col {currentCol}
          </span>
          <span className="hidden sm:inline">Tab Size: 4</span>
          <span className="hidden md:inline">UTF-8</span>
          <span className="font-semibold px-1.5 py-0.5 rounded bg-black/20">
            {viewMode === 'vscode' ? 'VS Code Dark+' : 'OneCompiler'}
          </span>
        </div>
      </div>
    </div>
  );
};

