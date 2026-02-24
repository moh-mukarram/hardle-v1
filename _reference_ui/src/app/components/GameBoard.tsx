import { Tile, TileState } from '../App';
import { GameTile } from './GameTile';
import { Lock, Check } from 'lucide-react';

interface GameBoardProps {
  grid: Tile[][];
  onTileClick: (rowIndex: number, colIndex: number) => void;
  onLetterChange: (rowIndex: number, colIndex: number, letter: string) => void;
  currentRow: number;
  lockedRows: Set<number>;
  onSubmitRow: (rowIndex: number) => void;
}

export function GameBoard({ grid, onTileClick, onLetterChange, currentRow, lockedRows, onSubmitRow }: GameBoardProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {grid.map((row, rowIndex) => {
        const isLocked = lockedRows.has(rowIndex);
        const isCurrent = rowIndex === currentRow;
        const isComplete = row.every(tile => tile.letter !== '');
        
        return (
          <div key={rowIndex} className="flex gap-1.5 items-center">
            {/* Row number indicator */}
            <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold ${
              isCurrent ? 'text-white' : 'text-gray-600'
            }`}>
              {rowIndex + 1}
            </div>
            
            {/* Tiles */}
            <div className="flex gap-1.5">
              {row.map((tile, colIndex) => (
                <GameTile
                  key={colIndex}
                  tile={tile}
                  onClick={() => onTileClick(rowIndex, colIndex)}
                  onLetterChange={(letter) => onLetterChange(rowIndex, colIndex, letter)}
                  isLocked={isLocked}
                  isCurrent={isCurrent}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                />
              ))}
            </div>
            
            {/* Row action button */}
            <div className="w-10">
              {isLocked ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gray-500" />
                </div>
              ) : isComplete && !isLocked ? (
                <button
                  onClick={() => onSubmitRow(rowIndex)}
                  className="w-8 h-8 flex items-center justify-center bg-[#6aaa64] hover:bg-[#5a9954] rounded transition-colors"
                  title="Lock row"
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}