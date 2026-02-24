import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TerminalTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function TerminalText({ 
  text, 
  className = "", 
  delay = 0, 
  stagger = 0.05 
}: TerminalTextProps) {
  const characters = text.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, display: "none" }, // display none prevents layout shifts if needed, but usually opacity is enough.
    // However, for terminal cursor effect, we want them to appear sequentially.
    visible: { 
      opacity: 1, 
      display: "inline-block",
      transition: { duration: 0 } // Instant appearance
    }, 
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span key={`${char}-${index}`} variants={charVariants}>
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
        className="inline-block w-[0.5em] h-[1em] bg-cyan-400 ml-1 align-middle"
      />
    </motion.span>
  );
}
