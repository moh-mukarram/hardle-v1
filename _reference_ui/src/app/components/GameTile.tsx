import { Tile, TileState } from '../App';
import { useRef, useEffect } from 'react';

interface GameTileProps {
  tile: Tile;
  onClick: () => void;
  onLetterChange: (letter: string) => void;
  isLocked: boolean;
  isCurrent: boolean;
  rowIndex: number;
  colIndex: number;
}

const getTileColors = (state: TileState, isLocked: boolean) => {
  const baseClasses = isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer';
  
  switch (state) {
    case 'correct':
      return `bg-[#6aaa64] border-[#6aaa64] ${!isLocked ? 'shadow-[0_0_8px_rgba(106,170,100,0.5)]' : ''} ${baseClasses}`;
    case 'present':
      return `bg-[#c9b458] border-[#c9b458] ${!isLocked ? 'shadow-[0_0_8px_rgba(201,180,88,0.5)]' : ''} ${baseClasses}`;
    case 'absent':
      return `bg-[#3a3a3c] border-[#3a3a3c] ${baseClasses}`;
    case 'empty':
    default:
      return `bg-[#121213] border-[#3a3a3c] ${baseClasses}`;
  }
};

export function GameTile({ tile, onClick, onLetterChange, isLocked, isCurrent, rowIndex, colIndex }: GameTileProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }

    // Allow only letters and navigation keys
    if (e.key.length === 1 && !/[a-zA-Z]/.test(e.key)) {
      e.preventDefault();
    }
    
    // Handle backspace to move to previous tile
    if (e.key === 'Backspace' && !tile.letter && colIndex > 0) {
      const prevInput = document.querySelector(
        `input[data-row="${rowIndex}"][data-col="${colIndex - 1}"]`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
    
    // Handle arrow keys for navigation
    if (e.key === 'ArrowLeft' && colIndex > 0) {
      const prevInput = document.querySelector(
        `input[data-row="${rowIndex}"][data-col="${colIndex - 1}"]`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
    
    if (e.key === 'ArrowRight' && colIndex < 4) {
      const nextInput = document.querySelector(
        `input[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`
      ) as HTMLInputElement;
      nextInput?.focus();
    }
    
    if (e.key === 'ArrowUp' && rowIndex > 0) {
      const upInput = document.querySelector(
        `input[data-row="${rowIndex - 1}"][data-col="${colIndex}"]`
      ) as HTMLInputElement;
      upInput?.focus();
    }
    
    if (e.key === 'ArrowDown' && rowIndex < 5) {
      const downInput = document.querySelector(
        `input[data-row="${rowIndex + 1}"][data-col="${colIndex}"]`
      ) as HTMLInputElement;
      downInput?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    
    const value = e.target.value.slice(-1); // Take only last character
    if (/^[a-zA-Z]?$/.test(value)) {
      onLetterChange(value);
      
      // Auto-advance to next tile if letter was entered
      if (value && colIndex < 4) {
        setTimeout(() => {
          const nextInput = document.querySelector(
            `input[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`
          ) as HTMLInputElement;
          nextInput?.focus();
        }, 0);
      }
    }
  };

  const handleClick = () => {
    if (isLocked) return;
    
    if (tile.letter) {
      onClick();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className={`
        relative w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center
        transition-all duration-200
        ${getTileColors(tile.state, isLocked)}
        ${!isLocked && 'hover:scale-105 active:scale-95'}
        ${isCurrent && tile.state === 'empty' ? 'ring-2 ring-gray-600' : ''}
      `}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="text"
        value={tile.letter}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        maxLength={1}
        data-row={rowIndex}
        data-col={colIndex}
        disabled={isLocked}
        className={`
          w-full h-full bg-transparent text-center text-2xl sm:text-3xl font-bold
          outline-none caret-transparent uppercase
          ${tile.state !== 'empty' ? 'text-white' : 'text-white'}
          ${isLocked ? 'pointer-events-none' : ''}
        `}
        placeholder=""
      />
    </div>
  );
}