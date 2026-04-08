import api from "../lib/axios";

export const loginAdminAPI = (data) =>
  api.post("/api/admin/login", data);

export const logoutAdminAPI = () =>
  api.post("/api/admin/logout");

export const getAdminMe = () =>
  api.get("/api/admin/me", {
    headers: {
      "Cache-Control": "no-cache",
    },
  });