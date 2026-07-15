import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  requestVendorPayoutAPI,
  getMyVendorPayoutsAPI,
  getVendorPayoutSummaryAPI,
} from "@/services/vendorPayoutService";

/* ================= ERROR HELPER ================= */
const normalizeError = (err) =>
  err?.response?.data?.message ||
  err?.message ||
  "Something went wrong";

/* ================= REQUEST PAYOUT ================= */
export const requestVendorPayout = createAsyncThunk(
  "vendorPayout/request",
  async (data, thunkAPI) => {
    try {
      const res = await requestVendorPayoutAPI(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

/* ================= GET MY PAYOUTS ================= */
export const getMyVendorPayouts = createAsyncThunk(
  "vendorPayout/myPayouts",
  async (_, thunkAPI) => {
    try {
      const res = await getMyVendorPayoutsAPI();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

/* ================= GET SUMMARY ================= */
export const getVendorPayoutSummary = createAsyncThunk(
  "vendorPayout/summary",
  async (_, thunkAPI) => {
    try {
      const res = await getVendorPayoutSummaryAPI();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

/* ================= INITIAL STATE ================= */
const initialState = {
  loading: false,
  error: null,
  success: false,

  payouts: [],

  summary: {
    pending_amount: 0,
    approved_amount: 0,
    paid_amount: 0,
    rejected_amount: 0,
    total_requested: 0,
  },
};

/* ================= SLICE ================= */
const vendorPayoutSlice = createSlice({
  name: "vendorPayout",

  initialState,

  reducers: {
    clearVendorPayoutState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    resetVendorPayouts: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.payouts = [];
      state.summary = {
        pending_amount: 0,
        approved_amount: 0,
        paid_amount: 0,
        rejected_amount: 0,
        total_requested: 0,
      };
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= REQUEST PAYOUT ================= */
      .addCase(requestVendorPayout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(requestVendorPayout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload?.payout) {
          state.payouts.unshift(action.payload.payout);
        }
      })

      .addCase(requestVendorPayout.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      /* ================= GET MY PAYOUTS ================= */
      .addCase(getMyVendorPayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMyVendorPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload?.payouts || [];
      })

      .addCase(getMyVendorPayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET SUMMARY ================= */
      .addCase(getVendorPayoutSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getVendorPayoutSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload?.summary || {
          pending_amount: 0,
          approved_amount: 0,
          paid_amount: 0,
          rejected_amount: 0,
          total_requested: 0,
        };
      })

      .addCase(getVendorPayoutSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVendorPayoutState, resetVendorPayouts } =
  vendorPayoutSlice.actions;

export default vendorPayoutSlice.reducer;