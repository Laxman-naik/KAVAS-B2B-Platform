// setupInterceptors(authapi);
// setupInterceptors(productapi);

// import axios from "axios";

// const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
// const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

// export const authapi = axios.create({
//   baseURL: AUTH_BASE_URL,
// });

// export const productapi = axios.create({
//   baseURL: PRODUCT_BASE_URL,
// });

// // 🔥 attach token to every request
// const attachToken = (apiInstance) => {
//   apiInstance.interceptors.request.use((config) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   });
// };

// // 🔥 handle refresh + retry
// const setupInterceptors = (apiInstance) => {
//   apiInstance.interceptors.response.use(
//     (res) => res,
//     async (err) => {
//       const originalRequest = err.config;

//       if (
//         err.response?.status === 401 &&
//         !originalRequest._retry &&
//         !originalRequest.url.includes("/auth/refresh")
//       ) {
//         originalRequest._retry = true;

//         try {
//           // 🔥 get new access token
//           const res = await authapi.post("/api/auth/refresh");

//           const newToken = res.data?.accessToken;

//           if (!newToken) {
//             return Promise.reject(err);
//           }

//           // 🔥 store new token
//           localStorage.setItem("token", newToken);

//           // 🔥 retry with new token
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;

//           return apiInstance(originalRequest);
//         } catch (refreshError) {
//           localStorage.removeItem("token");
//           return Promise.reject(refreshError);
//         }
//       }

//       return Promise.reject(err);
//     }
//   );
// };

// attachToken(authapi);
// attachToken(productapi);

// setupInterceptors(authapi);
// setupInterceptors(productapi);

import axios from "axios";

const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

export const authapi = axios.create({
  baseURL: AUTH_BASE_URL,
});

export const productapi = axios.create({
  baseURL: PRODUCT_BASE_URL,
});

const attachToken = (config) => {
  const token = localStorage.getItem("accessToken");

  if (token) { config.headers.Authorization = `Bearer ${token}`;}

  return config;
};

authapi.interceptors.request.use(attachToken);
productapi.interceptors.request.use(attachToken);