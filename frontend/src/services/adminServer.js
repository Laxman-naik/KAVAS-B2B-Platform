import api from "@/lib/axios";

export const registerAdminAPI = (data) => api.post("api/admin/register", data);

export const loginAdminAPI = (data) => api.post("api/admin/login", data);

export const refreshAdminToken = () => api.post("api/admin/refresh");

export const logoutAdminAPI = () => api.post("api/admin/logout");

export const getAdminProfile = () => api.get("api/admin/me");