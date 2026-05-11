// import axios from "axios";

// const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
// const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

// if (typeof window !== "undefined") {
//   if (!localStorage.getItem("sessionId")) {
//     localStorage.setItem("sessionId", crypto.randomUUID());
//   }
// }

// const getToken = () => {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("accessToken");
// };

// export const authapi = axios.create({
//   baseURL: AUTH_BASE_URL,
// });

// export const productapi = axios.create({
//   baseURL: PRODUCT_BASE_URL,
// });

// const attachHeaders = (config) => {
//   config.headers = config.headers || {};

//   const token = getToken();

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   const sessionId = localStorage.getItem("sessionId");
//   if (sessionId) {
//     config.headers["x-session-id"] = sessionId;
//   }

//   return config;
// };

// const handleError = (error) => {
//   if (error.response?.status === 401) {
//     console.warn("🔒 Unauthorized - clearing token");

//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");

//     if (typeof window !== "undefined") {
//       window.dispatchEvent(new Event("auth:expired"));
//     }
//   }

//   return Promise.reject(error);
// };

// authapi.interceptors.request.use(attachHeaders);
// productapi.interceptors.request.use(attachHeaders);

// authapi.interceptors.response.use((res) => res, handleError);
// productapi.interceptors.response.use((res) => res, handleError);

import axios from "axios";

const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

if (typeof window !== "undefined") {
  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", crypto.randomUUID());
  }
}

/* ================= TOKEN HELPERS ================= */

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
};

const setToken = (token) => {
  localStorage.setItem("accessToken", token);
};

/* ================= AXIOS INSTANCES ================= */

export const authapi = axios.create({
  baseURL: AUTH_BASE_URL,
});

export const productapi = axios.create({
  baseURL: PRODUCT_BASE_URL,
});

/* ================= REFRESH LOGIC ================= */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) throw new Error("No refresh token");

  const res = await axios.post(`${AUTH_BASE_URL}/api/auth/refresh`, {
    refreshToken,
  });

  const newAccessToken = res.data?.accessToken;

  if (!newAccessToken) throw new Error("Refresh failed");

  setToken(newAccessToken);

  return newAccessToken;
};

/* ================= REQUEST INTERCEPTOR ================= */

const attachHeaders = (config) => {
  config.headers = config.headers || {};

  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const sessionId = localStorage.getItem("sessionId");
  if (sessionId) {
    config.headers["x-session-id"] = sessionId;
  }

  return config;
};

authapi.interceptors.request.use(attachHeaders);
productapi.interceptors.request.use(attachHeaders);

/* ================= RESPONSE INTERCEPTOR (AUTO REFRESH) ================= */

const handleError = async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return axios(originalRequest);
    } catch (err) {
      processQueue(err, null);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.dispatchEvent(new Event("auth:expired"));

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

authapi.interceptors.response.use((res) => res, handleError);
productapi.interceptors.response.use((res) => res, handleError);