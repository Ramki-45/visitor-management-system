// Centralized so every feature formats dates the same way. If the display
// format needs to change later, it changes in exactly one place.

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

// YYYY-MM-DD for today, in local time — matches <input type="date"> value
// format and is what the API expects for visitDate.
export function getTodayDateString() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

// HH:MM for right now, in local time — matches <input type="time"> value
// format, used to enforce Rule 4 (arrival time can't be earlier than now,
// for today's date) client-side.
export function getCurrentTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function isToday(dateString) {
  return dateString === getTodayDateString();
}
