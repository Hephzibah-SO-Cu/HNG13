# HNG13 Stage 1 — Multi-Page Profile Site  

A clean, responsive, and accessible multi-page web project built for **HNG13 Stage 1**.  
This continues from Stage 0’s profile card, adding **Contact** and **About** pages with proper validation, accessibility, and semantic HTML.

---

## 🚀 Overview
This web app contains three pages:

1. **Profile Page (`index.html`)** — displays personal details and a live digital clock.  
2. **Contact Page (`contact.html`)** — includes a validated contact form with accessible error and success feedback.  
3. **About Page (`about.html`)** — reflective content with structured, semantic sections.

Each page is responsive, keyboard-accessible, and uses consistent visual styling.

---

## 🧩 Features
### 🏠 Profile Page
- Displays live local **time and date**
- Updates dynamically every 50ms
- Clean, centered layout with responsive design

### 💬 Contact Page
- Form with validation for:
  - Full Name (`test-contact-name`)
  - Email (`test-contact-email`)
  - Subject (`test-contact-subject`)
  - Message (`test-contact-message`)
- Error messages with `aria-describedby` links:
  - e.g. `test-contact-error-email`
- Success message shown after valid submission (`test-contact-success`)
- Fully keyboard navigable and screen-reader friendly

### 🧠 About Page
- Contains five reflective sections:
  - Bio — `test-about-bio`
  - Goals — `test-about-goals`
  - Areas of low confidence — `test-about-confidence`
  - Note to future self — `test-about-future-note`
  - Extra thoughts — `test-about-extra`
- Built with semantic HTML (`main`, `section`, `h2`, `p`, `ul`)

---

## 🧱 Tech Stack
- **HTML5** — semantic structure and accessibility  
- **CSS3** — responsive layout, flexbox, media queries  
- **Vanilla JavaScript (ES6)** — form validation and dynamic updates  

---

## 🧭 Project Structure
```bash
📁 hng13-stage1
│
├── index.html # Profile page with live time
├── contact.html # Contact form page
├── about.html # Reflection page
├── style.css # Shared global styles
└── script.js # JS logic (clock + form validation)
```

---

## 🧪 Data-TestIDs Summary
| Page | Element | Test ID |
|------|----------|---------|
| Contact | Form wrapper | `test-contact-form` |
| Contact | Name input | `test-contact-name` |
| Contact | Email input | `test-contact-email` |
| Contact | Subject input | `test-contact-subject` |
| Contact | Message textarea | `test-contact-message` |
| Contact | Submit button | `test-contact-submit` |
| Contact | Error messages | `test-contact-error-<field>` |
| Contact | Success message | `test-contact-success` |
| About | Main container | `test-about-page` |
| About | Bio | `test-about-bio` |
| About | Goals | `test-about-goals` |
| About | Confidence | `test-about-confidence` |
| About | Note to future self | `test-about-future-note` |
| About | Extra thoughts | `test-about-extra` |

---

## 📱 Responsiveness
- Scales gracefully from **mobile → tablet → desktop**
- Media queries at 700px and 900px
- Uses fluid widths, flexible spacing, and no horizontal overflow

---

## ⚙️ How to Run Locally
1. Clone this repo:

   ```bash
   git clone <your-repo-link>
   cd hng13-stage1
   ```
2. Open any of the pages in your browser:
    index.html → Profile
    about.html → About Me
    contact.html → Contact Form
    No external dependencies required.

## 🌐 Live Demo
Live URL: https://hng-13-stage-0-busayo.vercel.app/
GitHub Repo: https://github.com/Hephzibah-SO-Cu/HNG13/tree/main/Stage%200%20-%20Profile%20Card

## 📜 License
 Open-source and free to use for learning, testing, or reference during the HNG13 Internship.