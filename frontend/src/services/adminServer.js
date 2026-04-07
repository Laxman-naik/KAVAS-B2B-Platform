// import axios from "axios";

// const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

// /* AXIOS INSTANCE */
// const adminApi = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true, // 🔥 REQUIRED for cookies
// });

// /* REFRESH CONTROL */
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error) => {
//   failedQueue.forEach((p) => {
//     error ? p.reject(error) : p.resolve();
//   });
//   failedQueue = [];
// };

// /* RESPONSE INTERCEPTOR */
// adminApi.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (!originalRequest) return Promise.reject(error);

//     // ❌ Don't retry refresh itself
//     if (originalRequest.url?.includes("/admin/refresh")) {
//       return Promise.reject(error);
//     }

//     // ✅ If access token expired
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(() => adminApi(originalRequest));
//       }

//       isRefreshing = true;

//       try {
//         // 🔥 Call refresh (cookie-based)
//         await axios.post(
//           `${BASE_URL}/api/admin/refresh`,
//           {},
//           { withCredentials: true }
//         );

//         processQueue(null);

//         // 🔥 Retry original request (cookie already updated)
//         return adminApi(originalRequest);
//       } catch (err) {
//         processQueue(err);

//         // Optional: redirect to login
//         if (typeof window !== "undefined") {
//           window.location.href = "/admin/login";
//         }

//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// /* ADMIN APIs */
// export const registerAdminAPI = (data) =>
//   adminApi.post("/api/admin/register", data);

// export const loginAdminAPI = (data) =>
//   adminApi.post("/api/admin/login", data);

// export const logoutAdminAPI = () =>
//   adminApi.post("/api/admin/logout");

// export const getAdminProfile = () =>
//   adminApi.get("/api/admin/me");

// export default adminApi;

import axios from "axios";

const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

/* =========================
   PUBLIC API (NO INTERCEPTOR)
========================= */
export const publicApi = axios.create({
  baseURL: BASE_URL,
});

/* =========================
   ADMIN API (PROTECTED)
========================= */
export const adminApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/* =========================
   REFRESH CONTROL STATE
========================= */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve();
  });
  failedQueue = [];
};

/* =========================
   RESPONSE INTERCEPTOR
   (ONLY FOR adminApi)
========================= */
adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "";

    // ❌ NEVER intercept login/register/refresh
    if (
      url.includes("/login") ||
      url.includes("/register") ||
      url.includes("/refresh")
    ) {
      return Promise.reject(error);
    }

    // ❌ only handle token expiry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // queue requests while refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => adminApi(originalRequest));
      }

      isRefreshing = true;

      try {
        await axios.post(
          `${BASE_URL}/api/admin/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);

        return adminApi(originalRequest);
      } catch (err) {
        processQueue(err);

        // cleanup session
        if (typeof window !== "undefined") {
          window.location.href = "/admin/login";
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* =========================
   ADMIN API FUNCTIONS
========================= */

// LOGIN (PUBLIC API)
export const loginAdminAPI = (data) =>
  publicApi.post("/api/admin/login", data, {
    withCredentials: true,
  });

// REGISTER (PUBLIC API)
export const registerAdminAPI = (data) =>
  publicApi.post("/api/admin/register", data);

// LOGOUT (PROTECTED API)
export const logoutAdminAPI = () =>
  adminApi.post("/api/admin/logout");

// PROFILE (PROTECTED API)
export const getAdminProfile = () =>
  adminApi.get("/api/admin/me");

export default adminApi;