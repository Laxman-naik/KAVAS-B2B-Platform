import { authapi } from "../lib/axios";

const getLocalStorage = (key) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

export const loginAdminAPI = async (data) => {
  try {
    const res = await authapi.post("/api/admin/login", data, {
      skipAuth: true,
    });

    return res.data; // { user, accessToken, refreshToken }
  } catch (err) {
    throw err.response?.data || { message: "Admin login failed" };
  }
};

export const refreshAdminAPI = async () => {
  try {
    const refreshToken = getLocalStorage("refreshToken");

    const res = await authapi.post("/api/admin/refresh", {
      refreshToken,
    });

    return res.data; // { accessToken }
  } catch (err) {
    throw err.response?.data || { message: "Token refresh failed" };
  }
};

export const logoutAdminAPI = async () => {
  try {
    const refreshToken = getLocalStorage("refreshToken");

    const res = await authapi.post("/api/admin/logout", {
      refreshToken,
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Admin logout failed" };
  }
};

export const getAdminMeAPI = async () => {
  try {
    const res = await authapi.get("/api/admin/me");
    return res.data; // { user }
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch admin" };
  }
};

export const getAllUsersAPI = async (params = {}) => {
  try {
    const res = await authapi.get("/api/admin/users", { params });
    return res.data; // { users }
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch users" };
  }
};

export const getOnboardingVendorsAPI = async (params = {}) => {
  try {
    const res = await authapi.get("/api/admin/onboarding-vendors", {
      params,
    });

    return res.data;
  } catch (err) {
    throw (
      err.response?.data || {
        message: "Failed to fetch onboarding vendors",
      }
    );
  }
};

export const approveVendorAPI = async (onboarding_id) => {
  try {
    const res = await authapi.put("/api/admin/approve-vendor", {
      onboarding_id,
    });

    return res.data;
  } catch (err) {
    throw (
      err.response?.data || {
        message: "Failed to approve vendor",
      }
    );
  }
};

export const rejectVendorAPI = async (onboarding_id, reason) => {
  try {
    const res = await authapi.put("/api/admin/reject-vendor", {
      onboarding_id,
      reason,
    });

    return res.data;
  } catch (err) {
    throw (
      err.response?.data || {
        message: "Failed to reject vendor",
      }
    );
  }
};