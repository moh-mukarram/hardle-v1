# Hardle Frontend — Forensic Route & Page Inventory Audit

**Date:** 2026-02-23  
**Scope:** `frontend/src/routes/` and all navigation references

---

## 1. Full Route Tree

```
src/routes/
├── +layout.svelte
├── +page.svelte
├── login/
│   └── +page.svelte
├── select-mode/
│   └── +page.svelte
└── game/
    └── +page.svelte
```

No `+layout.ts`, `+page.ts`, `+server.ts`, route groups, or dynamic routes exist.

---

## 2. Route → URL Mapping

| File Path | URL |
|---|---|
| `src/routes/+layout.svelte` | Root layout (wraps all pages) |
| `src/routes/+page.svelte` | `/` |
| `src/routes/login/+page.svelte` | `/login` |
| `src/routes/select-mode/+page.svelte` | `/select-mode` |
| `src/routes/game/+page.svelte` | `/game` |

---

## 3. Used vs Unused Routes

### Used Routes

| URL | Referenced By |
|---|---|
| `/login` | `select-mode/+page.svelte:L18`, `game/+page.svelte:L21` |
| `/select-mode` | `login/+page.svelte:L18`, `+page.svelte:L18`, `AuthForm.svelte:L40`, `game/+page.svelte:L38` |
| `/game?mode=...` | `select-mode/+page.svelte:L23` |

### Orphan Routes

| URL | Status |
|---|---|
| `/` | Functionally orphaned as a destination. No `goto("/")` targets it. Only reachable via direct URL. Its `onMount` redirects authenticated users to `/select-mode`. |

---

## 4. Redirect Analysis

| File | Line | Call | Target |
|---|---|---|---|
| `src/routes/+page.svelte` | 18 | `goto("/select-mode")` | Redirect if authenticated |
| `src/routes/login/+page.svelte` | 18 | `goto("/select-mode")` | Redirect if authenticated |
| `src/lib/components/AuthForm.svelte` | 40 | `goto("/select-mode")` | After login/signup success |
| `src/lib/components/AuthForm.svelte` | 152 | `goto("/game")` | Guest access button |
| `src/routes/select-mode/+page.svelte` | 18 | `goto("/login")` | Auth guard |
| `src/routes/select-mode/+page.svelte` | 23 | `` goto(`/game?mode=${mode}`) `` | Mode selection |
| `src/routes/game/+page.svelte` | 21 | `goto("/login")` | Auth guard |
| `src/routes/game/+page.svelte` | 38 | `goto("/select-mode")` | "Abandon Operation" button |

No `redirect()` or `throw redirect()` calls exist in the project.

---

## 5. Auth Guard Analysis

| File | Checks `isAuthenticated` | Calls `getMe()` | Redirect |
|---|---|---|---|
| `+page.svelte:L17` | ✅ | ✅ (L15) | → `/select-mode` |
| `login/+page.svelte:L17` | ✅ | ✅ (L15) | → `/select-mode` |
| `select-mode/+page.svelte:L32` | ✅ (template) | ✅ (L14) | → `/login` |
| `game/+page.svelte:L29` | ✅ (template) | ✅ (L17) | → `/login` |

---

## 6. Backend API Usage (Frontend Calls)

All calls defined in `src/lib/utils/api.ts`:

| Function | Endpoint | Method | Status |
|---|---|---|---|
| `login()` | `/api/auth/login` | POST | ✅ Active |
| `signup()` | `/api/auth/signup` | POST | ✅ Active |
| `getMe()` | `/api/auth/me` | GET | ✅ Active |
| `logout()` | `/api/auth/logout` | POST | ⚠️ Orphaned |
| `getLeaderboard()` | `/api/auth/leaderboard` | GET | ⚠️ Orphaned |
| `getGameState()` | `/api/game/state` | GET | ⚠️ Orphaned |
| `submitGuess()` | `/api/game/guess` | POST | ⚠️ Orphaned |
| `resetGame()` | `/api/game/reset` | POST | ⚠️ Orphaned |
