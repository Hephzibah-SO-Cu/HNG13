# Zolve — Ticket Management (Twig / PHP implementation)

## Live Demo
Deployed: https://hng-13-stage-2-twigapp-busayo.onrender.com/

## What this is  
A complete Ticket Management frontend implementation using Twig templates + PHP.  
This repository is part of the HNG13 Frontend Stage 2 multi-framework task (React, Vue, Twig). This folder contains the **Twig** implementation.

---

## Example test accounts
You can use the example users already in `data/users.json`:
- **admin@zolve.com** / **zolveadmin**  
- **admin2@zolve.com** / **admin2zolve**

---

## Features implemented
- Landing page with wave hero, decorative circles, and CTAs
- Login & Signup with server-side validation and SweetAlert flashes
- Dashboard with ticket statistics (Total / Open / In Progress / Closed)
- Ticket Management (Create / Read / Update / Delete) with server-side validation:
  - `title` and `status` required
  - `status` limited to `open`, `in_progress`, `closed`
  - `priority`: `low`, `medium`, `high`
- Protected routes: Dashboard and Tickets require an active session
- Responsive layout, max width 1440px, accessible-ish markup

---

## Tech stack
- PHP (recommended 7.4+)
- Twig (templating)
- Composer
- SweetAlert2 (for flash messages)
- Plain CSS (`shared/styles.css`)
- Mock persistence: JSON files (`data/users.json`, `data/tickets.json`)

---

## Project structure
```bash
twig-app/
├─ auth/ # auth entry scripts
│ ├─ login.php
│ ├─ signup.php
│ ├─ process_login.php
│ ├─ process_signup.php
│ └─ logout.php
├─ data/
│ ├─ users.json
│ └─ tickets.json
├─ shared/
│ ├─ styles.css
│ └─ wave.svg, circle.svg
├─ templates/
│ ├─ base.twig
│ ├─ landing.twig
│ ├─ dashboard.twig
│ ├─ tickets.twig
│ └─ auth/
│ ├─ login.twig
│ └─ signup.twig
├─ index.php
├─ dashboard.php
├─ tickets.php
└─ composer.json
```
---

## Setup & Local Development
**Prerequisites**
- PHP 7.4+ 
- Composer

**Run locally**
1. From project root (where `composer.json` lives), install deps:
```bash
   composer install
```
2. Start PHP built-in server (from within the twig-app folder):
 ```bash
    php -S 127.0.0.1:8000
```
3. Open your browser: http://127.0.0.1:8000/index.php

Notes

The app reads/writes data/users.json and data/tickets.json. Make sure the PHP process has write permission:
```bash
    chmod 664 data/*.json
```
# If still failing in local dev, temporarily:
```bash
    chmod 666 data/*.json
```

## Notes

- This implementation uses JSON files as a mock backend — fine for the task but not production.
- If you want per-user separation for tickets, the JSON schema can be changed or a real backend adde