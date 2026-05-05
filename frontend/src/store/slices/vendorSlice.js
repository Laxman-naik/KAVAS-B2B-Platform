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
  getVendorProfileSelfAPI,
} from "../../services/vendorServer";

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

export const loginVendor = createAsyncThunk(
  "vendor/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginVendorAPI(data);
      return res; // service already returns clean payload
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

  accessToken:
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null,

  refreshToken:
    typeof window !== "undefined"
      ? localStorage.getItem("refreshToken")
      : null,

  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem("accessToken")
      : false,

  vendor: {
    id: null,
    email: null,
    phone: null,
    email_verified: false,
    phone_verified: false,
    id_verified: false,
    signature_verified: false,
    is_active: false,
  },

  onboarding: null,
  business: null,
  bank: null,

  otp: {
    email: false,
    phone: false,
  },
};

/* ================= SLICE ================= */

const vendorSlice = createSlice({
  name: "vendor",
  initialState,

  reducers: {
    resetVendorState: () => initialState,

    logoutLocal: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.vendor = null;
      state.onboarding = null;
      state.business = null;
      state.bank = null;

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

  if (!payload?.accessToken) {
    state.error = payload?.message || "Login failed";
    state.isAuthenticated = false;
    return;
  }

  state.isAuthenticated = true;
  state.accessToken = payload.accessToken;
  state.refreshToken = payload.refreshToken || null;

  // 🔥 persist BOTH tokens
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", payload.accessToken);
    if (payload.refreshToken) {
      localStorage.setItem("refreshToken", payload.refreshToken);
    }
  }

  state.vendor = payload.vendor || null;

  state.onboarding = {
    current_step: payload.onboarding_step || 1,
    status: payload.status || "draft",
  };
})

      /* ================= REFRESH ================= */
      .addCase(refreshVendorToken.fulfilled, (state, action) => {
        const token = action.payload?.accessToken;

        if (token) {
          state.accessToken = token;
          state.isAuthenticated = true;
        }
      })

      /* ================= OTP ================= */
      .addCase(sendVendorOtp.fulfilled, (state, action) => {
        if (action.meta.arg?.email) state.otp.email = false;
        if (action.meta.arg?.phone) state.otp.phone = false;
      })

      .addCase(verifyVendorOtp.fulfilled, (state, action) => {
        if (action.meta.arg?.email) state.otp.email = true;
        if (action.meta.arg?.phone) state.otp.phone = true;
      })

      /* ================= REGISTER ================= */
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.vendor = action.payload || null;
      })

      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        // The API returns vendor data with verification fields directly on the object
        state.vendor = {
          ...state.vendor,
          ...action.payload,
        };
      })

      /* ================= SELF PROFILE ================= */
      .addCase(fetchVendorme.fulfilled, (state, action) => {
        state.vendor = action.payload?.vendor || null;
        state.onboarding = action.payload?.onboarding || null;
        state.business = action.payload?.business || null;
        state.bank = action.payload?.bank || null;
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

      /* ================= ONBOARDING ================= */
      .addCase(fetchOnboardingState.fulfilled, (state, action) => {
        state.onboarding = action.payload || null;
      })

      .addCase(updateOnboardingStep.fulfilled, (state, action) => {
        const step = action.payload?.data?.current_step;
        if (step !== undefined) {
          state.onboarding.current_step = step;
        }
      })

      /* ================= GLOBAL HANDLERS ================= */
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