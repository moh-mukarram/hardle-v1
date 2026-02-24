from ninja import NinjaAPI
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import GameSession, UserProfile
from .schemas import (
    GameSessionSchema, GuessRequest,
    SignupRequest, LoginRequest, UserSchema
)
from .services import GameService

api = NinjaAPI(title="Hardle v1.0 API")

# --- Game Router ---
@api.get("/game/state", response=GameSessionSchema)
def get_game_state(request, session_id: str = None, mode: str = 'hard'):
    # Session loading logic similar to previous version
    session = None
    if session_id:
        session = GameService.get_session(session_id)
    
    if not session:
        session = GameService.create_session(mode=mode)
        # If user is authenticated, link session
        if request.user.is_authenticated:
            session.user = request.user
            session.save()
            
    # Expose target_word only if game is over
    target_word = session.target_word if session.status in ['WIN', 'LOSE'] else None

    # explicit construction for safety
    response_data = {
        "id": session.id,
        "status": session.status,
        "guesses": session.guesses,
        "mode": session.mode if hasattr(session, 'mode') else 'hard',
        "target_word": target_word
    }
            
    return response_data

@api.post("/game/guess", response={200: GameSessionSchema, 400: dict})
def submit_guess(request, payload: GuessRequest, session_id: str):
    try:
        session = GameService.process_guess(session_id, payload.guess)
        if request.user.is_authenticated:
            # Ensure session is linked
            if session.user != request.user:
                 session.user = request.user
                 session.save()
            

        
        response_data = {
            "id": session.id,
            "status": session.status,
            "guesses": session.guesses,
            "target_word": session.target_word if session.status in ['WIN', 'LOSE'] else None
        }
        return response_data
    except ValueError as e:
        return 400, {"message": str(e)}

@api.post("/game/reset", response=GameSessionSchema)
def reset_game(request, mode: str = 'hard'):
    session = GameService.create_session(mode=mode)
    if request.user.is_authenticated:
        session.user = request.user
        session.save()
    return session

# --- Auth Endpoints ---

@api.post("/auth/signup", response={200: UserSchema, 400: dict})
def signup(request, payload: SignupRequest):
    try:
        if User.objects.filter(username=payload.username).exists():
             return 400, {"message": "Username already taken"}
        if User.objects.filter(email=payload.email).exists():
             return 400, {"message": "Email already registered"}

        user = User.objects.create_user(
            username=payload.username,
            email=payload.email,
            password=payload.password
        )
        UserProfile.objects.create(user=user)
        login(request, user)  # Auto-login after signup
        return {"username": user.username, "email": user.email}
    except Exception as e:
        return 400, {"message": str(e)}

@api.post("/auth/login", response={200: UserSchema, 400: dict})
def login_user(request, payload: LoginRequest):
    # Authenticate by email (find user first, then authenticate)
    try:
        user_obj = User.objects.get(email=payload.email)
        user = authenticate(username=user_obj.username, password=payload.password)
        if user:
            login(request, user)
            return {
                "username": user.username,
                "email": user.email,
            }
        else:
            return 400, {"message": "Invalid credentials"}
    except User.DoesNotExist:
        return 400, {"message": "Invalid credentials"}

@api.get("/auth/me", response={200: UserSchema, 401: dict})
def get_me(request):
    if not request.user.is_authenticated:
        return 401, {"message": "Not authenticated"}
    
    return {
        "username": request.user.username,
        "email": request.user.email,
    }


@api.post("/auth/logout", response={200: dict})
def logout_user(request):
    from django.contrib.auth import logout
    logout(request)
    return {"message": "Logged out successfully"}
