// import axios from "axios";

// const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
// const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";


// if (typeof window !== "undefined") {
//   if (!localStorage.getItem("sessionId")) {
//     localStorage.setItem("sessionId", crypto.randomUUID());
//   }
// }


// export const authapi = axios.create({
//   baseURL: AUTH_BASE_URL,
// });

// export const productapi = axios.create({
//   baseURL: PRODUCT_BASE_URL,
// });

// const attachHeaders = (config) => {

//   config.headers = config.headers || {};

//   if (!config.skipAuth) {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   const sessionId = localStorage.getItem("sessionId");
//   if (sessionId) {
//     config.headers["x-session-id"] = sessionId;
//   }

//   return config;
// };

// authapi.interceptors.request.use(attachHeaders);
// productapi.interceptors.request.use(attachHeaders);

import axios from "axios";

const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

// -------------------------------
// Session ID (safe init)
// -------------------------------
if (typeof window !== "undefined") {
  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", crypto.randomUUID());
  }
}

// -------------------------------
// AXIOS INSTANCES
// -------------------------------
export const authapi = axios.create({
  baseURL: AUTH_BASE_URL,
});

export const productapi = axios.create({
  baseURL: PRODUCT_BASE_URL,
});

// -------------------------------
// REQUEST INTERCEPTOR (STRICT)
// -------------------------------
const attachHeaders = (config) => {
  config.headers = config.headers || {};

  const token = localStorage.getItem("accessToken");

  // ❗ HARD FAIL instead of silent request
  if (!config.skipAuth) {
    if (!token) {
      console.error("❌ No access token → blocking request:", config.url);
      return Promise.reject(new Error("No access token"));
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  // session tracking
  const sessionId = localStorage.getItem("sessionId");
  if (sessionId) {
    config.headers["x-session-id"] = sessionId;
  }

  return config;
};

// -------------------------------
// RESPONSE INTERCEPTOR (HANDLE EXPIRED TOKEN)
// -------------------------------
const handleResponseError = async (error) => {
  const originalRequest = error.config;

  // 🔥 If unauthorized → force logout (or refresh logic later)
  if (error.response?.status === 401 && !originalRequest._retry) {
    console.error("🔒 Unauthorized / Token expired");

    // prevent infinite loop
    originalRequest._retry = true;

    // ❗ simple approach: clear and redirect
    localStorage.removeItem("accessToken");

    if (typeof window !== "undefined") {
      window.location.href = "/vendor/vendorlogin";
    }
  }

  return Promise.reject(error);
};

// -------------------------------
// APPLY INTERCEPTORS
// -------------------------------
authapi.interceptors.request.use(attachHeaders, (err) => Promise.reject(err));
productapi.interceptors.request.use(attachHeaders, (err) => Promise.reject(err));

authapi.interceptors.response.use(
  (res) => res,
  handleResponseError
);

productapi.interceptors.response.use(
  (res) => res,
  handleResponseError
);