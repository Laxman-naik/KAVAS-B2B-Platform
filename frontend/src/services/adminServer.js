// import { authapi } from "../lib/axios";

// const getLocalStorage = (key) => {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem(key);
// };

// export const loginAdminAPI = async (data) => {
//   try {
//     const res = await authapi.post("/api/admin/login", data, {
//       skipAuth: true,
//     });

//     return res.data; // { user, accessToken, refreshToken }
//   } catch (err) {
//     throw err.response?.data || { message: "Admin login failed" };
//   }
// };

// export const refreshAdminAPI = async () => {
//   try {
//     const refreshToken = getLocalStorage("refreshToken");

//     const res = await authapi.post("/api/admin/refresh", {
//       refreshToken,
//     });

//     return res.data; // { accessToken }
//   } catch (err) {
//     throw err.response?.data || { message: "Token refresh failed" };
//   }
// };

// export const logoutAdminAPI = async () => {
//   try {
//     const refreshToken = getLocalStorage("refreshToken");

//     const res = await authapi.post("/api/admin/logout", {
//       refreshToken,
//     });

//     return res.data;
//   } catch (err) {
//     throw err.response?.data || { message: "Admin logout failed" };
//   }
// };

// export const getAdminMeAPI = async () => {
//   try {
//     const res = await authapi.get("/api/admin/me");
//     return res.data; // { user }
//   } catch (err) {
//     throw err.response?.data || { message: "Failed to fetch admin" };
//   }
// };

// export const getAllUsersAPI = async (params = {}) => {
//   try {
//     const res = await authapi.get("/api/admin/users", { params });
//     return res.data; // { users }
//   } catch (err) {
//     throw err.response?.data || { message: "Failed to fetch users" };
//   }
// };

// export const getOnboardingVendorsAPI = async (params = {}) => {
//   try {
//     const res = await authapi.get("/api/admin/onboarding-vendors", {
//       params,
//     });

//     return res.data;
//   } catch (err) {
//     throw (
//       err.response?.data || {
//         message: "Failed to fetch onboarding vendors",
//       }
//     );
//   }
// };

// export const approveVendorAPI = async ({ onboarding_id, status, rejection_reason }) => {
//   try {
//     const res = await authapi.put("/api/admin/approve-vendor", {
//       onboarding_id,
//       status,
//       rejection_reason,
//     });

//     return res.data;
//   } catch (err) {
//     throw (
//       err.response?.data || {
//         message: "Failed to update vendor status",
//       }
//     );
//   }
// };

// export const rejectVendorAPI = async (onboarding_id, reason) => {
//   try {
//     const res = await authapi.put("/api/admin/reject-vendor", {
//       onboarding_id,
//       reason,
//     });

//     return res.data;
//   } catch (err) {
//     throw (
//       err.response?.data || {
//         message: "Failed to reject vendor",
//       }
//     );
//   }
// };


import { authapi } from "../lib/axios";

export const loginAdminAPI = async (data) => {
  const res = await authapi.post(
    "/api/admin/login",
    data,
    { skipAuth: true }
  );

  const { accessToken, refreshToken, sessionId } = res.data;

  /* ✅ unified storage (NO ROLE BASED KEYS) */
  localStorage.setItem("role", "admin");
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("sessionId", sessionId);

  return res.data;
};

export const getAdminMeAPI = async () => {
  const res = await authapi.get("/api/admin/me");
  return res.data;
};

export const refreshAdminAPI = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const sessionId = localStorage.getItem("sessionId");

  if (!refreshToken || !sessionId) {
    throw new Error("No active admin session");
  }

  const res = await authapi.post(
    "/api/admin/refresh",
    {
      refreshToken,
      sessionId,
    },
    { skipAuth: true }
  );

  const newAccessToken = res.data?.accessToken;

  if (!newAccessToken) {
    throw new Error("No access token returned");
  }

  localStorage.setItem("accessToken", newAccessToken);

  return newAccessToken;
};

export const logoutAdminAPI = async () => {
  const sessionId = localStorage.getItem("sessionId");

  const res = await authapi.post(
    "/api/admin/logout",
    { sessionId },
    { skipAuth: true }
  );

  localStorage.removeItem("role");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("sessionId");

  return res.data;
};

export const getAllUsersAPI = async () => {
  const res = await authapi.get("/api/admin/users");
  return res.data;
};

export const getOnboardingVendorsAPI = async () => {
  const res = await authapi.get("/api/admin/onboarding-vendors");
  return res.data;
};


export const approveVendorAPI = async (data) => {
  const res = await authapi.put(
    "/api/admin/approve-vendor",
    data
  );

  return res.data;
};


export const rejectVendorAPI = async (data) => {
  const res = await authapi.put(
    "/api/admin/reject-vendor",
    data
  );

  return res.data;
};