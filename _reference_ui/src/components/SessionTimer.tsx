import React from 'react';

interface SessionTimerProps {
  timeRemaining: number;
  sessionTimeLimit: number;
  compact?: boolean;
  gameStatus?: 'playing' | 'won' | 'lost';
}

export function SessionTimer({ timeRemaining, sessionTimeLimit, compact = false, gameStatus = 'playing' }: SessionTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  const isLowTime = timeRemaining <= 30 && timeRemaining > 0;
  const isExpired = timeRemaining === 0;
  const isEnded = gameStatus !== 'playing';
  
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-2">
        <span className={`text-[9px] tracking-[0.12em] uppercase transition-all duration-300 ${
          isEnded
            ? 'text-cyan-500/50'
            : isExpired 
              ? 'text-red-400/80' 
              : isLowTime 
                ? 'text-amber-400/80' 
                : 'text-cyan-500/60'
        }`}>
          {isEnded ? 'SESSION ENDED' : isExpired ? 'SESSION EXPIRED' : 'SESSION TIME REMAINING'}
        </span>
        <span className={`text-sm font-mono font-bold transition-all duration-300 ${
          isEnded
            ? 'text-cyan-400/60'
            : isExpired 
              ? 'text-red-400' 
              : isLowTime 
                ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]' 
                : 'text-cyan-400'
        }`}>
          <span className="transition-opacity duration-200" key={timeRemaining}>
            {isExpired ? 'EXPIRED' : timeString}
          </span>
        </span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs tracking-wider transition-all duration-300 ${
        isExpired 
          ? 'text-red-400/80' 
          : isLowTime 
            ? 'text-amber-400/80' 
            : 'text-cyan-500/80'
      }`}>
        {isExpired ? 'SESSION EXPIRED' : 'SESSION TIME'}
      </span>
      {!isExpired && (
        <span className={`text-sm font-mono font-bold transition-all duration-300 ${
          isLowTime 
            ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' 
            : 'text-cyan-400'
        }`}>
          <span className="transition-opacity duration-200" key={timeRemaining}>
            {timeString}
          </span>
        </span>
      )}
    </div>
  );
}