import axios from "axios";

const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

export const authapi = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true,
});

export const productapi = axios.create({
  baseURL: PRODUCT_BASE_URL,
  withCredentials: true,
});

// ✅ ADD THIS INTERCEPTOR
productapi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});