import api from "@/lib/axios";

export const loginUser = (data) => api.post("/auth/login", data);

export const refreshToken = () => api.post("/auth/refresh");

export const logoutUser = () => api.post("/auth/logout");