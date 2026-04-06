// import api from "@/lib/axios";

// export const registerAdminAPI = (data) => api.post("api/admin/register", data);

// export const loginAdminAPI = (data) => api.post("api/admin/login", data);

// export const refreshAdminToken = () => api.post("api/admin/refresh");

// export const logoutAdminAPI = () => api.post("api/admin/logout");

// export const getAdminProfile = () => api.get("api/admin/me");

import axios from "axios";

const BASE_URL = "https://kavas-b2b-platform-3.onrender.com";

export const registerAdminAPI = (data) =>
  axios.post(`${BASE_URL}/api/admin/register`, data);

export const loginAdminAPI = (data) =>
  axios.post(`${BASE_URL}/api/admin/login`, data);

export const refreshAdminToken = () =>
  axios.post(`${BASE_URL}/api/admin/refresh`);

export const logoutAdminAPI = () =>
  axios.post(`${BASE_URL}/api/admin/logout`);

export const getAdminProfile = () =>
  axios.get(`${BASE_URL}/api/admin/me`);