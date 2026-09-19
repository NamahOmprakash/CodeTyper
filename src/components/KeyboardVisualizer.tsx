import React, { useState } from 'react';
import {
  KEYBOARD_ROWS,
  getFingerForChar,
  getKeyHighlightInfo,
  VirtualKey,
} from '../data/fingerMap';
import { ChevronDown, ChevronUp, Keyboard, AlertCircle } from 'lucide-react';
import { MistakeInfo } from '../types';
import { HandDiagram } from './HandDiagram';

interface KeyboardVisualizerProps {
  currentExpectedChar: string;
  lastMistake?: MistakeInfo | null;
  focusKeys?: string[];
}

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  currentExpectedChar,
  lastMistake,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fingerInfo = getFingerForChar(currentExpectedChar);
  const { activeKeyCode, shiftKeyCode } = getKeyHighlightInfo(currentExpectedChar);

  const isShiftMissed = lastMistake?.type === 'shift_missed';
  const isWrongKey = lastMistake?.type === 'wrong_key';

  return (
    <div className="bg-theme-surface border border-theme-border rounded-xl p-2 sm:p-3 shadow-sm transition-all duration-200">
      {/* Header with next key instruction, hand diagram & collapse toggle */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            className="flex items-center gap-1.5 text-xs font-semibold text-theme-text-muted"
            title="Visual guidance for touch-typing hand placement. You can type freely with any finger."
          >
            <Keyboard className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Finger Guide:</span>
          </div>

          {currentExpectedChar ? (
            isShiftMissed ? (
              /* Yellow warning: Missed shift */
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400 text-xs text-amber-300 shadow-sm animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-bold">Hold Shift!</span>
                <span className="text-amber-200/90 hidden sm:inline">
                  Target is <span className="font-mono font-bold text-amber-300">"{currentExpectedChar}"</span> ({fingerInfo.fingerLabel})
                </span>
              </div>
            ) : isWrongKey ? (
              /* Red warning: Wrong key */
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500 text-xs text-red-300 shadow-sm">
                <span className="font-bold">Typo!</span>
                <span className="text-red-200/90">
                  Press <span className="font-mono font-bold text-emerald-400">"{currentExpectedChar === '\n' ? 'Enter' : currentExpectedChar === '\t' ? 'Tab' : currentExpectedChar}"</span> (green key)
                </span>
              </div>
            ) : (
              /* Standard Green Target Guide */
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-theme-bg border border-theme-border text-xs">
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {currentExpectedChar === ' '
                    ? '␣ (Space)'
                    : currentExpectedChar === '\n'
                    ? '↵ (Enter)'
                    : currentExpectedChar === '\t'
                    ? '⇥ (Tab)'
                    : currentExpectedChar}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <span className="text-theme-text font-medium">{fingerInfo.fingerLabel}</span>
              </div>
            )
          ) : (
            <span className="text-xs text-theme-text-muted">Lesson Complete!</span>
          )}

          {/* Touch-Typing Visual Hands */}
          {currentExpectedChar && (
            <HandDiagram
              activeFinger={fingerInfo.finger}
              shiftFinger={fingerInfo.shiftFinger}
              className="hidden md:flex"
            />
          )}
        </div>

        {/* Semantic Color Legend & Collapse Button */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-theme-text-muted select-none">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Target</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Shift</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Error</span>
            </span>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-theme-bg text-theme-text-muted hover:text-theme-text transition-colors"
            title={isCollapsed ? 'Show Keyboard' : 'Hide Keyboard'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Keyboard Grid - STRICTLY Green, Yellow, and Red only */}
      {!isCollapsed && (
        <div className="flex flex-col gap-1 max-w-4xl mx-auto select-none pt-0.5">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1 w-full">
              {row.map((key: VirtualKey) => {
                const isTargetKey = key.code === activeKeyCode;
                const isShiftKey = key.code === shiftKeyCode;
                const isLetter = key.code.startsWith('Key');

                // Check if this key was the mistake key
                const isThisKeyWrong =
                  isWrongKey &&
                  (key.code === lastMistake?.keyCode ||
                    key.char === lastMistake?.typedChar ||
                    key.shiftChar === lastMistake?.typedChar);

                // Determine active status:
                // Yellow = Shift missed on target or shift key
                // Green = Target key to press
                // Red = The key pressed in error
                let colorClasses = 'bg-theme-bg/90 border border-theme-border/70 text-theme-text hover:border-theme-border';

                if (isThisKeyWrong) {
                  // RED: Mistaken key
                  colorClasses = 'bg-red-500/25 border-2 border-red-500 text-red-200 ring-2 ring-red-500/40 shadow-lg shadow-red-500/20 scale-105 z-20 font-bold';
                } else if ((isTargetKey || isShiftKey) && isShiftMissed) {
                  // YELLOW: Shift missed or small mistake
                  colorClasses = 'bg-amber-500/25 border-2 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 shadow-lg shadow-amber-400/25 scale-105 z-10 font-bold animate-pulse';
                } else if (isTargetKey || isShiftKey) {
                  // GREEN: Target key to press
                  colorClasses = 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-400/25 scale-105 z-10 font-bold';
                }

                return (
                  <div
                    key={key.code}
                    className={`h-8 sm:h-9 flex flex-col items-center justify-center rounded-md font-mono transition-all duration-100 relative ${
                      key.width ? key.width : 'flex-1 min-w-[28px] max-w-[50px]'
                    } ${colorClasses}`}
                  >
                    {/* Letter keys: single clean uppercase letter */}
                    {isLetter ? (
                      <span
                        className={`text-xs sm:text-sm font-semibold tracking-wide ${
                          isTargetKey || isShiftKey || isThisKeyWrong ? 'scale-110 font-bold' : ''
                        }`}
                      >
                        {key.shiftChar || key.char.toUpperCase()}
                      </span>
                    ) : key.shiftChar ? (
                      /* Number & Punctuation keys with shiftChar */
                      <div className="flex flex-col items-center leading-tight select-none">
                        <span
                          className={`text-[10px] ${
                            isTargetKey && currentExpectedChar === key.shiftChar
                              ? 'font-bold scale-110 text-emerald-300'
                              : 'text-theme-text-muted/70'
                          }`}
                        >
                          {key.shiftChar}
                        </span>
                        <span
                          className={`text-[11px] font-medium ${
                            isTargetKey && currentExpectedChar === key.char
                              ? 'font-bold scale-110 text-emerald-300'
                              : 'text-theme-text'
                          }`}
                        >
                          {key.char}
                        </span>
                      </div>
                    ) : (
                      /* Keys without shiftChar: Space, Tab, Enter, Shift, etc. */
                      <span className="text-[11px] sm:text-xs font-medium select-none">
                        {key.char}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
