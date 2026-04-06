// import api from "@/lib/axios";
// import axios from "axios";

// export const registerUserAPI = (data) => api.post("/api/auth/register", data);

// // export const loginUser = (data) => api.post("/api/auth/login", data);
// export const loginUser = (data) => axios.post("https://kavas-b2b-platform-3.onrender.com/api/auth/login", data)

// export const refreshToken = () => api.post("/api/auth/refresh");

// export const logoutUser = () => api.post("/api/auth/logout");

// export const getMe = () => api.get("/api/auth/me");

// import axios from "axios";

// const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

// export const registerUserAPI = (data) =>
//   axios.post(`${BASE_URL}/api/auth/register`, data);

// export const loginUser = (data) =>
//   axios.post(`${BASE_URL}/api/auth/login`, data);

// export const refreshToken = () =>
//   axios.post(`${BASE_URL}/api/auth/refresh`);

// export const logoutUser = () =>
//   axios.post(`${BASE_URL}/api/auth/logout`);

// export const getMe = () =>
//   axios.get(`${BASE_URL}/api/auth/me`);

// import axios from "axios";

// const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

// const api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true, // for cookies if used
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // AUTH APIs

// export const registerUserAPI = (data) =>
//   api.post("/api/auth/register", data);

// export const loginUser = (data) =>
//   api.post("/api/auth/login", data);

// export const refreshToken = () =>
//   api.post("/api/auth/refresh");

// export const logoutUser = () =>
//   api.post("/api/auth/logout");

// export const getMe = () =>
//   api.get("/api/auth/me");

import axios from "axios";

const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

/* AXIOS INSTANCE */
const api = axios.create({
  baseURL: BASE_URL, withCredentials: true, });

/* REQUEST INTERCEPTOR (token from localStorage)*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* RESPONSE INTERCEPTOR (AUTO REFRESH TOKEN) */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data?.accessToken;

        if (!newToken) throw new Error("No refresh token received");

        localStorage.setItem("token", newToken);

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("token");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* AUTH APIs */

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