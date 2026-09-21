import React, { useMemo } from 'react';
import { cn } from '../lib/utils';

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyMapEntry {
  finger: FingerId;
  keyCode: string;
  hand: 'left' | 'right';
  requiresShift: boolean;
  shiftKeyCode?: 'ShiftLeft' | 'ShiftRight';
  shiftFinger?: FingerId;
}

export interface KeycapDef {
  code: string;
  primary: string;
  shift?: string;
  finger: FingerId;
  width?: string;
  display?: string;
}

export interface KeyboardGuideProps {
  targetChar?: string;
  pressedKey?: string;
  className?: string;
}

// Comprehensive mapping of all standard characters and tokens to target finger and Shift requirements
export const FINGER_KEY_MAP: Record<string, KeyMapEntry> = {
  // Left Pinky
  '`': { finger: 'left-pinky', keyCode: 'Backquote', hand: 'left', requiresShift: false },
  '~': { finger: 'left-pinky', keyCode: 'Backquote', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  '1': { finger: 'left-pinky', keyCode: 'Digit1', hand: 'left', requiresShift: false },
  '!': { finger: 'left-pinky', keyCode: 'Digit1', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'q': { finger: 'left-pinky', keyCode: 'KeyQ', hand: 'left', requiresShift: false },
  'Q': { finger: 'left-pinky', keyCode: 'KeyQ', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'a': { finger: 'left-pinky', keyCode: 'KeyA', hand: 'left', requiresShift: false },
  'A': { finger: 'left-pinky', keyCode: 'KeyA', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'z': { finger: 'left-pinky', keyCode: 'KeyZ', hand: 'left', requiresShift: false },
  'Z': { finger: 'left-pinky', keyCode: 'KeyZ', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  '\t': { finger: 'left-pinky', keyCode: 'Tab', hand: 'left', requiresShift: false },
  'Tab': { finger: 'left-pinky', keyCode: 'Tab', hand: 'left', requiresShift: false },

  // Left Ring
  '2': { finger: 'left-ring', keyCode: 'Digit2', hand: 'left', requiresShift: false },
  '@': { finger: 'left-ring', keyCode: 'Digit2', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'w': { finger: 'left-ring', keyCode: 'KeyW', hand: 'left', requiresShift: false },
  'W': { finger: 'left-ring', keyCode: 'KeyW', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  's': { finger: 'left-ring', keyCode: 'KeyS', hand: 'left', requiresShift: false },
  'S': { finger: 'left-ring', keyCode: 'KeyS', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'x': { finger: 'left-ring', keyCode: 'KeyX', hand: 'left', requiresShift: false },
  'X': { finger: 'left-ring', keyCode: 'KeyX', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },

  // Left Middle
  '3': { finger: 'left-middle', keyCode: 'Digit3', hand: 'left', requiresShift: false },
  '#': { finger: 'left-middle', keyCode: 'Digit3', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'e': { finger: 'left-middle', keyCode: 'KeyE', hand: 'left', requiresShift: false },
  'E': { finger: 'left-middle', keyCode: 'KeyE', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'd': { finger: 'left-middle', keyCode: 'KeyD', hand: 'left', requiresShift: false },
  'D': { finger: 'left-middle', keyCode: 'KeyD', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'c': { finger: 'left-middle', keyCode: 'KeyC', hand: 'left', requiresShift: false },
  'C': { finger: 'left-middle', keyCode: 'KeyC', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },

  // Left Index
  '4': { finger: 'left-index', keyCode: 'Digit4', hand: 'left', requiresShift: false },
  '$': { finger: 'left-index', keyCode: 'Digit4', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  '5': { finger: 'left-index', keyCode: 'Digit5', hand: 'left', requiresShift: false },
  '%': { finger: 'left-index', keyCode: 'Digit5', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'r': { finger: 'left-index', keyCode: 'KeyR', hand: 'left', requiresShift: false },
  'R': { finger: 'left-index', keyCode: 'KeyR', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  't': { finger: 'left-index', keyCode: 'KeyT', hand: 'left', requiresShift: false },
  'T': { finger: 'left-index', keyCode: 'KeyT', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'f': { finger: 'left-index', keyCode: 'KeyF', hand: 'left', requiresShift: false },
  'F': { finger: 'left-index', keyCode: 'KeyF', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'g': { finger: 'left-index', keyCode: 'KeyG', hand: 'left', requiresShift: false },
  'G': { finger: 'left-index', keyCode: 'KeyG', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'v': { finger: 'left-index', keyCode: 'KeyV', hand: 'left', requiresShift: false },
  'V': { finger: 'left-index', keyCode: 'KeyV', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },
  'b': { finger: 'left-index', keyCode: 'KeyB', hand: 'left', requiresShift: false },
  'B': { finger: 'left-index', keyCode: 'KeyB', hand: 'left', requiresShift: true, shiftKeyCode: 'ShiftRight', shiftFinger: 'right-pinky' },

  // Thumb (Spacebar)
  ' ': { finger: 'thumb', keyCode: 'Space', hand: 'left', requiresShift: false },
  'Space': { finger: 'thumb', keyCode: 'Space', hand: 'left', requiresShift: false },

  // Right Index
  '6': { finger: 'right-index', keyCode: 'Digit6', hand: 'right', requiresShift: false },
  '^': { finger: 'right-index', keyCode: 'Digit6', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  '7': { finger: 'right-index', keyCode: 'Digit7', hand: 'right', requiresShift: false },
  '&': { finger: 'right-index', keyCode: 'Digit7', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'y': { finger: 'right-index', keyCode: 'KeyY', hand: 'right', requiresShift: false },
  'Y': { finger: 'right-index', keyCode: 'KeyY', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'u': { finger: 'right-index', keyCode: 'KeyU', hand: 'right', requiresShift: false },
  'U': { finger: 'right-index', keyCode: 'KeyU', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'h': { finger: 'right-index', keyCode: 'KeyH', hand: 'right', requiresShift: false },
  'H': { finger: 'right-index', keyCode: 'KeyH', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'j': { finger: 'right-index', keyCode: 'KeyJ', hand: 'right', requiresShift: false },
  'J': { finger: 'right-index', keyCode: 'KeyJ', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'n': { finger: 'right-index', keyCode: 'KeyN', hand: 'right', requiresShift: false },
  'N': { finger: 'right-index', keyCode: 'KeyN', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'm': { finger: 'right-index', keyCode: 'KeyM', hand: 'right', requiresShift: false },
  'M': { finger: 'right-index', keyCode: 'KeyM', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },

  // Right Middle
  '8': { finger: 'right-middle', keyCode: 'Digit8', hand: 'right', requiresShift: false },
  '*': { finger: 'right-middle', keyCode: 'Digit8', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'i': { finger: 'right-middle', keyCode: 'KeyI', hand: 'right', requiresShift: false },
  'I': { finger: 'right-middle', keyCode: 'KeyI', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'k': { finger: 'right-middle', keyCode: 'KeyK', hand: 'right', requiresShift: false },
  'K': { finger: 'right-middle', keyCode: 'KeyK', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  ',': { finger: 'right-middle', keyCode: 'Comma', hand: 'right', requiresShift: false },
  '<': { finger: 'right-middle', keyCode: 'Comma', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },

  // Right Ring
  '9': { finger: 'right-ring', keyCode: 'Digit9', hand: 'right', requiresShift: false },
  '(': { finger: 'right-ring', keyCode: 'Digit9', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'o': { finger: 'right-ring', keyCode: 'KeyO', hand: 'right', requiresShift: false },
  'O': { finger: 'right-ring', keyCode: 'KeyO', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'l': { finger: 'right-ring', keyCode: 'KeyL', hand: 'right', requiresShift: false },
  'L': { finger: 'right-ring', keyCode: 'KeyL', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  '.': { finger: 'right-ring', keyCode: 'Period', hand: 'right', requiresShift: false },
  '>': { finger: 'right-ring', keyCode: 'Period', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },

  // Right Pinky
  '0': { finger: 'right-pinky', keyCode: 'Digit0', hand: 'right', requiresShift: false },
  ')': { finger: 'right-pinky', keyCode: 'Digit0', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  '-': { finger: 'right-pinky', keyCode: 'Minus', hand: 'right', requiresShift: false },
  '_': { finger: 'right-pinky', keyCode: 'Minus', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  '=': { finger: 'right-pinky', keyCode: 'Equal', hand: 'right', requiresShift: false },
  '+': { finger: 'right-pinky', keyCode: 'Equal', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  'p': { finger: 'right-pinky', keyCode: 'KeyP', hand: 'right', requiresShift: false },
  'P': { finger: 'right-pinky', keyCode: 'KeyP', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  '[': { finger: 'right-pinky', keyCode: 'BracketLeft', hand: 'right', requiresShift: false },
  '{': { finger: 'right-pinky', keyCode: 'BracketLeft', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  ']': { finger: 'right-pinky', keyCode: 'BracketRight', hand: 'right', requiresShift: false },
  '}': { finger: 'right-pinky', keyCode: 'BracketRight', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  '\\': { finger: 'right-pinky', keyCode: 'Backslash', hand: 'right', requiresShift: false },
  '|': { finger: 'right-pinky', keyCode: 'Backslash', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  ';': { finger: 'right-pinky', keyCode: 'Semicolon', hand: 'right', requiresShift: false },
  ':': { finger: 'right-pinky', keyCode: 'Semicolon', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  "'": { finger: 'right-pinky', keyCode: 'Quote', hand: 'right', requiresShift: false },
  '"': { finger: 'right-pinky', keyCode: 'Quote', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  '/': { finger: 'right-pinky', keyCode: 'Slash', hand: 'right', requiresShift: false },
  '?': { finger: 'right-pinky', keyCode: 'Slash', hand: 'right', requiresShift: true, shiftKeyCode: 'ShiftLeft', shiftFinger: 'left-pinky' },
  '\n': { finger: 'right-pinky', keyCode: 'Enter', hand: 'right', requiresShift: false },
  'Enter': { finger: 'right-pinky', keyCode: 'Enter', hand: 'right', requiresShift: false },
  'Backspace': { finger: 'right-pinky', keyCode: 'Backspace', hand: 'right', requiresShift: false },
};

// Standard ANSI QWERTY 5-Row Layout
export const ANSI_KEYBOARD_ROWS: KeycapDef[][] = [
  // Row 1 (Number Row)
  [
    { code: 'Backquote', primary: '`', shift: '~', finger: 'left-pinky' },
    { code: 'Digit1', primary: '1', shift: '!', finger: 'left-pinky' },
    { code: 'Digit2', primary: '2', shift: '@', finger: 'left-ring' },
    { code: 'Digit3', primary: '3', shift: '#', finger: 'left-middle' },
    { code: 'Digit4', primary: '4', shift: '$', finger: 'left-index' },
    { code: 'Digit5', primary: '5', shift: '%', finger: 'left-index' },
    { code: 'Digit6', primary: '6', shift: '^', finger: 'right-index' },
    { code: 'Digit7', primary: '7', shift: '&', finger: 'right-index' },
    { code: 'Digit8', primary: '8', shift: '*', finger: 'right-middle' },
    { code: 'Digit9', primary: '9', shift: '(', finger: 'right-ring' },
    { code: 'Digit0', primary: '0', shift: ')', finger: 'right-pinky' },
    { code: 'Minus', primary: '-', shift: '_', finger: 'right-pinky' },
    { code: 'Equal', primary: '=', shift: '+', finger: 'right-pinky' },
    { code: 'Backspace', primary: 'Backspace', display: '⌫', finger: 'right-pinky', width: 'w-14 sm:w-16 flex-grow' },
  ],
  // Row 2 (Tab / QWERTY)
  [
    { code: 'Tab', primary: 'Tab', display: 'Tab', finger: 'left-pinky', width: 'w-12 sm:w-14' },
    { code: 'KeyQ', primary: 'q', shift: 'Q', finger: 'left-pinky' },
    { code: 'KeyW', primary: 'w', shift: 'W', finger: 'left-ring' },
    { code: 'KeyE', primary: 'e', shift: 'E', finger: 'left-middle' },
    { code: 'KeyR', primary: 'r', shift: 'R', finger: 'left-index' },
    { code: 'KeyT', primary: 't', shift: 'T', finger: 'left-index' },
    { code: 'KeyY', primary: 'y', shift: 'Y', finger: 'right-index' },
    { code: 'KeyU', primary: 'u', shift: 'U', finger: 'right-index' },
    { code: 'KeyI', primary: 'i', shift: 'I', finger: 'right-middle' },
    { code: 'KeyO', primary: 'o', shift: 'O', finger: 'right-ring' },
    { code: 'KeyP', primary: 'p', shift: 'P', finger: 'right-pinky' },
    { code: 'BracketLeft', primary: '[', shift: '{', finger: 'right-pinky' },
    { code: 'BracketRight', primary: ']', shift: '}', finger: 'right-pinky' },
    { code: 'Backslash', primary: '\\', shift: '|', finger: 'right-pinky', width: 'w-10 sm:w-12' },
  ],
  // Row 3 (Home Row)
  [
    { code: 'CapsLock', primary: 'Caps', display: 'Caps', finger: 'left-pinky', width: 'w-14 sm:w-16' },
    { code: 'KeyA', primary: 'a', shift: 'A', finger: 'left-pinky' },
    { code: 'KeyS', primary: 's', shift: 'S', finger: 'left-ring' },
    { code: 'KeyD', primary: 'd', shift: 'D', finger: 'left-middle' },
    { code: 'KeyF', primary: 'f', shift: 'F', finger: 'left-index' },
    { code: 'KeyG', primary: 'g', shift: 'G', finger: 'left-index' },
    { code: 'KeyH', primary: 'h', shift: 'H', finger: 'right-index' },
    { code: 'KeyJ', primary: 'j', shift: 'J', finger: 'right-index' },
    { code: 'KeyK', primary: 'k', shift: 'K', finger: 'right-middle' },
    { code: 'KeyL', primary: 'l', shift: 'L', finger: 'right-ring' },
    { code: 'Semicolon', primary: ';', shift: ':', finger: 'right-pinky' },
    { code: 'Quote', primary: "'", shift: '"', finger: 'right-pinky' },
    { code: 'Enter', primary: 'Enter', display: '↵ Return', finger: 'right-pinky', width: 'w-16 sm:w-20 flex-grow' },
  ],
  // Row 4 (Bottom Row)
  [
    { code: 'ShiftLeft', primary: 'Shift', display: '⇧ Shift', finger: 'left-pinky', width: 'w-16 sm:w-20' },
    { code: 'KeyZ', primary: 'z', shift: 'Z', finger: 'left-pinky' },
    { code: 'KeyX', primary: 'x', shift: 'X', finger: 'left-ring' },
    { code: 'KeyC', primary: 'c', shift: 'C', finger: 'left-middle' },
    { code: 'KeyV', primary: 'v', shift: 'V', finger: 'left-index' },
    { code: 'KeyB', primary: 'b', shift: 'B', finger: 'left-index' },
    { code: 'KeyN', primary: 'n', shift: 'N', finger: 'right-index' },
    { code: 'KeyM', primary: 'm', shift: 'M', finger: 'right-middle' },
    { code: 'Comma', primary: ',', shift: '<', finger: 'right-middle' },
    { code: 'Period', primary: '.', shift: '>', finger: 'right-ring' },
    { code: 'Slash', primary: '/', shift: '?', finger: 'right-pinky' },
    { code: 'ShiftRight', primary: 'Shift', display: '⇧ Shift', finger: 'right-pinky', width: 'w-20 sm:w-24 flex-grow' },
  ],
  // Row 5 (Space Row)
  [
    { code: 'ControlLeft', primary: 'Ctrl', finger: 'left-pinky', width: 'w-12' },
    { code: 'AltLeft', primary: 'Alt', display: '⌥', finger: 'thumb', width: 'w-10' },
    { code: 'MetaLeft', primary: 'Cmd', display: '⌘', finger: 'thumb', width: 'w-12' },
    { code: 'Space', primary: ' ', display: '␣ Space', finger: 'thumb', width: 'flex-1 min-w-[140px] max-w-xl' },
    { code: 'MetaRight', primary: 'Cmd', display: '⌘', finger: 'thumb', width: 'w-12' },
    { code: 'AltRight', primary: 'Alt', display: '⌥', finger: 'thumb', width: 'w-10' },
    { code: 'ControlRight', primary: 'Ctrl', finger: 'right-pinky', width: 'w-12' },
  ],
];

// Finger coordinates in Hand Vector SVG
interface FingertipCoord {
  id: FingerId;
  label: string;
  cx: number;
  cy: number;
  homeKey: string;
}

const LEFT_FINGERTIPS: FingertipCoord[] = [
  { id: 'left-pinky', label: 'L. Pinky', cx: 28, cy: 68, homeKey: 'A' },
  { id: 'left-ring', label: 'L. Ring', cx: 58, cy: 38, homeKey: 'S' },
  { id: 'left-middle', label: 'L. Middle', cx: 92, cy: 24, homeKey: 'D' },
  { id: 'left-index', label: 'L. Index', cx: 126, cy: 40, homeKey: 'F' },
  { id: 'thumb', label: 'Thumb', cx: 162, cy: 110, homeKey: '␣' },
];

const RIGHT_FINGERTIPS: FingertipCoord[] = [
  { id: 'thumb', label: 'Thumb', cx: 78, cy: 110, homeKey: '␣' },
  { id: 'right-index', label: 'R. Index', cx: 114, cy: 40, homeKey: 'J' },
  { id: 'right-middle', label: 'R. Middle', cx: 148, cy: 24, homeKey: 'K' },
  { id: 'right-ring', label: 'R. Ring', cx: 182, cy: 38, homeKey: 'L' },
  { id: 'right-pinky', label: 'R. Pinky', cx: 212, cy: 68, homeKey: ';' },
];

export const KeyboardGuide: React.FC<KeyboardGuideProps> = ({
  targetChar = '',
  pressedKey = '',
  className,
}) => {
  // Resolve key target info
  const activeInfo = useMemo(() => {
    if (!targetChar) return null;
    return FINGER_KEY_MAP[targetChar] || null;
  }, [targetChar]);

  const activeFinger = activeInfo?.finger;
  const targetKeyCode = activeInfo?.keyCode;
  const requiresShift = activeInfo?.requiresShift ?? false;
  const shiftKeyCode = activeInfo?.shiftKeyCode;
  const shiftFinger = activeInfo?.shiftFinger;

  return (
    <div
      className={cn(
        'w-full max-w-4xl mx-auto flex flex-col items-center select-none bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl backdrop-blur-md transition-all',
        className
      )}
    >
      {/* Top Status Banner */}
      <div className="w-full flex items-center justify-between gap-3 mb-3 px-1 text-xs sm:text-sm font-mono border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-sans text-xs">Target:</span>
          {targetChar ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-sm shadow-sm shadow-emerald-950">
              {targetChar === ' '
                ? '␣ Space'
                : targetChar === '\n'
                ? '↵ Enter'
                : targetChar === '\t'
                ? '⇥ Tab'
                : targetChar}
            </span>
          ) : (
            <span className="text-slate-500 italic font-sans text-xs">Awaiting input</span>
          )}
        </div>

        {/* Dynamic Finger Instructions */}
        <div className="flex items-center gap-2 text-xs">
          {activeFinger && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse" />
              <span className="capitalize font-semibold text-emerald-300">
                {activeFinger.replace('-', ' ')}
              </span>
            </div>
          )}

          {requiresShift && shiftFinger && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/50 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80 animate-pulse" />
              <span className="font-semibold capitalize">
                Hold {shiftKeyCode === 'ShiftLeft' ? 'Left' : 'Right'} Shift ({shiftFinger.replace('-', ' ')})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Virtual ANSI QWERTY Keyboard */}
      <div className="w-full flex flex-col gap-1 sm:gap-1.5 bg-slate-950/60 p-2 sm:p-3 rounded-xl border border-slate-800/80 shadow-inner">
        {ANSI_KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center items-center gap-1 sm:gap-1.5 w-full">
            {row.map((key) => {
              const isTarget = targetKeyCode === key.code;
              const isShiftActive = requiresShift && shiftKeyCode === key.code;
              const isPressed = pressedKey === key.code;

              return (
                <div
                  key={key.code}
                  className={cn(
                    'relative h-8 sm:h-11 rounded-lg flex flex-col items-center justify-center transition-all duration-150 font-mono text-[10px] sm:text-xs border shadow-sm select-none',
                    key.width || 'w-7 sm:w-10',
                    // Home row tactile bumps
                    (key.code === 'KeyF' || key.code === 'KeyJ') && 'after:content-[""] after:w-2.5 after:h-0.5 after:bg-slate-500/60 after:absolute after:bottom-1 after:rounded-full',
                    // Keycap State
                    isPressed
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-300 shadow-lg shadow-emerald-500/40 scale-95'
                      : isTarget
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_12px_rgba(16,185,129,0.45)] ring-1 ring-emerald-400/60'
                      : isShiftActive
                      ? 'bg-amber-950/70 border-amber-400 text-amber-200 font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)] ring-1 ring-amber-400/60 animate-pulse'
                      : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  )}
                >
                  {/* Shift Symbol (top) */}
                  {key.shift && (
                    <span
                      className={cn(
                        'text-[8px] sm:text-[10px] leading-tight font-medium',
                        isTarget && requiresShift ? 'text-emerald-300 font-bold' : 'text-slate-500'
                      )}
                    >
                      {key.shift}
                    </span>
                  )}

                  {/* Primary Symbol (bottom or centered) */}
                  <span
                    className={cn(
                      'leading-tight',
                      !key.shift && 'text-[10px] sm:text-xs',
                      isTarget && !requiresShift ? 'text-emerald-300 font-bold' : ''
                    )}
                  >
                    {key.display || key.primary}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hands & Fingers Overlay SVG */}
      <div className="w-full mt-4 flex items-center justify-center">
        <svg
          viewBox="0 0 540 180"
          className="w-full max-w-xl h-auto overflow-visible select-none drop-shadow-lg"
        >
          <defs>
            {/* Soft gradients for hand outlines */}
            <linearGradient id="handGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="handGradientRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.15" />
            </linearGradient>

            {/* Glowing filter for active fingertips */}
            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* LEFT HAND */}
          <g id="left-hand" transform="translate(15, 10)">
            {/* Hand & Palm Outline in Home Row Posture */}
            <path
              d="M 18,175 
                 C 10,145 12,95 24,70 
                 C 26,62 33,62 35,70 
                 C 38,85 46,65 54,40 
                 C 56,32 63,32 65,40 
                 C 72,70 78,50 88,26 
                 C 91,18 99,18 102,26 
                 C 109,55 116,65 122,42 
                 C 125,34 132,34 135,42 
                 C 142,75 146,95 154,112 
                 C 158,120 166,118 168,112 
                 C 174,96 168,85 178,110 
                 C 190,140 180,165 160,175 Z"
              fill="url(#handGradientLeft)"
              stroke="#475569"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Left Hand Fingertip Indicator Nodes */}
            {LEFT_FINGERTIPS.map((f) => {
              const isActive = activeFinger === f.id;
              const isShift = shiftFinger === f.id && !isActive;

              return (
                <g key={f.id} transform={`translate(${f.cx}, ${f.cy})`}>
                  {/* Subtle Home-key anchor label */}
                  <text
                    x="0"
                    y="18"
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-slate-500"
                  >
                    {f.homeKey}
                  </text>

                  {/* Pulsing Ripple Rings */}
                  {isActive && (
                    <circle
                      r="12"
                      className="fill-emerald-400/25 animate-ping"
                    />
                  )}
                  {isShift && (
                    <circle
                      r="12"
                      className="fill-amber-400/25 animate-ping"
                    />
                  )}

                  {/* Fingertip Center Node */}
                  <circle
                    r={isActive || isShift ? '7.5' : '5'}
                    className={cn(
                      'transition-all duration-150',
                      isActive
                        ? 'fill-emerald-400 stroke-emerald-200 stroke-2'
                        : isShift
                        ? 'fill-amber-400 stroke-amber-200 stroke-2'
                        : 'fill-slate-700/80 stroke-slate-500/80 stroke-1'
                    )}
                    filter={isActive || isShift ? 'url(#glowFilter)' : undefined}
                  />

                  {/* Inner dot */}
                  {(isActive || isShift) && (
                    <circle r="2.5" fill="#ffffff" />
                  )}
                </g>
              );
            })}

            <text
              x="95"
              y="165"
              textAnchor="middle"
              className="text-[10px] font-mono tracking-wider font-semibold fill-slate-500 uppercase"
            >
              Left Hand (ASDF)
            </text>
          </g>

          {/* Central Divider / Home-Row Split Indicator */}
          <line
            x1="270"
            y1="25"
            x2="270"
            y2="165"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* RIGHT HAND */}
          <g id="right-hand" transform="translate(285, 10)">
            {/* Hand & Palm Outline in Home Row Posture */}
            <path
              d="M 222,175 
                 C 230,145 228,95 216,70 
                 C 214,62 207,62 205,70 
                 C 202,85 194,65 186,40 
                 C 184,32 177,32 175,40 
                 C 168,70 162,50 152,26 
                 C 149,18 141,18 138,26 
                 C 131,55 124,65 118,42 
                 C 115,34 108,34 105,42 
                 C 98,75 94,95 86,112 
                 C 82,120 74,118 72,112 
                 C 66,96 72,85 62,110 
                 C 50,140 60,165 80,175 Z"
              fill="url(#handGradientRight)"
              stroke="#475569"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Right Hand Fingertip Indicator Nodes */}
            {RIGHT_FINGERTIPS.map((f) => {
              const isActive = activeFinger === f.id;
              const isShift = shiftFinger === f.id && !isActive;

              return (
                <g key={f.id} transform={`translate(${f.cx}, ${f.cy})`}>
                  {/* Subtle Home-key anchor label */}
                  <text
                    x="0"
                    y="18"
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-slate-500"
                  >
                    {f.homeKey}
                  </text>

                  {/* Pulsing Ripple Rings */}
                  {isActive && (
                    <circle
                      r="12"
                      className="fill-emerald-400/25 animate-ping"
                    />
                  )}
                  {isShift && (
                    <circle
                      r="12"
                      className="fill-amber-400/25 animate-ping"
                    />
                  )}

                  {/* Fingertip Center Node */}
                  <circle
                    r={isActive || isShift ? '7.5' : '5'}
                    className={cn(
                      'transition-all duration-150',
                      isActive
                        ? 'fill-emerald-400 stroke-emerald-200 stroke-2'
                        : isShift
                        ? 'fill-amber-400 stroke-amber-200 stroke-2'
                        : 'fill-slate-700/80 stroke-slate-500/80 stroke-1'
                    )}
                    filter={isActive || isShift ? 'url(#glowFilter)' : undefined}
                  />

                  {/* Inner dot */}
                  {(isActive || isShift) && (
                    <circle r="2.5" fill="#ffffff" />
                  )}
                </g>
              );
            })}

            <text
              x="145"
              y="165"
              textAnchor="middle"
              className="text-[10px] font-mono tracking-wider font-semibold fill-slate-500 uppercase"
            >
              Right Hand (JKL;)
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default KeyboardGuide;
