import { authapi } from "../lib/axios";

export const registerUserAPI = async (data) => {
  const res = await authapi.post("/api/auth/register", data, {
    skipAuth: true,
  });
  return res.data;
};

/* LOGIN */
export const loginUser = async (data) => {
  const res = await authapi.post("/api/auth/login", data, {
    skipAuth: true,
  });

  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("refreshToken", res.data.refreshToken);

  return res.data;
};

/* GET ME */
export const getMe = async () => {
  const res = await authapi.get("/api/auth/me");
  return res.data;
};

/* REFRESH */
export const refreshTokenAPI = async () => {
  const token = localStorage.getItem("refreshToken");

  const res = await authapi.post(
    "/api/auth/refresh",
    { refreshToken: token },
    { skipAuth: true }
  );

  localStorage.setItem("accessToken", res.data.accessToken);
  return res.data.accessToken;
};

/* LOGOUT */
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};