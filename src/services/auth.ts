const TOKEN_KEY = "qwik_token";
const LOGIN_EMAIL_KEY = "qwik_login_email";
const RESET_TOKEN_KEY = "qwik_reset_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setLoginEmail(email: string) {
  localStorage.setItem(LOGIN_EMAIL_KEY, email);
}

export function getLoginEmail() {
  return localStorage.getItem(LOGIN_EMAIL_KEY) ?? "";
}

export function setResetToken(token: string) {
  localStorage.setItem(RESET_TOKEN_KEY, token);
}

export function getResetToken() {
  return localStorage.getItem(RESET_TOKEN_KEY) ?? "";
}
