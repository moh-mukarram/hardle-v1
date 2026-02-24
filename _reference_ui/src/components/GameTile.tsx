import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './ui/utils';
import { EASE_MECHANICAL, EASE_TACTICAL } from '../lib/animations';

interface GameTileProps {
  letter: string;
  state: 'correct' | 'present' | 'absent' | 'empty' | 'current';
  isResolving: boolean;
  difficulty?: 'normal' | 'hard' | 'extreme';
  delay?: number;
}

export function GameTile({ letter, state, isResolving, difficulty = 'normal', delay = 0 }: GameTileProps) {
  const [prevLetter, setPrevLetter] = useState(letter);
  
  // Track letter changes for "pop" effect on type
  useEffect(() => {
    if (letter !== prevLetter) {
      setPrevLetter(letter);
    }
  }, [letter, prevLetter]);

  // Base style classes
  const baseStyle = "w-12 h-12 md:w-14 md:h-14 border-2 flex items-center justify-center text-xl md:text-2xl font-bold select-none relative overflow-hidden";
  
  // Determine visual state based on difficulty
  let visualState = state;
  if (difficulty === 'extreme' && (state === 'correct' || state === 'present' || state === 'absent')) {
    visualState = 'submitted'; // Neutral style for extreme
  } else if (difficulty === 'hard' && state === 'present') {
    visualState = 'absent'; // Suppress partials
  }

  // Get colors based on visual state
  const getColors = () => {
    if (isResolving) {
      return "border-cyan-400 bg-slate-800 text-cyan-50 shadow-[0_0_15px_rgba(6,182,212,0.4)] z-10";
    }
    
    switch (visualState) {
      case 'correct':
        return "bg-green-900/40 border-green-500 text-green-50 shadow-[0_0_10px_rgba(34,197,94,0.2)]";
      case 'present':
        return "bg-amber-900/40 border-amber-500 text-amber-50 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
      case 'absent':
        return "bg-slate-800/40 border-slate-700 text-slate-500";
      case 'submitted': // Extreme mode neutral
        return "bg-slate-900/40 border-cyan-900/60 text-cyan-100/60";
      case 'current':
        return "border-cyan-500 text-cyan-300 bg-slate-900/40 shadow-[0_0_10px_rgba(6,182,212,0.1)]";
      default: // empty
        return "border-cyan-900/30 text-cyan-300 bg-slate-900/10";
    }
  };

  const variants = {
    initial: { rotateX: 0, scale: 1 },
    flipIn: { 
      rotateX: 90, 
      transition: { duration: 0.15, ease: "easeIn" } 
    },
    flipOut: { 
      rotateX: 0, 
      transition: { duration: 0.15, ease: "easeOut" } 
    },
    pop: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.1 }
    }
  };

  // If state changed to correct/present/absent (meaning it was resolved), trigger flip
  // However, isResolving handles the intermediate state.
  // The flow is: empty/current -> isResolving=true -> correct/present/absent
  
  return (
    <motion.div
      layout
      initial={false}
      animate={
        isResolving ? "flipIn" : 
        (state !== 'empty' && state !== 'current' && !isResolving) ? "flipOut" : 
        (letter && state === 'current') ? "pop" : "initial"
      }
      variants={variants}
      className={cn(baseStyle, getColors())}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: letter ? 1 : 0 }}
        className="relative z-10"
      >
        {letter}
      </motion.span>
      
      {/* Background scanline texture for active/filled tiles */}
      {(state === 'current' || state === 'correct' || state === 'present') && (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDAsIDAsIDAsIDAuMikiLz4KPC9zdmc+')] opacity-20 pointer-events-none" />
      )}
      
      {/* Flash effect on type */}
      {state === 'current' && letter && (
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-cyan-100 mix-blend-overlay pointer-events-none"
        />
      )}
    </motion.div>
  );
}
