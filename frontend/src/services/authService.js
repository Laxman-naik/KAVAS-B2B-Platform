import api from "@/lib/axios";
import axios from "axios";

export const registerUserAPI = (data) => api.post("/api/auth/register", data);

// export const loginUser = (data) => api.post("/api/auth/login", data);
export const loginUser = (data) => axios.post("https://kavas-b2b-platform-3.onrender.com/api/auth/login", data)

export const refreshToken = () => api.post("/api/auth/refresh");

export const logoutUser = () => api.post("/api/auth/logout");

export const getMe = () => api.get("/api/auth/me");