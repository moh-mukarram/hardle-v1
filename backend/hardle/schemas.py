from ninja import Schema
from typing import List, Optional
from uuid import UUID

class GuessRequest(Schema):
    guess: str

class GuessDetail(Schema):
    word: str
    colors: List[int]

class GameSessionSchema(Schema):
    id: UUID
    status: str
    mode: str = 'hard'
    guesses: List[GuessDetail]
    target_word: Optional[str] = None
    # target_word is intentionally OMITTED by default, populated only on game over

# Auth Schemas
class SignupRequest(Schema):
    username: str
    email: str
    password: str

class LoginRequest(Schema):
    email: str
    password: str

class UserSchema(Schema):
    username: str
    email: str


