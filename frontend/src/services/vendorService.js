import { authapi } from "../lib/axios";


export const sendVendorOtpAPI = (data) => authapi.post("/api/vendor/send-otp", data, { skipAuth: true });

export const verifyVendorOtpAPI = (data) => authapi.post("/api/vendor/verify-otp", data, { skipAuth: true });

export const registerVendorAPI = (data) => authapi.post("/api/vendor/register", data, { skipAuth: true });

export const loginVendorAPI = async (data) => {
  try {
    const res = await authapi.post(
      "/api/vendor/login",
      data,
      {
        skipAuth: true,
        withCredentials: true,
      }
    );

    const response = res.data;

    if (
      typeof window !== "undefined" &&
      response?.accessToken
    ) {
      // ✅ USE ROLE-BASED STORAGE
      localStorage.setItem("role", "vendor");

      localStorage.setItem(
        "vendor_accessToken",
        response.accessToken
      );

      if (response.refreshToken) {
        localStorage.setItem(
          "vendor_refreshToken",
          response.refreshToken
        );
      }

      localStorage.setItem(
        "next_action",
        response.next_action || "dashboard"
      );

      localStorage.setItem(
        "onboarding_step",
        response.onboarding_step || 1
      );
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


export const refreshTokenAPI = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await authapi.post("/api/vendor/refresh", {
    refreshToken,
  });

  localStorage.setItem("accessToken", res.data.accessToken);

  return res.data;
};

export const logoutVendorAPI = (refreshToken) => authapi.post("/api/vendor/logout", { refreshToken });

export const getVendorProfileAPI = (id) => authapi.get(`/api/vendor/${id}`, { skipAuth: true });

export const upsertBusinessAPI = (data) => authapi.post("/api/vendor/business", data);

export const getBusinessAPI = () => authapi.get("/api/vendor/getbusiness");

export const upsertBankAPI = (data) => authapi.post("/api/vendor/bank", data);

export const getBankAPI = () => authapi.get("/api/vendor/getbank");

export const upsertStoreDetailsAPI = (data) => authapi.post("/api/vendor/store-details", data);

export const getStoreDetailsAPI = () => authapi.get("/api/vendor/getstore",)

export const getOnboardingStateAPI = () => authapi.get("/api/vendor/state");

export const updateOnboardingStepAPI = (step) => authapi.patch("/api/vendor/step", { step });

export const getVendorProfileSelfAPI = () =>authapi.get("/api/vendor/me",);