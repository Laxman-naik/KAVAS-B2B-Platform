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

const setupInterceptors = (apiInstance) => {
  apiInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (
        err.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/refresh")
      ) {
        originalRequest._retry = true;

        try {
          // call refresh (cookie-based)
          await authapi.post("/api/auth/refresh");

          // retry original request
          return apiInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(err);
    }
  );
};

setupInterceptors(authapi);
setupInterceptors(productapi);