import {authapi} from "../lib/axios";

/* AUTH */
export const loginUser = (data) =>
  authapi.post("/api/auth/login", data);

export const registerUserAPI = (data) =>
  authapi.post("/api/auth/register", data);

export const logoutUser = () =>
  authapi.post("/api/auth/logout");

export const getMe = () =>
  authapi.get("/api/auth/me");