import React, { useState, useEffect, useRef } from 'react';
import { Settings, Menu, X, Terminal, ChevronRight, Power, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'motion/react';
import userAvatar from 'figma:asset/4b6b616d4cb92763208a247eca03b346f218e807.png';

interface PregameTerminalProps {
  onStartGame: (mode: 'normal' | 'hard' | 'extreme') => void;
  username?: string;
  rank?: 'guest' | 'user' | 'sudo' | 'admin' | 'root';
  totalPoints?: number;
}

export function PregameTerminal({ 
  onStartGame, 
  username = "ryu", 
  rank = "user", 
  totalPoints = 450 
}: PregameTerminalProps) {
  const [selectedMode, setSelectedMode] = useState<'normal' | 'hard' | 'extreme'>('normal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [areLogsOpen, setAreLogsOpen] = useState(false);
  const [pointsDisplay, setPointsDisplay] = useState(10);
  
  // Modal states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTerminateOpen, setIsTerminateOpen] = useState(false);

  // Settings states
  const [volume, setVolume] = useState(75);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [hapticIntensity, setHapticIntensity] = useState<'low'|'medium'|'high'>('medium');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Flicker effect for points when switching modes
  useEffect(() => {
    const targetPoints = selectedMode === 'normal' ? 10 : selectedMode === 'hard' ? 18 : 25;
    let flickerCount = 0;
    const maxFlickers = 6;
    
    const interval = setInterval(() => {
      if (flickerCount < maxFlickers) {
        setPointsDisplay(Math.floor(Math.random() * 99));
        flickerCount++;
      } else {
        setPointsDisplay(targetPoints);
        clearInterval(interval);
      }
    }, 40);
    
    return () => clearInterval(interval);
  }, [selectedMode]);
  
  // Slide to activate logic
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderConstraints, setSliderConstraints] = useState({ left: 0, right: 0 });
  const [handleWidth, setHandleWidth] = useState(80);
  const x = useMotionValue(0);
  const bgOpacity = useTransform(x, [0, sliderConstraints.right || 1], [0, 1]); 
  const textOpacity = useTransform(x, [0, sliderConstraints.right * 0.5], [1, 0]);
  
  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newHandleWidth = Math.floor(containerWidth * 0.25); // ~25% width
        setHandleWidth(newHandleWidth);
        setSliderConstraints({
          left: 0,
          right: containerWidth - newHandleWidth - 8 // 8px total margin (4px each side)
        });
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = sliderConstraints.right * 0.75;
    if (x.get() > threshold) {
      animate(x, sliderConstraints.right, { type: "spring", stiffness: 400, damping: 40 });
      setTimeout(() => {
        onStartGame(selectedMode);
      }, 300);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 40 });
    }
  };

  // ---------------------------------------------------------------------------
  // DESKTOP COMPONENTS
  // ---------------------------------------------------------------------------

  const DesktopModeCard = ({ 
    mode, 
    title, 
    points, 
    description, 
    colorClass, 
    borderColorClass,
    indicators 
  }: { 
    mode: 'normal' | 'hard' | 'extreme', 
    title: string, 
    points: number, 
    description: string, 
    colorClass: string,
    borderColorClass: string,
    indicators: React.ReactNode
  }) => {
    const isSelected = selectedMode === mode;
    
    return (
      <button 
        onClick={() => setSelectedMode(mode)}
        className={`
          relative flex flex-col p-6 text-left transition-all duration-200 w-full h-full
          border bg-[#081018]/40
          ${isSelected 
            ? `${borderColorClass} bg-cyan-900/10 shadow-[0_0_15px_rgba(8,145,178,0.15)]` 
            : 'border-cyan-900/20 hover:border-cyan-800 hover:bg-cyan-900/5'
          }
        `}
      >
        <div className="flex justify-between items-start mb-4 w-full">
          <h3 className={`text-lg font-bold tracking-widest ${isSelected ? colorClass : 'text-cyan-700'}`}>
            {title}
          </h3>
          {isSelected && (
            <div className={`w-1.5 h-1.5 ${colorClass === 'text-amber-500' ? 'bg-amber-500' : 'bg-cyan-400'} shadow-[0_0_8px_currentColor]`}></div>
          )}
        </div>

        <p className="text-[10px] uppercase tracking-wider text-cyan-400/60 mb-6 h-12">
          {description}
        </p>

        <div className="mt-auto w-full pt-4 border-t border-cyan-900/20 flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] uppercase tracking-widest text-cyan-800">Signal Intel</span>
            {indicators}
          </div>
          <div className={`text-2xl font-light ${isSelected ? colorClass : 'text-cyan-800'}`}>
            +{isSelected ? pointsDisplay : points}
          </div>
        </div>
      </button>
    );
  };

  // ---------------------------------------------------------------------------
  // MOBILE COMPONENTS
  // ---------------------------------------------------------------------------

  const MobileModeCard = ({ 
    mode, 
    title, 
    points, 
    description, 
    colorClass, 
    borderColorClass,
    indicators 
  }: { 
    mode: 'normal' | 'hard' | 'extreme', 
    title: string, 
    points: number, 
    description: string, 
    colorClass: string,
    borderColorClass: string,
    indicators: React.ReactNode
  }) => {
    const isSelected = selectedMode === mode;
    
    return (
      <button 
        onClick={() => setSelectedMode(mode)}
        className={`
          relative flex flex-col justify-center p-3 text-left transition-all duration-200 w-full
          border bg-[#081018]/40 h-[90px] shrink-0
          ${isSelected 
            ? `border-cyan-400 bg-cyan-900/10 shadow-[0_0_10px_rgba(34,211,238,0.1)]` 
            : 'border-cyan-900/20 hover:border-cyan-800'
          }
        `}
      >
        <div className="flex justify-between items-center w-full mb-1">
          <h3 className={`text-sm font-bold tracking-widest uppercase ${isSelected ? colorClass : 'text-cyan-700'}`}>
            {title}
          </h3>
          <div className={`text-lg font-light ${isSelected ? colorClass : 'text-cyan-800/60'}`}>
            +{points}
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-2 truncate">
          {description}
        </p>

        <div className="flex items-center gap-2">
           <span className="text-[8px] uppercase tracking-widest text-cyan-900/60">Signal</span>
           {indicators}
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050C14] bg-gradient-to-b from-[#050C14] to-[#0A1622] text-cyan-400 font-mono overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyMDAlJyBoZWlnaHQ9JzIwMCUnPjxmaWx0ZXIgaWQ9J25vaXNlJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC42NSBzdGl0Y2hUaWxlcz0nc3RpdGNoJy8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsdGVyPSd1cmwoI25vaXNlKScgb3BhY2l0eT0nMC40Jy8+PC9zdmc+')] mix-blend-overlay"></div>
      <div className="hidden lg:block absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-1 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

      {/* ========================================================================================== */}
      {/* MOBILE LAYOUT ( < 1024px ) */}
      {/* ========================================================================================== */}
      <div className="lg:hidden flex flex-col h-full w-full">
        
        {/* TOP BAR */}
        <header className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-cyan-900/30 bg-[#050C14]/90 backdrop-blur-md h-[50px] shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-cyan-500 hover:text-cyan-300 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-sm tracking-[0.2em] font-bold text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
              HARDLE
            </h1>
          </div>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="text-cyan-600 hover:text-cyan-400 transition-colors"
          >
              <Settings className="w-4 h-4" />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 top-[50px] z-40 bg-[#050C14]/98 backdrop-blur-xl border-t border-cyan-900/30 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
            <button 
              onClick={() => setIsTerminateOpen(true)}
              className="flex items-center gap-3 px-4 py-3 border border-red-900/60 text-red-500/70 text-xs tracking-widest uppercase bg-red-900/5"
            >
              <Power className="w-4 h-4" />
              Terminate Session
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          
          {/* HEADER */}
          <div className="space-y-0.5 mb-3 shrink-0">
            <div className="flex items-center gap-1.5 text-cyan-500/50 text-[10px] tracking-widest">
              <ChevronRight className="w-3 h-3" />
              <span>DECRYPTION INIT</span>
            </div>
            <h2 className="text-xl text-white font-light tracking-widest uppercase">
              Select Mode
            </h2>
          </div>

          {/* PLAYER SNAPSHOT (Mobile) */}
          <div className="relative p-4 mb-4 border-t border-b border-cyan-900/30 bg-cyan-900/5 shrink-0">
             <div className="flex flex-col gap-1">
                <div className="text-xl text-white font-medium tracking-wide lowercase leading-none">
                  {username}
                </div>
                <div className={`
                  inline-block w-fit px-2 py-0.5 mt-1 mb-1 text-xs font-mono text-cyan-300 border border-cyan-500/40 bg-cyan-900/20 rounded-sm
                  ${rank === 'root' ? 'shadow-[0_0_10px_rgba(6,182,212,0.3)] border-cyan-400' : 'shadow-[0_0_5px_rgba(6,182,212,0.1)]'}
                `}>
                  [{rank}]
                </div>
                <div className="text-sm font-mono text-cyan-500/60 tracking-wider">
                  {totalPoints} PTS
                </div>
             </div>
          </div>

          {/* PROTOCOL CARDS (Stacked) */}
          <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto pb-4">
             <MobileModeCard 
                mode="normal"
                title="NORMAL"
                points={10}
                description="Visual signal intel active."
                colorClass="text-cyan-300"
                borderColorClass="border-cyan-500/60"
                indicators={
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500"></div>
                    <div className="w-1.5 h-1.5 bg-slate-700/50"></div>
                    <div className="w-1.5 h-1.5 bg-slate-700/50"></div>
                  </div>
                }
              />
              <MobileModeCard 
                mode="hard"
                title="HARD"
                points={18}
                description="Verified signals only."
                colorClass="text-cyan-300"
                borderColorClass="border-cyan-400"
                indicators={
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500"></div>
                    <div className="w-1.5 h-1.5 bg-slate-700/50"></div>
                    <div className="w-1.5 h-1.5 bg-slate-700/50"></div>
                    <div className="w-1.5 h-1.5 bg-slate-700/50"></div>
                  </div>
                }
              />
              <MobileModeCard 
                mode="extreme"
                title="EXTREME"
                points={25}
                description="Zero signal intel."
                colorClass="text-amber-500"
                borderColorClass="border-amber-500/60"
                indicators={
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-slate-800"></div>
                    <div className="w-1.5 h-1.5 bg-slate-800"></div>
                    <div className="w-1.5 h-1.5 bg-slate-800"></div>
                    <div className="w-1.5 h-1.5 bg-slate-800"></div>
                  </div>
                }
              />
          </div>

          {/* COLLAPSIBLE LOGS */}
          <div className="shrink-0 border-t border-cyan-900/30 mt-2">
             <button 
              onClick={() => setAreLogsOpen(!areLogsOpen)}
              className="w-full flex items-center justify-between py-3 text-[10px] tracking-widest text-cyan-500/80 uppercase active:bg-cyan-900/10 transition-colors"
            >
              <span>[ LAST 5 DECRYPTION LOGS ]</span>
              {areLogsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
             <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#04080c] ${areLogsOpen ? 'max-h-[150px] border-b border-cyan-900/30' : 'max-h-0'}`}>
                <div className="p-3 space-y-2">
                   {[
                    { date: '04.23', status: 'SUCCESS', points: '+10', type: 'success' },
                    { date: '04.23', status: 'FAILED', points: '-5', type: 'fail' },
                    { date: '04.22', status: 'SUCCESS', points: '+20', type: 'success' },
                    { date: '04.22', status: 'SUCCESS', points: '+10', type: 'success' },
                    { date: '04.22', status: 'FAILED', points: '-10', type: 'fail' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-800">{log.date}</span>
                      <span className={`${log.type === 'success' ? 'text-green-500/80' : 'text-amber-600/80'}`}>
                        {log.status}
                      </span>
                      <span className={`${log.type === 'success' ? 'text-green-400' : 'text-amber-500'} w-8 text-right`}>
                        {log.points}
                      </span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* MOBILE SLIDE CTA */}
        <div className="p-4 pb-8 bg-[#050C14] shrink-0 border-t border-cyan-900/20">
          <div 
            className="relative h-[80px] rounded-xl border-2 border-cyan-500 bg-[#081018] overflow-hidden select-none touch-none shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            ref={containerRef}
          >
             {/* Track Fill Animation */}
             <motion.div 
               className="absolute inset-y-0 left-0 bg-cyan-500/20"
               style={{ opacity: bgOpacity, width: x }}
             />
             
             {/* Text Label */}
             <motion.div 
               className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 pl-16 md:pl-20"
               style={{ opacity: textOpacity }}
             >
               <span className="text-[11px] tracking-[0.15em] font-bold text-cyan-400 uppercase">
                 Slide to Initiate Decryption →
               </span>
             </motion.div>

             {/* Draggable Handle */}
             <motion.div
               className="absolute top-1 bottom-1 left-1 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] z-10 cursor-grab active:cursor-grabbing"
               style={{ 
                 width: handleWidth,
                 x 
               }}
               drag="x"
               dragConstraints={sliderConstraints}
               dragElastic={0.05}
               dragMomentum={false}
               onDragEnd={handleDragEnd}
               whileTap={{ scale: 0.98 }}
             >
               <ArrowRight className="w-6 h-6 text-[#050C14] stroke-[3px]" />
             </motion.div>
          </div>
        </div>

      </div>

      {/* ========================================================================================== */}
      {/* DESKTOP LAYOUT ( >= 1024px ) */}
      {/* ========================================================================================== */}
      <div className="hidden lg:flex flex-col h-full w-full">
        
        {/* Top Navigation Bar */}
        <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-cyan-900/30 bg-[#050C14]/90 backdrop-blur-md">
          <div className="flex items-center gap-4">
            
            <h1 className="text-xl tracking-[0.2em] font-bold text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
              HARDLE
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 border border-cyan-800 text-cyan-500 text-[10px] tracking-widest hover:bg-cyan-900/20 hover:border-cyan-600 transition-colors uppercase"
            >
              <Settings className="w-3 h-3" />
              Settings
            </button>
            <button 
              onClick={() => setIsTerminateOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 border border-red-900/60 text-red-500/70 text-[10px] tracking-widest hover:bg-red-900/10 hover:text-red-400 hover:border-red-700/50 transition-colors uppercase"
            >
              <Power className="w-3 h-3" />
              Terminate
            </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="relative z-10 flex-1 flex p-10 gap-10 max-w-[1600px] mx-auto w-full">
          
          {/* Left Column - Core Interface */}
          <div className="flex-1 flex flex-col gap-10">
            
            <div className="space-y-1 mt-2">
              <div className="flex items-center gap-2 text-cyan-500/50 text-xs tracking-widest">
                <ChevronRight className="w-3 h-3" />
                <span>DECRYPTION PROTOCOL INITIALIZATION</span>
              </div>
              <h2 className="text-3xl text-white font-light tracking-widest uppercase">
                Select Breach Mode
              </h2>
            </div>

            {/* Player Snapshot (Desktop) */}
            <div className="relative p-5 border-l border-cyan-500/20 bg-gradient-to-r from-cyan-900/10 to-transparent">
              <div className="flex flex-row items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <div className="text-xl text-white tracking-[0.15em] uppercase font-medium">{username}</div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
                      <span className="text-cyan-400 tracking-wider font-mono">[{rank}]</span>
                      <span className="text-cyan-800">|</span>
                      <span className="text-white/80 tracking-wider">{totalPoints} PTS</span>
                    </div>
                  </div>
                </div>

                <div className="ml-auto">
                  <div className="text-[10px] text-cyan-500/50 flex items-center gap-2 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-cyan-500/40 rounded-full animate-pulse"></span>
                    Reset in 18 days
                  </div>
                </div>
              </div>
            </div>

            {/* Protocol Selection Grid */}
            <div className="grid grid-cols-3 gap-5">
              <DesktopModeCard 
                mode="normal"
                title="NORMAL PROTOCOL"
                points={10}
                description="Standard decryption process. Visual signal intelligence active."
                colorClass="text-cyan-300"
                borderColorClass="border-cyan-500/60"
                indicators={
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-[1px] shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-[1px] shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
                    <div className="w-2 h-2 bg-slate-700/50 rounded-[1px]"></div>
                    <div className="w-2 h-2 bg-slate-700/50 rounded-[1px]"></div>
                    <div className="w-2 h-2 bg-slate-700/50 rounded-[1px]"></div>
                  </div>
                }
              />
              
              <DesktopModeCard 
                mode="hard"
                title="HARD PROTOCOL"
                points={18}
                description="Verified signals only. Partial signals suppressed."
                colorClass="text-cyan-300"
                borderColorClass="border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                indicators={
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-[1px] shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                    <div className="w-2 h-2 bg-slate-700/50 rounded-[1px]"></div>
                    <div className="w-2 h-2 bg-slate-700/50 rounded-[1px]"></div>
                    <div className="w-2 h-2 bg-slate-700/50 rounded-[1px]"></div>
                    <div className="w-2 h-2 bg-slate-700/50 rounded-[1px]"></div>
                  </div>
                }
              />
              
              <DesktopModeCard 
                mode="extreme"
                title="EXTREME PROTOCOL"
                points={25}
                description="Zero signal intelligence. Blind decryption required."
                colorClass="text-amber-500"
                borderColorClass="border-amber-500/60"
                indicators={
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-800 rounded-[1px]"></div>
                    <div className="w-2 h-2 bg-slate-800 rounded-[1px]"></div>
                    <div className="w-2 h-2 bg-slate-800 rounded-[1px]"></div>
                    <div className="w-2 h-2 bg-slate-800 rounded-[1px]"></div>
                    <div className="w-2 h-2 bg-slate-800 rounded-[1px]"></div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Right Column - Intelligence Panel */}
          <div className="w-[380px] border-l border-cyan-900/30 pl-10 flex flex-col justify-between py-2">
            <div className="space-y-8">
              <div className="border border-cyan-900/30 p-1">
                 <div className="bg-cyan-900/10 px-3 py-2 flex items-center gap-2 text-cyan-500 text-[10px] uppercase tracking-[0.2em]">
                   <Terminal className="w-3 h-3" />
                   <span>Terminal Access Log</span>
                 </div>
              </div>

              <div>
                <h4 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-6 border-b border-cyan-900/30 pb-2">
                  Last 5 Decryption Logs
                </h4>
                
                <div className="space-y-4 font-mono text-xs">
                  {[
                    { date: '04.23.24', status: 'CLEARANCE SUCCESS', points: '+10', type: 'success' },
                    { date: '04.23.24', status: 'BREACH FAILED', points: '-5', type: 'fail' },
                    { date: '04.22.24', status: 'CLEARANCE SUCCESS', points: '+20', type: 'success' },
                    { date: '04.22.24', status: 'CLEARANCE SUCCESS', points: '+10', type: 'success' },
                    { date: '04.22.24', status: 'BREACH FAILED', points: '-10', type: 'fail' },
                  ].map((log, i) => (
                    <div key={i} className="grid grid-cols-[auto_1fr_auto] gap-4 items-center group cursor-default hover:bg-cyan-900/5 p-1 rounded transition-colors">
                      <span className="text-cyan-800 group-hover:text-cyan-600 transition-colors">{log.date}</span>
                      <span className={`${log.type === 'success' ? 'text-green-500' : 'text-amber-500'} tracking-tight`}>
                        {log.status}
                      </span>
                      <span className={`${log.type === 'success' ? 'text-green-400' : 'text-amber-500'} text-right font-medium`}>
                        {log.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
              
            <div className="mt-auto border-t border-cyan-900/20 pt-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-cyan-700 tracking-widest uppercase">System Status</span>
                <span className="text-[10px] text-cyan-600 tracking-widest uppercase">Load: 12%</span>
              </div>
              <div className="flex gap-1 h-8">
                  {Array(24).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 ${i < 18 ? 'bg-cyan-900/30' : 'bg-cyan-900/10'} animate-pulse`} 
                      style={{ animationDelay: `${i * 0.05}s` }}
                    ></div>
                  ))}
              </div>
            </div>
          </div>

        </main>

        {/* Footer / CTA (Desktop) */}
        <footer className="relative z-10 p-10 flex justify-end bg-transparent border-t lg:border-t-0 border-cyan-900/30">
          <button
            onClick={() => onStartGame(selectedMode)}
            className={`
              relative w-auto px-16 py-5 text-lg tracking-[0.2em] font-medium uppercase transition-all duration-300
              border group
              ${selectedMode === 'extreme' 
                ? 'border-amber-600/60 text-amber-100 hover:border-amber-500 hover:text-white' 
                : selectedMode === 'hard'
                  ? 'border-cyan-400/60 text-cyan-100 hover:border-cyan-300 hover:text-white'
                  : 'border-cyan-600/40 text-cyan-200 hover:border-cyan-400 hover:text-white'
              }
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
               INITIATE DECRYPTION
               <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-black/0 group-active:bg-black/20 transition-colors"></div>
          </button>
        </footer>
      </div>
      {/* ========================================================================================== */}
      {/* MODALS */}
      {/* ========================================================================================== */}
      
      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px] animate-in fade-in duration-150"
            onClick={() => setIsSettingsOpen(false)}
          ></div>
          <div className="relative w-full max-w-[480px] bg-[#071018] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] animate-in fade-in zoom-in-95 duration-150 p-0 overflow-hidden">
             
             {/* Modal Header */}
             <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/30 bg-[#0A1622]">
                <h3 className="text-sm font-bold tracking-[0.2em] text-cyan-100 uppercase">
                  &gt; SYSTEM SETTINGS
                </h3>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-cyan-500 hover:text-cyan-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
             </div>

             {/* Modal Body */}
             <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* Audio Section */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest border-b border-cyan-900/30 pb-2">
                    Audio
                  </h4>
                  <div className="space-y-4 px-2">
                     <div className="space-y-2">
                        <div className="flex justify-between text-xs text-cyan-400 uppercase tracking-wider">
                           <span>Master Volume</span>
                           <span>{volume}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={volume} 
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="w-full h-1 bg-cyan-900/40 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-0"
                        />
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-cyan-400 uppercase tracking-wider">Sound Effects</span>
                        <button 
                          onClick={() => setSfxEnabled(!sfxEnabled)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${sfxEnabled ? 'bg-cyan-500/30' : 'bg-slate-800'}`}
                        >
                           <div className={`absolute top-0.5 w-3 h-3 bg-cyan-400 rounded-full transition-all ${sfxEnabled ? 'left-4.5' : 'left-0.5'}`}></div>
                        </button>
                     </div>
                  </div>
                </section>

                {/* Haptics Section */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest border-b border-cyan-900/30 pb-2">
                    Haptics
                  </h4>
                  <div className="space-y-4 px-2">
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-cyan-400 uppercase tracking-wider">Vibration</span>
                        <button 
                          onClick={() => setVibrationEnabled(!vibrationEnabled)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${vibrationEnabled ? 'bg-cyan-500/30' : 'bg-slate-800'}`}
                        >
                           <div className={`absolute top-0.5 w-3 h-3 bg-cyan-400 rounded-full transition-all ${vibrationEnabled ? 'left-4.5' : 'left-0.5'}`}></div>
                        </button>
                     </div>
                     
                     <div className={`space-y-2 transition-opacity ${!vibrationEnabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <span className="text-xs text-cyan-400 uppercase tracking-wider block mb-2">Intensity</span>
                        <div className="flex border border-cyan-900/30 bg-cyan-900/10 p-0.5">
                           {(['low', 'medium', 'high'] as const).map((level) => (
                              <button
                                key={level}
                                onClick={() => setHapticIntensity(level)}
                                className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider transition-all ${hapticIntensity === level ? 'bg-cyan-500/20 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-cyan-600 hover:text-cyan-400'}`}
                              >
                                {level}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
                </section>

                {/* General Section */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest border-b border-cyan-900/30 pb-2">
                    General
                  </h4>
                  <div className="space-y-4 px-2">
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-cyan-400 uppercase tracking-wider">Reduce Motion</span>
                        <button 
                          onClick={() => setReduceMotion(!reduceMotion)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${reduceMotion ? 'bg-cyan-500/30' : 'bg-slate-800'}`}
                        >
                           <div className={`absolute top-0.5 w-3 h-3 bg-cyan-400 rounded-full transition-all ${reduceMotion ? 'left-4.5' : 'left-0.5'}`}></div>
                        </button>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-cyan-400 uppercase tracking-wider">High Contrast</span>
                        <button 
                          onClick={() => setHighContrast(!highContrast)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${highContrast ? 'bg-cyan-500/30' : 'bg-slate-800'}`}
                        >
                           <div className={`absolute top-0.5 w-3 h-3 bg-cyan-400 rounded-full transition-all ${highContrast ? 'left-4.5' : 'left-0.5'}`}></div>
                        </button>
                     </div>
                  </div>
                </section>

                {/* About Section */}
                <section className="pt-2">
                   <div className="bg-cyan-900/5 border border-cyan-900/20 p-4 space-y-3 text-center">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-cyan-100 tracking-widest">HARDLE v1.0</div>
                        <div className="text-[10px] text-cyan-500/60 uppercase tracking-wider">Competitive Word Decryption System</div>
                      </div>
                      <div className="text-[9px] text-cyan-800 font-mono">Build ID: 0608N-116</div>
                      <button className="text-[10px] text-cyan-400 border border-cyan-900/40 px-3 py-1 uppercase tracking-widest hover:bg-cyan-900/20 transition-colors">
                        View License
                      </button>
                   </div>
                </section>
             </div>

             {/* Footer */}
             <div className="px-6 py-3 bg-[#050C14] border-t border-cyan-900/30 flex justify-end">
                <span className="text-[9px] text-cyan-700/50 uppercase tracking-widest">Settings auto-save active</span>
             </div>
          </div>
        </div>
      )}

      {/* TERMINATE SESSION MODAL */}
      {isTerminateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px] animate-in fade-in duration-150"
            onClick={() => setIsTerminateOpen(false)}
          ></div>
          <div className="relative w-full max-w-[420px] bg-[#071018] border border-red-900/50 shadow-[0_0_40px_rgba(220,38,38,0.1)] animate-in fade-in zoom-in-95 duration-150 p-0">
             
             {/* Header */}
             <div className="px-6 py-4 border-b border-red-900/20 bg-[#0A1622]">
                <h3 className="text-sm font-bold tracking-[0.2em] text-red-500 uppercase">
                  &gt; TERMINATE SESSION
                </h3>
             </div>

             {/* Body */}
             <div className="p-8 text-center space-y-4">
                <p className="text-cyan-100 text-sm tracking-wide">
                  Are you sure you want to sign out?
                </p>
                <p className="text-cyan-600/60 text-xs tracking-wide">
                  You will be redirected to the login interface.
                </p>
             </div>

             {/* Buttons */}
             <div className="p-6 pt-2 flex gap-4">
                <button 
                   onClick={() => setIsTerminateOpen(false)}
                   className="flex-1 py-3 border border-cyan-800 text-cyan-500 text-xs font-bold tracking-[0.15em] hover:bg-cyan-900/10 hover:border-cyan-600 transition-colors uppercase"
                >
                  Cancel
                </button>
                <button 
                   onClick={() => window.location.reload()} // Placeholder for logout action
                   className="flex-1 py-3 bg-red-900/80 text-white text-xs font-bold tracking-[0.15em] hover:bg-red-800 transition-colors uppercase shadow-[0_0_15px_rgba(153,27,27,0.4)]"
                >
                  Terminate
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
