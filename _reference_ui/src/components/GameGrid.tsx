import React from 'react';

interface GameGridProps {
  guesses: Array<{
    letters: string[];
    states: ('correct' | 'present' | 'absent' | 'empty' | 'current')[];
  }>;
  currentRow: number;
  resolvingTileIndex: number;
  gameStatus: 'playing' | 'won' | 'lost';
  difficulty?: 'normal' | 'hard' | 'extreme';
}

export function GameGrid({ guesses, currentRow, resolvingTileIndex, gameStatus, difficulty = 'normal' }: GameGridProps) {
  const getTileStyle = (state: string, isResolving: boolean) => {
    const baseStyle = 'w-12 h-12 md:w-14 md:h-14 border-2 flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-200';
    
    if (isResolving) {
      return `${baseStyle} border-cyan-400 bg-slate-800 shadow-[0_0_8px_rgba(6,182,212,0.4)] scale-105`;
    }

    // In Extreme mode, override visual feedback for submitted tiles (correct/present/absent)
    // We keep 'current' logic for typing
    if (difficulty === 'extreme' && (state === 'correct' || state === 'present' || state === 'absent')) {
       // Neutral "submitted" style
       return `${baseStyle} border-cyan-900/60 bg-slate-900/40 text-cyan-100/80`;
    }

    // In Hard mode, suppress partial signals (treat 'present' as 'absent' visually)
    if (difficulty === 'hard' && state === 'present') {
      return `${baseStyle} bg-slate-800/40 border-slate-700 text-slate-500`;
    }
    
    switch (state) {
      case 'correct':
        return `${baseStyle} bg-green-900/60 border-green-600 text-green-100 shadow-[0_0_6px_rgba(34,197,94,0.3)]`;
      case 'present':
        return `${baseStyle} bg-amber-900/60 border-amber-600 text-amber-100 shadow-[0_0_6px_rgba(251,191,36,0.3)]`;
      case 'absent':
        return `${baseStyle} bg-slate-800/40 border-slate-700 text-slate-500`;
      case 'current':
        return `${baseStyle} border-cyan-500 text-cyan-300 bg-slate-900/40 animate-[borderPulse_80ms_ease-out]`;
      default:
        return `${baseStyle} border-cyan-900/40 text-cyan-300 bg-slate-900/20`;
    }
  };

  return (
    <div className="grid grid-rows-6 gap-2 md:gap-2.5">
      {guesses.map((guess, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 md:gap-2.5">
          {guess.letters.map((letter, colIndex) => {
            const isResolving = rowIndex === currentRow && colIndex === resolvingTileIndex;
            const tileIndex = rowIndex * 5 + colIndex;
            
            return (
              <div
                key={colIndex}
                className={getTileStyle(guess.states[colIndex], isResolving)}
                style={{
                  animation: guess.states[colIndex] === 'current' && letter 
                    ? 'letterFadeIn 150ms ease-out' 
                    : undefined
                }}
              >
                <span style={{
                  opacity: letter ? 1 : 0,
                  transition: 'opacity 150ms ease-out'
                }}>
                  {letter}
                </span>
              </div>
            );
          })}
        </div>
      ))}
      
      <style>{`
        @keyframes borderPulse {
          0% { border-color: rgba(6, 182, 212, 0.4); }
          50% { border-color: rgba(6, 182, 212, 0.8); }
          100% { border-color: rgba(6, 182, 212, 0.5); }
        }
        
        @keyframes letterFadeIn {
          0% { opacity: 0.7; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}