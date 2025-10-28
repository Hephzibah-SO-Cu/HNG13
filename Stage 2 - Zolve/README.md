# Stage 2 — Zolve (Multi-framework ticket app)

This repository contains three separate frontend implementations of the same ticket management app required by HNG13 Stage 2:

- `twig-app/` — server-side PHP + Twig implementation (deployed on Render)
- `react-app/` — React + Vite implementation (deployed on Vercel)
- `vue-app/` — Vue 3 + Vite implementation (deployed on Vercel)

All implementations follow the same layout and UX rules:
- Wave hero with SVG and decorative circles
- Max-width 1440px, centered layout
- Login / Signup (simulated auth)
- Protected Dashboard + Ticket CRUD
- Responsive design with inline validation and toast notifications

---

## Live deployments
- Twig (PHP/Twig): https://hng-13-stage-2-twigapp-busayo.onrender.com
- React (Vercel): https://hng-13-stage-2-reactapp-busayo.vercel.app
- Vue (Vercel): https://hng-13-stage-2-vueapp-busayo.vercel.app

---

## How to run locally (per implementation)

### Twig (PHP + Twig)
1. `cd "Stage 2 - Zolve/twig-app"`
2. Install dependencies: `composer install`
3. Run a quick local server: `php -S 127.0.0.1:8000 -t .`  
   Open `http://127.0.0.1:8000/index.php`.

**Deploy notes (short)**
- Recommended hosts: Render Web Service (Docker), DigitalOcean App Platform, or any PHP-capable host.
- On Render in a monorepo: set the service Root Directory to `Stage 2 - Zolve/twig-app`, ensure `composer install` runs during build, and pick a PHP runtime or Docker.

### React
1. `cd react-app`
2. `npm install`
3. `npm run dev` → open `http://localhost:5173`
4. `npm run build` / `npm run preview` for production preview

Deployed on Vercel (static front-end). Works as a static app reading/writing `localStorage`.

### Vue
1. `cd vue-app`
2. `npm install`
3. `npm run dev` → open `http://localhost:5173`
4. `npm run build` / `npm run preview`

Deployed on Vercel (static front-end).

---

## Shared assets
Each implementation includes the same shared assets (wave + circle SVGs and `styles.css`) in its `public/shared/` directory. If you want a single shared folder, copy the assets into each implementation's public directory before deploy.

---

## Test user credentials (suggested)
- `user@zolve.com` / `zolve123`

(You can create additional accounts via Signup on each implementation.)

---

## Notes
- The Stage 2 acceptance checklist is implemented across all three apps: landing, auth, dashboard, ticket CRUD, validation, and protected routing.
- The task did **not** require production-ready security (password hashing, server-side auth). Those are optional improvements.
- Local development uses mock persistence in `localStorage`. If you want the repo cleaner for graders, either remove local keys in the browser or implement per-user scoping & password hashing before submission.

---

## Contact / author
- Repo owner: `Shogun.` (Slack)

This project was prepared for HNG13 Stage 2.
