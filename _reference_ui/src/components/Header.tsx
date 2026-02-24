import React from 'react';
import { Menu } from 'lucide-react';
import { SessionTimer } from './SessionTimer';

interface HeaderProps {
  timeRemaining: number;
  sessionTimeLimit: number;
  onLeaderboardOpen?: () => void;
}

export function Header({ timeRemaining, sessionTimeLimit, onLeaderboardOpen }: HeaderProps) {
  return (
    <header className="border-b border-cyan-900/40 bg-slate-900/30 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-cyan-500/60" />
          <h1 className="text-xl lg:text-2xl font-bold tracking-[0.3em] text-cyan-400">
            HARDLE
          </h1>
        </div>
        
        {/* Center - Timer (Desktop only) */}
        <div className="hidden lg:block">
          <SessionTimer 
            timeRemaining={timeRemaining} 
            sessionTimeLimit={sessionTimeLimit}
          />
        </div>
        
        {/* Right - Leaderboard Button */}
        <div>
          <button
            onClick={onLeaderboardOpen}
            className="px-3 py-1.5 lg:px-4 lg:py-2 border border-cyan-900/60 bg-slate-900/40 text-cyan-400 font-mono text-xs lg:text-sm tracking-wider uppercase rounded hover:bg-slate-800/60 hover:border-cyan-700 transition-all hover:shadow-[0_0_8px_rgba(6,182,212,0.3)]"
          >
            Leaderboard
          </button>
        </div>
      </div>
    </header>
  );
}