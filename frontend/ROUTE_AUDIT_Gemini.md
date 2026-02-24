# Hardle Frontend — Forensic Route & Page Inventory Audit

### 1. FULL ROUTE TREE

```text
src/routes/
 ├── +layout.svelte
 ├── +page.svelte
 ├── game/
 │   └── +page.svelte
 ├── login/
 │   └── +page.svelte
 └── select-mode/
     └── +page.svelte
```

*(No `+layout.ts`, `+page.ts`, `+server.ts`, route groups, or dynamic routes exist anywhere in the project).*

────────────────────────────

### 2. ROUTE → URL MAPPING

| File Path | URL Mapping |
| :--- | :--- |
| `src/routes/+layout.svelte` | *(Root Layout Shell)* |
| `src/routes/+page.svelte` | `/` |
| `src/routes/login/+page.svelte` | `/login` |
| `src/routes/select-mode/+page.svelte` | `/select-mode` |
| `src/routes/game/+page.svelte` | `/game` |

────────────────────────────

### 3. USED VS UNUSED ROUTES

**USED ROUTES**
- `/login` (Referenced by `goto()` guards in `select-mode` and `game`)
- `/select-mode` (Referenced by `goto()` upon login success, and "Abandon" fallback)
- `/game` (Referenced by `goto()` from mode selection buttons)

**ORPHAN ROUTES**
- `/` (`src/routes/+page.svelte`): Functionally orphaned as a user-facing destination. No `goto("/")` or `<a href="/">` points to it. The only way it is reached is by typing the base URL directly, where its `onMount` immediately forces authenticated users away to `/select-mode`.

**UNUSED ROUTES**
- None. All configured paths have at least one valid trigger interaction or direct load path. 

────────────────────────────

### 4. REDIRECT ANALYSIS

| File Location | Line | Redirect Statement |
| :--- | :--- | :--- |
| `src/routes/+page.svelte` | 18 | `goto("/select-mode");` |
| `src/routes/login/+page.svelte` | 18 | `goto("/select-mode");` |
| `src/lib/components/AuthForm.svelte` | 40 | `goto("/select-mode");` |
| `src/lib/components/AuthForm.svelte` | 152 | `goto("/game");` *(Guest Simulation UI string)* |
| `src/routes/select-mode/+page.svelte` | 18 | `goto("/login"); // Simple protection guard` |
| `src/routes/select-mode/+page.svelte` | 23 | ``goto(`/game?mode=${mode}`);`` |
| `src/routes/game/+page.svelte` | 21 | `goto("/login"); // Simple protection guard` |
| `src/routes/game/+page.svelte` | 38 | `goto("/select-mode")` *(Inline onclick abandon button)* |

────────────────────────────

### 5. AUTH GUARD ANALYSIS

| File Path | Checks `auth.isAuthenticated` | Calls `getMe()` API | `onMount` execution |
| :--- | :--- | :--- | :--- |
| `src/routes/+page.svelte` | Yes | Yes | Bounces authenticated users |
| `src/routes/login/+page.svelte` | Yes | Yes | Bounces authenticated users |
| `src/routes/select-mode/+page.svelte` | Yes | Yes | Drops unauthenticated users |
| `src/routes/game/+page.svelte` | Yes | Yes | Drops unauthenticated users |

────────────────────────────

### 6. BACKEND ROUTE USAGE (FRONTEND CALLS)

**Active Calls:**
- `/api/auth/login`
- `/api/auth/signup`
- `/api/auth/me`

**Orphaned/Redundant Backend Connections:**
*(Defined in `api.ts` but never imported nor called from any `.svelte` file)*
- `/api/auth/logout`
- `/api/auth/leaderboard`
- `/api/game/state`
- `/api/game/guess`
- `/api/game/reset`
