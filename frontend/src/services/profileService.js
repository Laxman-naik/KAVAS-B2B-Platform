import { authapi } from "../lib/axios";

export const getProfileAPI = async () => {
  const res = await authapi.get("/api/profile");
  return res.data;
};

export const updateProfileAPI = async (profileData) => {
  const res = await authapi.put("/api/profile", profileData);
  return res.data;
};