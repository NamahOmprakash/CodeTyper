import { FingerInfo, FingerName } from '../types';

export const FINGER_COLORS: Record<FingerName, { color: string; label: string; hand: 'left' | 'right' }> = {
  'left-pinky': { color: '#ef4444', label: 'Left Pinky', hand: 'left' },
  'left-ring': { color: '#f97316', label: 'Left Ring', hand: 'left' },
  'left-middle': { color: '#eab308', label: 'Left Middle', hand: 'left' },
  'left-index': { color: '#22c55e', label: 'Left Index', hand: 'left' },
  'thumb': { color: '#64748b', label: 'Thumb', hand: 'left' },
  'right-index': { color: '#06b6d4', label: 'Right Index', hand: 'right' },
  'right-middle': { color: '#3b82f6', label: 'Right Middle', hand: 'right' },
  'right-ring': { color: '#8b5cf6', label: 'Right Ring', hand: 'right' },
  'right-pinky': { color: '#ec4899', label: 'Right Pinky', hand: 'right' },
};

// Base key definition for visual keyboard
export interface VirtualKey {
  code: string;
  char: string;
  shiftChar?: string;
  finger: FingerName;
  width?: string; // e.g. 'w-12', 'w-16', 'flex-1'
}

export const KEYBOARD_ROWS: VirtualKey[][] = [
  // Row 1 (Number row)
  [
    { code: 'Backquote', char: '`', shiftChar: '~', finger: 'left-pinky' },
    { code: 'Digit1', char: '1', shiftChar: '!', finger: 'left-pinky' },
    { code: 'Digit2', char: '2', shiftChar: '@', finger: 'left-ring' },
    { code: 'Digit3', char: '3', shiftChar: '#', finger: 'left-middle' },
    { code: 'Digit4', char: '4', shiftChar: '$', finger: 'left-index' },
    { code: 'Digit5', char: '5', shiftChar: '%', finger: 'left-index' },
    { code: 'Digit6', char: '6', shiftChar: '^', finger: 'right-index' },
    { code: 'Digit7', char: '7', shiftChar: '&', finger: 'right-index' },
    { code: 'Digit8', char: '8', shiftChar: '*', finger: 'right-middle' },
    { code: 'Digit9', char: '9', shiftChar: '(', finger: 'right-ring' },
    { code: 'Digit0', char: '0', shiftChar: ')', finger: 'right-pinky' },
    { code: 'Minus', char: '-', shiftChar: '_', finger: 'right-pinky' },
    { code: 'Equal', char: '=', shiftChar: '+', finger: 'right-pinky' },
    { code: 'Backspace', char: 'Backspace', finger: 'right-pinky', width: 'w-20' },
  ],
  // Row 2 (Tab / QWERTY)
  [
    { code: 'Tab', char: 'Tab', finger: 'left-pinky', width: 'w-16' },
    { code: 'KeyQ', char: 'q', shiftChar: 'Q', finger: 'left-pinky' },
    { code: 'KeyW', char: 'w', shiftChar: 'W', finger: 'left-ring' },
    { code: 'KeyE', char: 'e', shiftChar: 'E', finger: 'left-middle' },
    { code: 'KeyR', char: 'r', shiftChar: 'R', finger: 'left-index' },
    { code: 'KeyT', char: 't', shiftChar: 'T', finger: 'left-index' },
    { code: 'KeyY', char: 'y', shiftChar: 'Y', finger: 'right-index' },
    { code: 'KeyU', char: 'u', shiftChar: 'U', finger: 'right-index' },
    { code: 'KeyI', char: 'i', shiftChar: 'I', finger: 'right-middle' },
    { code: 'KeyO', char: 'o', shiftChar: 'O', finger: 'right-ring' },
    { code: 'KeyP', char: 'p', shiftChar: 'P', finger: 'right-pinky' },
    { code: 'BracketLeft', char: '[', shiftChar: '{', finger: 'right-pinky' },
    { code: 'BracketRight', char: ']', shiftChar: '}', finger: 'right-pinky' },
    { code: 'Backslash', char: '\\', shiftChar: '|', finger: 'right-pinky', width: 'w-14' },
  ],
  // Row 3 (Home row)
  [
    { code: 'CapsLock', char: 'Caps', finger: 'left-pinky', width: 'w-18' },
    { code: 'KeyA', char: 'a', shiftChar: 'A', finger: 'left-pinky' },
    { code: 'KeyS', char: 's', shiftChar: 'S', finger: 'left-ring' },
    { code: 'KeyD', char: 'd', shiftChar: 'D', finger: 'left-middle' },
    { code: 'KeyF', char: 'f', shiftChar: 'F', finger: 'left-index' },
    { code: 'KeyG', char: 'g', shiftChar: 'G', finger: 'left-index' },
    { code: 'KeyH', char: 'h', shiftChar: 'H', finger: 'right-index' },
    { code: 'KeyJ', char: 'j', shiftChar: 'J', finger: 'right-index' },
    { code: 'KeyK', char: 'k', shiftChar: 'K', finger: 'right-middle' },
    { code: 'KeyL', char: 'l', shiftChar: 'L', finger: 'right-ring' },
    { code: 'Semicolon', char: ';', shiftChar: ':', finger: 'right-pinky' },
    { code: 'Quote', char: "'", shiftChar: '"', finger: 'right-pinky' },
    { code: 'Enter', char: 'Enter', finger: 'right-pinky', width: 'w-24' },
  ],
  // Row 4 (Bottom row)
  [
    { code: 'ShiftLeft', char: 'Shift', finger: 'left-pinky', width: 'w-24' },
    { code: 'KeyZ', char: 'z', shiftChar: 'Z', finger: 'left-pinky' },
    { code: 'KeyX', char: 'x', shiftChar: 'X', finger: 'left-ring' },
    { code: 'KeyC', char: 'c', shiftChar: 'C', finger: 'left-middle' },
    { code: 'KeyV', char: 'v', shiftChar: 'V', finger: 'left-index' },
    { code: 'KeyB', char: 'b', shiftChar: 'B', finger: 'left-index' },
    { code: 'KeyN', char: 'n', shiftChar: 'N', finger: 'right-index' },
    { code: 'KeyM', char: 'm', shiftChar: 'M', finger: 'right-middle' },
    { code: 'Comma', char: ',', shiftChar: '<', finger: 'right-middle' },
    { code: 'Period', char: '.', shiftChar: '>', finger: 'right-ring' },
    { code: 'Slash', char: '/', shiftChar: '?', finger: 'right-pinky' },
    { code: 'ShiftRight', char: 'Shift', finger: 'right-pinky', width: 'w-24' },
  ],
  // Row 5 (Space row)
  [
    { code: 'ControlLeft', char: 'Ctrl', finger: 'left-pinky', width: 'w-14' },
    { code: 'AltLeft', char: 'Alt', finger: 'thumb', width: 'w-14' },
    { code: 'Space', char: 'Space', finger: 'thumb', width: 'flex-1 max-w-lg' },
    { code: 'AltRight', char: 'Alt', finger: 'thumb', width: 'w-14' },
    { code: 'ControlRight', char: 'Ctrl', finger: 'right-pinky', width: 'w-14' },
  ],
];

