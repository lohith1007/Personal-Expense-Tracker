// Keeps the JWT and username in the browser (localStorage) so a page refresh does not log the user out.
// The token is only a proof of identity: the backend reads the user id from inside it.

const TOKEN_KEY = "et_token";
const USERNAME_KEY = "et_username";

export function saveSession(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

// Reads the "exp" (expiry, in seconds) from the middle part of the JWT.
function readExpiry(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)).exp;
  } catch (e) {
    return null;
  }
}

// True only if a token exists and has not expired. An expired token is removed.
export function isLoggedIn() {
  const token = getToken();
  if (!token) {
    return false;
  }
  const exp = readExpiry(token);
  if (!exp || exp * 1000 <= Date.now()) {
    clearSession();
    return false;
  }
  return true;
}
