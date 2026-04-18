// import {authapi} from "../lib/axios";

// /* AUTH */
// export const loginUser = (data) =>
//   authapi.post("/api/auth/login", data);

// export const registerUserAPI = (data) =>
//   authapi.post("/api/auth/register", data);

// export const logoutUser = () =>
//   authapi.post("/api/auth/logout");

// export const getMe = () =>
//   authapi.get("/api/auth/me");

import { authapi } from "../lib/axios";

/* AUTH */

// LOGIN
export const loginUser = async (data) => {
  const res = await authapi.post("/api/auth/login", data);
  return res.data;
};

// REGISTER
export const registerUserAPI = async (data) => {
  const res = await authapi.post("/api/auth/register", data);
  return res.data;
};

// LOGOUT
export const logoutUser = async () => {
  const res = await authapi.post("/api/auth/logout");
  return res.data;
};

// GET CURRENT USER
export const getMe = async () => {
  const res = await authapi.get("/api/auth/me");
  return res.data;
};