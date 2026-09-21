import React, { useMemo } from 'react';
import { cn } from '../lib/utils';
import { MistakeInfo } from '../types';

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb-left'
  | 'thumb-right'
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

export interface KeyDef {
  code: string;
  primary: string;
  shift?: string;
  finger: FingerId;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  display?: string;
  isHomeKey?: boolean;
}

export interface KeyboardGuideProps {
  targetChar?: string;
  pressedKey?: string;
  lastMistake?: MistakeInfo | null;
  className?: string;
}

// -------------------------------------------------------------
// Exact ANSI QWERTY Layout Coordinates in a 840 x 430 SVG Plane
// -------------------------------------------------------------
export const ANSI_KEYS: KeyDef[] = [
  // Row 0 (Number Row) y = 24, h = 42
  { code: 'Backquote', primary: '`', shift: '~', finger: 'left-pinky', x: 32, y: 24, w: 46, h: 42, cx: 55, cy: 45 },
  { code: 'Digit1', primary: '1', shift: '!', finger: 'left-pinky', x: 82, y: 24, w: 46, h: 42, cx: 105, cy: 45 },
  { code: 'Digit2', primary: '2', shift: '@', finger: 'left-ring', x: 132, y: 24, w: 46, h: 42, cx: 155, cy: 45 },
  { code: 'Digit3', primary: '3', shift: '#', finger: 'left-middle', x: 182, y: 24, w: 46, h: 42, cx: 205, cy: 45 },
  { code: 'Digit4', primary: '4', shift: '$', finger: 'left-index', x: 232, y: 24, w: 46, h: 42, cx: 255, cy: 45 },
  { code: 'Digit5', primary: '5', shift: '%', finger: 'left-index', x: 282, y: 24, w: 46, h: 42, cx: 305, cy: 45 },
  { code: 'Digit6', primary: '6', shift: '^', finger: 'right-index', x: 332, y: 24, w: 46, h: 42, cx: 355, cy: 45 },
  { code: 'Digit7', primary: '7', shift: '&', finger: 'right-index', x: 382, y: 24, w: 46, h: 42, cx: 405, cy: 45 },
  { code: 'Digit8', primary: '8', shift: '*', finger: 'right-middle', x: 432, y: 24, w: 46, h: 42, cx: 455, cy: 45 },
  { code: 'Digit9', primary: '9', shift: '(', finger: 'right-ring', x: 482, y: 24, w: 46, h: 42, cx: 505, cy: 45 },
  { code: 'Digit0', primary: '0', shift: ')', finger: 'right-pinky', x: 532, y: 24, w: 46, h: 42, cx: 555, cy: 45 },
  { code: 'Minus', primary: '-', shift: '_', finger: 'right-pinky', x: 582, y: 24, w: 46, h: 42, cx: 605, cy: 45 },
  { code: 'Equal', primary: '=', shift: '+', finger: 'right-pinky', x: 632, y: 24, w: 46, h: 42, cx: 655, cy: 45 },
  { code: 'Backspace', primary: 'Backspace', display: '⌫', finger: 'right-pinky', x: 682, y: 24, w: 126, h: 42, cx: 745, cy: 45 },

  // Row 1 (QWERTY Row) y = 72, h = 42
  { code: 'Tab', primary: 'Tab', display: 'Tab', finger: 'left-pinky', x: 32, y: 72, w: 72, h: 42, cx: 68, cy: 93 },
  { code: 'KeyQ', primary: 'q', shift: 'Q', finger: 'left-pinky', x: 108, y: 72, w: 46, h: 42, cx: 131, cy: 93 },
  { code: 'KeyW', primary: 'w', shift: 'W', finger: 'left-ring', x: 158, y: 72, w: 46, h: 42, cx: 181, cy: 93 },
  { code: 'KeyE', primary: 'e', shift: 'E', finger: 'left-middle', x: 208, y: 72, w: 46, h: 42, cx: 231, cy: 93 },
  { code: 'KeyR', primary: 'r', shift: 'R', finger: 'left-index', x: 258, y: 72, w: 46, h: 42, cx: 281, cy: 93 },
  { code: 'KeyT', primary: 't', shift: 'T', finger: 'left-index', x: 308, y: 72, w: 46, h: 42, cx: 331, cy: 93 },
  { code: 'KeyY', primary: 'y', shift: 'Y', finger: 'right-index', x: 358, y: 72, w: 46, h: 42, cx: 381, cy: 93 },
  { code: 'KeyU', primary: 'u', shift: 'U', finger: 'right-index', x: 408, y: 72, w: 46, h: 42, cx: 431, cy: 93 },
  { code: 'KeyI', primary: 'i', shift: 'I', finger: 'right-middle', x: 458, y: 72, w: 46, h: 42, cx: 481, cy: 93 },
  { code: 'KeyO', primary: 'o', shift: 'O', finger: 'right-ring', x: 508, y: 72, w: 46, h: 42, cx: 531, cy: 93 },
  { code: 'KeyP', primary: 'p', shift: 'P', finger: 'right-pinky', x: 558, y: 72, w: 46, h: 42, cx: 581, cy: 93 },
  { code: 'BracketLeft', primary: '[', shift: '{', finger: 'right-pinky', x: 608, y: 72, w: 46, h: 42, cx: 631, cy: 93 },
  { code: 'BracketRight', primary: ']', shift: '}', finger: 'right-pinky', x: 658, y: 72, w: 46, h: 42, cx: 681, cy: 93 },
  { code: 'Backslash', primary: '\\', shift: '|', finger: 'right-pinky', x: 708, y: 72, w: 100, h: 42, cx: 758, cy: 93 },

  // Row 2 (Home Row) y = 120, h = 42
  { code: 'CapsLock', primary: 'Caps', display: 'Caps', finger: 'left-pinky', x: 32, y: 120, w: 84, h: 42, cx: 74, cy: 141 },
  { code: 'KeyA', primary: 'a', shift: 'A', finger: 'left-pinky', isHomeKey: true, x: 120, y: 120, w: 46, h: 42, cx: 143, cy: 141 },
  { code: 'KeyS', primary: 's', shift: 'S', finger: 'left-ring', isHomeKey: true, x: 170, y: 120, w: 46, h: 42, cx: 193, cy: 141 },
  { code: 'KeyD', primary: 'd', shift: 'D', finger: 'left-middle', isHomeKey: true, x: 220, y: 120, w: 46, h: 42, cx: 243, cy: 141 },
  { code: 'KeyF', primary: 'f', shift: 'F', finger: 'left-index', isHomeKey: true, x: 270, y: 120, w: 46, h: 42, cx: 293, cy: 141 },
  { code: 'KeyG', primary: 'g', shift: 'G', finger: 'left-index', x: 320, y: 120, w: 46, h: 42, cx: 343, cy: 141 },
  { code: 'KeyH', primary: 'h', shift: 'H', finger: 'right-index', x: 370, y: 120, w: 46, h: 42, cx: 393, cy: 141 },
  { code: 'KeyJ', primary: 'j', shift: 'J', finger: 'right-index', isHomeKey: true, x: 420, y: 120, w: 46, h: 42, cx: 443, cy: 141 },
  { code: 'KeyK', primary: 'k', shift: 'K', finger: 'right-middle', isHomeKey: true, x: 470, y: 120, w: 46, h: 42, cx: 493, cy: 141 },
  { code: 'KeyL', primary: 'l', shift: 'L', finger: 'right-ring', isHomeKey: true, x: 520, y: 120, w: 46, h: 42, cx: 543, cy: 141 },
  { code: 'Semicolon', primary: ';', shift: ':', finger: 'right-pinky', isHomeKey: true, x: 570, y: 120, w: 46, h: 42, cx: 593, cy: 141 },
  { code: 'Quote', primary: "'", shift: '"', finger: 'right-pinky', x: 620, y: 120, w: 46, h: 42, cx: 643, cy: 141 },
  { code: 'Enter', primary: 'Enter', display: '↵ Return', finger: 'right-pinky', x: 670, y: 120, w: 138, h: 42, cx: 739, cy: 141 },

  // Row 3 (Bottom Row) y = 168, h = 42
  { code: 'ShiftLeft', primary: 'Shift', display: '⇧ Shift', finger: 'left-pinky', x: 32, y: 168, w: 108, h: 42, cx: 86, cy: 189 },
  { code: 'KeyZ', primary: 'z', shift: 'Z', finger: 'left-pinky', x: 144, y: 168, w: 46, h: 42, cx: 167, cy: 189 },
  { code: 'KeyX', primary: 'x', shift: 'X', finger: 'left-ring', x: 194, y: 168, w: 46, h: 42, cx: 217, cy: 189 },
  { code: 'KeyC', primary: 'c', shift: 'C', finger: 'left-middle', x: 244, y: 168, w: 46, h: 42, cx: 267, cy: 189 },
  { code: 'KeyV', primary: 'v', shift: 'V', finger: 'left-index', x: 294, y: 168, w: 46, h: 42, cx: 317, cy: 189 },
  { code: 'KeyB', primary: 'b', shift: 'B', finger: 'left-index', x: 344, y: 168, w: 46, h: 42, cx: 367, cy: 189 },
  { code: 'KeyN', primary: 'n', shift: 'N', finger: 'right-index', x: 394, y: 168, w: 46, h: 42, cx: 417, cy: 189 },
  { code: 'KeyM', primary: 'm', shift: 'M', finger: 'right-middle', x: 444, y: 168, w: 46, h: 42, cx: 467, cy: 189 },
  { code: 'Comma', primary: ',', shift: '<', finger: 'right-middle', x: 494, y: 168, w: 46, h: 42, cx: 517, cy: 189 },
  { code: 'Period', primary: '.', shift: '>', finger: 'right-ring', x: 544, y: 168, w: 46, h: 42, cx: 567, cy: 189 },
  { code: 'Slash', primary: '/', shift: '?', finger: 'right-pinky', x: 594, y: 168, w: 46, h: 42, cx: 617, cy: 189 },
  { code: 'ShiftRight', primary: 'Shift', display: '⇧ Shift', finger: 'right-pinky', x: 644, y: 168, w: 164, h: 42, cx: 726, cy: 189 },

  // Row 4 (Space Row) y = 216, h = 42
  { code: 'ControlLeft', primary: 'Ctrl', finger: 'left-pinky', x: 32, y: 216, w: 60, h: 42, cx: 62, cy: 237 },
  { code: 'AltLeft', primary: 'Alt', display: '⌥', finger: 'thumb-left', x: 96, y: 216, w: 54, h: 42, cx: 123, cy: 237 },
  { code: 'MetaLeft', primary: 'Cmd', display: '⌘', finger: 'thumb-left', x: 154, y: 216, w: 64, h: 42, cx: 186, cy: 237 },
  { code: 'Space', primary: ' ', display: '␣ Space', finger: 'thumb-left', x: 222, y: 216, w: 340, h: 42, cx: 392, cy: 237 },
  { code: 'MetaRight', primary: 'Cmd', display: '⌘', finger: 'thumb-right', x: 566, y: 216, w: 64, h: 42, cx: 598, cy: 237 },
  { code: 'AltRight', primary: 'Alt', display: '⌥', finger: 'thumb-right', x: 634, y: 216, w: 54, h: 42, cx: 661, cy: 237 },
  { code: 'ControlRight', primary: 'Ctrl', finger: 'right-pinky', x: 692, y: 216, w: 116, h: 42, cx: 750, cy: 237 },
];

