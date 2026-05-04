// import { authapi } from "../lib/axios";

// export const sendVendorOtpAPI = (data) => authapi.post("/api/vendor/send-otp", data, { skipAuth: true });

// export const verifyVendorOtpAPI = (data) => authapi.post("/api/vendor/verify-otp", data, { skipAuth: true });

// export const registerVendorAPI = (data) => authapi.post("/api/vendor/register", data);

// export const loginVendorAPI = async (data) => {
//   const res = await authapi.post("/api/vendor/login", data, {skipAuth: true,});
//   if (res.data?.token) {
//     localStorage.setItem("accessToken", res.data.token);
//   }
//   return res.data;
// };

// export const getVendorProfileAPI = (id) => authapi.get(`/api/vendor/${id}`);

// export const upsertBusinessAPI = (data) => authapi.post("/api/vendor/business", data);

// export const getBusinessAPI = () => authapi.get("/api/vendor/getbusiness");

// export const upsertBankAPI = (data) => authapi.post("/api/vendor/bank", data);

// export const getBankAPI = () => authapi.get("/api/vendor/getbank");

// export const getOnboardingStateAPI = () => authapi.get("/api/vendor/state");

// export const updateOnboardingStepAPI = (step) => authapi.patch("/api/vendor/step", { step });

import { authapi } from "../lib/axios";


export const sendVendorOtpAPI = (data) =>
  authapi.post("/api/vendor/send-otp", data, { skipAuth: true });

export const verifyVendorOtpAPI = (data) =>
  authapi.post("/api/vendor/verify-otp", data, { skipAuth: true });

export const registerVendorAPI = (data) =>
  authapi.post("/api/vendor/register", data, { skipAuth: true });

export const loginVendorAPI = async (data) => {
  try {
    const res = await authapi.post("/api/vendor/login", data, {
      skipAuth: true,
      withCredentials: true, 
    });

    const response = res.data;

    if (typeof window !== "undefined" && response?.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("next_action", response.next_action || "dashboard");
      localStorage.setItem("onboarding_step", response.onboarding_step || 1);
    }

    return response;
  } catch (err) {
    const errorData = err.response?.data;

    if (err.response?.status === 403) {
      return {
        error: true,
        status: errorData?.status,
        message: errorData?.message,
      };
    }

    throw err;
  }
};


export const refreshTokenAPI = () =>
  authapi.post("/api/vendor/refresh", {}, { withCredentials: true });

export const logoutVendorAPI = (refreshToken) =>
  authapi.post("/api/vendor/logout", { refreshToken });


export const getVendorProfileAPI = (id) =>
  authapi.get(`/api/vendor/${id}`, { skipAuth: true });


export const upsertBusinessAPI = (data) =>
  authapi.post("/api/vendor/business", data);

export const getBusinessAPI = () =>
  authapi.get("/api/vendor/getbusiness");

export const upsertBankAPI = (data) =>
  authapi.post("/api/vendor/bank", data);

export const getBankAPI = () =>
  authapi.get("/api/vendor/getbank");

export const getOnboardingStateAPI = () =>
  authapi.get("/api/vendor/state");

export const updateOnboardingStepAPI = (step) =>
  authapi.patch("/api/vendor/step", { step });

export const getVendorProfileSelfAPI = () =>
  authapi.get("/api/vendor/me"); 