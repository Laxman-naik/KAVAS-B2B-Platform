import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  sendVendorOtpAPI,
  verifyVendorOtpAPI,
  registerVendorAPI,
  loginVendorAPI,
  getVendorProfileAPI,
  upsertBusinessAPI,
  getBusinessAPI,
  upsertBankAPI,
  getBankAPI,
  getOnboardingStateAPI,
  upsertStoreDetailsAPI,
  getStoreDetailsAPI,
  updateOnboardingStepAPI,
  refreshTokenAPI,
  logoutVendorAPI,
  getVendorProfileSelfAPI,
} from "../../services/vendorService";

/* ================= THUNKS ================= */

export const sendVendorOtp = createAsyncThunk(
  "vendor/sendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await sendVendorOtpAPI(data);
      return res.data;
    } catch (err) {
      console.log("SEND OTP THUNK ERROR:", err);
      console.log("ERROR RESPONSE:", err.response);
      console.log("ERROR DATA:", err.response?.data);

      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const verifyVendorOtp = createAsyncThunk(
  "vendor/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await verifyVendorOtpAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const registerVendor = createAsyncThunk(
  "vendor/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerVendorAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loginVendor = createAsyncThunk(
  "vendor/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginVendorAPI(data);
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Login failed"
      );
    }
  }
);

