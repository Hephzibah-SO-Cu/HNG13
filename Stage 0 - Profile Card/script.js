document.addEventListener("DOMContentLoaded", () => {
  // Navigation: Active Link
  const path = window.location.pathname.split("/").pop();
  const activeLink = document.querySelector(`.nav-link[href="${path}"]`);
  if (activeLink) activeLink.classList.add("active");

  // Index Page: Live Time
  const readable = document.getElementById("user-time-readable");
  const ms = document.getElementById("user-time-ms");

  if (readable && ms) {
    function pad(n, s = 2) { return String(n).padStart(s, "0"); }

    function updateTime() {
      const now = new Date();
      const dname = now.toLocaleString("en-US", { weekday: "long" });
      const mname = now.toLocaleString("en-US", { month: "long" });
      const day = pad(now.getDate());
      const year = now.getFullYear();

      let hours = now.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      const msPart = pad(now.getMilliseconds(), 3);

      readable.textContent = `${dname}, ${mname} ${day}, ${year} — ${hours}:${minutes}:${seconds}.${msPart} ${ampm}`;
      ms.textContent = Date.now();
    }

    updateTime();
    setInterval(updateTime, 50);
  }

  // Contact Page: Form Validation
  const form = document.querySelector('[data-testid="test-contact-form"]');
  if (form) {
    const fields = [
      { el: form.querySelector('[data-testid="test-contact-name"]'), name: 'name' },
      { el: form.querySelector('[data-testid="test-contact-email"]'), name: 'email' },
      { el: form.querySelector('[data-testid="test-contact-subject"]'), name: 'subject' },
      { el: form.querySelector('[data-testid="test-contact-message"]'), name: 'message' },
    ];

    const successMsg = form.querySelector('[data-testid="test-contact-success"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      fields.forEach(({ el, name }) => {
        const errEl = form.querySelector(`[data-testid="test-contact-error-${name}"]`);
        if (!errEl) return;

        errEl.textContent = '';
        const value = el.value.trim();

        if (!value) {
          errEl.textContent = 'This field is required.';
          valid = false;
        } else if (name === 'email' && !emailRegex.test(value)) {
          errEl.textContent = 'Enter a valid email.';
          valid = false;
        } else if (name === 'message' && value.length < 10) {
          errEl.textContent = 'Message must be at least 10 characters.';
          valid = false;
        }
      });

      if (valid && successMsg) {
        successMsg.hidden = false;
        successMsg.textContent = '✅ Message sent successfully!';
        form.reset();
      } else if (successMsg) {
        successMsg.hidden = true;
      }
    });
  }

  // About Page Placeholder
  const about = document.querySelector('[data-testid="test-about-page"]');
  if (about) {
    // No JS required for now; placeholder for future dynamic behaviors
    console.log("About page loaded");
  }
});
