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
} from "../../services/vendorServer";

/* ================= SAFE TOKEN ================= */

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
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

/* ===== LOGIN ===== */
export const loginVendor = createAsyncThunk(
  "vendor/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginVendorAPI(data);

      // 🔴 FORCE FAIL if error exists
      if (res?.error) {
        return rejectWithValue(res);
      }

      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===== PROFILE ===== */
export const fetchVendorProfile = createAsyncThunk(
  "vendor/fetchProfile",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getVendorProfileAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===== BUSINESS ===== */
export const saveBusinessDetails = createAsyncThunk(
  "vendor/saveBusiness",
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
  "vendor/getBusiness",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getBusinessAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===== BANK ===== */
export const saveBankDetails = createAsyncThunk(
  "vendor/saveBank",
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
  "vendor/getBank",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getBankAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===== ONBOARDING ===== */
export const fetchOnboardingState = createAsyncThunk(
  "vendor/getState",
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
  "vendor/updateStep",
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

  isAuthenticated: false,
  token: getToken(), // ✅ SAFE
  next_action: null,

  otp: {
    mobileSent: false,
    emailSent: false,
  },

  verification: {
    phone_verified: false,
    email_verified: false,
  },

  vendor: {
    id: null,
    data: null,
  },

  onboarding: {
    current_step: 1,
    status: "draft",
  },

  business: null,
  bank: null,
};

/* ================= SLICE ================= */

const vendorSlice = createSlice({
  name: "vendor",
  initialState,

  reducers: {
    resetVendorState: () => initialState,

    logoutVendor: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.vendor = { id: null, data: null };
      state.next_action = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("next_action");
        localStorage.removeItem("onboarding_step");
      }
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== LOGIN ===== */
      .addCase(loginVendor.fulfilled, (state, action) => {
        if (action.payload?.error) {
          state.isAuthenticated = false;
          state.error = action.payload.message;
          state.next_action = action.payload.status;
          return;
        }

        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.next_action = action.payload.next_action;

        state.vendor = {
          id: action.payload.vendor?.id,
          data: action.payload.vendor,
        };

        state.onboarding.current_step =
          action.payload.onboarding_step || 1;

        state.onboarding.status =
          action.payload.status || "draft";
      })

      /* ===== OTP ===== */
      .addCase(sendVendorOtp.fulfilled, (state, action) => {
        if (action.meta.arg.phone) state.otp.mobileSent = true;
        if (action.meta.arg.email) state.otp.emailSent = true;
      })

      .addCase(verifyVendorOtp.fulfilled, (state) => {
        state.verification = {
          phone_verified: true,
          email_verified: true,
        };
      })

      /* ===== REGISTER ===== */
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.vendor = {
          id: action.payload?.vendor_id || action.payload?.id,
          data: action.payload,
        };
      })

      /* ===== PROFILE ===== */
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.vendor.id = action.payload?.id;
        state.vendor.data = action.payload;

        state.verification = {
          phone_verified: action.payload?.phone_verified,
          email_verified: action.payload?.email_verified,
        };
      })

      /* ===== BUSINESS ===== */
      .addCase(fetchBusinessDetails.fulfilled, (state, action) => {
        state.business = action.payload;
      })
      .addCase(saveBusinessDetails.fulfilled, (state, action) => {
        state.business = action.payload?.data;
      })

      /* ===== BANK ===== */
      .addCase(fetchBankDetails.fulfilled, (state, action) => {
        state.bank = action.payload;
      })
      .addCase(saveBankDetails.fulfilled, (state, action) => {
        state.bank = action.payload?.data;
      })

      /* ===== ONBOARDING ===== */
      .addCase(fetchOnboardingState.fulfilled, (state, action) => {
        state.onboarding = action.payload;
      })

      .addCase(updateOnboardingStep.fulfilled, (state, action) => {
        state.onboarding.current_step =
          action.payload?.data?.current_step ||
          state.onboarding.current_step;
      })

      /* ===== MATCHERS (LAST ONLY) ===== */
      .addMatcher(
        (action) =>
          action.type.startsWith("vendor/") &&
          action.type.endsWith("/pending"),
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
          state.error =
            action.payload?.message ||
            action.payload ||
            "Something went wrong";
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

export const { resetVendorState, logoutVendor } = vendorSlice.actions;
export default vendorSlice.reducer;