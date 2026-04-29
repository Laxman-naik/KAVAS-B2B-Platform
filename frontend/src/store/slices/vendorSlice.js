import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendVendorOtpAPI, verifyVendorOtpAPI, registerVendorAPI,} from "../../services/vendorServer";

// 1. Send OTP
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

// 2. Verify OTP
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

// 3. Register Vendor
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

/* ================= SLICE ================= */

const initialState = {
  loading: {
    sendOtp: false,
    verifyOtp: false,
    register: false,
  },
  otp: {
    mobileSent: false,
    emailSent: false,
    mobileVerified: false,
    emailVerified: false,
  },
  vendor: null,
  error: null,
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    resetVendorState: (state) => {
      state.loading = false;
      state.otpSent = false;
      state.otpVerified = false;
      state.vendor = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

/* ===== SEND OTP ===== */
.addCase(sendVendorOtp.pending, (state) => {
  state.loading.sendOtp = true;
  state.error = null;
})
.addCase(sendVendorOtp.fulfilled, (state, action) => {
  state.loading.sendOtp = false;

  if (action.meta.arg.phone) {
    state.otp.mobileSent = true;
  }

  if (action.meta.arg.email) {
    state.otp.emailSent = true;
  }
})
.addCase(sendVendorOtp.rejected, (state, action) => {
  state.loading.sendOtp = false;
  state.error = action.payload;
})

/* ===== VERIFY OTP ===== */
.addCase(verifyVendorOtp.pending, (state) => {
  state.loading.verifyOtp = true;
  state.error = null;
})
.addCase(verifyVendorOtp.fulfilled, (state, action) => {
  state.loading.verifyOtp = false;

  if (action.meta.arg.phone) {
    state.otp.mobileVerified = true;
  }

  if (action.meta.arg.email) {
    state.otp.emailVerified = true;
  }
})
.addCase(verifyVendorOtp.rejected, (state, action) => {
  state.loading.verifyOtp = false;
  state.error = action.payload;
})

/* ===== REGISTER ===== */
.addCase(registerVendor.pending, (state) => {
  state.loading.register = true;
  state.error = null;
})
.addCase(registerVendor.fulfilled, (state, action) => {
  state.loading.register = false;
  state.vendor = action.payload;
})
.addCase(registerVendor.rejected, (state, action) => {
  state.loading.register = false;
  state.error = action.payload;
});
  },
});

export const { resetVendorState } = vendorSlice.actions;
export default vendorSlice.reducer;