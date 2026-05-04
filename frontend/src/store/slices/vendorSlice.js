// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { sendVendorOtpAPI, verifyVendorOtpAPI, registerVendorAPI, } from "../../services/vendorServer";

// // 1. Send OTP
// export const sendVendorOtp = createAsyncThunk(
//   "vendor/sendOtp",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await sendVendorOtpAPI(data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 2. Verify OTP
// export const verifyVendorOtp = createAsyncThunk(
//   "vendor/verifyOtp",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await verifyVendorOtpAPI(data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 3. Register Vendor
// export const registerVendor = createAsyncThunk(
//   "vendor/register",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await registerVendorAPI(data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// /* ================= SLICE ================= */

// const initialState = {
//   loading: {
//     sendOtp: false,
//     verifyOtp: false,
//     register: false,
//   },
//   otp: {
//     mobileSent: false,
//     emailSent: false,
//     mobileVerified: false,
//     emailVerified: false,
//   },
//   vendor: null,
//   error: null,
// };

// const vendorSlice = createSlice({
//   name: "vendor",
//   initialState,
//   reducers: {
//     resetVendorState: (state) => {
//       state.loading = false;
//       state.otpSent = false;
//       state.otpVerified = false;
//       state.vendor = null;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder

// /* ===== SEND OTP ===== */
// .addCase(sendVendorOtp.pending, (state) => {
//   state.loading.sendOtp = true;
//   state.error = null;
// })
// .addCase(sendVendorOtp.fulfilled, (state, action) => {
//   state.loading.sendOtp = false;

//   if (action.meta.arg.phone) {
//     state.otp.mobileSent = true;
//   }

//   if (action.meta.arg.email) {
//     state.otp.emailSent = true;
//   }
// })
// .addCase(sendVendorOtp.rejected, (state, action) => {
//   state.loading.sendOtp = false;
//   state.error = action.payload;
// })

// /* ===== VERIFY OTP ===== */
// .addCase(verifyVendorOtp.pending, (state) => {
//   state.loading.verifyOtp = true;
//   state.error = null;
// })
// .addCase(verifyVendorOtp.fulfilled, (state, action) => {
//   state.loading.verifyOtp = false;

//   if (action.meta.arg.phone) {
//     state.otp.mobileVerified = true;
//   }

//   if (action.meta.arg.email) {
//     state.otp.emailVerified = true;
//   }
// })
// .addCase(verifyVendorOtp.rejected, (state, action) => {
//   state.loading.verifyOtp = false;
//   state.error = action.payload;
// })

// /* ===== REGISTER ===== */
// .addCase(registerVendor.pending, (state) => {
//   state.loading.register = true;
//   state.error = null;
// })
// .addCase(registerVendor.fulfilled, (state, action) => {
//   state.loading.register = false;
//   state.vendor = action.payload;
// })
// .addCase(registerVendor.rejected, (state, action) => {
//   state.loading.register = false;
//   state.error = action.payload;
// });
//   },
// });

// export const { resetVendorState } = vendorSlice.actions;
// export default vendorSlice.reducer;

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
  updateOnboardingStepAPI,
  refreshTokenAPI,
  logoutVendorAPI,
} from "../../services/vendorServer";

/* ================= TOKEN HELPERS ================= */

const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

/* ================= THUNKS ================= */

