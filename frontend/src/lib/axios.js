// import axios from "axios";

// const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
// const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

// export const authapi = axios.create({
//   baseURL: AUTH_BASE_URL,
//   withCredentials: true,
// });

// export const productapi = axios.create({
//   baseURL: PRODUCT_BASE_URL,
//   withCredentials: true,
// });

// const attachToken = (config) => {
//   const token = localStorage.getItem("token");

//   console.log("TOKEN SENT:", token); 

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// };

// authapi.interceptors.request.use(attachToken);
// productapi.interceptors.request.use(attachToken);

import axios from "axios";

const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

/* ================== INSTANCES ================== */

export const authapi = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true, // ✅ IMPORTANT (cookies)
});

export const productapi = axios.create({
  baseURL: PRODUCT_BASE_URL,
  withCredentials: true, // ✅ IMPORTANT (cookies)
});

/* ================== RESPONSE INTERCEPTOR ================== */

const handleResponseError = async (err, apiInstance) => {
  const originalRequest = err.config;

  // prevent infinite loop
  if (err.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      // ✅ call refresh using authapi (cookie-based)
      await authapi.post("/auth/refresh", {}, { withCredentials: true });

      // ✅ retry original request using SAME instance
      return apiInstance(originalRequest);
    } catch (refreshError) {
      console.error("Refresh failed:", refreshError);

      // 🔥 force logout (session expired)
      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(err);
};

/* ================== ATTACH INTERCEPTORS ================== */

// for auth APIs
authapi.interceptors.response.use(
  (res) => res,
  (err) => handleResponseError(err, authapi)
);

// for product APIs
productapi.interceptors.response.use(
  (res) => res,
  (err) => handleResponseError(err, productapi)
);