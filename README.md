# ConceptCoach — AI Socratic Learning

Explain a concept in your own words. ConceptCoach asks reasoning-based follow-up questions,
one at a time, tracks the discussion over a fixed number of rounds, and ends with a scored
report that shows what you actually understood — not just what you memorised.

- **Live app:** `https://conceptcoachai.vercel.app`
- **API:** https://conceptcoach-ai.onrender.com
- **Backend repository:** https://github.com/shivhareharsh-005/Explained.AI

---

## The learning loop

```text
Explain a topic in your own words
        |
        v
AI asks ONE reasoning-based probing question
        |
        v
You answer  ->  AI asks the next follow-up (3, 4 or 5 rounds)
        |
        v
Session completes automatically
        |
        v
Scored report: overall, clarity, correctness, reasoning, communication
+ strengths, reasoning gaps, resolved gaps, remaining gaps, ideal explanation, next steps
        |
        v
Every session is stored, so the full discussion can be replayed later
```

## Features

**Learner facing**

- Email or username + password sign up / login (JWT stored in httpOnly cookies)
- Enter a topic and your own explanation, then choose 3 to 5 discussion rounds
- Live discussion view with round progress and an "AI is thinking" state
- Session complete screen leading to a scored, personalised report
- History page: replay any past discussion read-only, open its report, or continue an active one

**Engineering**

- Protected routes on both sides (React Router guard + JWT middleware on the API)
- Ownership checks on every session, message and report request (403 on cross-user access)
- Finished sessions are rendered read-only: the answer composer is not rendered at all,
  so the API never receives writes for a completed session
- Single API client (`src/services/api.js`) that always sends cookies and normalises errors
- Shared Tailwind class tokens (`src/styles/classNames.js`) keep long JSX readable

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | React 19, React Router 7, Tailwind CSS 4 |
| Build | Vite 8 |
| Lint | Oxlint |
| API | Express 5, Mongoose 9, MongoDB Atlas |
| Auth | JWT access + refresh tokens, bcrypt, httpOnly cookies |
| AI | Google Gemini via `@google/generative-ai` |
| Hosting | Vercel (this repo) + Render (API) |

## Project structure

```text
src/
├── components/ui/   Navbar, Hero, HowItWorks, ProtectedRoute
├── context/         AuthContext — session bootstrap, login, logout
├── pages/           Home, Login, Signup, StartSession, ChatSession,
│                    SessionComplete, Report, History
├── services/        api.js — one fetch wrapper for every endpoint
├── styles/          home.css, classNames.js (shared Tailwind tokens)
├── App.jsx          Route table
└── main.jsx         Router + AuthProvider entry
```

## Local setup

```bash
npm install
npm run dev              # http://localhost:5173
```

The API runs separately (see the backend repository) on `http://localhost:8000`.
The Vite dev server proxies `/api/*` to it (see `server.proxy` in `vite.config.js`),
so no extra configuration is needed locally.

### Environment variables

| Variable | Local | Production |
| --- | --- | --- |
| `VITE_API_URL` | *optional*, defaults to `/api` | *optional*, defaults to `/api` |

In both environments the browser calls `/api/*` on its own origin: the Vite dev server
proxies those in development, and `vercel.json` proxies them to the Render API in
production. Keeping the call same-origin means the auth cookie stays a first-party
cookie — it works in Safari as well, and the client needs no CORS setup.

## Deployment

- **Frontend → Vercel:** framework preset `Vite`, build `npm run build`, output `dist`
  (no environment variables required — the client defaults to `/api`)
- **API → Render:** build `npm install`, start `node src/index.js`, environment variables as
  documented in the backend repository (MongoDB Atlas network access must allow `0.0.0.0/0`
  because Render does not expose fixed outbound IPs on the free tier)
- `vercel.json` rewrites `/api/*` to the Render service and falls back to `index.html` for
  client-side routes

> Render's free tier sleeps after 15 minutes of inactivity, so the first API request after a
> break can take up to a minute.

## Roadmap

- Automated tests (API integration tests + component tests)
- Refresh token rotation endpoint and silent session refresh
- Streaming AI responses (SSE) and Markdown rendering for AI answers
- Practice questions and per-topic analytics after each report
