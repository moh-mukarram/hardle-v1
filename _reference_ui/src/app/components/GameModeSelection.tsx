import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface GameMode {
  id: string;
  label: string;
  tag: string;
  description: string;
  difficulty: number;
  color: string;
  glowColor: string;
  dailyReset?: string;
}

export function GameModeSelection() {
  const navigate = useNavigate();
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const gameModes: GameMode[] = [
    {
      id: "extreme",
      label: "HAAAAAAAAARDLE",
      tag: "EXTREME",
      description: "No color hints. Pure deduction.",
      difficulty: 5,
      color: "from-red-950/50 to-red-900/30",
      glowColor: "shadow-red-500/30",
    },
    {
      id: "very-hard",
      label: "HAAAAARDLE",
      tag: "VERY HARD",
      description: "Minimal hints. Brutal logic.",
      difficulty: 4,
      color: "from-orange-950/50 to-orange-900/30",
      glowColor: "shadow-orange-500/30",
    },
    {
      id: "hard",
      label: "HARDLE",
      tag: "HARD",
      description: "Harder than Wordle. Fair but unforgiving.",
      difficulty: 3,
      color: "from-yellow-950/50 to-yellow-900/30",
      glowColor: "shadow-yellow-500/30",
    },
    {
      id: "daily",
      label: "DAILY HARDLE",
      tag: "DAILY",
      description: "One puzzle per day. Compete on leaderboard.",
      difficulty: 3,
      color: "from-green-950/50 to-green-900/30",
      glowColor: "shadow-green-500/30",
      dailyReset: "23h",
    },
  ];

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    // Animate out and navigate
    setTimeout(() => {
      navigate("/game");
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 dark bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
      {/* Header */}
      <div className="text-center mb-16 space-y-3">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
          Choose Your Challenge
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
          Not all minds survive the same difficulty.
        </p>
      </div>

      {/* Game Mode Cards */}
      <div className="w-full max-w-4xl space-y-4 md:space-y-6">
        {gameModes.map((mode, index) => (
          <button
            key={mode.id}
            onClick={() => handleModeSelect(mode.id)}
            onMouseEnter={() => setHoveredMode(mode.id)}
            onMouseLeave={() => setHoveredMode(null)}
            className={`
              w-full group relative
              bg-gradient-to-r ${mode.color}
              border-2 border-gray-800
              rounded-2xl p-6 md:p-8
              text-left
              transition-all duration-300 ease-out
              ${
                hoveredMode === mode.id
                  ? `transform -translate-y-2 ${mode.glowColor} shadow-2xl border-gray-700`
                  : ""
              }
              ${
                selectedMode === mode.id
                  ? "opacity-100 scale-105"
                  : selectedMode
                  ? "opacity-30"
                  : "opacity-100"
              }
              ${hoveredMode && hoveredMode !== mode.id ? "opacity-40" : ""}
            `}
            style={{
              transitionDelay: selectedMode === mode.id ? "0ms" : `${index * 30}ms`,
            }}
          >
            {/* Backdrop blur effect for other cards */}
            {hoveredMode === mode.id && (
              <div className="absolute inset-0 bg-black/20 rounded-2xl blur-xl -z-10" />
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left side - Title and Description */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
                    {mode.label}
                  </h2>
                  <span className="text-xs font-bold tracking-widest text-gray-500 bg-gray-900/50 px-3 py-1 rounded-full">
                    {mode.tag}
                  </span>
                </div>
                <p className="text-gray-400 text-base md:text-lg">
                  {mode.description}
                </p>
                {mode.dailyReset && (
                  <p className="text-xs text-gray-600">
                    Resets in {mode.dailyReset}
                  </p>
                )}
              </div>

              {/* Right side - Difficulty indicator */}
              <div className="flex gap-1.5">
                {Array.from({ length: mode.difficulty }).map((_, i) => (
                  <div
                    key={i}
                    className="text-2xl transition-all duration-300"
                    style={{
                      transform:
                        hoveredMode === mode.id
                          ? `translateY(-${i * 2}px)`
                          : "translateY(0)",
                      transitionDelay: `${i * 50}ms`,
                    }}
                  >
                    🔥
                  </div>
                ))}
              </div>
            </div>

            {/* Hover indicator */}
            <div
              className={`
                absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                w-1/3 h-0.5 bg-gradient-to-r from-transparent via-[#d4a933] to-transparent
                transition-opacity duration-300
                ${hoveredMode === mode.id ? "opacity-100" : "opacity-0"}
              `}
            />
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <p className="text-gray-600 text-sm mt-12">
        Select a mode to begin
      </p>
    </div>
  );
}
