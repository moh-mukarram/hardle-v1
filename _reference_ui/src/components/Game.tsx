import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { GameGrid } from './GameGrid';
import { Keyboard } from './Keyboard';
import { DecryptionPanel } from './DecryptionPanel';
import { OutcomeMessage } from './OutcomeMessage';
import { SessionTimer } from './SessionTimer';
import { ClearancePanel } from './ClearancePanel';
import { LeaderboardPanel } from './LeaderboardPanel';
import { PregameTerminal } from './PregameTerminal';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Word list for the game
const WORD_LIST = ['GRADE', 'SHORE', 'PRIME', 'CRANE', 'SLATE', 'TRACE', 'BRAKE', 'GLOVE', 'PROVE', 'GROVE'];

// Session time limit in seconds (5 minutes)
const SESSION_TIME_LIMIT = 300;

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'current';

interface Guess {
  letters: string[];
  states: LetterState[];
}

interface OutcomeMessages {
  primary: string;
  secondary: string;
}

export function Game() {
  const [targetWord] = useState(() => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  const [guesses, setGuesses] = useState<Guess[]>(
    Array(6).fill(null).map(() => ({
      letters: ['', '', '', '', ''],
      states: ['empty', 'empty', 'empty', 'empty', 'empty'] as LetterState[]
    }))
  );
  
  // Game Flow State
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<'normal' | 'hard' | 'extreme'>('normal');

  const [currentGuess, setCurrentGuess] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [statusMessage, setStatusMessage] = useState('AWAITING INPUT');
  const [keyStates, setKeyStates] = useState<Map<string, LetterState>>(new Map());
  const [panelOpen, setPanelOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(SESSION_TIME_LIMIT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolvingTileIndex, setResolvingTileIndex] = useState<number>(-1);
  const [enterPressed, setEnterPressed] = useState(false);
  const [outcomeMessages, setOutcomeMessages] = useState<OutcomeMessages | null>(null);
  const [lossReason, setLossReason] = useState<'attempts' | 'time' | null>(null);
  
  // User progression state (in real app, this would come from backend/localStorage)
  const [totalPoints, setTotalPoints] = useState(450); // Starting points for demo
  
  // Leaderboard state
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  
  // Calculate points based on performance
  const calculatePoints = (): number => {
    if (gameStatus !== 'won') {
      // Small penalty for losing
      return 10;
    }
    
    // Base points for winning
    let points = 100;
    
    // Bonus for fewer attempts (20 points per unused attempt)
    const unusedAttempts = 5 - currentGuess;
    points += unusedAttempts * 20;
    
    // Time bonus (1 point per 10 seconds remaining)
    points += Math.floor(timeRemaining / 10);
    
    // Difficulty Multiplier/Bonus
    if (difficulty === 'hard') {
      points += 75; // Bonus for Hard mode
    } else if (difficulty === 'extreme') {
      points += 150; // Significant bonus for Extreme mode
    }

    return points;
  };

  // Handle Game Start from Terminal
  const handleStartGame = (mode: 'normal' | 'hard' | 'extreme') => {
    setDifficulty(mode);
    setGameStarted(true);
    // Reset game state if needed, though initial state is fresh
  };

  // Session timer
  useEffect(() => {
    if (!gameStarted || gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameStatus('lost');
          setLossReason('time');
          setStatusMessage('SESSION EXPIRED');
          setOutcomeMessages({
            primary: 'SESSION EXPIRED',
            secondary: 'THE WORLD COULD NOT BE SAVED'
          });
          // Deduct points on time expiration
          setTotalPoints(prev => Math.max(0, prev - 10));
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameStatus]);

  const handleKeyPress = (key: string) => {
    if (!gameStarted || gameStatus !== 'playing' || isProcessing) return;

    if (key === 'ENTER') {
      if (currentLetter === 5) {
        setEnterPressed(true);
        setTimeout(() => setEnterPressed(false), 200);
        submitGuess();
      }
    } else if (key === 'BACKSPACE') {
      if (currentLetter > 0) {
        const newGuesses = [...guesses];
        newGuesses[currentGuess].letters[currentLetter - 1] = '';
        newGuesses[currentGuess].states[currentLetter - 1] = 'empty';
        setGuesses(newGuesses);
        setCurrentLetter(currentLetter - 1);
      }
    } else if (key.length === 1 && /[A-Z]/.test(key)) {
      if (currentLetter < 5) {
        const newGuesses = [...guesses];
        newGuesses[currentGuess].letters[currentLetter] = key;
        newGuesses[currentGuess].states[currentLetter] = 'current';
        setGuesses(newGuesses);
        setCurrentLetter(currentLetter + 1);
      }
    }
  };

  const submitGuess = () => {
    setIsProcessing(true);
    setStatusMessage('PROCESSING GUESS');
    
    const newGuesses = [...guesses];
    const guessWord = newGuesses[currentGuess].letters.join('');
    const targetLetters = targetWord.split('');
    const guessLetters = guessWord.split('');
    const newStates: LetterState[] = Array(5).fill('absent');
    const usedTargetIndices = new Set<number>();
    
    // First pass: mark correct positions
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        newStates[i] = 'correct';
        usedTargetIndices.add(i);
      }
    });
    
    // Second pass: mark present letters
    guessLetters.forEach((letter, i) => {
      if (newStates[i] === 'absent') {
        const targetIndex = targetLetters.findIndex((tl, ti) => 
          tl === letter && !usedTargetIndices.has(ti)
        );
        if (targetIndex !== -1) {
          newStates[i] = 'present';
          usedTargetIndices.add(targetIndex);
        }
      }
    });
    
    // Animate tiles resolving sequentially
    let currentTile = 0;
    const revealInterval = setInterval(() => {
      if (currentTile < 5) {
        setResolvingTileIndex(currentTile);
        newGuesses[currentGuess].states[currentTile] = newStates[currentTile];
        setGuesses([...newGuesses]);
        currentTile++;
      } else {
        clearInterval(revealInterval);
        setResolvingTileIndex(-1);
        
        // Update keyboard states
        const newKeyStates = new Map(keyStates);
        guessLetters.forEach((letter, i) => {
          const currentState = newKeyStates.get(letter);
          const newState = newStates[i];
          
          if (newState === 'correct') {
            newKeyStates.set(letter, 'correct');
          } else if (newState === 'present' && currentState !== 'correct') {
            newKeyStates.set(letter, 'present');
          } else if (newState === 'absent' && !currentState) {
            newKeyStates.set(letter, 'absent');
          }
        });
        setKeyStates(newKeyStates);
        
        // Check win/loss
        if (guessWord === targetWord) {
          setGameStatus('won');
          setStatusMessage('ACCESS GRANTED');
          setOutcomeMessages({
            primary: 'SYSTEM BREACHED',
            secondary: 'ACCESS GRANTED — COMPLETE'
          });
          // Update total points on win
          const pointsEarned = calculatePoints();
          setTotalPoints(prev => prev + pointsEarned);
        } else if (currentGuess === 5) {
          setGameStatus('lost');
          setLossReason('attempts');
          setStatusMessage('DECRYPTION FAILED');
          setOutcomeMessages({
            primary: 'DECRYPTION FAILED',
            secondary: 'KEY COULD NOT BE DERIVED'
          });
        } else {
          setCurrentGuess(currentGuess + 1);
          setCurrentLetter(0);
          setStatusMessage('AWAITING INPUT');
        }
        
        setIsProcessing(false);
      }
    }, 150);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, currentLetter, gameStatus, isProcessing, gameStarted]);

  const calculateProgress = () => {
    const greens = guesses.slice(0, currentGuess + 1).flatMap(g => 
      g.states.filter(s => s === 'correct')
    ).length;
    
    const yellows = guesses.slice(0, currentGuess + 1).flatMap(g => 
      g.states.filter(s => s === 'present')
    ).length;
    
    return { greens, yellows };
  };

  const { greens, yellows } = calculateProgress();

  // Animated status message with ellipsis
  const getAnimatedStatus = () => {
    if (statusMessage === 'PROCESSING GUESS' && isProcessing) {
      const dots = Math.floor((Date.now() / 400) % 4);
      return 'PROCESSING GUESS' + '.'.repeat(dots);
    }
    return statusMessage;
  };

  if (!gameStarted) {
    return (
      <PregameTerminal 
        onStartGame={handleStartGame}
        username="ryu"
        rank="user"
        totalPoints={totalPoints}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-cyan-400 font-mono flex flex-col">
      <Header 
        timeRemaining={timeRemaining} 
        sessionTimeLimit={SESSION_TIME_LIMIT} 
        onLeaderboardOpen={() => setLeaderboardOpen(true)}
      />
      
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 lg:px-6 py-3 lg:py-4 max-w-[1600px] mx-auto flex-1 w-full">
        {/* Main game area */}
        <div className="flex-1 flex flex-col">
          {/* Session info */}
          <div className="text-xs text-cyan-500/60 mb-2 lg:mb-4 border border-cyan-900/40 rounded px-3 py-2 bg-slate-900/20 font-mono">
            <span className="text-cyan-400/70">[l0bed]</span> <span className="text-cyan-500/60">C:\\hardle</span> <span className="text-cyan-600/40 mx-2">›</span> <span className="text-cyan-500/50">06●08N 1 16</span>
          </div>
          
          {/* Mobile timer - ABOVE grid */}
          <div className="lg:hidden text-center mb-2">
            <SessionTimer 
              timeRemaining={timeRemaining} 
              sessionTimeLimit={SESSION_TIME_LIMIT} 
              compact={true}
              gameStatus={gameStatus}
            />
          </div>
          
          {/* Game grid */}
          <div className="flex-1 flex items-center justify-center mb-2 lg:mb-6">
            <GameGrid 
              guesses={guesses} 
              currentRow={currentGuess}
              resolvingTileIndex={resolvingTileIndex}
              gameStatus={gameStatus}
              difficulty={difficulty}
            />
          </div>
          
          {/* Status message - BELOW grid, ABOVE keyboard - Mobile */}
          <div className="lg:hidden text-xs text-cyan-400 mb-2 font-mono tracking-wider text-center min-h-[16px]">
            {outcomeMessages ? outcomeMessages.primary : getAnimatedStatus()}
          </div>
          
          {/* Keyboard - shown only when playing */}
          {gameStatus === 'playing' && (
            <Keyboard 
              onKeyPress={handleKeyPress} 
              keyStates={keyStates}
              enterPressed={enterPressed}
              disabled={isProcessing}
              difficulty={difficulty}
            />
          )}
          
          {/* Keyboard fade out on game end */}
          {gameStatus !== 'playing' && (
            <div className="h-0 overflow-hidden" />
          )}
          
          {/* Outcome message (end state) - Desktop */}
          {outcomeMessages && (
            <div className="hidden lg:block">
              <OutcomeMessage 
                primary={outcomeMessages.primary}
                secondary={outcomeMessages.secondary}
                solution={targetWord}
                pointsGained={calculatePoints()}
              />
            </div>
          )}
          
          {/* Status message (playing state) - Desktop */}
          {!outcomeMessages && (
            <div className="hidden lg:flex text-sm text-cyan-400 mb-3 lg:mb-4 font-mono tracking-wider text-center lg:text-left min-h-[20px]">
              {getAnimatedStatus()}
            </div>
          )}
          
          {/* Outcome message - Mobile (replaces keyboard) */}
          {outcomeMessages && (
            <div className="lg:hidden mb-3">
              <OutcomeMessage 
                primary={outcomeMessages.primary}
                secondary={outcomeMessages.secondary}
                solution={targetWord}
                pointsGained={calculatePoints()}
                gameStatus={gameStatus}
              />
            </div>
          )}
          
          {/* Clearance Panel - Mobile (after outcome) */}
          {outcomeMessages && (
            <div className="lg:hidden mb-3">
              <ClearancePanel 
                currentTotalPoints={totalPoints}
                pointsGained={calculatePoints()}
                gameStatus={gameStatus}
              />
            </div>
          )}
        </div>
        
        {/* Right panel - Desktop */}
        <div className="hidden lg:block">
          {gameStatus === 'playing' ? (
            <DecryptionPanel 
              greens={greens} 
              yellows={yellows}
              attemptsUsed={currentGuess}
              gameStatus={gameStatus}
              difficulty={difficulty}
            />
          ) : (
            <ClearancePanel 
              currentTotalPoints={totalPoints}
              pointsGained={calculatePoints()}
              gameStatus={gameStatus}
            />
          )}
        </div>
      </div>
      
      {/* Mobile Panel - Bottom Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        {gameStatus === 'playing' ? (
          <>
            {/* Toggle button */}
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="w-full bg-slate-900/95 border-t border-cyan-900/40 px-4 py-2.5 flex items-center justify-between backdrop-blur-sm"
            >
              <span className="text-xs tracking-widest text-cyan-400/80">[ DECRYPTION STATE ]</span>
              {panelOpen ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronUp className="w-4 h-4 text-cyan-400" />}
            </button>
            
            {/* Panel content */}
            <div 
              className={`bg-slate-900/95 backdrop-blur-sm border-t border-cyan-900/40 overflow-y-auto transition-all duration-300 ${
                panelOpen ? 'max-h-[60vh]' : 'max-h-0'
              }`}
            >
              <div className="p-4">
                <DecryptionPanel 
                  greens={greens} 
                  yellows={yellows}
                  attemptsUsed={currentGuess}
                  gameStatus={gameStatus}
                  isMobile={true}
                  difficulty={difficulty}
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
      <LeaderboardPanel 
        isOpen={leaderboardOpen} 
        onClose={() => setLeaderboardOpen(false)} 
        currentPlayerPoints={totalPoints} 
      />
    </div>
  );
}
