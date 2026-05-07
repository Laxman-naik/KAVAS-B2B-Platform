import axios from "axios";

const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

if (typeof window !== "undefined") {
  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", crypto.randomUUID());
  }
}

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const authapi = axios.create({
  baseURL: AUTH_BASE_URL,
});

export const productapi = axios.create({
  baseURL: PRODUCT_BASE_URL,
});

const attachHeaders = (config) => {
  config.headers = config.headers || {};

  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const sessionId = localStorage.getItem("sessionId");
  if (sessionId) {
    config.headers["x-session-id"] = sessionId;
  }

  return config;
};

const handleError = (error) => {
  if (error.response?.status === 401) {
    console.warn("🔒 Unauthorized - clearing token");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:expired"));
    }
  }

  return Promise.reject(error);
};

authapi.interceptors.request.use(attachHeaders);
productapi.interceptors.request.use(attachHeaders);

authapi.interceptors.response.use((res) => res, handleError);
productapi.interceptors.response.use((res) => res, handleError);