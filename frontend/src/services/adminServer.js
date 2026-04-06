

// import axios from "axios";

// const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

// const isBrowser = typeof window !== "undefined";

// /* AXIOS INSTANCE */
// const adminApi = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// /* REQUEST INTERCEPTOR */
// adminApi.interceptors.request.use((config) => {
//   if (isBrowser) {
//     const token = localStorage.getItem("admin_token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   return config;
// });

// /* REFRESH CONTROL */
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((p) => {
//     error ? p.reject(error) : p.resolve(token);
//   });
//   failedQueue = [];
// };

// /* RESPONSE INTERCEPTOR */
// adminApi.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (!originalRequest) return Promise.reject(error);

//     if (originalRequest.url?.includes("/admin/refresh")) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return adminApi(originalRequest);
//         });
//       }

//       isRefreshing = true;

//       try {
//         const res = await axios.post(
//           `${BASE_URL}/api/admin/refresh`,
//           {},
//           { withCredentials: true }
//         );

//         const newToken = res.data?.accessToken;

//         if (!newToken) throw new Error("No admin token received");

//         if (isBrowser) {
//           localStorage.setItem("admin_token", newToken);
//         }

//         adminApi.defaults.headers.common.Authorization = `Bearer ${newToken}`;

//         processQueue(null, newToken);

//         originalRequest.headers.Authorization = `Bearer ${newToken}`;

//         return adminApi(originalRequest);
//       } catch (err) {
//         processQueue(err, null);

//         if (isBrowser) {
//           localStorage.removeItem("admin_token");
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

// export const refreshAdminToken = () =>
//   adminApi.post("/api/admin/refresh");

// export const logoutAdminAPI = () =>
//   adminApi.post("/api/admin/logout");

// export const getAdminProfile = () =>
//   adminApi.get("/api/admin/me");

// export default adminApi;

import axios from "axios";

const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

/* AXIOS INSTANCE */
const adminApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔥 REQUIRED for cookies
});

/* REFRESH CONTROL */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve();
  });
  failedQueue = [];
};

/* RESPONSE INTERCEPTOR */
adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // ❌ Don't retry refresh itself
    if (originalRequest.url?.includes("/admin/refresh")) {
      return Promise.reject(error);
    }

    // ✅ If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => adminApi(originalRequest));
      }

      isRefreshing = true;

      try {
        // 🔥 Call refresh (cookie-based)
        await axios.post(
          `${BASE_URL}/api/admin/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);

        // 🔥 Retry original request (cookie already updated)
        return adminApi(originalRequest);
      } catch (err) {
        processQueue(err);

        // Optional: redirect to login
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

/* ADMIN APIs */
export const registerAdminAPI = (data) =>
  adminApi.post("/api/admin/register", data);

export const loginAdminAPI = (data) =>
  adminApi.post("/api/admin/login", data);

export const logoutAdminAPI = () =>
  adminApi.post("/api/admin/logout");

export const getAdminProfile = () =>
  adminApi.get("/api/admin/me");

export default adminApi;