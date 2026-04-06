// import api from "@/lib/axios";

// export const registerAdminAPI = (data) => api.post("api/admin/register", data);

// export const loginAdminAPI = (data) => api.post("api/admin/login", data);

// export const refreshAdminToken = () => api.post("api/admin/refresh");

// export const logoutAdminAPI = () => api.post("api/admin/logout");

// export const getAdminProfile = () => api.get("api/admin/me");

// import axios from "axios";

// const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

// export const registerAdminAPI = (data) =>
//   axios.post(`${BASE_URL}/api/admin/register`, data);

// export const loginAdminAPI = (data) =>
//   axios.post(`${BASE_URL}/api/admin/login`, data);

// export const refreshAdminToken = () =>
//   axios.post(`${BASE_URL}/api/admin/refresh`);

// export const logoutAdminAPI = () =>
//   axios.post(`${BASE_URL}/api/admin/logout`);

// export const getAdminProfile = () =>
//   axios.get(`${BASE_URL}/api/admin/me`);

import axios from "axios";

const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

/* AXIOS INSTANCE */
const adminApi = axios.create({ baseURL: BASE_URL, withCredentials: true,});

/* REQUEST INTERCEPTOR (Attach admin token) */
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* RESPONSE INTERCEPTOR (AUTO REFRESH ADMIN TOKEN) */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (originalRequest.url?.includes("/admin/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return adminApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/api/admin/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data?.accessToken;

        if (!newToken) throw new Error("No admin token received");

        localStorage.setItem("admin_token", newToken);

        adminApi.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return adminApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("admin_token");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ADMIN APIs */

export const registerAdminAPI = (data) =>
  adminApi.post("/api/admin/register", data);

export const loginAdminAPI = (data) =>
  adminApi.post("/api/admin/login", data);

export const refreshAdminToken = () =>
  adminApi.post("/api/admin/refresh");

export const logoutAdminAPI = () =>
  adminApi.post("/api/admin/logout");

export const getAdminProfile = () =>
  adminApi.get("/api/admin/me");

export default adminApi;