export const refreshVendorToken = createAsyncThunk(
  "vendor/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await refreshTokenAPI();
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const logoutVendor = createAsyncThunk(
  "vendor/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("vendor_refreshToken")
          : null;

      const res = await logoutVendorAPI(refreshToken);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchVendorProfile = createAsyncThunk(
  "vendor/profile",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getVendorProfileAPI(id);
      return res.data;

    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchVendorme = createAsyncThunk(
  "vendor/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getVendorProfileSelfAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const saveBusinessDetails = createAsyncThunk(
  "vendor/businessSave",
  async (data, { rejectWithValue }) => {
    try {
      const res = await upsertBusinessAPI(data);
      return res.data;
    } catch (err) {
      console.log(err)
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchBusinessDetails = createAsyncThunk(
  "vendor/businessGet",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getBusinessAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const saveBankDetails = createAsyncThunk(
  "vendor/bankSave",
  async (data, { rejectWithValue }) => {
    try {
      const res = await upsertBankAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchBankDetails = createAsyncThunk(
  "vendor/bankGet",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getBankAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchOnboardingState = createAsyncThunk(
  "vendor/onboardingGet",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getOnboardingStateAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateOnboardingStep = createAsyncThunk(
  "vendor/onboardingStep",
  async (step, { rejectWithValue }) => {
    try {
      const res = await updateOnboardingStepAPI(step);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchStoreDetails = createAsyncThunk(
  "vendor/storeGet",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getStoreDetailsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const saveStoreDetails = createAsyncThunk(
  "vendor/storeSave",
  async (data, { rejectWithValue }) => {
    try {
      const res = await upsertStoreDetailsAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= STATE ================= */

const initialState = {
  loading: false,
  error: null,

  accessToken:
    typeof window !== "undefined"
      ? localStorage.getItem("vendor_accessToken")
      : null,

  refreshToken:
    typeof window !== "undefined"
      ? localStorage.getItem("vendor_refreshToken")
      : null,

  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem("vendor_accessToken")
      : false,

  vendor: null,
  onboarding: null,
  business: null,
  bank: null,
  store: null,
  pickup: null,

  otp: {
    mobileSent: false,
    mobileVerified: false,
  },
};

/* ================= SLICE ================= */

const vendorSlice = createSlice({
  name: "vendor",
  initialState,

  reducers: {
    resetVendorState: () => initialState,

    resetMobileVerification: (state) => {
      state.otp.mobileSent = false;
      state.otp.mobileVerified = false;
    },

    logoutLocal: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.vendor = null;
      state.onboarding = null;
      state.business = null;
      state.bank = null;
      state.store = null;
      state.pickup = null;

      state.otp = {
        mobileSent: false,
        mobileVerified: false,
      };

      if (typeof window !== "undefined") {
        localStorage.removeItem("vendor_accessToken");
        localStorage.removeItem("vendor_refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("next_action");
        localStorage.removeItem("onboarding_step");
      }
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= LOGIN ================= */
      .addCase(loginVendor.fulfilled, (state, action) => {
        const payload = action.payload;

        if (!payload?.accessToken) {
          state.error = payload?.message || "Login failed";
          state.isAuthenticated = false;
          return;
        }

        state.isAuthenticated = true;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken || null;
        state.vendor = payload.vendor || null;

        state.onboarding = {
          current_step: payload.onboarding_step || 1,
          status: payload.status || "draft",
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("role", "vendor");
          localStorage.setItem("vendor_accessToken", payload.accessToken);

          if (payload.refreshToken) {
            localStorage.setItem("vendor_refreshToken", payload.refreshToken);
          }

          localStorage.setItem("next_action", payload.next_action || "dashboard");
          localStorage.setItem("onboarding_step", payload.onboarding_step || 1);
        }
      })

      /* ================= REFRESH ================= */
      .addCase(refreshVendorToken.fulfilled, (state, action) => {
        const token = action.payload?.accessToken;

        if (token) {
          state.accessToken = token;
          state.isAuthenticated = true;

          if (typeof window !== "undefined") {
            localStorage.setItem("vendor_accessToken", token);
          }
        }
      })

      /* ================= LOGOUT ================= */
      .addCase(logoutVendor.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.vendor = null;
        state.onboarding = null;
        state.business = null;
        state.bank = null;
        state.store = null;
        state.pickup = null;

        state.otp = {
          mobileSent: false,
          mobileVerified: false,
        };

        if (typeof window !== "undefined") {
          localStorage.removeItem("vendor_accessToken");
          localStorage.removeItem("vendor_refreshToken");
          localStorage.removeItem("role");
          localStorage.removeItem("next_action");
          localStorage.removeItem("onboarding_step");
        }
      })

      .addCase(sendVendorOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(sendVendorOtp.fulfilled, (state) => {
        state.loading = false;
        state.otp.mobileSent = true;
      })

      .addCase(sendVendorOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || action.payload || "Failed to send OTP";
      })

      .addCase(verifyVendorOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyVendorOtp.fulfilled, (state) => {
        state.loading = false;
        state.otp.mobileVerified = true;
      })

      .addCase(verifyVendorOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || action.payload || "OTP verification failed";
      })

      /* ================= REGISTER ================= */
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.vendor = action.payload || null;
      })

      /* ================= PROFILE BY ID ================= */
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.vendor = action.payload?.vendor || action.payload || null;
      })

      /* ================= SELF PROFILE ================= */
      .addCase(fetchVendorme.fulfilled, (state, action) => {
        state.vendor = action.payload?.vendor || null;
        state.onboarding = action.payload?.onboarding || null;
        state.business = action.payload?.business || null;
        state.bank = action.payload?.bank || null;
        state.store = action.payload?.store || null;
        state.pickup = action.payload?.pickup || null;
      })

      /* ================= BUSINESS ================= */
      .addCase(fetchBusinessDetails.fulfilled, (state, action) => {
        state.business = action.payload || null;
      })

      .addCase(saveBusinessDetails.fulfilled, (state, action) => {
        state.business = action.payload?.data || null;
      })

      /* ================= BANK ================= */
      .addCase(fetchBankDetails.fulfilled, (state, action) => {
        state.bank = action.payload || null;
      })

      .addCase(saveBankDetails.fulfilled, (state, action) => {
        state.bank = action.payload?.data || null;
      })

      /* ================= STORE ================= */
      .addCase(fetchStoreDetails.fulfilled, (state, action) => {
        state.store = action.payload?.store || null;
        state.pickup = action.payload?.pickup || null;
      })

      .addCase(saveStoreDetails.fulfilled, (state, action) => {
        state.store = action.payload?.data?.store || null;
        state.pickup = action.payload?.data?.pickup || null;
      })

      .addCase(fetchOnboardingState.fulfilled, (state, action) => {
        state.onboarding = action.payload || null;
      })

      .addCase(updateOnboardingStep.fulfilled, (state, action) => {
        const step =
          action.payload?.data?.current_step ||
          action.payload?.current_step ||
          action.meta.arg;

        if (step !== undefined) {
          if (!state.onboarding) state.onboarding = {};
          state.onboarding.current_step = step;
        }
      })

      .addMatcher(
        (action) =>
          action.type.startsWith("vendor/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("vendor/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || action.payload || "Error";
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("vendor/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const {
  resetVendorState,
  resetMobileVerification,
  logoutLocal,
} = vendorSlice.actions;

export default vendorSlice.reducer;