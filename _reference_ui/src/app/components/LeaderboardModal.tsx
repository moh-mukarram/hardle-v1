import { X } from "lucide-react";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const leaderboardData = [
    { username: "w0rdmaster", points: 1238, rank: 1 },
    { username: "deducto42", points: 1239, rank: 2 },
    { username: "guesserino", points: 1261, rank: 3 },
    { username: "scrabbly", points: 1260, rank: 4 },
    { username: "lingolegend", points: 1250, rank: 5 },
    { username: "puzzler975", points: 1128, rank: 6 },
    { username: "vocabvulture", points: 1133, rank: 7 },
    { username: "cryptospell", points: 1155, rank: 8 },
    { username: "lexiconking", points: 1850, rank: 9 },
    { username: "anagramadept", points: 850, rank: 10 },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-8">
        <div className="bg-[#161616] border border-gray-800 rounded-2xl p-8 max-w-md w-full relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Leaderboard content */}
          <h2 className="text-2xl font-semibold text-white mb-6">
            Leaderboard
          </h2>

          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-2 pb-3 border-b border-gray-800">
              <div className="text-sm font-medium text-gray-400">User</div>
              <div className="text-sm font-medium text-gray-400 text-right">Points</div>
            </div>

            {/* Leaderboard Entries */}
            <div className="space-y-0.5">
              {leaderboardData.map((entry, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 py-3 border-b border-gray-800/50 last:border-0 ${
                    index < 3 ? "text-white" : "text-gray-400"
                  }`}
                >
                  <div className={`${index < 3 ? "text-[#d4a933]" : ""}`}>
                    {entry.username}
                  </div>
                  <div className={`text-right ${index < 3 ? "font-medium" : ""}`}>
                    {entry.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
