import axios from "axios";
import { AUTH_TOKEN_STORAGE_KEY } from "../utils/constants";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  // Fail loudly in dev rather than silently hitting a relative path.
  // eslint-disable-next-line no-console
  console.error(
    "VITE_API_BASE_URL is not set. Copy .env.example to .env and set it.",
  );
}

export const axiosClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach the bearer token, if present, to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A single hook for "the session is no longer valid" that AuthContext
// registers into. Kept decoupled from React so this file has no React
// dependency and can't create an import cycle with AuthContext.
let onUnauthorized = null;
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.error?.code;

    if (status === 401 && onUnauthorized) {
      onUnauthorized(code);
    }

    return Promise.reject(error);
  },
);
