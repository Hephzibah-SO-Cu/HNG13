# Zolve React Implementation (HNG13 Stage 2)

## Frameworks and Libraries
- React 18.2.0
- React Router DOM 6.22.0
- React Hot Toast 2.4.1
- Vite 5.0.0 (build tool)

## Setup and Execution
1. cd react-app
2. npm install
3. Copy ../shared to public/shared
4. npm run dev (open http://localhost:5173)
5. For build: npm run build (output in dist/)

## UI Components and State Structure
- Global styles from shared/styles.css.
- State: LocalStorage for auth (ticketapp_session) and tickets (zolve_tickets).
- Components: Landing (hero), Auth (forms with validation), Dashboard (stats grid), Tickets (CRUD form/list with toasts).
- Protected routes via isAuthenticated check.

## Accessibility and Known Issues
- Semantic HTML used (h1/h2/h3, forms with labels implied by placeholders—add aria-labels if needed).
- Alt text on images, focus states on buttons (CSS :focus).
- Color contrast: Status colors meet AA standards.
- Known issues: LocalStorage not persistent across domains; no real backend (mock only). Responsive tested on mobile/desktop.

## Test User Credentials
Email: user@zolve.com
Password: zolve123

To switch frameworks: See root README for Vue/Twig links.