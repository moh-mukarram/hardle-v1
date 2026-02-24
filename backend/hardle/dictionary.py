import os
from pathlib import Path
import random
from typing import Set, List

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / 'data'
SOLUTIONS_PATH = DATA_DIR / 'solutions.txt'
VALID_GUESSES_PATH = DATA_DIR / 'valid_guesses.txt'

# Safety Guards (Forbidden Words)
# Words that must NEVER be in the dictionary (e.g., offensive, or specific bans requested by product).
# If these are found in the loaded files, the application will refuse to start.
_FORBIDDEN_WORDS = {
    "SOARE", # Banned strategy word (requested)
    "CLINT", # Banned (requested)
}

# In-memory storage
_SOLUTIONS: List[str] = []
_VALID_GUESSES: Set[str] = set()

def _load_dictionary():
    """Loads dictionary files into memory if not already loaded."""
    global _SOLUTIONS, _VALID_GUESSES
    
    if _SOLUTIONS and _VALID_GUESSES:
        return

    # Load Solutions (for target selection)
    if not SOLUTIONS_PATH.exists():
        raise FileNotFoundError(f"Dictionary file not found: {SOLUTIONS_PATH}")
    
    with open(SOLUTIONS_PATH, 'r', encoding='utf-8') as f:
        _SOLUTIONS = [line.strip().upper() for line in f if line.strip()]

    # Load Valid Guesses (for validation)
    guess_list = []
    if VALID_GUESSES_PATH.exists():
        with open(VALID_GUESSES_PATH, 'r', encoding='utf-8') as f:
            guess_list = [line.strip().upper() for line in f if line.strip()]
    
    # Combined Set
    _VALID_GUESSES = set(_SOLUTIONS) | set(guess_list)
    
    # Perform Safety Checks
    # We check if any forbidden word managed to sneak into the valid guesses
    overlap = _VALID_GUESSES.intersection(_FORBIDDEN_WORDS)
    if overlap:
        raise RuntimeError(
            f"CRITICAL SECURITY ERROR: Dictionary contains forbidden words: {overlap}. "
            "Server startup aborted."
        )
    
    print(f"[Dictionary] Loaded {len(_SOLUTIONS)} solutions and {len(_VALID_GUESSES)} valid guesses. Safety check passed.")

# Initialize on module load
_load_dictionary()

def is_valid_word(word: str) -> bool:
    """Checks if a word is in the valid guesses set."""
    if not word:
        return False
    return word.upper() in _VALID_GUESSES

def get_random_target() -> str:
    """Selects a random target word from the solution list."""
    if not _SOLUTIONS:
        _load_dictionary() # Just in case
    return random.choice(_SOLUTIONS)

def get_total_solutions() -> int:
    return len(_SOLUTIONS)

def get_total_guesses() -> int:
    return len(_VALID_GUESSES)
