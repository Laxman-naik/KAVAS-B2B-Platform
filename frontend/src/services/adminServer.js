import { authapi } from "../lib/axios";

export const loginAdminAPI = (data) => authapi.post("/api/admin/login", data);

export const logoutAdminAPI = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  return authapi.post("/api/admin/logout", { refreshToken });
};

export const getAdminMe = () => authapi.get("/api/admin/me");

export const getAllUsersAPI = () => authapi.get("/api/admin/users");