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

/* ================= ROLE ================= */

const getRole = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role"); // vendor | buyer | admin
};

/* ================= TOKEN HELPERS ================= */

const getToken = () => {
  if (typeof window === "undefined") return null;
  const role = getRole();
  return role ? localStorage.getItem(`${role}_accessToken`) : null;
};

const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  const role = getRole();
  return role ? localStorage.getItem(`${role}_refreshToken`) : null;
};

const setToken = (token) => {
  const role = getRole();
  if (!role) return;
  localStorage.setItem(`${role}_accessToken`, token);
};

/* ================= AXIOS ================= */

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
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

/* 🔥 ROLE-BASED REFRESH ENDPOINT */
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  const role = getRole();

  if (!refreshToken || !role) {
    throw new Error("Missing refresh token or role");
  }

  const res = await axios.post(
    `${AUTH_BASE_URL}/api/${role}/refresh`,
    { refreshToken }
  );

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

/* ================= RESPONSE INTERCEPTOR ================= */

const handleError = async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return axios(originalRequest);
    } catch (err) {
      processQueue(err, null);

      const role = getRole();
      if (role) {
        localStorage.removeItem(`${role}_accessToken`);
        localStorage.removeItem(`${role}_refreshToken`);
      }

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