function pad(num, size = 2) {
  return String(num).padStart(size, "0");
}

function updateTime() {
  const readableEl = document.getElementById("user-time-readable");
  const msEl = document.getElementById("user-time-ms");
  const now = new Date();

  // Construct readable format
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

  // Example: Thursday, October 16, 2025 — 9:42:30.183 AM
  readableEl.textContent = `${dayName}, ${monthName} ${day}, ${year} — ${hours}:${minutes}:${seconds}.${milliseconds} ${ampm}`;

  // Raw milliseconds (for automated test)
  msEl.textContent = Date.now();
}

// Run immediately, then update every 50ms
setInterval(updateTime, 50);
updateTime();
