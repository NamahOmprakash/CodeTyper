import React, { useMemo, useState, useEffect } from 'react';
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

// -----------------------------------------------------------------
// MATHEMATICAL SYMMETRY ACROSS X = 368 (midpoint of F=293 and J=443)
// -----------------------------------------------------------------
const CENTER_X = 368;
const mirrorX = (x: number) => 2 * CENTER_X - x; // 736 - x
const isLeftFinger = (f: FingerId) => f.startsWith('left-') || f === 'thumb-left';
const isRightFinger = (f: FingerId) => f.startsWith('right-') || f === 'thumb-right';

// Left Hand anatomical anchor points
const LEFT_WRIST = { x: 218, y: 315 };
const LEFT_KNUCKLES: Record<FingerId, { x: number; y: number }> = {
  'left-pinky':  { x: 143, y: 206 },
  'left-ring':   { x: 193, y: 203 },
  'left-middle': { x: 243, y: 201 },
  'left-index':  { x: 293, y: 203 },
  'thumb-left':  { x: 282, y: 245 },
  // Placeholders for typing
  'thumb-right': { x: mirrorX(282), y: 245 },
  'right-index': { x: mirrorX(293), y: 203 },
  'right-middle':{ x: mirrorX(243), y: 201 },
  'right-ring':  { x: mirrorX(193), y: 203 },
  'right-pinky': { x: mirrorX(143), y: 206 },
};

// Right Hand exact mathematical mirror
const RIGHT_WRIST = { x: mirrorX(LEFT_WRIST.x), y: LEFT_WRIST.y }; // (518, 315)
const RIGHT_KNUCKLES: Record<FingerId, { x: number; y: number }> = {
  'thumb-right': { x: mirrorX(LEFT_KNUCKLES['thumb-left'].x), y: LEFT_KNUCKLES['thumb-left'].y }, // (454, 245)
  'right-index': { x: mirrorX(LEFT_KNUCKLES['left-index'].x), y: LEFT_KNUCKLES['left-index'].y }, // (443, 203)
  'right-middle':{ x: mirrorX(LEFT_KNUCKLES['left-middle'].x), y: LEFT_KNUCKLES['left-middle'].y }, // (493, 201)
  'right-ring':  { x: mirrorX(LEFT_KNUCKLES['left-ring'].x), y: LEFT_KNUCKLES['left-ring'].y }, // (543, 203)
  'right-pinky': { x: mirrorX(LEFT_KNUCKLES['left-pinky'].x), y: LEFT_KNUCKLES['left-pinky'].y }, // (593, 206)
  'thumb-left':  { x: 282, y: 245 },
  'left-index':  { x: 293, y: 203 },
  'left-middle': { x: 243, y: 201 },
  'left-ring':   { x: 193, y: 203 },
  'left-pinky':  { x: 143, y: 206 },
};

