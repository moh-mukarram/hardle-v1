import { useState } from "react";
import { Info, Trophy, RotateCcw } from "lucide-react";
import { LeaderboardModal } from "./LeaderboardModal";
import { EndGameModal } from "./EndGameModal";

export function GamePage() {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isEndGameOpen, setIsEndGameOpen] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "lose">("win");

  // Mock game data
  const liveTracker = [
    { greens: 2, yellows: 2 },
    { greens: 2, yellows: 2 },
    { greens: 2, yellows: 2 },
    { greens: 2, yellows: 2 },
    { greens: 2, yellows: 2 },
    { greens: 2, yellows: 2 },
  ];

  // Demo functions to show win/lose states
  const showWinState = () => {
    setGameResult("win");
    setIsEndGameOpen(true);
  };

  const showLoseState = () => {
    setGameResult("lose");
    setIsEndGameOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col dark bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white px-8 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        {/* Left - Info icon */}
        <button className="text-gray-400 hover:text-white transition-colors">
          <Info size={24} />
        </button>

        {/* Center - Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold tracking-wider">HARDLE</h1>
          <p className="text-gray-500 text-sm mt-1 tracking-wide">
            PLAYING AS RYU | @ PTS
          </p>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Trophy size={20} />
          </button>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#5865F2] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="flex flex-1 gap-12 max-w-7xl mx-auto w-full">
        {/* Left Side - Game Grid */}
        <div className="flex-1 flex flex-col items-center">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="flex items-center gap-3">
                <span className="text-gray-500 text-sm w-4">{row}</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((col) => (
                    <div
                      key={col}
                      className="w-12 h-12 border-2 border-gray-700 bg-[#0f0f0f] rounded"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-6">Keyboard input only</p>

          {/* Demo buttons to show endgame states */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={showWinState}
              className="px-4 py-2 bg-[#538d4e] hover:bg-[#6aaa64] text-white rounded text-sm transition-colors"
            >
              Show Win State
            </button>
            <button
              onClick={showLoseState}
              className="px-4 py-2 bg-[#787c7e] hover:bg-[#878a8c] text-white rounded text-sm transition-colors"
            >
              Show Lose State
            </button>
          </div>
        </div>

        {/* Right Side - Live Tracker and Rough Work */}
        <div className="w-80 space-y-8">
          {/* Live Count Tracker */}
          <div>
            <h3 className="text-gray-400 text-sm mb-4">Live count tracker</h3>
            <div className="space-y-2">
              {liveTracker.map((track, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-4">{index + 1}</span>
                  <div className="flex gap-2">
                    {/* Green boxes */}
                    {Array.from({ length: track.greens }).map((_, i) => (
                      <div
                        key={`green-${i}`}
                        className="w-10 h-10 border-2 border-[#538d4e] bg-[#538d4e]/20 rounded"
                      />
                    ))}
                    {/* Yellow boxes */}
                    {Array.from({ length: track.yellows }).map((_, i) => (
                      <div
                        key={`yellow-${i}`}
                        className="w-10 h-10 border-2 border-[#b59f3b] bg-[#b59f3b]/20 rounded"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rough Work */}
          <div className="bg-[#161616] border border-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-4 tracking-wide">ROUGH WORK</h3>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <span className="text-[#538d4e]">Greens</span>
                <span className="text-gray-500"> = ---</span>
              </p>
              <p className="text-sm">
                <span className="text-[#b59f3b]">Yellows</span>
                <span className="text-gray-500"> = ---</span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 text-sm">Type your deductions here...</p>
              <textarea
                className="w-full h-48 bg-[#0f0f0f] border border-gray-800 rounded p-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700 resize-none"
                placeholder=""
              />
            </div>

            <p className="text-gray-600 text-xs mt-3">Scratch pad for notes</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* End Game Modal */}
      <EndGameModal
        isOpen={isEndGameOpen}
        onClose={() => setIsEndGameOpen(false)}
        onPlayAgain={() => {
          setIsEndGameOpen(false);
          // In a real app, this would reset the game state
          console.log("Starting new game...");
        }}
        gameResult={gameResult}
        word="REALM"
        points={245}
      />
    </div>
  );
}