import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  requestVendorPayoutAPI,
  getMyVendorPayoutsAPI,
  getVendorPayoutSummaryAPI,
} from "@/services/vendorPayoutService";

const normalizeError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

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

const initialState = {
  loading: false,
  error: null,
  success: false,
  payouts: [],
  summary: null,
};

const vendorPayoutSlice = createSlice({
  name: "vendorPayout",
  initialState,

  reducers: {
    clearVendorPayoutState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(requestVendorPayout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(requestVendorPayout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.payouts.unshift(action.payload.payout);
      })
      .addCase(requestVendorPayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMyVendorPayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyVendorPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload.payouts || [];
      })
      .addCase(getMyVendorPayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getVendorPayoutSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendorPayoutSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
      })
      .addCase(getVendorPayoutSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVendorPayoutState } = vendorPayoutSlice.actions;
export default vendorPayoutSlice.reducer;