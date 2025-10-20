// ==========
// Utility: Pad Numbers
// ==========
function pad(num, size = 2) {
  return String(num).padStart(size, "0");
}

// ==========
// Index Page: Live Time Display
// ==========
function initTime() {
  const readableEl = document.getElementById("user-time-readable");
  const msEl = document.getElementById("user-time-ms");

  if (!readableEl || !msEl) return; // Skip if not on index

  function updateTime() {
    const now = new Date();

    const dayName = now.toLocaleString("en-US", { weekday: "long" });
    const monthName = now.toLocaleString("en-US", { month: "long" });
    const day = pad(now.getDate());
    const year = now.getFullYear();

    let hours = now.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const milliseconds = pad(now.getMilliseconds(), 3);

    readableEl.textContent = `${dayName}, ${monthName} ${day}, ${year} — ${hours}:${minutes}:${seconds}.${milliseconds} ${ampm}`;
    msEl.textContent = Date.now();
  }

  updateTime();
  setInterval(updateTime, 50);
}

// ==========
// Contact Page: Form Validation
// ==========
function initContactForm() {
  const form = document.querySelector('[data-testid="test-contact-form"]');
  if (!form) return; // Skip if not on contact page

  const nameInput = document.querySelector('[data-testid="test-contact-name"]');
  const emailInput = document.querySelector('[data-testid="test-contact-email"]');
  const subjectInput = document.querySelector('[data-testid="test-contact-subject"]');
  const messageInput = document.querySelector('[data-testid="test-contact-message"]');
  const successMsg = document.querySelector('[data-testid="test-contact-success"]');

  // Defensive check: if any required element is missing, bail out gracefully
  if (!nameInput || !emailInput || !subjectInput || !messageInput || !successMsg) {
    // Do not throw — just don't attach the handler
    console.warn("Contact form: missing required elements; validation disabled.");
    return;
  }

  const fields = [
    { el: nameInput, name: "name" },
    { el: emailInput, name: "email" },
    { el: subjectInput, name: "subject" },
    { el: messageInput, name: "message" },
  ];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function clearErrors() {
    fields.forEach(({ name }) => {
      const errEl = document.querySelector(`[data-testid="test-contact-error-${name}"]`);
      if (errEl) {
        errEl.textContent = "";
      }
    });
    // hide success message on new attempts
    if (successMsg) {
      successMsg.textContent = "";
      successMsg.hidden = true;
      successMsg.removeAttribute("role");
      successMsg.removeAttribute("aria-live");
    }
    // remove aria-describedby from inputs
    fields.forEach(({ el }) => {
      if (el) el.removeAttribute("aria-describedby");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    let valid = true;

    fields.forEach(({ el, name }) => {
      const value = el.value ? el.value.trim() : "";
      const errEl = document.querySelector(`[data-testid="test-contact-error-${name}"]`);

      if (!errEl) return; // defensive

      if (!value) {
        errEl.textContent = "This field is required.";
        el.setAttribute("aria-describedby", errEl.id);
        valid = false;
        return;
      }

      if (name === "email" && !emailRegex.test(value)) {
        errEl.textContent = "Please enter a valid email address.";
        el.setAttribute("aria-describedby", errEl.id);
        valid = false;
        return;
      }

      if (name === "message" && value.length < 10) {
        errEl.textContent = "Message must be at least 10 characters.";
        el.setAttribute("aria-describedby", errEl.id);
        valid = false;
        return;
      }

      // If we reach here the field passed validation
      el.removeAttribute("aria-describedby");
    });

    if (valid) {
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.textContent = "✅ Message sent successfully!";
        successMsg.setAttribute("role", "status");
        successMsg.setAttribute("aria-live", "polite");
      }
      form.reset();
    }
  });
}

// ==========
// About Page (no dynamic behavior required)
// ==========
function initAboutPage() {
  const about = document.querySelector('[data-testid="test-about-page"]');
  if (!about) return;
  // No JS required for now; placeholder if we want to add behavior later.
}

// ==========
// Router: Run Only On Matching Page
// ==========
document.addEventListener("DOMContentLoaded", () => {
  initTime();
  initContactForm();
  initAboutPage();
});
