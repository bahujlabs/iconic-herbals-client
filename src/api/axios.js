import axios from "axios";
import { useAuthStore } from "../store/user/authStore.js";

let refreshPromise = null;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://api.yourapp.com",
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // sends cookies automatically on every request
});

// ── No request interceptor needed ─────────────────────────
// Browser attaches the cookie header automatically

// ── Response: refresh token with deduplication ────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry)
      return Promise.reject(error);

    original._retry = true;

    // Deduplicate: if a refresh is already in-flight, wait for it
    if (!refreshPromise) {
      refreshPromise = api
        .post("/auth/refresh")
        .finally(() => (refreshPromise = null));
    }

    try {
      await refreshPromise;
      return api(original);
    } catch (err) {
      useAuthStore.getState().logout();
      return Promise.reject(err);
    }
  },
);
