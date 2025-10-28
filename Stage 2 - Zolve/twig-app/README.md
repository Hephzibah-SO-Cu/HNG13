# Zolve — Ticket Management (Twig / PHP implementation)

**What this is**  
A complete Ticket Management frontend implementation using Twig templates + PHP.  
This repository is part of the HNG13 Frontend Stage 2 multi-framework task (React, Vue, Twig). This folder contains the **Twig** implementation.

---

## Live / Test credentials
Live site: https://hng-13-stage-2-twigapp-busayo.onrender.com/

You can use the example users already in `data/users.json`:

- **admin@zolve.com** / **zolveadmin**  
- **admin2@zolve.com** / **admin2zolve**

(These are mock accounts stored in `data/users.json` for the assignment.)

---

## Features implemented
- Landing page with wave hero, decorative circles, and CTA buttons.
- Login & Signup pages with server-side validation and SweetAlert flash notifications.
- Dashboard with ticket statistics (Total, Open, In Progress, Closed).
- Ticket Management (Create / Read / Update / Delete) with:
  - Server-side validation (title & status mandatory),
  - Status values strictly limited to: `open`, `in_progress`, `closed`,
  - Priority handling: `low`, `medium`, `high`,
  - SweetAlert success/error toasts (flash messages).
- Protected routes: Dashboard and Tickets pages require an active session.
- Design rules: max width 1440px, card-based layout, status color mapping, responsive behavior.

---

## Tech stack
- PHP (built-in server for dev)
- Twig (templating)
- SweetAlert2 (toast / modals)
- Plain CSS (shared/styles.css)
- Data persistence: local JSON files (`data/users.json`, `data/tickets.json`) for the mock backend

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
- PHP 7.4+ recommended (code will work with older versions but Composer/Twig may require >=5.6)
- [Composer](https://getcomposer.org/) installed

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