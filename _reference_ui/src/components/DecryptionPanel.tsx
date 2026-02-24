import React, { useState, useEffect } from 'react';

interface DecryptionPanelProps {
  greens: number;
  yellows: number;
  attemptsUsed: number;
  gameStatus: 'playing' | 'won' | 'lost';
  isMobile?: boolean;
  difficulty?: 'normal' | 'hard' | 'extreme';
}

export function DecryptionPanel({ greens, yellows, attemptsUsed, gameStatus, isMobile = false, difficulty = 'normal' }: DecryptionPanelProps) {
  const [roughWork, setRoughWork] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [confidenceText, setConfidenceText] = useState('');
  const [displayedRecovery, setDisplayedRecovery] = useState(0);

  const breachWindowsRemaining = 6 - attemptsUsed;
  const maxSignals = 5; // Based on 5-letter word
  const systemConfidence = greens >= 3 ? 'HIGH' : greens >= 1 ? 'MEDIUM' : 'LOW';
  const dataRecovery = Math.min(Math.floor((greens * 15) + (yellows * 5)), 100);

  // Cursor blink effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 800);
      return () => clearInterval(interval);
    } else {
      setShowCursor(false);
    }
  }, [gameStatus]);

  // Typed confidence effect
  useEffect(() => {
    const targetText = systemConfidence;
    let currentIndex = 0;
    setConfidenceText('');
    
    const typeInterval = setInterval(() => {
      if (currentIndex < targetText.length) {
        setConfidenceText(targetText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);
    
    return () => clearInterval(typeInterval);
  }, [systemConfidence]);

  // Stepped recovery percentage
  useEffect(() => {
    if (displayedRecovery < dataRecovery) {
      const step = Math.ceil((dataRecovery - displayedRecovery) / 3);
      const timeout = setTimeout(() => {
        setDisplayedRecovery(Math.min(displayedRecovery + step, dataRecovery));
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [dataRecovery, displayedRecovery]);

  const handleRoughWorkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRoughWork(e.target.value);
  };

  const renderSignalBlocks = (value: number, max: number, type: 'verified' | 'partial') => {
    // If Extreme Difficulty, show jammed signals
    if (difficulty === 'extreme') {
       return (
         <div className="flex gap-1.5 opacity-50">
           {Array.from({ length: max }).map((_, i) => (
             <div
               key={i}
               className="w-6 h-6 rounded bg-slate-900/40 border border-slate-800 flex items-center justify-center"
             >
               <span className="text-[10px] text-slate-700 select-none">×</span>
             </div>
           ))}
         </div>
       );
    }
    
    // If Hard Difficulty, suppress partial signals
    if (difficulty === 'hard' && type === 'partial') {
      return (
         <div className="flex gap-1.5 opacity-50">
           {Array.from({ length: max }).map((_, i) => (
             <div
               key={i}
               className="w-6 h-6 rounded bg-slate-900/40 border border-slate-800 flex items-center justify-center"
             >
               <span className="text-[10px] text-slate-700 select-none">-</span>
             </div>
           ))}
         </div>
       );
    }

    const color = type === 'verified' ? 'bg-green-500' : 'bg-amber-500';
    const glowColor = type === 'verified' 
      ? 'shadow-[0_0_6px_rgba(34,197,94,0.5)]' 
      : 'shadow-[0_0_6px_rgba(251,191,36,0.5)]';
    
    return (
      <div className="flex gap-1.5">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded transition-all duration-500 ${
              i < value 
                ? `${color} ${glowColor}` 
                : 'bg-slate-900/60 border border-cyan-900/30'
            }`}
            style={{
              transitionDelay: `${i * 120}ms`
            }}
          />
        ))}
      </div>
    );
  };

  const renderDataRecoveryBlocks = () => {
    const totalBlocks = 14;
    const filledBlocks = Math.floor((displayedRecovery / 100) * totalBlocks);
    
    return (
      <div className="flex gap-1">
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded transition-all duration-300 ${
              i < filledBlocks 
                ? 'bg-cyan-600 shadow-[0_0_4px_rgba(8,145,178,0.4)]' 
                : 'bg-slate-900/60 border border-cyan-900/30'
            }`}
            style={{
              transitionDelay: `${i * 80}ms`
            }}
          />
        ))}
      </div>
    );
  };

  const renderBreachWindows = () => {
    return (
      <div className="flex gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded transition-all duration-300 ${
              i < breachWindowsRemaining
                ? 'bg-slate-600 border border-cyan-700/50'
                : 'bg-transparent border border-red-900/30 opacity-30'
            }`}
            style={{
              animation: i === breachWindowsRemaining && attemptsUsed > 0
                ? 'windowCollapse 400ms ease-out'
                : undefined
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`${isMobile ? 'w-full' : 'w-80'} border border-cyan-900/40 rounded-lg bg-slate-900/30 p-4 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm tracking-widest text-cyan-400/80">[ DECRYPTION STATE ]</h2>
        <div className="text-xs text-cyan-500/60">Ø{200 + greens * 20 + yellows * 10}</div>
      </div>
      
      {/* Verified Signals */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDuration: '2s' }}></div>
          <span className="text-xs tracking-wider text-green-400">VERIFIED SIGNALS</span>
        </div>
        {renderSignalBlocks(greens, maxSignals, 'verified')}
      </div>
      
      {/* Partial Signals */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDuration: '2s' }}></div>
          <span className="text-xs tracking-wider text-amber-400">PARTIAL SIGNALS</span>
        </div>
        {renderSignalBlocks(yellows, maxSignals, 'partial')}
      </div>
      
      {/* System Confidence */}
      <div className="mb-5 pb-5 border-b border-cyan-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs text-cyan-500/60 tracking-wider">SYSTEM CONFIDENCE</span>
          <span className={`text-sm font-mono font-bold tracking-wider ${
            systemConfidence === 'HIGH' ? 'text-green-400' :
            systemConfidence === 'MEDIUM' ? 'text-amber-400' :
            'text-red-400'
          }`}>
            {confidenceText}
          </span>
        </div>
      </div>
      
      {/* Data Recovery */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-cyan-500/60 tracking-wider">DATA RECOVERY</span>
          <span className="text-sm font-mono font-bold text-cyan-400">{displayedRecovery}%</span>
        </div>
        {renderDataRecoveryBlocks()}
      </div>
      
      {/* Scratch Buffer */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs tracking-wider text-cyan-400/80">SCRATCH BUFFER</span>
          {gameStatus !== 'playing' && (
            <span className="text-xs text-red-400/60">[ LOCKED ]</span>
          )}
        </div>
        <div className="relative">
          <textarea
            value={roughWork}
            onChange={handleRoughWorkChange}
            placeholder="> TYPE NOTES HERE..."
            className={`w-full ${isMobile ? 'h-24' : 'h-32'} bg-slate-950/60 border border-cyan-900/50 rounded text-xs text-cyan-300 font-mono p-2 resize-none focus:outline-none focus:border-cyan-700 placeholder:text-cyan-900/60 caret-cyan-500 transition-all duration-200 ${
              gameStatus !== 'playing' ? 'opacity-60' : ''
            }`}
            spellCheck={false}
            disabled={gameStatus !== 'playing'}
          />
          {gameStatus === 'playing' && showCursor && roughWork.length === 0 && (
            <div className="absolute left-2 top-2 w-0.5 h-4 bg-cyan-500 animate-[cursorBlink_800ms_step-end_infinite]" />
          )}
        </div>
      </div>
      
      {/* Breach Windows Remaining */}
      <div>
        <div className="text-xs text-cyan-500/60 tracking-wider mb-2">
          BREACH WINDOWS REMAINING
        </div>
        {renderBreachWindows()}
      </div>
      
      <style>{`
        @keyframes cursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        
        @keyframes windowCollapse {
          0% { 
            transform: scale(1);
            opacity: 1;
            background-color: rgb(71, 85, 105);
          }
          50% { 
            transform: scale(0.9);
            opacity: 0.5;
            background-color: rgb(239, 68, 68);
          }
          100% { 
            transform: scale(1);
            opacity: 0.3;
            background-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}