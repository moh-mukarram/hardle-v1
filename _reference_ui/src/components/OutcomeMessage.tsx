import React, { useState, useEffect } from 'react';

interface OutcomeMessageProps {
  primary: string;
  secondary: string;
  solution: string;
  pointsGained: number;
  gameStatus?: 'won' | 'lost';
}

export function OutcomeMessage({ primary, secondary, solution, pointsGained, gameStatus = 'won' }: OutcomeMessageProps) {
  const [visible, setVisible] = useState(false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [pointsVisible, setPointsVisible] = useState(false);

  useEffect(() => {
    // Stagger the appearance
    const timer1 = setTimeout(() => setVisible(true), 100);
    const timer2 = setTimeout(() => setSolutionVisible(true), 400);
    const timer3 = setTimeout(() => setPointsVisible(true), 700);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 py-4 lg:py-4 border-y border-cyan-900/40 my-3 lg:my-4 bg-slate-900/20 lg:bg-transparent px-4 lg:px-0 lg:items-center">
      {/* SECTION 1 — LEFT (OUTCOME) */}
      <div className={`flex-1 flex flex-col gap-2 lg:gap-2 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        {/* Primary status */}
        <div className="text-sm md:text-lg lg:text-xl text-cyan-300 font-mono tracking-[0.2em] font-bold uppercase">
          {primary}
        </div>
        
        {/* Secondary narrative */}
        <div className="text-[10px] md:text-sm text-cyan-500/60 font-mono tracking-[0.15em] uppercase">
          {secondary}
        </div>
        
        {/* Solution reveal */}
        <div className={`mt-1 lg:mt-3 transition-all duration-500 delay-300 ${
          solutionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="text-[10px] text-cyan-500/60 tracking-widest uppercase mb-1">Solution</div>
          <div className="text-xl md:text-3xl text-cyan-400 font-mono tracking-[0.3em] font-bold">
            {solution.split('').map((letter, i) => (
              <span 
                key={i}
                className="inline-block animate-[letterReveal_150ms_ease-out_forwards]"
                style={{ 
                  animationDelay: `${i * 80}ms`,
                  opacity: 0
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* SECTION 2 — CENTER (SESSION IMPACT) */}
      <div className={`flex-shrink-0 flex flex-col items-center justify-center text-center lg:px-6 transition-all duration-500 delay-500 ${
        pointsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div className="text-[10px] text-cyan-500/60 tracking-widest uppercase mb-1">
          {gameStatus === 'won' ? 'Points Gained' : 'Points Deducted'}
        </div>
        <div className={`text-xl font-mono font-bold animate-[pointsPulse_400ms_ease-out] ${
          gameStatus === 'won' ? 'text-cyan-300' : 'text-red-400'
        }`}>
          {gameStatus === 'won' ? '+' : '−'}{pointsGained} PTS
        </div>
      </div>
      
      {/* SECTION 3 — RIGHT (NEXT ACTION) */}
      <div className={`flex-shrink-0 flex items-center justify-center lg:justify-end transition-all duration-500 delay-700 ${
        pointsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
      }`}>
        <button className="w-full lg:w-auto px-5 py-2 border-2 border-cyan-900/60 bg-slate-900/40 text-cyan-400 font-mono text-xs tracking-wider uppercase rounded hover:bg-slate-800/60 hover:border-cyan-700 transition-all hover:shadow-[0_0_8px_rgba(6,182,212,0.3)]">
          Return to Modes
        </button>
      </div>
      
      <style>{`
        @keyframes letterReveal {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pointsPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}