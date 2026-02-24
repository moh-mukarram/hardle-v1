import React, { useState, useEffect } from 'react';

interface ClearancePanelProps {
  currentTotalPoints: number;
  pointsGained: number;
  gameStatus: 'won' | 'lost';
}

interface Rank {
  name: string;
  minPoints: number;
}

const RANKS: Rank[] = [
  { name: 'UNVERIFIED', minPoints: 0 },
  { name: 'CLEARANCE I', minPoints: 100 },
  { name: 'CLEARANCE II', minPoints: 300 },
  { name: 'CLEARANCE III', minPoints: 600 },
  { name: 'SECURE ACCESS', minPoints: 1000 },
  { name: 'ELEVATED ACCESS', minPoints: 1500 },
  { name: 'RESTRICTED ACCESS', minPoints: 2100 },
  { name: 'SYSTEM OPERATOR', minPoints: 2800 },
  { name: 'CORE OPERATOR', minPoints: 3600 },
  { name: 'ROOT ACCESS', minPoints: 4500 },
];

export function ClearancePanel({ currentTotalPoints, pointsGained, gameStatus }: ClearancePanelProps) {
  const [visible, setVisible] = useState(false);
  const [rankChangeVisible, setRankChangeVisible] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setVisible(true), 200);
    const timer2 = setTimeout(() => setRankChangeVisible(true), 600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getRankByPoints = (points: number): Rank => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (points >= RANKS[i].minPoints) {
        return RANKS[i];
      }
    }
    return RANKS[0];
  };

  const getNextRank = (currentRank: Rank): Rank | null => {
    const currentIndex = RANKS.findIndex(r => r.name === currentRank.name);
    if (currentIndex < RANKS.length - 1) {
      return RANKS[currentIndex + 1];
    }
    return null;
  };

  const calculateProgress = (points: number, currentRank: Rank): number => {
    const nextRank = getNextRank(currentRank);
    if (!nextRank) return 100;
    
    const currentMin = currentRank.minPoints;
    const nextMin = nextRank.minPoints;
    const range = nextMin - currentMin;
    const progress = points - currentMin;
    
    return Math.floor((progress / range) * 100);
  };

  const pointsChange = gameStatus === 'won' ? pointsGained : -Math.abs(pointsGained);
  const previousPoints = currentTotalPoints - pointsChange;
  const newPoints = currentTotalPoints;
  
  const previousRank = getRankByPoints(previousPoints);
  const newRank = getRankByPoints(newPoints);
  
  const rankChanged = previousRank.name !== newRank.name;
  const rankIncreased = rankChanged && newRank.minPoints > previousRank.minPoints;
  const rankDecreased = rankChanged && newRank.minPoints < previousRank.minPoints;
  
  const progress = calculateProgress(newPoints, newRank);
  const nextRank = getNextRank(newRank);

  return (
    <div className={`w-full lg:w-80 border border-cyan-900/40 rounded-lg bg-slate-900/30 p-4 backdrop-blur-sm transition-all duration-500 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm tracking-widest text-cyan-400/80">CLEARANCE REPORT</h2>
        <div className="text-xs text-cyan-500/60">SYS-EVAL</div>
      </div>
      
      {/* Current Rank */}
      <div className="mb-6">
        <div className="text-[10px] text-cyan-500/60 tracking-widest uppercase mb-2">
          Current Clearance
        </div>
        <div className="text-lg text-cyan-300 font-mono tracking-[0.2em] font-bold">
          {previousRank.name}
        </div>
      </div>
      
      {/* Points Impact */}
      <div className="mb-6 pb-6 border-b border-cyan-900/30">
        <div className="text-[10px] text-cyan-500/60 tracking-widest uppercase mb-2">
          {gameStatus === 'won' ? 'Points Added' : 'Points Deducted'}
        </div>
        <div className={`text-base font-mono font-bold animate-[pointsFlash_300ms_ease-out] ${
          gameStatus === 'won' ? 'text-green-400' : 'text-red-400'
        }`}>
          {gameStatus === 'won' ? '+' : '−'}{Math.abs(pointsChange)} PTS
        </div>
      </div>
      
      {/* Rank Change Status */}
      <div className={`mb-6 transition-all duration-500 delay-400 ${
        rankChangeVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
      }`}>
        {rankIncreased && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs tracking-wider text-green-400 uppercase">Rank Increased</span>
            </div>
            <div className="text-[10px] text-green-500/60 tracking-widest uppercase mb-3">
              Access Level Upgraded
            </div>
            <div className="text-lg text-green-300 font-mono tracking-[0.2em] font-bold animate-[rankGlow_600ms_ease-out]">
              {newRank.name}
            </div>
          </>
        )}
        
        {rankDecreased && (
          <>
            <div className="flex items-center gap-2 mb-2 animate-[alertFlash_200ms_ease-out]">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-xs tracking-wider text-red-400 uppercase">Rank Reduced</span>
            </div>
            <div className="text-[10px] text-red-500/60 tracking-widest uppercase mb-3">
              Access Level Revoked
            </div>
            <div className="text-lg text-red-300 font-mono tracking-[0.2em] font-bold">
              {newRank.name}
            </div>
          </>
        )}
        
        {!rankChanged && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-xs tracking-wider text-amber-400 uppercase">Rank Unchanged</span>
            </div>
            <div className="text-lg text-cyan-300 font-mono tracking-[0.2em] font-bold mt-3">
              {newRank.name}
            </div>
          </>
        )}
      </div>
      
      {/* Progress Indicator */}
      {nextRank && (
        <div className="pt-6 border-t border-cyan-900/30">
          <div className="text-[10px] text-cyan-500/60 tracking-widest uppercase mb-2">
            Progress to Next Clearance
          </div>
          <div className="text-sm text-cyan-400 font-mono font-bold mb-2">
            {progress}%
          </div>
          <div className="text-[10px] text-cyan-500/50 font-mono">
            {nextRank.minPoints - newPoints} PTS to {nextRank.name}
          </div>
        </div>
      )}
      
      {!nextRank && (
        <div className="pt-6 border-t border-cyan-900/30">
          <div className="text-[10px] text-cyan-500/60 tracking-widest uppercase mb-2">
            Maximum Clearance Achieved
          </div>
          <div className="text-xs text-green-400/60 font-mono">
            ROOT ACCESS GRANTED
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes pointsFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes rankGlow {
          0% { text-shadow: none; }
          50% { text-shadow: 0 0 12px rgba(34, 197, 94, 0.6); }
          100% { text-shadow: none; }
        }
        
        @keyframes alertFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}