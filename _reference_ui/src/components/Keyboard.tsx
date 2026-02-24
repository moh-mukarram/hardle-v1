import React from 'react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStates: Map<string, 'correct' | 'present' | 'absent' | 'empty' | 'current'>;
  enterPressed: boolean;
  disabled: boolean;
  difficulty?: 'normal' | 'hard' | 'extreme';
}

export function Keyboard({ onKeyPress, keyStates, enterPressed, disabled, difficulty = 'normal' }: KeyboardProps) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ];

  const getKeyStyle = (key: string) => {
    let state = keyStates.get(key);
    
    // In Extreme mode, treat all non-empty states as 'neutral' or hide them
    if (difficulty === 'extreme' && state) {
       state = undefined; 
    }

    // In Hard mode, suppress partial signals
    if (difficulty === 'hard' && state === 'present') {
      state = 'absent';
    }

    const baseStyle = 'px-2 py-3 md:px-4 md:py-4 rounded border-2 font-bold text-xs md:text-sm transition-all duration-200 min-w-[32px] md:min-w-[40px] active:scale-95';
    
    if (key === 'ENTER' && enterPressed) {
      return `${baseStyle} bg-cyan-600 border-cyan-400 text-cyan-50 shadow-[0_0_12px_rgba(6,182,212,0.6)] scale-95`;
    }
    
    switch (state) {
      case 'correct':
        return `${baseStyle} bg-green-900/60 border-green-600 text-green-100 shadow-[0_0_4px_rgba(34,197,94,0.3)]`;
      case 'present':
        return `${baseStyle} bg-amber-900/60 border-amber-600 text-amber-100 shadow-[0_0_4px_rgba(251,191,36,0.3)]`;
      case 'absent':
        return `${baseStyle} bg-slate-800/40 border-slate-700 text-slate-500`;
      default:
        return `${baseStyle} bg-slate-900/40 border-cyan-900/60 text-cyan-300 hover:bg-slate-800/60 hover:border-cyan-700`;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-1.5 md:space-y-2 -mt-1 md:mt-0 animate-[fadeIn_200ms_ease-out] px-[0px] py-[45px]">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 md:gap-1.5">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              disabled={disabled}
              className={getKeyStyle(key)}
              style={{
                minWidth: key === 'ENTER' || key === 'BACKSPACE' ? '60px' : undefined,
              }}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </button>
          ))}
        </div>
      ))}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}