export const sendVendorOtp = createAsyncThunk(
  "vendor/sendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await sendVendorOtpAPI(data);
      return res.data;
    } catch (err) {
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

/* ================= LOGIN ================= */

export const loginVendor = createAsyncThunk(
  "vendor/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginVendorAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= REFRESH ================= */

export const refreshVendorToken = createAsyncThunk(
  "vendor/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await refreshTokenAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= PROFILE ================= */

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

/* ================= BUSINESS ================= */

export const saveBusinessDetails = createAsyncThunk(
  "vendor/businessSave",
  async (data, { rejectWithValue }) => {
    try {
      const res = await upsertBusinessAPI(data);
      return res.data;
    } catch (err) {
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

/* ================= BANK ================= */

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

/* ================= ONBOARDING ================= */

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

/* ================= STATE ================= */

const initialState = {
  loading: false,
  error: null,

  accessToken: getAccessToken() || null,
  refreshToken: getRefreshToken() || null,
  isAuthenticated: !!getAccessToken(),

  vendor: null,

  onboarding: {
    current_step: 1,
    status: "draft",
  },

  business: null,
  bank: null,

  otp: {
    email: { sent: false, verified: false },
    phone: { sent: false, verified: false },
  },
};

/* ================= SLICE ================= */

const vendorSlice = createSlice({
  name: "vendor",
  initialState,

  reducers: {
    resetVendorState: () => initialState,

    logoutLocal: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.vendor = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= LOGIN ================= */
      .addCase(loginVendor.fulfilled, (state, action) => {
        const payload = action.payload;

        if (!payload) {
          state.error = "Empty login response";
          state.isAuthenticated = false;
          return;
        }

        const accessToken = payload?.accessToken;
        const refreshToken = payload?.refreshToken;

        if (!accessToken) {
          state.error = "Missing accessToken from backend";
          state.isAuthenticated = false;
          return;
        }

        state.isAuthenticated = true;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken || null;

        state.vendor = payload?.vendor ?? null;

        /* ================= SAFE ONBOARDING ================= */
        state.onboarding.current_step =
          payload?.onboarding_step ??
          state.onboarding?.current_step ??
          1;

        state.onboarding.status =
          payload?.status ??
          state.onboarding?.status ??
          "draft";

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);

          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }
        }
      })

      /* ================= REFRESH ================= */
      .addCase(refreshVendorToken.fulfilled, (state, action) => {
        state.accessToken = action.payload?.accessToken || null;

        if (typeof window !== "undefined" && action.payload?.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      })

      /* ================= OTP ================= */
      .addCase(sendVendorOtp.fulfilled, (state, action) => {
        if (action.meta.arg.email) state.otp.email.sent = true;
        if (action.meta.arg.phone) state.otp.phone.sent = true;
      })

      .addCase(verifyVendorOtp.fulfilled, (state) => {
        state.otp.email.verified = true;
        state.otp.phone.verified = true;
      })

      /* ================= REGISTER ================= */
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.vendor = action.payload ?? null;
      })

      /* ================= PROFILE ================= */
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.vendor = action.payload ?? null;
      })

      /* ================= BUSINESS ================= */
      .addCase(fetchBusinessDetails.fulfilled, (state, action) => {
        state.business = action.payload ?? null;
      })
      .addCase(saveBusinessDetails.fulfilled, (state, action) => {
        state.business = action.payload?.data ?? null;
      })

      /* ================= BANK ================= */
      .addCase(fetchBankDetails.fulfilled, (state, action) => {
        state.bank = action.payload ?? null;
      })
      .addCase(saveBankDetails.fulfilled, (state, action) => {
        state.bank = action.payload?.data ?? null;
      })

      /* ================= ONBOARDING ================= */
      .addCase(fetchOnboardingState.fulfilled, (state, action) => {
        state.onboarding = action.payload ?? state.onboarding;
      })
      .addCase(updateOnboardingStep.fulfilled, (state, action) => {
        state.onboarding.current_step =
          action.payload?.data?.current_step ??
          state.onboarding.current_step;
      })

      /* ================= GLOBAL LOADERS ================= */
      .addMatcher(
        (a) => a.type.startsWith("vendor/") && a.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (a) => a.type.startsWith("vendor/") && a.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload?.message ||
            action.payload ||
            "Error";
        }
      )
      .addMatcher(
        (a) => a.type.startsWith("vendor/") && a.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { resetVendorState, logoutLocal } = vendorSlice.actions;
export default vendorSlice.reducer;