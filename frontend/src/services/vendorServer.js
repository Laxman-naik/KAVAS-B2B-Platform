import { authapi } from "../lib/axios";

export const sendVendorOtpAPI = (data) =>
  authapi.post("/api/vendor/send-otp", data, { skipAuth: true });

export const verifyVendorOtpAPI = (data) =>
  authapi.post("/api/vendor/verify-otp", data, { skipAuth: true });

export const registerVendorAPI = (data) =>
  authapi.post("/api/vendor/register", data);