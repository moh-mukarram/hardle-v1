
export interface GameSession {
    id: string;
    status: 'IN_PROGRESS' | 'WIN' | 'LOSE';
    guesses: GuessDetail[];
    remaining_attempts?: number; // Optional helper
    target_word?: string; // Populated only on WIN/LOSE
}

export interface GuessDetail {
    word: string;
    colors: number[]; // 0=Gray, 1=Yellow, 2=Green
}

// Fallback to localhost if VITE_API_URL is missing
export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// Internal helper for safe JSON fetching
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const defaultOptions: RequestInit = {
        credentials: 'include', // Ensure cookies are sent
    };

    const finalOptions = { ...defaultOptions, ...options };

    const res = await fetch(url, finalOptions);
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        // If response claims to be JSON, try to parse it
        const data = await res.json();
        if (!res.ok) {
            // Backend returned JSON error object
            throw new Error(data.message || `Request failed: ${res.status}`);
        }
        return data as T;
    } else {
        // Not JSON (e.g., 500 HTML error, 404 text)
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        // Success but not JSON? This shouldn't happen for our API.
        throw new Error("Invalid response: Expected JSON, got " + (contentType || "unknown"));
    }
}

export async function getGameState(sessionId?: string, mode: string = 'hard'): Promise<GameSession> {
    let url = `${API_BASE}/api/game/state`;
    const params = new URLSearchParams();
    if (sessionId) params.append("session_id", sessionId);
    params.append("mode", mode);

    return fetchJson<GameSession>(`${url}?${params.toString()}`);
}

export async function submitGuess(sessionId: string, guess: string): Promise<GameSession> {
    return fetchJson<GameSession>(`${API_BASE}/api/game/guess?session_id=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess })
    });
}

export async function resetGame(mode: string = 'hard'): Promise<GameSession> {
    return fetchJson<GameSession>(`${API_BASE}/api/game/reset?mode=${mode}`, { method: 'POST' });
}

// --- Auth API ---

export interface AuthResponse {
    username: string;
    email: string;
}



export async function signup(username: string, email: string, password: string): Promise<AuthResponse> {
    return fetchJson<AuthResponse>(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    return fetchJson<AuthResponse>(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
}

export async function getMe(): Promise<AuthResponse> {
    return fetchJson<AuthResponse>(`${API_BASE}/api/auth/me`);
}



export async function logout(): Promise<void> {
    // Logout might not return JSON, just 200 OK.
    const res = await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include' // CRITICAL: Send session cookie to backend
    });
    if (!res.ok) throw new Error('Logout failed');
}
