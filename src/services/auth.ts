/**
 * Frontend-only authentication utilities
 * Uses localStorage to persist auth state
 * Token is obtained from backend after login/register
 */

const TOKEN_KEY = "qwik_token";
const ROLE_KEY = "qwik_role";
const LOGIN_EMAIL_KEY = "qwik_login_email";
const DEV_TEST_TOKENS = new Set(["test-token", "dev-test-token"]);

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");

  if (parts.length !== 3 || !parts[1]) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payloadJson = atob(padded);
    return JSON.parse(payloadJson) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ===== Token Management =====
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isTokenExpired(token: string | null | undefined) {
  if (!token) {
    return true;
  }

  if (DEV_TEST_TOKENS.has(token)) {
    return false;
  }

  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;

  if (typeof exp !== "number") {
    return false;
  }

  return exp * 1000 <= Date.now();
}

export function hasValidToken() {
  const token = getToken();

  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    clearAllAuthData();
    return false;
  }

  return true;
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function getRoleFromToken() {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  return typeof payload?.role === "string" ? payload.role : null;
}

export function setRole(role: string) {
  localStorage.setItem(ROLE_KEY, role);
}

export function clearRole() {
  localStorage.removeItem(ROLE_KEY);
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

// ===== Session Management =====
/**
 * Clear all authentication data from localStorage
 * Call this on logout
 */
export function clearAllAuthData() {
  clearToken();
  clearRole();
  clearLoginEmail();
}
