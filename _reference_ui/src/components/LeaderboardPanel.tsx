import React from 'react';
import { X } from 'lucide-react';

interface LeaderboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlayerPoints: number;
}

// Fixed placeholder data as requested
const LEADERBOARD_DATA = [
  { position: '01', username: 'l0bed', points: 9128, isCurrent: true },
  { position: '02', username: 'nx_root', points: 9051, isCurrent: false },
  { position: '03', username: 'hexnull', points: 8970, isCurrent: false },
  { position: '04', username: 'byte_rx', points: 8822, isCurrent: false },
  { position: '05', username: 'nullsec', points: 8704, isCurrent: false },
];

export function LeaderboardPanel({ isOpen, onClose }: LeaderboardPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-[#0a0e1a] border-l border-cyan-900/40 z-50 flex flex-col shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.5)] transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="border-b border-cyan-900/40 p-4 md:p-6 bg-slate-900/30">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg md:text-xl text-cyan-400 font-mono tracking-widest font-bold">
              GLOBAL CLEARANCE LEADERBOARD
            </h2>
            <button
              onClick={onClose}
              className="text-cyan-400 hover:text-cyan-300 transition-colors p-1"
              aria-label="Close leaderboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center justify-between">
              <span className="text-cyan-500/60 tracking-wider">CURRENT CLEARANCE</span>
              <span className="text-cyan-300 font-bold tracking-wider">CLEARANCE II</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cyan-500/60 tracking-wider">RESET IN</span>
              <span className="text-cyan-300 font-bold">18 DAYS</span>
            </div>
          </div>
        </div>
        
        {/* Table Header */}
        <div className="border-b border-cyan-900/40 px-4 md:px-6 py-3 bg-slate-900/20">
          <div className="grid grid-cols-[60px_1fr_100px] gap-4 text-xs text-cyan-500/60 tracking-widest font-mono">
            <div>POSITION</div>
            <div>USERNAME</div>
            <div className="text-right">POINTS</div>
          </div>
        </div>
        
        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-6">
            {LEADERBOARD_DATA.map((entry) => (
              <div
                key={entry.username}
                className={`grid grid-cols-[60px_1fr_100px] gap-4 py-3 border-b border-cyan-900/20 font-mono text-sm ${
                  entry.isCurrent 
                    ? 'bg-cyan-900/10 text-cyan-300 font-bold' 
                    : 'text-cyan-400/80'
                }`}
              >
                <div className="text-cyan-500/60 font-mono">
                  {entry.position}
                </div>
                <div className="truncate">
                  {entry.username}
                  {entry.isCurrent && <span className="ml-2 text-xs text-cyan-500/60 tracking-wider">[YOU]</span>}
                </div>
                <div className="text-right tabular-nums tracking-wider">
                  {entry.points}
                </div>
              </div>
            ))}
            
            {/* Additional filler rows to show scrolling capability if needed, 
                but prompt asked specifically for the top 5. 
                I will stick to the top 5 to be precise. */}
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="border-t border-cyan-900/40 px-4 md:px-6 py-3 bg-slate-900/30">
          <p className="text-xs text-cyan-500/50 font-mono tracking-wide">
            FILTER: [CLEARANCE II] ONLY
          </p>
        </div>
      </div>
    </>
  );
}
