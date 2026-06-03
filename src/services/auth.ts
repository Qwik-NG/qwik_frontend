/**
 * Frontend-only authentication utilities
 * Uses localStorage to persist auth state
 * Token is obtained from backend after login/register
 */

const TOKEN_KEY = "qwik_token";
const LOGIN_EMAIL_KEY = "qwik_login_email";
const RESET_TOKEN_KEY = "qwik_reset_token";

// ===== Token Management =====
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ===== Email & Reset Token Management =====
export function setLoginEmail(email: string) {
  localStorage.setItem(LOGIN_EMAIL_KEY, email);
}

export function getLoginEmail() {
  return localStorage.getItem(LOGIN_EMAIL_KEY) ?? "";
}

export function clearLoginEmail() {
  localStorage.removeItem(LOGIN_EMAIL_KEY);
}

export function setResetToken(token: string) {
  localStorage.setItem(RESET_TOKEN_KEY, token);
}

export function getResetToken() {
  return localStorage.getItem(RESET_TOKEN_KEY) ?? "";
}

export function clearResetToken() {
  localStorage.removeItem(RESET_TOKEN_KEY);
}

// ===== Session Management =====
/**
 * Clear all authentication data from localStorage
 * Call this on logout
 */
export function clearAllAuthData() {
  clearToken();
  clearLoginEmail();
  clearResetToken();
}
