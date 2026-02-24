import React from 'react';
import { motion } from 'motion/react';

export function SuccessParticles() {
  // Generate random particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    angle: (i / 20) * 360,
    distance: 100 + Math.random() * 50,
    delay: Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: p.delay,
          }}
          className="absolute w-1 h-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        />
      ))}
    </div>
  );
}
