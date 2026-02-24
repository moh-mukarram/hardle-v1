import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTile } from './GameTile';
import { cn } from './ui/utils';
import { SCAN_TRANSITION } from '../lib/animations';

interface GameRowProps {
  guess: {
    letters: string[];
    states: ('correct' | 'present' | 'absent' | 'empty' | 'current')[];
  };
  rowIndex: number;
  currentRow: number;
  resolvingTileIndex: number;
  difficulty?: 'normal' | 'hard' | 'extreme';
  isProcessing: boolean;
}

export function GameRow({ 
  guess, 
  rowIndex, 
  currentRow, 
  resolvingTileIndex, 
  difficulty,
  isProcessing 
}: GameRowProps) {
  const isCurrentRow = rowIndex === currentRow;
  const isSubmitted = rowIndex < currentRow; // Rows above current are submitted
  
  // Track if this row is currently being "scanned"
  // This state is triggered when resolving starts for this row (resolvingTileIndex >= 0)
  // and we are the currentRow.
  const isScanning = isCurrentRow && resolvingTileIndex >= 0;

  // Row compression animation variants
  const rowVariants = {
    initial: { scaleY: 1 },
    compress: { 
      scaleY: 0.98,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    expand: {
      scaleY: 1,
      transition: { duration: 0.3, ease: "backOut" }
    }
  };

  return (
    <motion.div 
      layout
      variants={rowVariants}
      animate={isScanning ? "compress" : "expand"}
      className="relative flex gap-2 md:gap-2.5"
    >
      {/* Scan Line Effect */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ left: "-10%", opacity: 0 }}
            animate={{ 
              left: "110%", 
              opacity: [0, 1, 1, 0],
              transition: { 
                duration: 0.4, 
                ease: "linear",
                times: [0, 0.1, 0.9, 1]
              }
            }}
            exit={{ opacity: 0 }}
            className="absolute top-0 bottom-0 w-1 bg-cyan-400/80 shadow-[0_0_15px_2px_rgba(34,211,238,0.6)] z-20 pointer-events-none blur-[1px]"
            style={{ mixBlendMode: 'screen' }}
          />
        )}
      </AnimatePresence>

      {/* Tiles */}
      {guess.letters.map((letter, colIndex) => {
        // Tile is resolving if this is the current row AND the resolving index matches
        const isResolving = isCurrentRow && colIndex === resolvingTileIndex;
        
        return (
          <GameTile 
            key={`${rowIndex}-${colIndex}`}
            letter={letter}
            state={guess.states[colIndex]}
            isResolving={isResolving}
            difficulty={difficulty}
          />
        );
      })}
    </motion.div>
  );
}
