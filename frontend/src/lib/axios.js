import axios from "axios";

const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

/* ================= SESSION INIT ================= */

if (typeof window !== "undefined") {
  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", crypto.randomUUID());
  }
}

/* ================= AXIOS INSTANCES ================= */

export const authapi = axios.create({
  baseURL: AUTH_BASE_URL,
});

export const productapi = axios.create({
  baseURL: PRODUCT_BASE_URL,
});

/* ================= INTERCEPTOR ================= */

const attachHeaders = (config) => {

  config.headers = config.headers || {};

  if (!config.skipAuth) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  const sessionId = localStorage.getItem("sessionId");
  if (sessionId) {
    config.headers["x-session-id"] = sessionId;
  }

  return config;
};

/* ================= APPLY INTERCEPTORS ================= */

authapi.interceptors.request.use(attachHeaders);
productapi.interceptors.request.use(attachHeaders);