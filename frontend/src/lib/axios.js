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

// import axios from "axios";

// const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
// const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

// /* ================== INSTANCES ================== */

// export const authapi = axios.create({
//   baseURL: AUTH_BASE_URL,
//   withCredentials: true,
// });

// export const productapi = axios.create({
//   baseURL: PRODUCT_BASE_URL,
//   withCredentials: true,
// });

// /* ================== RESPONSE INTERCEPTOR ================== */

// const handleResponseError = async (err, apiInstance) => {
//   const originalRequest = err.config;

//   if (err.response?.status === 401 && !originalRequest._retry) {
//     originalRequest._retry = true;

//     try {
//       await authapi.post("/api/auth/refresh");
//       return apiInstance(originalRequest);
//     } catch (refreshError) {
//       console.error("Refresh failed:", refreshError);

//       // ❌ DON'T redirect to API route
//       window.location.href = "components/ui/auth/login";

//       return Promise.reject(refreshError);
//     }
//   }

//   return Promise.reject(err);
// };

// /* ================== ATTACH INTERCEPTORS ================== */

// authapi.interceptors.response.use(
//   (res) => res,
//   (err) => handleResponseError(err, authapi)
// );

// productapi.interceptors.response.use(
//   (res) => res,
//   (err) => handleResponseError(err, productapi)
// );

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
  apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);
  console.log("HEADERS:", config.headers);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

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
          const res = await authapi.post("/api/auth/refresh");
          const newToken = res.data?.accessToken;

          if (newToken) {
            localStorage.setItem("token", newToken);
          }

          return apiInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(err);
    }
  );
};

setupInterceptors(authapi);
setupInterceptors(productapi);