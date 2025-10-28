# Zolve — Ticket Management (Vue Implementation)

## Live demo
Deployed: https://hng-13-stage-2-vueapp-busayo.vercel.app/

## What this is
This is the Vue 3 front-end implementation of **Zolve**, a small multi-framework ticket app for HNG13 Stage 2. It implements the same UX and layout rules as the React and Twig versions: wave hero, decorative circles, landing page, auth (login/signup), protected dashboard, and full ticket CRUD.

---

## Frameworks & libraries
- Vue 3
- Vue Router 4
- Vite (dev server / build)
- vue-toastification (toast notifications)

---

## Quick setup (local)
1. `cd vue-app`
2. `npm install`
3. `npm run dev`  
   Open `http://localhost:5173` (or the URL Vite prints)

Build / preview:
- `npm run build`  
- `npm run preview`

---

## Project structure (important files)
- `public/shared/` — shared assets: `wave.svg`, `circle.svg`, `styles.css`
- `src/main.js` — app bootstrap
- `src/App.vue` — header + layout + global auth listener
- `src/router/index.js` — routes & auth guard
- `src/pages/` — `Landing.vue`, `Dashboard.vue`, `Tickets.vue`, `auth/Login.vue`, `auth/Signup.vue`
- `src/utils/auth.js` — client-side auth helpers (session/token storage)
- `src/utils/tickets.js` — tickets helpers (get/save/validate)

---

## How auth & storage work (important)
- **Session token**: saved in `localStorage` under `ticketapp_session` to allow cross-tab behavior and persistent session.
- **Users & tickets**: the app uses `localStorage` as a mock persistence layer:
  - Users are stored under `zolve_users` (array of `{email, password}`).
  - Tickets are stored globally in `zolve_tickets` (array) — or per-user depending on which branch of code you use.
- **Protected routes**: Dashboard and Tickets require `ticketapp_session`. Router guard redirects to `/auth/login` with a toast if not authenticated.

---

## Test credentials (default)
- `user@zolve.com` / `zolve123`

(You can create additional accounts through the signup form.)

---

## Acceptance checklist (stage 2)
- [x] Landing page with wave hero and decorative circles
- [x] Login & Signup (form validation + toasts)
- [x] Dashboard with ticket summary stats
- [x] Ticket management: Create / Read / Update / Delete
- [x] Protected routes (redirect to login if not authenticated)
- [x] Responsive layout, max-width 1440px, accessible-ish markup
- [ ] Optional: passwords hashed & per-user ticket scoping (not required)

---

## Known issues & notes
- Local dev: `localStorage` contains user/ticket data in clear text.
- `auth_notice`: transient helper used for UX; not always visible in `localStorage`.
- If you want the app to **not** leave `zolve_users` or `zolve_tickets` in `localStorage`, run this in the browser console:
  ```js
  localStorage.removeItem('zolve_users');
  localStorage.removeItem('zolve_tickets');
  ```
(That removes old global keys. Current code may use scoped keys depending on the branch.)
