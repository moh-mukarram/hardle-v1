# Hardle v1

Hardle v1 is a **server-authoritative Wordle-style game** built as a
**foundational platform** for experimentation, analytics, and future expansion.

## Architecture
- Backend: Django 5.1 + Django Ninja (Async)
- Frontend: SvelteKit 5 (Runes)
- Database: PostgreSQL (SQLite for local dev)

## Core Principles
- Server is the single source of truth
- Client is read-only
- Dictionary validation enforced
- Experimental modes are display-only

## Status
Foundation implementation in progress.

---

### Configuration

**Local Development**
No configuration required. The app defaults to:
- Frontend: `http://localhost:5173`
- Backend: `http://127.0.0.1:8000`

**Production (Vercel/Railway)**
Set the following environment variables:

**Frontend (Vercel)**
```
VITE_API_URL=https://your-backend-url.railway.app
```

**Backend (Railway)**
```
DJANGO_DEBUG=False
DATABASE_URL=postgres://...
ALLOWED_HOSTS=*
SECRET_KEY=...
```
