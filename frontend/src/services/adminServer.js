// import {authapi} from "../lib/axios";

// export const loginAdminAPI = (data) =>
//   authapi.post("/api/admin/login", data);

// export const logoutAdminAPI = () =>
//   authapi.post("/api/admin/logout");

// export const getAdminMe = () =>
//   authapi.get("/api/admin/me", {
//     headers: {
//       "Cache-Control": "no-cache",
//     },
//   });

import { authapi } from "../lib/axios";

export const loginAdminAPI = (data) =>
  authapi.post("/api/admin/login", data);

export const logoutAdminAPI = () =>
  authapi.post("/api/admin/logout");

export const getAdminMe = () =>
  authapi.get("/api/admin/me");