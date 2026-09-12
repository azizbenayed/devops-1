// Same simple pattern the backend's express-validator isEmail() accepts in
// practice for the common case; good enough for instant client-side
// feedback (the server remains the source of truth).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value) => EMAIL_RE.test(String(value || "").trim());

// Mirrors the tickets/auth service's own express-validator rules so the
// UI never rejects something the API would accept, or vice versa.
export const isValidSignupPassword = (value) =>
  typeof value === "string" && value.trim().length >= 4 && value.trim().length <= 20;

export const isValidPrice = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
};