// Complete Character to Finger and Shift mapping
export function getFingerForChar(targetChar: string): FingerInfo {
  if (targetChar === ' ' || targetChar === '\t') {
    if (targetChar === '\t') {
      return {
        finger: 'left-pinky',
        hand: 'left',
        fingerLabel: 'Left Pinky (Tab)',
        color: FINGER_COLORS['left-pinky'].color,
      };
    }
    return {
      finger: 'thumb',
      hand: 'left',
      fingerLabel: 'Thumb (Space)',
      color: FINGER_COLORS.thumb.color,
    };
  }

  if (targetChar === '\n') {
    return {
      finger: 'right-pinky',
      hand: 'right',
      fingerLabel: 'Right Pinky (Enter)',
      color: FINGER_COLORS['right-pinky'].color,
    };
  }

  // Iterate rows to locate matching char or shiftChar
  for (const row of KEYBOARD_ROWS) {
    for (const key of row) {
      if (key.char === targetChar) {
        const meta = FINGER_COLORS[key.finger];
        return {
          finger: key.finger,
          hand: meta.hand,
          fingerLabel: meta.label,
          color: meta.color,
        };
      }
      if (key.shiftChar === targetChar) {
        const primaryMeta = FINGER_COLORS[key.finger];
        // Shift should be pressed with opposite hand!
        const shiftHand: 'left' | 'right' = primaryMeta.hand === 'left' ? 'right' : 'left';
        const shiftFinger: FingerName = shiftHand === 'left' ? 'left-pinky' : 'right-pinky';
        return {
          finger: key.finger,
          hand: primaryMeta.hand,
          fingerLabel: `${primaryMeta.label} (Hold Shift with ${shiftHand === 'left' ? 'Left Pinky' : 'Right Pinky'})`,
          color: primaryMeta.color,
          shiftFinger,
          shiftHand,
        };
      }
      // Case insensitive check for uppercase letters
      if (key.code.startsWith('Key') && key.char.toUpperCase() === targetChar) {
        const primaryMeta = FINGER_COLORS[key.finger];
        const shiftHand: 'left' | 'right' = primaryMeta.hand === 'left' ? 'right' : 'left';
        const shiftFinger: FingerName = shiftHand === 'left' ? 'left-pinky' : 'right-pinky';
        return {
          finger: key.finger,
          hand: primaryMeta.hand,
          fingerLabel: `${primaryMeta.label} (Hold Shift with ${shiftHand === 'left' ? 'Left Pinky' : 'Right Pinky'})`,
          color: primaryMeta.color,
          shiftFinger,
          shiftHand,
        };
      }
    }
  }

  // Fallback default
  return {
    finger: 'thumb',
    hand: 'left',
    fingerLabel: 'Unknown',
    color: '#64748b',
  };
}

export function getKeyHighlightInfo(targetChar: string): { activeKeyCode: string; shiftKeyCode?: string } {
  if (targetChar === '\n') return { activeKeyCode: 'Enter' };
  if (targetChar === ' ') return { activeKeyCode: 'Space' };
  if (targetChar === '\t') return { activeKeyCode: 'Tab' };

  for (const row of KEYBOARD_ROWS) {
    for (const key of row) {
      if (key.char === targetChar) {
        return { activeKeyCode: key.code };
      }
      if (key.shiftChar === targetChar) {
        const primaryMeta = FINGER_COLORS[key.finger];
        const shiftKeyCode = primaryMeta.hand === 'left' ? 'ShiftRight' : 'ShiftLeft';
        return { activeKeyCode: key.code, shiftKeyCode };
      }
      if (key.code.startsWith('Key') && key.char.toUpperCase() === targetChar) {
        const primaryMeta = FINGER_COLORS[key.finger];
        const shiftKeyCode = primaryMeta.hand === 'left' ? 'ShiftRight' : 'ShiftLeft';
        return { activeKeyCode: key.code, shiftKeyCode };
      }
    }
  }

  return { activeKeyCode: '' };
}
