# Zolve — Ticket Management (React Implementation)

## Live demo
Deployed: https://hng-13-stage-2-reactapp-busayo.vercel.app/

## What this is
A frontend-only ticket-management app built with React + Vite.
Implements the Stage 2 requirements: landing page (wave + circles), auth (signup/login), dashboard (stats), tickets CRUD with validation, protected routes. Auth and data are simulated in localStorage.

## Tech stack
- React 18 (Vite)
- React Router v6
- react-hot-toast (toasts)
- Plain CSS (shared/styles.css)
- No backend — uses localStorage to simulate users & tickets

## Quick start (local)
```bash
# 1. clone and cd into the react app folder
cd "Stage 2 - Zolve/react-app"

# 2. install deps
npm install

# 3. run dev server
npm run dev
# Open: http://localhost:5173
```

## Build for production:
```bash
npm run build       # outputs to dist/
npm run preview     # preview build (optional)
```
## Deploy (recommended)
Vercel — easiest for this React app. Example settings for a monorepo:
   - Project root: Stage 2 - Zolve/react-app
   -  Build command: npm run build
   -  Output directory: dist

Netlify or any static host also works.

Note: This is a static frontend. Do not try to serve it on a PHP-only host expecting server runtime (Twig app lives elsewhere).

## Folder overview (important files)
```bash
react-app/
├─ public/shared/         # shared wave + circle + styles.css
├─ src/
│  ├─ pages/              # Landing, Login, Signup, Dashboard, Tickets
│  ├─ utils/
│  │  ├─ auth.js          # login/signup/logout + session token helpers
│  │  └─ tickets.js       # per-user ticket helpers (read/write)
│  ├─ App.jsx             # routes + Navbar + ProtectedRoute
│  └─ main.jsx
├─ index.html
├─ package.json
```

## How auth & data work (exact)
- Session token: stored under ticketapp_session in localStorage (value = btoa(email)).
- Users: stored under zolve_users (array of { email, password }).
- Tickets: stored under zolve_tickets (array). Each ticket includes an owner field (email) and the app filters tickets for the current user before rendering.

This design gives per-user isolation in the UI while keeping everything in localStorage for the frontend task.

## Test credentials
Default test account:
Email: user@zolve.com
Password: zolve123

You can create new users via Signup. Each user’s tickets are isolated.

## UX & validation behavior
- Client-side validation with inline error messages + toast notifications.
Ticket rules:
- title required
- status must be one of open, in_progress, closed
- description max 500 chars

Protected routes redirect to /auth/login when unauthenticated with a toast message.

## Security caveats (do not ship like this)
Do NOT treat this as secure or production-ready. These are the exact weaknesses and what to do about them:
- Plain-text passwords stored in localStorage (zolve_users) — only acceptable for this front-end exercise.
- localStorage is readable by JS on the domain; do not use this approach in production.
- Client-side checks only: a backend is required for real authentication and authorization.

Suggested production architecture: backend (Node/Express, PHP, etc.) + DB + hashed passwords + secure server sessions or JWTs over HTTPS.