export const KEY_BY_CODE = new Map<string, KeyDef>(ANSI_KEYS.map((k) => [k.code, k]));

// Default resting coordinates on home row keys (neatly centered on keycaps)
export const HOME_RESTING_TIPS: Record<FingerId, { x: number; y: number }> = {
  'left-pinky':  { x: 143, y: 139 }, // KeyA
  'left-ring':   { x: 193, y: 137 }, // KeyS
  'left-middle': { x: 243, y: 135 }, // KeyD
  'left-index':  { x: 293, y: 137 }, // KeyF
  'thumb-left':  { x: 348, y: 235 }, // Space left
  'thumb-right': { x: 442, y: 235 }, // Space right
  'right-index': { x: 443, y: 137 }, // KeyJ
  'right-middle':{ x: 493, y: 135 }, // KeyK
  'right-ring':  { x: 543, y: 137 }, // KeyL
  'right-pinky': { x: 593, y: 139 }, // Semicolon
};

// Mapping of characters to target fingers and modifier requirements
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

  // Spacebar (Thumb)
  ' ': { finger: 'thumb-left', keyCode: 'Space', hand: 'left', requiresShift: false },
  'Space': { finger: 'thumb-left', keyCode: 'Space', hand: 'left', requiresShift: false },

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

// Generates smooth Bezier curve segment between two anatomical anchor points
function getEdgeCurve(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cp1x = x1 + dx * 0.35;
  const cp1y = y1 + dy * 0.35;
  const cp2x = x2 - dx * 0.35;
  const cp2y = y2 - dy * 0.35;
  return `C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}

// Generates slender, compact, elegant Left Hand outline matching media_1789968158671.png
function getLeftHandPath(tips: Record<FingerId, { x: number; y: number }>) {
  const lp = tips['left-pinky'];
  const lr = tips['left-ring'];
  const lm = tips['left-middle'];
  const li = tips['left-index'];
  const lt = tips['thumb-left'];

  const pw = 6.5; // Pinky half-width (13px wide)
  const rw = 7.0; // Ring half-width (14px wide)
  const mw = 7.5; // Middle half-width (15px wide)
  const iw = 7.5; // Index half-width (15px wide)
  const tw = 8.0; // Thumb half-width (16px wide)

  // Slender anatomical valleys between fingers
  const w1 = { x: 168, y: 204 }; // Pinky - Ring
  const w2 = { x: 218, y: 198 }; // Ring - Middle
  const w3 = { x: 268, y: 202 }; // Middle - Index
  const w4 = { x: 308, y: 246 }; // Index - Thumb

  return [
    // Outer wrist (compact 75px wrist at bottom)
    `M 185,430`,
    `C 180,375 168,310 166,255`,
    `C 165,225 156,180 ${lp.x - pw},${lp.y}`,
    // Pinky tip cap
    `A ${pw},${pw} 0 0,1 ${lp.x + pw},${lp.y}`,
    // Pinky inner edge to Web 1
    getEdgeCurve(lp.x + pw, lp.y, w1.x, w1.y),
    // Web 1 to Ring outer edge
    getEdgeCurve(w1.x, w1.y, lr.x - rw, lr.y),
    // Ring tip cap
    `A ${rw},${rw} 0 0,1 ${lr.x + rw},${lr.y}`,
    // Ring inner edge to Web 2
    getEdgeCurve(lr.x + rw, lr.y, w2.x, w2.y),
    // Web 2 to Middle outer edge
    getEdgeCurve(w2.x, w2.y, lm.x - mw, lm.y),
    // Middle tip cap
    `A ${mw},${mw} 0 0,1 ${lm.x + mw},${lm.y}`,
    // Middle inner edge to Web 3
    getEdgeCurve(lm.x + mw, lm.y, w3.x, w3.y),
    // Web 3 to Index outer edge
    getEdgeCurve(w3.x, w3.y, li.x - iw, li.y),
    // Index tip cap
    `A ${iw},${iw} 0 0,1 ${li.x + iw},${li.y}`,
    // Index inner edge to Web 4
    getEdgeCurve(li.x + iw, li.y, w4.x, w4.y),
    // Web 4 to Thumb outer edge
    getEdgeCurve(w4.x, w4.y, lt.x - tw, lt.y),
    // Thumb tip cap
    `A ${tw},${tw} 0 0,1 ${lt.x + tw},${lt.y + 4}`,
    // Thumb inner edge down thenar muscle to inner wrist
    `C ${lt.x + 6},${lt.y + 20} 315,290 285,350`,
    `C 270,380 262,410 260,430`,
    `L 185,430`,
    `Z`,
  ].join(' ');
}

// Generates slender, compact, elegant Right Hand outline matching media_1789968158671.png
function getRightHandPath(tips: Record<FingerId, { x: number; y: number }>) {
  const rp = tips['right-pinky'];
  const rr = tips['right-ring'];
  const rm = tips['right-middle'];
  const ri = tips['right-index'];
  const rt = tips['thumb-right'];

  const pw = 6.5;
  const rw = 7.0;
  const mw = 7.5;
  const iw = 7.5;
  const tw = 8.0;

  // Slender anatomical valleys between fingers
  const w1 = { x: 568, y: 204 }; // Ring - Pinky
  const w2 = { x: 518, y: 198 }; // Middle - Ring
  const w3 = { x: 468, y: 202 }; // Index - Middle
  const w4 = { x: 476, y: 246 }; // Thumb - Index

  return [
    // Outer wrist (compact 75px wrist at bottom)
    `M 655,430`,
    `C 660,375 672,310 674,255`,
    `C 675,225 684,180 ${rp.x + pw},${rp.y}`,
    // Pinky tip cap
    `A ${pw},${pw} 0 0,0 ${rp.x - pw},${rp.y}`,
    // Pinky inner edge to Web 1
    getEdgeCurve(rp.x - pw, rp.y, w1.x, w1.y),
    // Web 1 to Ring outer edge
    getEdgeCurve(w1.x, w1.y, rr.x + rw, rr.y),
    // Ring tip cap
    `A ${rw},${rw} 0 0,0 ${rr.x - rw},${rr.y}`,
    // Ring inner edge to Web 2
    getEdgeCurve(rr.x - rw, rr.y, w2.x, w2.y),
    // Web 2 to Middle outer edge
    getEdgeCurve(w2.x, w2.y, rm.x + mw, rm.y),
    // Middle tip cap
    `A ${mw},${mw} 0 0,0 ${rm.x - mw},${rm.y}`,
    // Middle inner edge to Web 3
    getEdgeCurve(rm.x - mw, rm.y, w3.x, w3.y),
    // Web 3 to Index outer edge
    getEdgeCurve(w3.x, w3.y, ri.x + iw, ri.y),
    // Index tip cap
    `A ${iw},${iw} 0 0,0 ${ri.x - iw},${ri.y}`,
    // Index inner edge to Web 4
    getEdgeCurve(ri.x - iw, ri.y, w4.x, w4.y),
    // Web 4 to Thumb outer edge
    getEdgeCurve(w4.x, w4.y, rt.x + tw, rt.y),
    // Thumb tip cap
    `A ${tw},${tw} 0 0,0 ${rt.x - tw},${rt.y + 4}`,
    // Thumb inner edge down thenar muscle to inner wrist
    `C ${rt.x - 6},${rt.y + 20} 525,290 555,350`,
    `C 570,380 578,410 580,430`,
    `L 655,430`,
    `Z`,
  ].join(' ');
}

// Generates an isolated reaching finger contour for glowing active stroke overlay
function getActiveFingerContour(fingerId: FingerId, tips: Record<FingerId, { x: number; y: number }>): string | null {
  const tip = tips[fingerId];
  if (!tip) return null;

  if (fingerId === 'left-pinky') {
    const pw = 6.5;
    const w1 = { x: 168, y: 204 };
    return `M 166,255 C 165,225 156,180 ${tip.x - pw},${tip.y} A ${pw},${pw} 0 0,1 ${tip.x + pw},${tip.y} ${getEdgeCurve(tip.x + pw, tip.y, w1.x, w1.y)} Z`;
  }
  if (fingerId === 'left-ring') {
    const rw = 7.0;
    const w1 = { x: 168, y: 204 };
    const w2 = { x: 218, y: 198 };
    return `M ${w1.x},${w1.y} ${getEdgeCurve(w1.x, w1.y, tip.x - rw, tip.y)} A ${rw},${rw} 0 0,1 ${tip.x + rw},${tip.y} ${getEdgeCurve(tip.x + rw, tip.y, w2.x, w2.y)} Z`;
  }
  if (fingerId === 'left-middle') {
    const mw = 7.5;
    const w2 = { x: 218, y: 198 };
    const w3 = { x: 268, y: 202 };
    return `M ${w2.x},${w2.y} ${getEdgeCurve(w2.x, w2.y, tip.x - mw, tip.y)} A ${mw},${mw} 0 0,1 ${tip.x + mw},${tip.y} ${getEdgeCurve(tip.x + mw, tip.y, w3.x, w3.y)} Z`;
  }
  if (fingerId === 'left-index') {
    const iw = 7.5;
    const w3 = { x: 268, y: 202 };
    const w4 = { x: 308, y: 246 };
    return `M ${w3.x},${w3.y} ${getEdgeCurve(w3.x, w3.y, tip.x - iw, tip.y)} A ${iw},${iw} 0 0,1 ${tip.x + iw},${tip.y} ${getEdgeCurve(tip.x + iw, tip.y, w4.x, w4.y)} Z`;
  }
  if (fingerId === 'thumb-left') {
    const tw = 8.0;
    const w4 = { x: 308, y: 246 };
    return `M ${w4.x},${w4.y} ${getEdgeCurve(w4.x, w4.y, tip.x - tw, tip.y)} A ${tw},${tw} 0 0,1 ${tip.x + tw},${tip.y + 4} C ${tip.x + 6},${tip.y + 20} 315,290 285,350 Z`;
  }

  if (fingerId === 'right-index') {
    const iw = 7.5;
    const w3 = { x: 468, y: 202 };
    const w4 = { x: 476, y: 246 };
    return `M ${w4.x},${w4.y} ${getEdgeCurve(w4.x, w4.y, tip.x - iw, tip.y)} A ${iw},${iw} 0 0,1 ${tip.x + iw},${tip.y} ${getEdgeCurve(tip.x + iw, tip.y, w3.x, w3.y)} Z`;
  }
  if (fingerId === 'right-middle') {
    const mw = 7.5;
    const w3 = { x: 468, y: 202 };
    const w2 = { x: 518, y: 198 };
    return `M ${w3.x},${w3.y} ${getEdgeCurve(w3.x, w3.y, tip.x - mw, tip.y)} A ${mw},${mw} 0 0,1 ${tip.x + mw},${tip.y} ${getEdgeCurve(tip.x + mw, tip.y, w2.x, w2.y)} Z`;
  }
  if (fingerId === 'right-ring') {
    const rw = 7.0;
    const w2 = { x: 518, y: 198 };
    const w1 = { x: 568, y: 204 };
    return `M ${w2.x},${w2.y} ${getEdgeCurve(w2.x, w2.y, tip.x - rw, tip.y)} A ${rw},${rw} 0 0,1 ${tip.x + rw},${tip.y} ${getEdgeCurve(tip.x + rw, tip.y, w1.x, w1.y)} Z`;
  }
  if (fingerId === 'right-pinky') {
    const pw = 6.5;
    const w1 = { x: 568, y: 204 };
    return `M ${w1.x},${w1.y} ${getEdgeCurve(w1.x, w1.y, tip.x - pw, tip.y)} A ${pw},${pw} 0 0,1 ${tip.x + pw},${tip.y} C 675,225 684,180 674,255 Z`;
  }
  if (fingerId === 'thumb-right') {
    const tw = 8.0;
    const w4 = { x: 476, y: 246 };
    return `M ${w4.x},${w4.y} ${getEdgeCurve(w4.x, w4.y, tip.x + tw, tip.y)} A ${tw},${tw} 0 0,0 ${tip.x - tw},${tip.y + 4} C ${tip.x - 6},${tip.y + 20} 525,290 555,350 Z`;
  }

  return null;
}

export const KeyboardGuide: React.FC<KeyboardGuideProps> = ({
  targetChar = '',
  pressedKey = '',
  lastMistake = null,
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

  // Active target key definition
  const targetKey = useMemo(() => {
    if (!targetKeyCode) return null;
    return KEY_BY_CODE.get(targetKeyCode) || null;
  }, [targetKeyCode]);

  // Shift key definition (when shift required)
  const shiftKey = useMemo(() => {
    if (!requiresShift || !shiftKeyCode) return null;
    return KEY_BY_CODE.get(shiftKeyCode) || null;
  }, [requiresShift, shiftKeyCode]);

  // Detect error key from lastMistake or live wrong keypress
  const errorKey = useMemo(() => {
    const MODIFIER_KEYS = [
      'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
      'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'CapsLock', 'Escape',
    ];
    // From engine's lastMistake
    if (lastMistake?.keyCode) {
      const key = KEY_BY_CODE.get(lastMistake.keyCode);
      if (key) return key;
    }
    if (lastMistake?.typedChar) {
      const mapped = FINGER_KEY_MAP[lastMistake.typedChar];
      if (mapped?.keyCode) {
        const key = KEY_BY_CODE.get(mapped.keyCode);
        if (key) return key;
      }
    }
    // Live: currently pressed key that isn't the target or shift
    if (pressedKey && !MODIFIER_KEYS.includes(pressedKey)) {
      const isTarget = targetKeyCode === pressedKey;
      const isShift = requiresShift && shiftKeyCode === pressedKey;
      if (!isTarget && !isShift) {
        return KEY_BY_CODE.get(pressedKey) || null;
      }
    }
    return null;
  }, [lastMistake, pressedKey, targetKeyCode, requiresShift, shiftKeyCode]);

  // Compute dynamic fingertip positions:
  // Active finger extends directly to target key center (cx, cy)
  // Shift finger extends to shift key center (cx, cy)
  // All other fingers rest peacefully on home row keys
  const dynamicFingertips = useMemo(() => {
    const tips = { ...HOME_RESTING_TIPS };

    if (activeFinger && targetKey) {
      tips[activeFinger] = { x: targetKey.cx, y: targetKey.cy };
    }

    if (requiresShift && shiftFinger && shiftKey) {
      tips[shiftFinger] = { x: shiftKey.cx, y: shiftKey.cy };
    }

    return tips;
  }, [activeFinger, targetKey, requiresShift, shiftFinger, shiftKey]);

  // Hand outlines
  const leftHandPath = useMemo(() => getLeftHandPath(dynamicFingertips), [dynamicFingertips]);
  const rightHandPath = useMemo(() => getRightHandPath(dynamicFingertips), [dynamicFingertips]);

  // Active finger highlight contour
  const activeHighlightPath = useMemo(() => {
    if (!activeFinger) return null;
    return getActiveFingerContour(activeFinger, dynamicFingertips);
  }, [activeFinger, dynamicFingertips]);

  const shiftHighlightPath = useMemo(() => {
    if (!requiresShift || !shiftFinger) return null;
    return getActiveFingerContour(shiftFinger, dynamicFingertips);
  }, [requiresShift, shiftFinger, dynamicFingertips]);

  const errorHighlightPath = useMemo(() => {
    if (!errorKey?.finger || errorKey.finger === activeFinger || errorKey.finger === shiftFinger) return null;
    return getActiveFingerContour(errorKey.finger, dynamicFingertips);
  }, [errorKey, activeFinger, shiftFinger, dynamicFingertips]);

  return (
    <div
      className={cn(
        'w-full max-w-4xl mx-auto flex flex-col items-center select-none bg-slate-900/95 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md transition-all',
        className
      )}
    >
      {/* Top Status Banner matching media_1789968158671.png */}
      <div className="w-full flex items-center justify-between gap-3 mb-2 px-1 text-xs sm:text-sm font-mono border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-sans text-xs">Target:</span>
          {targetChar ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-sm shadow-sm">
              {targetChar === ' '
                ? '␣ Space'
                : targetChar === '\n'
                ? '↵ Enter'
                : targetChar === '\t'
                ? '⇥ Tab'
                : targetChar}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs shadow-sm">
              Home Row
            </span>
          )}

          {/* Red typo alert badge */}
          {errorKey && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/50 text-red-300 font-bold text-xs shadow-sm animate-pulse">
              ❌ Wrong: {lastMistake?.typedChar === ' ' ? 'Space' : (lastMistake?.typedChar || errorKey.display || errorKey.primary)}
            </span>
          )}
        </div>

        {/* Dynamic Position / Finger Instructions */}
        <div className="flex items-center gap-2 text-xs">
          {activeFinger ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400/80 animate-pulse" />
              <span className="capitalize font-semibold text-sky-300">
                {activeFinger
                  .replace('thumb-left', 'Left Thumb')
                  .replace('thumb-right', 'Right Thumb')
                  .replace('-', ' ')}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80" />
              <span className="font-semibold text-slate-300">Position: Home Row Resting</span>
            </div>
          )}

          {requiresShift && shiftFinger && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/50 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80 animate-pulse" />
              <span className="font-semibold capitalize">
                Hold {shiftKeyCode === 'ShiftLeft' ? 'Left' : 'Right'} Shift
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Unified Overlaid Keyboard & Slender Dynamic Hands SVG */}
      <div className="w-full relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/70 shadow-inner">
        <svg
          viewBox="0 0 840 430"
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Subtle gradients for translucent hands */}
            <linearGradient id="handFillLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="handFillRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
            </linearGradient>

            {/* Glowing neon filters */}
            <filter id="keyGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="errorKeyGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="fingerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial gradients for beacon pulse waves */}
            <radialGradient id="beaconGlow">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="shiftBeaconGlow">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="errorBeaconGlow">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ------------------------------------------------------------- */}
          {/* LAYER 1: KEYBOARD CHASSIS & KEYCAPS                           */}
          {/* ------------------------------------------------------------- */}
          <g id="keyboard-chassis">
            {/* Outer keyboard frame */}
            <rect
              x="22"
              y="14"
              width="796"
              height="256"
              rx="14"
              fill="#090d16"
              stroke="#1e293b"
              strokeWidth="1.5"
            />

            {/* Render all Keycaps */}
            {ANSI_KEYS.map((key) => {
              const isTarget = targetKeyCode === key.code;
              const isShiftActive = requiresShift && shiftKeyCode === key.code;
              const isPressed = pressedKey === key.code;
              const isErrorKey = errorKey?.code === key.code;

              let fill = '#111827';
              let stroke = '#1f2937';
              let strokeWidth = 1;
              let textColor = '#e2e8f0';
              let filterAttr: string | undefined = undefined;

              if (isErrorKey) {
                fill = '#991b1b'; // Vibrant RED on wrong key!
                stroke = '#ef4444';
                strokeWidth = 2.5;
                textColor = '#ffffff';
                filterAttr = 'url(#errorKeyGlow)';
              } else if (isPressed) {
                fill = '#0284c7';
                stroke = '#38bdf8';
                strokeWidth = 2;
                textColor = '#ffffff';
              } else if (isTarget) {
                fill = '#0369a1';
                stroke = '#38bdf8';
                strokeWidth = 2;
                textColor = '#ffffff';
                filterAttr = 'url(#keyGlow)';
              } else if (isShiftActive) {
                fill = '#78350f';
                stroke = '#f59e0b';
                strokeWidth = 2;
                textColor = '#fef3c7';
                filterAttr = 'url(#keyGlow)';
              }

              return (
                <g key={key.code} className="transition-all duration-150">
                  {/* Keycap background */}
                  <rect
                    x={key.x}
                    y={key.y}
                    width={key.w}
                    height={key.h}
                    rx="6"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    filter={filterAttr}
                  />

                  {/* Tactile home row bars on F and J */}
                  {key.isHomeKey && (key.code === 'KeyF' || key.code === 'KeyJ') && (
                    <line
                      x1={key.cx - 6}
                      y1={key.y + key.h - 6}
                      x2={key.cx + 6}
                      y2={key.y + key.h - 6}
                      stroke="#64748b"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Secondary Shift Label */}
                  {key.shift && (
                    <text
                      x={key.x + 8}
                      y={key.y + 14}
                      className="text-[10px] font-mono font-medium select-none"
                      fill={isTarget && requiresShift ? '#38bdf8' : '#64748b'}
                    >
                      {key.shift}
                    </text>
                  )}

                  {/* Primary Character Label */}
                  <text
                    x={key.shift ? key.x + 8 : key.cx}
                    y={key.shift ? key.y + 32 : key.cy + 4}
                    textAnchor={key.shift ? 'start' : 'middle'}
                    className={cn(
                      'font-mono select-none',
                      key.display ? 'text-[11px] font-semibold' : 'text-[13px] font-bold'
                    )}
                    fill={textColor}
                  >
                    {key.display || key.primary}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ------------------------------------------------------------- */}
          {/* LAYER 2: HOME ROW CONCENTRIC ANCHORS (from media_1789968158671)*/}
          {/* ------------------------------------------------------------- */}
          <g id="home-row-anchors" pointerEvents="none">
            {[
              { cx: 143, cy: 141 }, // A
              { cx: 193, cy: 141 }, // S
              { cx: 243, cy: 141 }, // D
              { cx: 293, cy: 141 }, // F
              { cx: 443, cy: 141 }, // J
              { cx: 493, cy: 141 }, // K
              { cx: 543, cy: 141 }, // L
              { cx: 593, cy: 141 }, // ;
            ].map(({ cx, cy }, i) => (
              <g key={i} transform={`translate(${cx}, ${cy})`}>
                <circle r="6" stroke="#64748b" strokeWidth="1" fill="none" opacity="0.4" />
                <circle r="11" stroke="#475569" strokeWidth="0.8" fill="none" opacity="0.25" />
              </g>
            ))}
          </g>

          {/* ------------------------------------------------------------- */}
          {/* LAYER 3: RADIAL BEACONS (Target, Shift, Error)                */}
          {/* ------------------------------------------------------------- */}
          {/* Target Key Radial Beacon */}
          {targetKey && (
            <g id="target-beacon" transform={`translate(${targetKey.cx}, ${targetKey.cy})`} pointerEvents="none">
              <circle
                r="36"
                fill="url(#beaconGlow)"
                className="animate-ping opacity-60"
              />
              <circle
                r="22"
                fill="url(#beaconGlow)"
                className="opacity-75"
              />
              <circle
                r="4.5"
                fill="#ffffff"
                className="animate-pulse"
              />
            </g>
          )}

          {/* Shift Key Radial Beacon */}
          {shiftKey && (
            <g id="shift-beacon" transform={`translate(${shiftKey.cx}, ${shiftKey.cy})`} pointerEvents="none">
              <circle
                r="32"
                fill="url(#shiftBeaconGlow)"
                className="animate-ping opacity-60"
              />
              <circle
                r="18"
                fill="url(#shiftBeaconGlow)"
                className="opacity-75"
              />
            </g>
          )}

          {/* Error Key Red Beacon (pulsing ripple on wrong key) */}
          {errorKey && (
            <g id="error-beacon" transform={`translate(${errorKey.cx}, ${errorKey.cy})`} pointerEvents="none">
              <circle
                r="36"
                fill="url(#errorBeaconGlow)"
                className="animate-ping opacity-80"
              />
              <circle
                r="22"
                fill="url(#errorBeaconGlow)"
                className="opacity-90"
              />
              {/* ✕ cross indicator */}
              <line x1="-5" y1="-5" x2="5" y2="5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="5" y1="-5" x2="-5" y2="5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {/* ------------------------------------------------------------- */}
          {/* LAYER 4: SLENDER OVERLAID HANDS (matching media_1789968158671) */}
          {/* ------------------------------------------------------------- */}
          <g id="hands-overlay" className="pointer-events-none select-none">
            {/* Left Hand Silhouette */}
            <path
              d={leftHandPath}
              fill="url(#handFillLeft)"
              stroke="#38bdf8"
              strokeOpacity="0.75"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
            />

            {/* Right Hand Silhouette */}
            <path
              d={rightHandPath}
              fill="url(#handFillRight)"
              stroke="#94a3b8"
              strokeOpacity="0.75"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
            />

            {/* ----------------------------------------------------------- */}
            {/* LAYER 5: ACTIVE GLOWING FINGER REACH OVERLAYS               */}
            {/* ----------------------------------------------------------- */}
            {/* Active Finger Glow Highlight (Cyan) */}
            {activeHighlightPath && (
              <path
                d={activeHighlightPath}
                fill="rgba(56, 189, 248, 0.22)"
                stroke="#38bdf8"
                strokeWidth="2.8"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#fingerGlow)"
                className="transition-all duration-150 ease-out"
              />
            )}

            {/* Shift Finger Glow Highlight (Amber) */}
            {shiftHighlightPath && (
              <path
                d={shiftHighlightPath}
                fill="rgba(245, 158, 11, 0.22)"
                stroke="#f59e0b"
                strokeWidth="2.8"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#fingerGlow)"
                className="transition-all duration-150 ease-out"
              />
            )}

            {/* Error Finger Glow Highlight (Red) */}
            {errorHighlightPath && (
              <path
                d={errorHighlightPath}
                fill="rgba(239, 68, 68, 0.25)"
                stroke="#ef4444"
                strokeWidth="2.8"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#errorKeyGlow)"
                className="transition-all duration-150 ease-out"
              />
            )}
          </g>

          {/* ------------------------------------------------------------- */}
          {/* LAYER 6: HOME ROW LABELS & SPARK (from media_1789968158671)   */}
          {/* ------------------------------------------------------------- */}
          <text
            x="220"
            y="420"
            textAnchor="middle"
            className="text-[11px] font-mono tracking-wider select-none"
          >
            <tspan fill="#64748b">LEFT HAND RESTING (</tspan>
            <tspan fill="#22d3ee" fontWeight="bold">A S D F</tspan>
            <tspan fill="#64748b">)</tspan>
          </text>
          <text
            x="620"
            y="420"
            textAnchor="middle"
            className="text-[11px] font-mono tracking-wider select-none"
          >
            <tspan fill="#64748b">RIGHT HAND RESTING (</tspan>
            <tspan fill="#22d3ee" fontWeight="bold">J K L ;</tspan>
            <tspan fill="#64748b">)</tspan>
          </text>

          {/* Subtle decorative 4-point star spark at bottom right */}
          <g transform="translate(765, 395) scale(0.9)" opacity="0.6">
            <path
              d="M 0,-14 Q 0,0 14,0 Q 0,0 0,14 Q 0,0 -14,0 Q 0,0 0,-14 Z"
              fill="#64748b"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default KeyboardGuide;
