import axios from "axios";

const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/* ================== REQUEST INTERCEPTOR ================== */
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================== REFRESH CONTROL ================== */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

/* ================== RESPONSE INTERCEPTOR ================== */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // ❌ DO NOT refresh refresh endpoint
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      /* ================== QUEUE REQUESTS ================== */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // IMPORTANT: use SAME instance (axios OR api, not mixed)
        const res = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data?.accessToken;

        if (!newToken) throw new Error("No access token received");

        localStorage.setItem("token", newToken);

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        localStorage.removeItem("token");

        window.location.href = "/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ================== AUTH API FUNCTIONS ================== */
export const registerUserAPI = (data) =>
  api.post("/api/auth/register", data);

export const loginUser = (data) =>
  api.post("/api/auth/login", data);

export const refreshToken = () =>
  api.post("/api/auth/refresh");

export const logoutUser = () =>
  api.post("/api/auth/logout");

export const getMe = () =>
  api.get("/api/auth/me");

export default api;