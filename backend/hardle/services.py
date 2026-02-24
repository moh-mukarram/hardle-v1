from typing import List
from .dictionary import is_valid_word, get_random_target
from .models import GameSession, GameStatus

COLOR_GRAY = 0
COLOR_YELLOW = 1
COLOR_GREEN = 2

class GameService:
    @staticmethod
    def create_session(mode: str = 'hard') -> GameSession:
        target = get_random_target()
        session = GameSession.objects.create(target_word=target, mode=mode)
        return session

    @staticmethod
    def get_session(session_id: str) -> GameSession:
        try:
            return GameSession.objects.get(id=session_id)
        except GameSession.DoesNotExist:
            return None

    @staticmethod
    def evaluate_guess(target: str, guess: str) -> List[int]:
        target = target.upper()
        guess = guess.upper()
        result = [COLOR_GRAY] * 5
        target_counts = {}

        # First pass: Greens and count targets
        for i, char in enumerate(target):
            target_counts[char] = target_counts.get(char, 0) + 1

        # Decrement counts for CORRECT (Green) matches
        for i, char in enumerate(guess):
            if char == target[i]:
                result[i] = COLOR_GREEN
                target_counts[char] -= 1

        # Second pass: Yellows (Present)
        for i, char in enumerate(guess):
            if result[i] == COLOR_GREEN:
                continue
            
            if char in target_counts and target_counts[char] > 0:
                result[i] = COLOR_YELLOW
                target_counts[char] -= 1
        
        return result

    @staticmethod
    def process_guess(session_id: str, guess_word: str):
        session = GameService.get_session(session_id)
        if not session:
            raise ValueError("Session not found")

        if session.status != GameStatus.IN_PROGRESS:
            raise ValueError("Game is already over")

        guess_word = guess_word.upper()
        if len(guess_word) != 5:
            raise ValueError("Word must be 5 letters")

        if not is_valid_word(guess_word):
            raise ValueError("Not in dictionary")

        colors = GameService.evaluate_guess(session.target_word, guess_word)
        
        # Update session
        current_guesses = session.guesses
        current_guesses.append({
            "word": guess_word,
            "colors": colors
        })
        session.guesses = current_guesses  # Trigger save

        # Check Win/Loss
        if guess_word == session.target_word:
            session.status = GameStatus.WIN
        elif len(current_guesses) >= 6:
            session.status = GameStatus.LOSE
        
        session.save()
        return session
