import axios from "axios";
import { clearSession, getToken } from "./auth";

// The one Axios instance used by every page. Change the address with REACT_APP_API_URL if needed.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Before every request: attach the JWT as "Authorization: Bearer <token>".
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// After every response: if the server says 401 (token expired/invalid), clear the session and go to login.
// Login and register are excluded because a 401 there just means "wrong username or password".
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = url === "/login" || url === "/register";
    if (error.response?.status === 401 && !isAuthCall && getToken()) {
      clearSession();
      window.location.assign("/login?expired=1");
    }
    return Promise.reject(error);
  }
);

// Turns any Axios error into one readable sentence for the user.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error.response) {
    const data = error.response.data;
    if (data && data.errors && Object.keys(data.errors).length > 0) {
      return Object.values(data.errors).join(" ");
    }
    if (data && data.message) {
      return data.message;
    }
    return fallback;
  }
  if (error.request) {
    return "Cannot reach the server. Please check that the backend is running on http://localhost:8080.";
  }
  return fallback;
}

export default api;
