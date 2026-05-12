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

/* ================= SESSION INIT ================= */

if (typeof window !== "undefined") {
  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", crypto.randomUUID());
  }
}

/* ================= ROLE ================= */

const getRole = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("role"); // buyer | vendor | admin
};

/* ================= TOKEN HELPERS ================= */

const getToken = () => {
  if (typeof window === "undefined") return null;

  const role = getRole();

  if (!role) return null;

  return localStorage.getItem(`${role}_accessToken`);
};

const getRefreshToken = () => {
  if (typeof window === "undefined") return null;

  const role = getRole();

  if (!role) return null;

  return localStorage.getItem(`${role}_refreshToken`);
};

const setAccessToken = (token) => {
  if (typeof window === "undefined") return;

  const role = getRole();

  if (!role) return;

  localStorage.setItem(`${role}_accessToken`, token);
};

/* ================= ROLE → REFRESH ROUTES ================= */

const refreshRoutes = {
  buyer: `${AUTH_BASE_URL}/api/auth/refresh`,
  vendor: `${AUTH_BASE_URL}/api/vendor/refresh`,
  admin: `${AUTH_BASE_URL}/api/admin/refresh`,
};

/* ================= AXIOS INSTANCES ================= */

export const authapi = axios.create({
  baseURL: AUTH_BASE_URL,
});

export const productapi = axios.create({
  baseURL: PRODUCT_BASE_URL,
});

/* ================= REQUEST INTERCEPTOR ================= */

const attachHeaders = (config) => {
  config.headers = config.headers || {};

  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (typeof window !== "undefined") {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      config.headers["x-session-id"] = sessionId;
    }
  }

  return config;
};

authapi.interceptors.request.use(attachHeaders);
productapi.interceptors.request.use(attachHeaders);

/* ================= REFRESH LOGIC ================= */

let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshAccessToken = async () => {
  const role = getRole();
  const refreshToken = getRefreshToken();

  console.log("ROLE:", role);
  console.log("REFRESH TOKEN:", refreshToken);

  if (!role || !refreshToken) {
  console.warn("No active session found");
  return null;
}

  const url = refreshRoutes[role];

  console.log("REFRESH URL:", url);

  if (!url) {
    throw new Error(`No refresh route configured for role: ${role}`);
  }

  const response = await axios.post(
    url,
    {
      refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("REFRESH RESPONSE:", response.data);

  const newAccessToken = response.data?.accessToken;

  if (!newAccessToken) {
    throw new Error("No new access token returned");
  }

  setAccessToken(newAccessToken);

  return newAccessToken;
};

/* ================= RESPONSE INTERCEPTOR ================= */

const retryRequest = (originalRequest) => {
  return originalRequest.baseURL === PRODUCT_BASE_URL
    ? productapi(originalRequest)
    : authapi(originalRequest);
};

const handleError = async (error) => {
  const originalRequest = error.config;

  if (!originalRequest) {
    return Promise.reject(error);
  }

  /* Prevent refresh loop */
  if (originalRequest.url?.includes("/refresh")) {
    return Promise.reject(error);
  }

  if (
    error.response?.status === 401 &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;

    /* Queue pending requests while refreshing */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return retryRequest(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return retryRequest(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);

      const role = getRole();

      if (role) {
        localStorage.removeItem(`${role}_accessToken`);
        localStorage.removeItem(`${role}_refreshToken`);
      }

      localStorage.removeItem("role");

      console.error("REFRESH FAILED:", refreshError);

      window.dispatchEvent(new Event("auth:expired"));

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

authapi.interceptors.response.use(
  (response) => response,
  handleError
);

productapi.interceptors.response.use(
  (response) => response,
  handleError
);

/* ================= AUTH STORAGE HELPERS ================= */

export const saveAuthData = ({
  role,
  accessToken,
  refreshToken,
}) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("role", role);

  localStorage.setItem(
    `${role}_accessToken`,
    accessToken
  );

  localStorage.setItem(
    `${role}_refreshToken`,
    refreshToken
  );
};

export const clearAuthData = () => {
  if (typeof window === "undefined") return;

  const role = getRole();

  if (role) {
    localStorage.removeItem(`${role}_accessToken`);
    localStorage.removeItem(`${role}_refreshToken`);
  }

  localStorage.removeItem("role");
};