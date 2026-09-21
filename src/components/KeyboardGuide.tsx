import React, { useMemo } from 'react';
import { cn } from '../lib/utils';

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

// Default resting coordinates on home row keys
export const HOME_RESTING_TIPS: Record<FingerId, { x: number; y: number }> = {
  'left-pinky': { x: 143, y: 141 },   // on KeyA
  'left-ring': { x: 193, y: 141 },    // on KeyS
  'left-middle': { x: 243, y: 141 },  // on KeyD
  'left-index': { x: 293, y: 141 },   // on KeyF
  'thumb-left': { x: 340, y: 237 },   // on Space (left side)
  'thumb-right': { x: 444, y: 237 },  // on Space (right side)
  'right-index': { x: 443, y: 141 },  // on KeyJ
  'right-middle': { x: 493, y: 141 }, // on KeyK
  'right-ring': { x: 543, y: 141 },   // on KeyL
  'right-pinky': { x: 593, y: 141 },  // on Semicolon
};

// Knuckle base attachment points on palm
export const KNUCKLE_BASES: Record<FingerId, { x: number; y: number }> = {
  'left-pinky': { x: 150, y: 245 },
  'left-ring': { x: 195, y: 235 },
  'left-middle': { x: 245, y: 228 },
  'left-index': { x: 295, y: 232 },
  'thumb-left': { x: 320, y: 315 },
  'thumb-right': { x: 464, y: 315 },
  'right-index': { x: 489, y: 232 },
  'right-middle': { x: 539, y: 228 },
  'right-ring': { x: 589, y: 235 },
  'right-pinky': { x: 634, y: 245 },
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

// Generates smooth SVG path for the entire Left Hand with dynamic finger reach
function getLeftHandOutline(tips: Record<FingerId, { x: number; y: number }>) {
  const lp = tips['left-pinky'];
  const lr = tips['left-ring'];
  const lm = tips['left-middle'];
  const li = tips['left-index'];
  const lt = tips['thumb-left'];

  return [
    `M 170,430`,
    `C 150,380 132,310 134,240`,
    // Pinky left edge
    `C 134,200 ${lp.x - 12},${lp.y + 20} ${lp.x - 10},${lp.y}`,
    // Pinky tip cap
    `A 10,10 0 0,1 ${lp.x + 10},${lp.y}`,
    // Pinky right edge to web 1
    `C ${lp.x + 10},${lp.y + 20} 168,195 170,210`,
    // Ring left edge
    `C 172,195 ${lr.x - 11},${lr.y + 20} ${lr.x - 10},${lr.y}`,
    // Ring tip cap
    `A 10,10 0 0,1 ${lr.x + 10},${lr.y}`,
    // Ring right edge to web 2
    `C ${lr.x + 10},${lr.y + 20} 218,185 220,200`,
    // Middle left edge
    `C 222,185 ${lm.x - 11},${lm.y + 20} ${lm.x - 10},${lm.y}`,
    // Middle tip cap
    `A 10,10 0 0,1 ${lm.x + 10},${lm.y}`,
    // Middle right edge to web 3
    `C ${lm.x + 10},${lm.y + 20} 268,190 270,205`,
    // Index left edge
    `C 272,190 ${li.x - 11},${li.y + 20} ${li.x - 10},${li.y}`,
    // Index tip cap
    `A 10,10 0 0,1 ${li.x + 10},${li.y}`,
    // Index right edge to thumb web
    `C ${li.x + 10},${li.y + 30} 305,240 300,280`,
    // Thumb outer edge
    `C 300,270 ${lt.x - 14},${lt.y + 15} ${lt.x - 12},${lt.y}`,
    // Thumb tip cap
    `A 12,12 0 0,1 ${lt.x + 12},${lt.y + 4}`,
    // Thumb inner edge down to wrist
    `C ${lt.x + 8},${lt.y + 25} 310,360 255,430`,
    `Z`,
  ].join(' ');
}

// Generates smooth SVG path for the entire Right Hand with dynamic finger reach
function getRightHandOutline(tips: Record<FingerId, { x: number; y: number }>) {
  const rp = tips['right-pinky'];
  const rr = tips['right-ring'];
  const rm = tips['right-middle'];
  const ri = tips['right-index'];
  const rt = tips['thumb-right'];

  return [
    `M 670,430`,
    `C 690,380 708,310 706,240`,
    // Pinky right edge
    `C 706,200 ${rp.x + 12},${rp.y + 20} ${rp.x + 10},${rp.y}`,
    // Pinky tip cap
    `A 10,10 0 0,0 ${rp.x - 10},${rp.y}`,
    // Pinky left edge to web 1
    `C ${rp.x - 10},${rp.y + 20} 672,195 670,210`,
    // Ring right edge
    `C 668,195 ${rr.x + 11},${rr.y + 20} ${rr.x + 10},${rr.y}`,
    // Ring tip cap
    `A 10,10 0 0,0 ${rr.x - 10},${rr.y}`,
    // Ring left edge to web 2
    `C ${rr.x - 10},${rr.y + 20} 622,185 620,200`,
    // Middle right edge
    `C 618,185 ${rm.x + 11},${rm.y + 20} ${rm.x + 10},${rm.y}`,
    // Middle tip cap
    `A 10,10 0 0,0 ${rm.x - 10},${rm.y}`,
    // Middle left edge to web 3
    `C ${rm.x - 10},${rm.y + 20} 572,190 570,205`,
    // Index right edge
    `C 568,190 ${ri.x + 11},${ri.y + 20} ${ri.x + 10},${ri.y}`,
    // Index tip cap
    `A 10,10 0 0,0 ${ri.x - 10},${ri.y}`,
    // Index left edge to thumb web
    `C ${ri.x - 10},${ri.y + 30} 535,240 540,280`,
    // Thumb outer edge
    `C 540,270 ${rt.x + 14},${rt.y + 15} ${rt.x + 12},${rt.y}`,
    // Thumb tip cap
    `A 12,12 0 0,0 ${rt.x - 12},${rt.y + 4}`,
    // Thumb inner edge down to wrist
    `C ${rt.x - 8},${rt.y + 25} 530,360 585,430`,
    `Z`,
  ].join(' ');
}

// Generates an emphasized single-finger vector segment when reaching for keys
function getActiveFingerSegment(
  base: { x: number; y: number },
  tip: { x: number; y: number },
  width: number = 10
) {
  const dx = tip.x - base.x;
  const dy = tip.y - base.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = (-dy / dist) * width;
  const ny = (dx / dist) * width;

  return [
    `M ${base.x + nx},${base.y + ny}`,
    `C ${base.x + nx * 0.9 + dx * 0.4},${base.y + ny * 0.9 + dy * 0.4} ${tip.x + nx * 0.8},${tip.y + ny * 0.8} ${tip.x + nx * 0.7},${tip.y + ny * 0.7}`,
    `A ${width},${width} 0 0,1 ${tip.x - nx * 0.7},${tip.y - ny * 0.7}`,
    `C ${tip.x - nx * 0.8},${tip.y - ny * 0.8} ${base.x - nx * 0.9 + dx * 0.4},${base.y - ny * 0.9 + dy * 0.4} ${base.x - nx},${base.y - ny}`,
    `Z`,
  ].join(' ');
}

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

  // Compute dynamic fingertip positions:
  // Active finger extends directly to the target key's center (cx, cy)!
  // If Shift is required, shift finger extends to the Shift key's center!
  // All other fingers rest gracefully on their home-row keys.
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
  const leftHandPath = useMemo(() => getLeftHandOutline(dynamicFingertips), [dynamicFingertips]);
  const rightHandPath = useMemo(() => getRightHandOutline(dynamicFingertips), [dynamicFingertips]);

  // Active finger highlight paths
  const activeFingerPath = useMemo(() => {
    if (!activeFinger || !targetKey) return null;
    const base = KNUCKLE_BASES[activeFinger];
    const tip = dynamicFingertips[activeFinger];
    return getActiveFingerSegment(base, tip, activeFinger.startsWith('thumb') ? 12 : 9.5);
  }, [activeFinger, targetKey, dynamicFingertips]);

  const shiftFingerPath = useMemo(() => {
    if (!requiresShift || !shiftFinger || !shiftKey) return null;
    const base = KNUCKLE_BASES[shiftFinger];
    const tip = dynamicFingertips[shiftFinger];
    return getActiveFingerSegment(base, tip, 9.5);
  }, [requiresShift, shiftFinger, shiftKey, dynamicFingertips]);

  return (
    <div
      className={cn(
        'w-full max-w-4xl mx-auto flex flex-col items-center select-none bg-slate-900/95 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md transition-all',
        className
      )}
    >
      {/* Top Status Banner */}
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
            <span className="text-slate-500 italic font-sans text-xs">Awaiting input</span>
          )}
        </div>

        {/* Dynamic Finger Instructions */}
        <div className="flex items-center gap-2 text-xs">
          {activeFinger && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400/80 animate-pulse" />
              <span className="capitalize font-semibold text-sky-300">
                {activeFinger.replace('thumb-left', 'Left Thumb').replace('thumb-right', 'Right Thumb').replace('-', ' ')}
              </span>
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

      {/* Unified Overlaid Keyboard & Dynamic Hands SVG */}
      <div className="w-full relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/70 shadow-inner">
        <svg
          viewBox="0 0 840 430"
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Soft gradients for semi-transparent hands */}
            <linearGradient id="handFillLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id="handFillRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.65" />
            </linearGradient>

            {/* Glowing neon filters */}
            <filter id="keyGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="fingerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial gradient for beacon pulse waves */}
            <radialGradient id="beaconGlow">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="shiftBeaconGlow">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
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

              let fill = '#111827';
              let stroke = '#1f2937';
              let strokeWidth = 1;
              let textColor = '#e2e8f0';

              if (isPressed) {
                fill = '#0284c7';
                stroke = '#38bdf8';
                strokeWidth = 2;
                textColor = '#ffffff';
              } else if (isTarget) {
                fill = '#0369a1';
                stroke = '#38bdf8';
                strokeWidth = 2;
                textColor = '#ffffff';
              } else if (isShiftActive) {
                fill = '#78350f';
                stroke = '#f59e0b';
                strokeWidth = 2;
                textColor = '#fef3c7';
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
                    filter={isTarget || isShiftActive ? 'url(#keyGlow)' : undefined}
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
          {/* LAYER 2: TARGET KEY RADIAL BEACON WAVES (like Image 2)        */}
          {/* ------------------------------------------------------------- */}
          {targetKey && (
            <g id="target-beacon" transform={`translate(${targetKey.cx}, ${targetKey.cy})`}>
              {/* Outer expanding ripple */}
              <circle
                r="36"
                fill="url(#beaconGlow)"
                className="animate-ping opacity-60"
              />
              <circle
                r="24"
                fill="url(#beaconGlow)"
                className="opacity-75"
              />
              {/* Central target core */}
              <circle
                r="5"
                fill="#ffffff"
                className="animate-pulse"
              />
            </g>
          )}

          {shiftKey && (
            <g id="shift-beacon" transform={`translate(${shiftKey.cx}, ${shiftKey.cy})`}>
              <circle
                r="32"
                fill="url(#shiftBeaconGlow)"
                className="animate-ping opacity-60"
              />
              <circle
                r="20"
                fill="url(#shiftBeaconGlow)"
                className="opacity-75"
              />
            </g>
          )}

          {/* ------------------------------------------------------------- */}
          {/* LAYER 3: DYNAMIC OVERLAID HANDS (Semi-Transparent Line-Art)   */}
          {/* ------------------------------------------------------------- */}
          <g id="hands-overlay" className="pointer-events-none">
            {/* Left Hand Silhouette */}
            <path
              d={leftHandPath}
              fill="url(#handFillLeft)"
              stroke="#475569"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="transition-all duration-200 ease-out"
            />

            {/* Right Hand Silhouette */}
            <path
              d={rightHandPath}
              fill="url(#handFillRight)"
              stroke="#475569"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="transition-all duration-200 ease-out"
            />

            {/* ----------------------------------------------------------- */}
            {/* LAYER 4: ACTIVE REACHING FINGER HIGHLIGHTS (Blue/Sky Stroke) */}
            {/* ----------------------------------------------------------- */}
            {/* Active Finger Glow Reach */}
            {activeFingerPath && (
              <g className="transition-all duration-200 ease-out">
                {/* Finger silhouette highlight */}
                <path
                  d={activeFingerPath}
                  fill="rgba(56, 189, 248, 0.22)"
                  stroke="#38bdf8"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter="url(#fingerGlow)"
                />
                {/* Internal energy line along finger axis */}
                {activeFinger && targetKey && (
                  <line
                    x1={KNUCKLE_BASES[activeFinger].x}
                    y1={KNUCKLE_BASES[activeFinger].y}
                    x2={targetKey.cx}
                    y2={targetKey.cy}
                    stroke="#e0f2fe"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                )}
              </g>
            )}

            {/* Shift Finger Glow Reach (Amber Stroke) */}
            {shiftFingerPath && (
              <g className="transition-all duration-200 ease-out">
                <path
                  d={shiftFingerPath}
                  fill="rgba(245, 158, 11, 0.22)"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter="url(#fingerGlow)"
                />
                {shiftFinger && shiftKey && (
                  <line
                    x1={KNUCKLE_BASES[shiftFinger].x}
                    y1={KNUCKLE_BASES[shiftFinger].y}
                    x2={shiftKey.cx}
                    y2={shiftKey.cy}
                    stroke="#fef3c7"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                )}
              </g>
            )}

            {/* ----------------------------------------------------------- */}
            {/* LAYER 5: FINGERTIP NODES ON ALL 10 FINGERS                  */}
            {/* ----------------------------------------------------------- */}
            {(Object.keys(dynamicFingertips) as FingerId[]).map((fId) => {
              const tip = dynamicFingertips[fId];
              const isActive = activeFinger === fId;
              const isShift = shiftFinger === fId && !isActive;

              let circleFill = 'rgba(71, 85, 105, 0.5)';
              let circleStroke = '#64748b';
              let radius = 5;

              if (isActive) {
                circleFill = '#38bdf8';
                circleStroke = '#ffffff';
                radius = 8;
              } else if (isShift) {
                circleFill = '#f59e0b';
                circleStroke = '#ffffff';
                radius = 8;
              }

              return (
                <g key={fId} transform={`translate(${tip.x}, ${tip.y})`} className="transition-all duration-200 ease-out">
                  {/* Outer active pulse */}
                  {(isActive || isShift) && (
                    <circle
                      r="16"
                      className={cn(
                        'animate-ping opacity-75',
                        isActive ? 'fill-sky-400' : 'fill-amber-400'
                      )}
                    />
                  )}

                  {/* Fingertip Center Node */}
                  <circle
                    r={radius}
                    fill={circleFill}
                    stroke={circleStroke}
                    strokeWidth={isActive || isShift ? '2.5' : '1'}
                    filter={isActive || isShift ? 'url(#fingerGlow)' : undefined}
                  />

                  {/* Inner pure white pinpoint */}
                  {(isActive || isShift) && (
                    <circle r="2.5" fill="#ffffff" />
                  )}
                </g>
              );
            })}
          </g>

          {/* Home Row Center Reference Labels */}
          <text
            x="215"
            y="420"
            textAnchor="middle"
            className="text-[11px] font-mono font-semibold fill-slate-500/80 tracking-wider uppercase select-none"
          >
            Left Hand (ASDF)
          </text>
          <text
            x="630"
            y="420"
            textAnchor="middle"
            className="text-[11px] font-mono font-semibold fill-slate-500/80 tracking-wider uppercase select-none"
          >
            Right Hand (JKL;)
          </text>
        </svg>
      </div>
    </div>
  );
};

export default KeyboardGuide;
