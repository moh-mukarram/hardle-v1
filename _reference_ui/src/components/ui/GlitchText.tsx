import React, { useState, useEffect, useRef } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  scrambleDuration?: number; // ms
  stable?: boolean;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@&[]";

export function GlitchText({ 
  text, 
  className = "", 
  scrambleDuration = 400,
  stable = true
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start scrambling when text changes
    let progress = 0;
    const steps = 10; // Number of scramble frames
    const stepDuration = scrambleDuration / steps;
    
    setIsScrambling(true);

    intervalRef.current = setInterval(() => {
      progress++;
      
      if (progress >= steps) {
        setDisplayText(text);
        setIsScrambling(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const scrambled = text.split('').map((char, index) => {
        if (char === ' ') return ' ';
        // As progress increases, higher chance of showing real char
        if (Math.random() < progress / steps) {
          return char;
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      setDisplayText(scrambled);

    }, stepDuration);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, scrambleDuration]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
}
