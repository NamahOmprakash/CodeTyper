import React from 'react';
import { FingerName } from '../types';

interface HandDiagramProps {
  activeFinger?: FingerName;
  shiftFinger?: FingerName;
  className?: string;
}

interface FingerDef {
  id: FingerName;
  label: string;
  short: string;
  x: number;
  y: number;
  height: number;
  width: number;
}

const LEFT_FINGERS: FingerDef[] = [
  { id: 'left-pinky', label: 'L. Pinky', short: 'P', x: 6, y: 16, height: 26, width: 7 },
  { id: 'left-ring', label: 'L. Ring', short: 'R', x: 16, y: 8, height: 34, width: 7 },
  { id: 'left-middle', label: 'L. Middle', short: 'M', x: 26, y: 4, height: 38, width: 7 },
  { id: 'left-index', label: 'L. Index', short: 'I', x: 36, y: 9, height: 33, width: 7 },
  { id: 'thumb', label: 'Thumb', short: 'T', x: 47, y: 24, height: 20, width: 8 },
];

const RIGHT_FINGERS: FingerDef[] = [
  { id: 'thumb', label: 'Thumb', short: 'T', x: 5, y: 24, height: 20, width: 8 },
  { id: 'right-index', label: 'R. Index', short: 'I', x: 16, y: 9, height: 33, width: 7 },
  { id: 'right-middle', label: 'R. Middle', short: 'M', x: 26, y: 4, height: 38, width: 7 },
  { id: 'right-ring', label: 'R. Ring', short: 'R', x: 36, y: 8, height: 34, width: 7 },
  { id: 'right-pinky', label: 'R. Pinky', short: 'P', x: 46, y: 16, height: 26, width: 7 },
];

export const HandDiagram: React.FC<HandDiagramProps> = ({
  activeFinger,
  shiftFinger,
  className = '',
}) => {
  const renderHand = (fingers: FingerDef[], handName: 'Left' | 'Right') => {
    return (
      <div className="flex flex-col items-center">
        <svg
          viewBox="0 0 60 56"
          className="w-11 h-10 sm:w-13 sm:h-11 overflow-visible"
        >
          {/* Palm base */}
          <path
            d={
              handName === 'Left'
                ? 'M 4 36 C 4 48, 12 52, 28 52 C 44 52, 50 48, 48 38 C 46 32, 44 32, 40 32 L 8 32 Z'
                : 'M 12 38 C 10 48, 16 52, 32 52 C 48 52, 56 48, 56 36 L 20 32 C 16 32, 14 32, 12 38 Z'
            }
            fill="currentColor"
            className="text-theme-border/60"
          />

          {/* Fingers */}
          {fingers.map((f) => {
            const isActive = activeFinger === f.id;
            const isShift = shiftFinger === f.id && !isActive;

            let fill = '#3f3f46'; // zinc-700
            let stroke = '#27272a'; // zinc-800
            let glow = false;

            if (isActive) {
              fill = '#10b981'; // emerald-500
              stroke = '#34d399'; // emerald-400
              glow = true;
            } else if (isShift) {
              fill = '#f59e0b'; // amber-500
              stroke = '#fbbf24'; // amber-400
              glow = true;
            }

            return (
              <g key={f.id + f.short} className="transition-all duration-150">
                {/* Finger pill */}
                <rect
                  x={f.x}
                  y={f.y}
                  width={f.width}
                  height={f.height}
                  rx={f.width / 2}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="1"
                  className={glow ? 'filter drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]' : ''}
                />
                {/* Fingertip dot */}
                {(isActive || isShift) && (
                  <circle
                    cx={f.x + f.width / 2}
                    cy={f.y + 4}
                    r="2"
                    fill="#ffffff"
                  />
                )}
              </g>
            );
          })}
        </svg>
        <span className="text-[8px] sm:text-[9px] font-mono text-theme-text-muted mt-0.5">
          {handName}
        </span>
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-2 px-2 py-0.5 bg-theme-bg/80 border border-theme-border/60 rounded-lg select-none ${className}`}>
      {renderHand(LEFT_FINGERS, 'Left')}
      <div className="h-6 w-[1px] bg-theme-border/60 mx-0.5" />
      {renderHand(RIGHT_FINGERS, 'Right')}
    </div>
  );
};
