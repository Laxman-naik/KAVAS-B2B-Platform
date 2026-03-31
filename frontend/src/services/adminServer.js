import api from "@/lib/axios";

export const registerAdminAPI = (data) => api.post("/admin/auth/register", data);

export const loginAdminAPI = (data) => api.post("/admin/auth/login", data);

export const refreshAdminToken = () => api.post("/admin/auth/refresh");

export const logoutAdminAPI = () => api.post("/admin/auth/logout");

export const getAdminProfile = () => api.get("/admin/auth/me");