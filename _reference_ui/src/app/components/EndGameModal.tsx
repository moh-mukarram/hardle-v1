interface EndGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain?: () => void;
  gameResult: "win" | "lose";
  word: string;
  points: number;
}

export function EndGameModal({ isOpen, onClose, onPlayAgain, gameResult, word, points }: EndGameModalProps) {
  if (!isOpen) return null;

  const isWin = gameResult === "win";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 z-40" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-8">
        <div className="bg-[#161616] border border-gray-800 rounded-2xl p-12 max-w-lg w-full text-center space-y-6">
          {/* Result Header */}
          <h2 className="text-4xl font-bold text-white tracking-tight">
            {isWin ? "Well done!" : "Game Over"}
          </h2>

          {/* Result Sentence */}
          <p className="text-lg text-gray-300 leading-relaxed">
            Your word was{" "}
            <span className="font-mono font-bold text-white tracking-wider">
              {word.toUpperCase()}
            </span>{" "}
            and you gained{" "}
            <span className="font-semibold text-white">
              {points}
            </span>{" "}
            points.
          </p>

          {/* Secondary Info */}
          <p className="text-sm text-gray-500 pt-2">
            Come back tomorrow to improve your rank.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-6">
            <button
              onClick={onPlayAgain}
              className="w-full px-8 py-3 bg-[#d4a933] hover:bg-[#e0b840] text-black font-semibold rounded-lg transition-colors duration-200"
            >
              Play Again
            </button>
            <button
              onClick={onClose}
              className="w-full px-8 py-3 bg-transparent hover:bg-gray-800/50 text-gray-400 hover:text-gray-300 font-medium rounded-lg border border-gray-800 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}