export const HOME_RESTING_TIPS: Record<FingerId, { x: number; y: number }> = {
  'left-pinky':  { x: 143, y: 141 }, // KeyA
  'left-ring':   { x: 193, y: 141 }, // KeyS
  'left-middle': { x: 243, y: 141 }, // KeyD
  'left-index':  { x: 293, y: 141 }, // KeyF
  'thumb-left':  { x: 348, y: 237 }, // Space left
  'thumb-right': { x: mirrorX(348), y: 237 }, // (388, 237) Space right
  'right-index': { x: mirrorX(293), y: 141 }, // (443, 141) KeyJ
  'right-middle':{ x: mirrorX(243), y: 141 }, // (493, 141) KeyK
  'right-ring':  { x: mirrorX(193), y: 141 }, // (543, 141) KeyL
  'right-pinky': { x: mirrorX(143), y: 141 }, // (593, 141) Semicolon
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

const renderFingerStick = (
  keyPrefix: string,
  fId: FingerId,
  knuckle: { x: number; y: number },
  tip: { x: number; y: number },
  isActive: boolean,
  isShift: boolean,
  isError: boolean
) => {
  if (isError) {
    return (
      <g key={`${keyPrefix}-${fId}`}>
        <line
          x1={knuckle.x}
          y1={knuckle.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#dc2626"
          strokeWidth="9"
          strokeOpacity="0.30"
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
        <line
          x1={knuckle.x}
          y1={knuckle.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#ef4444"
          strokeWidth="5"
          strokeOpacity="0.75"
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
        <line
          x1={knuckle.x}
          y1={knuckle.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
      </g>
    );
  }

  if (isActive) {
    return (
      <g key={`${keyPrefix}-${fId}`}>
        <line
          x1={knuckle.x}
          y1={knuckle.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#0284c7"
          strokeWidth="9"
          strokeOpacity="0.30"
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
        <line
          x1={knuckle.x}
          y1={knuckle.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#38bdf8"
          strokeWidth="5"
          strokeOpacity="0.75"
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
        <line
          x1={knuckle.x}
          y1={knuckle.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#f0f9ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
      </g>
    );
  }

  if (isShift) {
    return (
      <g key={`${keyPrefix}-${fId}`}>
        <line
          x1={knuckle.x}
          y1={knuckle.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#d97706"
          strokeWidth="9"
          strokeOpacity="0.30"
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
        <line
          x1={knuckle.x}
          y1={knuckle.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#fbbf24"
          strokeWidth="5"
          strokeOpacity="0.75"
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
        <line
          x1={knuckle.x}
          y1={knuckle.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#fffbeb"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
      </g>
    );
  }

  return (
    <line
      key={`${keyPrefix}-${fId}`}
      x1={knuckle.x}
      y1={knuckle.y}
      x2={tip.x}
      y2={tip.y}
      stroke="#64748b"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="transition-all duration-150 ease-out"
    />
  );
};

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

  // Target Key definition
  const targetKey = useMemo(() => {
    if (!targetKeyCode) return null;
    return KEY_BY_CODE.get(targetKeyCode) || null;
  }, [targetKeyCode]);

  // Shift Key definition
  const shiftKey = useMemo(() => {
    if (!requiresShift || !shiftKeyCode) return null;
    return KEY_BY_CODE.get(shiftKeyCode) || null;
  }, [requiresShift, shiftKeyCode]);

  // Accurate error key detection: only turns red on real mistakes
  const [activeErrorKey, setActiveErrorKey] = useState<KeyDef | null>(null);

  useEffect(() => {
    if (!lastMistake) {
      setActiveErrorKey(null);
      return;
    }

    let key: KeyDef | null = null;
    if (lastMistake.keyCode) {
      key = KEY_BY_CODE.get(lastMistake.keyCode) || null;
    }
    if (!key && lastMistake.typedChar) {
      const mapped = FINGER_KEY_MAP[lastMistake.typedChar];
      if (mapped?.keyCode) {
        key = KEY_BY_CODE.get(mapped.keyCode) || null;
      }
    }

    if (key) {
      setActiveErrorKey(key);
      const timer = setTimeout(() => {
        setActiveErrorKey(null);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [lastMistake]);

  const errorFinger = activeErrorKey?.finger;

  // -----------------------------------------------------------------
  // 3D KINEMATICS: Minimal floating movement over the keyboard plane
  // -----------------------------------------------------------------
  const leftHandShift = useMemo(() => {
    if (!activeFinger || !targetKey || !isLeftFinger(activeFinger)) {
      return { x: 0, y: 0 };
    }
    const homeTip = HOME_RESTING_TIPS[activeFinger];
    let targetX = targetKey.cx;
    let targetY = targetKey.cy;
    if (targetKey.code === 'Space') {
      targetX = 348;
    }
    const dx = targetX - homeTip.x;
    const dy = targetY - homeTip.y;
    return { x: Math.round(dx * 0.20), y: Math.round(dy * 0.22) };
  }, [activeFinger, targetKey]);

  const rightHandShift = useMemo(() => {
    if (!activeFinger || !targetKey || !isRightFinger(activeFinger)) {
      return { x: 0, y: 0 };
    }
    const homeTip = HOME_RESTING_TIPS[activeFinger];
    let targetX = targetKey.cx;
    let targetY = targetKey.cy;
    if (targetKey.code === 'Space') {
      targetX = 388;
    }
    const dx = targetX - homeTip.x;
    const dy = targetY - homeTip.y;
    return { x: Math.round(dx * 0.20), y: Math.round(dy * 0.22) };
  }, [activeFinger, targetKey]);

  // Compute fingertip coordinates
  const fingertips = useMemo(() => {
    const tips = { ...HOME_RESTING_TIPS };

    if (activeFinger && targetKey) {
      const isLeft = isLeftFinger(activeFinger);
      const shift = isLeft ? leftHandShift : rightHandShift;
      let targetX = targetKey.cx;
      let targetY = targetKey.cy;

      if (targetKey.code === 'Space') {
        targetX = activeFinger === 'thumb-right' ? 388 : 348;
      }

      tips[activeFinger] = {
        x: targetX - shift.x,
        y: targetY - shift.y,
      };
    }

    if (requiresShift && shiftFinger && shiftKey) {
      const isLeft = isLeftFinger(shiftFinger);
      const shift = isLeft ? leftHandShift : rightHandShift;
      tips[shiftFinger] = {
        x: shiftKey.cx - shift.x,
        y: shiftKey.cy - shift.y,
      };
    }

    return tips;
  }, [activeFinger, targetKey, requiresShift, shiftFinger, shiftKey, leftHandShift, rightHandShift]);

  const isLeftActive = Boolean(
    (activeFinger && isLeftFinger(activeFinger)) ||
    (requiresShift && shiftFinger && isLeftFinger(shiftFinger)) ||
    (errorFinger && isLeftFinger(errorFinger))
  );
  const isRightActive = Boolean(
    (activeFinger && isRightFinger(activeFinger)) ||
    (requiresShift && shiftFinger && isRightFinger(shiftFinger)) ||
    (errorFinger && isRightFinger(errorFinger))
  );

  // Left & Right fingers list
  const leftFingers: FingerId[] = ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'thumb-left'];
  const rightFingers: FingerId[] = ['thumb-right', 'right-index', 'right-middle', 'right-ring', 'right-pinky'];

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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs shadow-sm">
              Home Row
            </span>
          )}

          {/* Red typo alert badge - only appears on actual mistake */}
          {activeErrorKey && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/50 text-red-300 font-bold text-xs shadow-sm animate-pulse">
              ❌ Wrong: {lastMistake?.typedChar === ' ' ? 'Space' : (lastMistake?.typedChar || activeErrorKey.display || activeErrorKey.primary)}
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

      {/* SVG Container: Keyboard + 3D Hovering Symmetric Stick Hands */}
      <div className="w-full relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/70 shadow-inner">
        <svg
          viewBox="0 0 840 430"
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* 3D Depth Shadow: Cast onto keyboard keys from Z-axis hovering hands */}
            <filter id="hands3dElevation" filterUnits="userSpaceOnUse" x="0" y="0" width="840" height="430">
              <feDropShadow dx="0" dy="12" stdDeviation="7" floodColor="#000000" floodOpacity="0.75" />
            </filter>

            {/* Glowing neon keycap filters */}
            <filter id="keyGlow" filterUnits="userSpaceOnUse" x="0" y="0" width="840" height="430">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="errorKeyGlow" filterUnits="userSpaceOnUse" x="0" y="0" width="840" height="430">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ------------------------------------------------------------- */}
          {/* LAYER 1: KEYBOARD CHASSIS & KEYCAPS (Z = 0)                   */}
          {/* ------------------------------------------------------------- */}
          <g id="keyboard-chassis">
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
              const isErrorKey = activeErrorKey?.code === key.code;

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
                fill = '#0284c7'; // Blue on active keypress
                stroke = '#38bdf8';
                strokeWidth = 2;
                textColor = '#ffffff';
              } else if (isTarget) {
                fill = '#0369a1'; // Soft cyan on target
                stroke = '#38bdf8';
                strokeWidth = 2;
                textColor = '#ffffff';
                filterAttr = 'url(#keyGlow)';
              } else if (isShiftActive) {
                fill = '#78350f'; // Amber on required shift
                stroke = '#f59e0b';
                strokeWidth = 2;
                textColor = '#fef3c7';
                filterAttr = 'url(#keyGlow)';
              }

              return (
                <g key={key.code} className="transition-all duration-150">
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
          {/* LAYER 2: 3D FLOATING STICK HANDS (Z > 0 above keyboard)       */}
          {/* Pure clean lines with NO circle dots and NO extra cross lines */}
          {/* ------------------------------------------------------------- */}
          <g id="stick-hands" filter="url(#hands3dElevation)" className="pointer-events-none select-none">
            {/* ====== LEFT STICK HAND ====== */}
            {/* Forearm stick anchored at bottom edge */}
            {isLeftActive && (
              <line
                x1="218"
                y1="430"
                x2={LEFT_WRIST.x + leftHandShift.x}
                y2={LEFT_WRIST.y + leftHandShift.y}
                stroke="#0284c7"
                strokeWidth="7"
                strokeOpacity="0.35"
                strokeLinecap="round"
                className="transition-all duration-200 ease-out"
              />
            )}
            <line
              x1="218"
              y1="430"
              x2={LEFT_WRIST.x + leftHandShift.x}
              y2={LEFT_WRIST.y + leftHandShift.y}
              stroke={isLeftActive ? '#38bdf8' : '#475569'}
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-all duration-200 ease-out"
            />

            {/* Floating Left Hand Assembly */}
            <g
              transform={`translate(${leftHandShift.x}, ${leftHandShift.y})`}
              className="transition-transform duration-200 ease-out"
            >
              {/* Clean Trapezoid Palm Cup (NO inner extra cross line) */}
              <polygon
                points={`
                  ${LEFT_WRIST.x},${LEFT_WRIST.y}
                  ${LEFT_KNUCKLES['left-pinky'].x},${LEFT_KNUCKLES['left-pinky'].y}
                  ${LEFT_KNUCKLES['left-ring'].x},${LEFT_KNUCKLES['left-ring'].y}
                  ${LEFT_KNUCKLES['left-middle'].x},${LEFT_KNUCKLES['left-middle'].y}
                  ${LEFT_KNUCKLES['left-index'].x},${LEFT_KNUCKLES['left-index'].y}
                  ${LEFT_KNUCKLES['thumb-left'].x},${LEFT_KNUCKLES['thumb-left'].y}
                `}
                fill={isLeftActive ? 'rgba(56, 189, 248, 0.12)' : 'rgba(30, 41, 59, 0.35)'}
                stroke={isLeftActive ? '#38bdf8' : '#475569'}
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="transition-colors duration-200"
              />

              {/* 5 Left Finger Sticks (pure lines, no dots) */}
              {leftFingers.map((fId) => {
                const knuckle = LEFT_KNUCKLES[fId];
                const tip = fingertips[fId];
                const isActive = activeFinger === fId;
                const isShift = shiftFinger === fId;
                const isError = errorFinger === fId;

                return renderFingerStick('left', fId, knuckle, tip, isActive, isShift, isError);
              })}
            </g>

            {/* ====== RIGHT STICK HAND (Exact mirror: 736 - x) ====== */}
            {/* Forearm stick anchored at bottom edge */}
            {isRightActive && (
              <line
                x1="518"
                y1="430"
                x2={RIGHT_WRIST.x + rightHandShift.x}
                y2={RIGHT_WRIST.y + rightHandShift.y}
                stroke="#0284c7"
                strokeWidth="7"
                strokeOpacity="0.35"
                strokeLinecap="round"
                className="transition-all duration-200 ease-out"
              />
            )}
            <line
              x1="518"
              y1="430"
              x2={RIGHT_WRIST.x + rightHandShift.x}
              y2={RIGHT_WRIST.y + rightHandShift.y}
              stroke={isRightActive ? '#38bdf8' : '#475569'}
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-all duration-200 ease-out"
            />

            {/* Floating Right Hand Assembly */}
            <g
              transform={`translate(${rightHandShift.x}, ${rightHandShift.y})`}
              className="transition-transform duration-200 ease-out"
            >
              {/* Clean Trapezoid Palm Cup (mirrored, NO inner extra cross line) */}
              <polygon
                points={`
                  ${RIGHT_WRIST.x},${RIGHT_WRIST.y}
                  ${RIGHT_KNUCKLES['right-pinky'].x},${RIGHT_KNUCKLES['right-pinky'].y}
                  ${RIGHT_KNUCKLES['right-ring'].x},${RIGHT_KNUCKLES['right-ring'].y}
                  ${RIGHT_KNUCKLES['right-middle'].x},${RIGHT_KNUCKLES['right-middle'].y}
                  ${RIGHT_KNUCKLES['right-index'].x},${RIGHT_KNUCKLES['right-index'].y}
                  ${RIGHT_KNUCKLES['thumb-right'].x},${RIGHT_KNUCKLES['thumb-right'].y}
                `}
                fill={isRightActive ? 'rgba(56, 189, 248, 0.12)' : 'rgba(30, 41, 59, 0.35)'}
                stroke={isRightActive ? '#38bdf8' : '#475569'}
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="transition-colors duration-200"
              />

              {/* 5 Right Finger Sticks (pure lines, no dots) */}
              {rightFingers.map((fId) => {
                const knuckle = RIGHT_KNUCKLES[fId];
                const tip = fingertips[fId];
                const isActive = activeFinger === fId;
                const isShift = shiftFinger === fId;
                const isError = errorFinger === fId;

                return renderFingerStick('right', fId, knuckle, tip, isActive, isShift, isError);
              })}
            </g>
          </g>

          {/* ------------------------------------------------------------- */}
          {/* LAYER 3: HOME ROW LABELS                                      */}
          {/* ------------------------------------------------------------- */}
          <text
            x="218"
            y="420"
            textAnchor="middle"
            className="text-[11px] font-mono tracking-wider select-none"
          >
            <tspan fill="#64748b">LEFT HAND (</tspan>
            <tspan fill="#22d3ee" fontWeight="bold">A S D F</tspan>
            <tspan fill="#64748b">)</tspan>
          </text>
          <text
            x="518"
            y="420"
            textAnchor="middle"
            className="text-[11px] font-mono tracking-wider select-none"
          >
            <tspan fill="#64748b">RIGHT HAND (</tspan>
            <tspan fill="#22d3ee" fontWeight="bold">J K L ;</tspan>
            <tspan fill="#64748b">)</tspan>
          </text>
        </svg>
      </div>
    </div>
  );
};

export default KeyboardGuide;
