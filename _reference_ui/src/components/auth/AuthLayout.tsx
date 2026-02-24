import React from 'react';
import { motion } from 'motion/react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#050810] text-slate-200 font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      
      {/* 1. Background System */}
      <div className="absolute inset-0 z-0">
        {/* Deep radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-[#050810] to-[#050810]" />
        
        {/* Subtle cyan ambient glow (top center) */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full opacity-50" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNTYnIGhlaWdodD0nMjU2Jz48ZmlsdGVyIGlkPSdub2lzZSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuOScgbnVtT2N0YXZlcz0nMycgc3RpdGNoVGlsZXM9J3N0aXRjaCcvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNub2lzZSknIG9wYWNpdHk9JzAuNScvPjwvc3ZnPg==')] mix-blend-overlay pointer-events-none" />
      </div>

      {/* 2. Main Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className="w-full max-w-[400px] flex flex-col relative z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            {/* Soft ambient glow behind logo */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full scale-150 opacity-20 animate-pulse-slow" />
            
            <h1 className="font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-br from-cyan-100 to-cyan-600 drop-shadow-lg select-none font-[Press_Start_2P] text-[64px]">
              HARDLE
            </h1>
          </motion.div>
          
          {/* Optional Tagline/Subtitle */}
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 text-xs font-mono text-cyan-500/50 tracking-[0.3em] uppercase"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Card/Form Area */}
        <div className="w-full flex flex-col">
          {title && (
            <div className="mb-6 text-center">
              <h2 className="text-sm font-medium text-slate-400 tracking-wide uppercase">
                {title}
              </h2>
            </div>
          )}

          {children}
        </div>
      </motion.div>

      {/* Footer / Copyright / Version */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-6 text-[10px] font-mono text-slate-700 tracking-wider mix-blend-plus-lighter"
      >
        SECURE TERMINAL ACCESS v2.0
      </motion.div>
    </div>
  );
}
