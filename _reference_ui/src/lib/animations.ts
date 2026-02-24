import { Variants } from "motion/react";

// -----------------------------------------------------------------------------
// PHYSICS ENGINE CONSTANTS
// -----------------------------------------------------------------------------

export const EASE_TACTICAL = [0.2, 0.8, 0.2, 1]; // Sharp attack, smooth landing
export const EASE_MECHANICAL = [0.45, 0, 0.55, 1]; // Robotic, constant speed

export const DURATION = {
  INSTANT: 0.1,
  FAST: 0.25,
  PROCESS: 0.45,
};

export const STAGGER = {
  TIGHT: 0.04,
  LOOSE: 0.1,
};

// -----------------------------------------------------------------------------
// REUSABLE VARIANTS
// -----------------------------------------------------------------------------

export const TACTICAL_TRANSITION = {
  type: "tween",
  ease: EASE_TACTICAL,
  duration: 0.5,
};

export const SCAN_TRANSITION = {
  type: "tween",
  ease: "linear",
  duration: 0.2,
};

// Page Entry
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.TIGHT,
      delayChildren: 0.1,
    },
  },
};

// Standard Fade Up
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { ...TACTICAL_TRANSITION, duration: 0.4 } 
  },
};

// -----------------------------------------------------------------------------
// TOKENS
// -----------------------------------------------------------------------------

export const ANIMATION_TOKENS = {
  scan: "hardle-scan",
  flip: "hardle-flip",
  glow: "hardle-glow",
};
