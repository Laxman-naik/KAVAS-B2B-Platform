// // import {authapi} from "../lib/axios";

// // /* AUTH */
// // export const loginUser = (data) =>
// //   authapi.post("/api/auth/login", data);

// // export const registerUserAPI = (data) =>
// //   authapi.post("/api/auth/register", data);

// // export const logoutUser = () =>
// //   authapi.post("/api/auth/logout");

// // export const getMe = () =>
// //   authapi.get("/api/auth/me");

// import { authapi } from "../lib/axios";

// /* AUTH */

// // export const loginUser = async (data) => {
// //   const res = await authapi.post("/api/auth/login", data);
// //   return res.data; // ✅ correct
// // };

// export const registerUserAPI = async (data) => {
//   const res = await authapi.post("/api/auth/register", data);
//   return res.data;
// };

// export const logoutUser = async () => {
//   const res = await authapi.post("/api/auth/logout");
//   return res.data;
// };

// // export const getMe = async () => {
// //   const res = await authapi.get("/api/auth/me");
// //   return res.data;
// // };

// export const loginUser = async (data) => {
//   const res = await authapi.post("/api/auth/login", data);

//   const { accessToken, refreshToken } = res.data;

//   localStorage.setItem("accessToken", accessToken);
//   localStorage.setItem("refreshToken", refreshToken);

//   return res.data;
// };

// export const getMe = async () => {
//   const token = localStorage.getItem("accessToken");

//   const res = await authapi.get("/api/auth/me", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return res.data;
// };

import { authapi } from "../lib/axios";

export const registerUserAPI = async (data) => {
  const res = await authapi.post("/api/auth/register", data);
  return res.data;
};

/* LOGIN */
export const loginUser = async (data) => {
  const res = await authapi.post("/api/auth/login", data);

  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("refreshToken", res.data.refreshToken);

  return res.data;
};

/* GET ME */
export const getMe = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await authapi.get("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* REFRESH */
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await authapi.post("/api/auth/refresh", {
    refreshToken,
  });

  localStorage.setItem("accessToken", res.data.accessToken);

  return res.data.accessToken;
};

/* LOGOUT */
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};