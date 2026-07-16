import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getVendorPaymentHistoryAPI } from "@/services/vendorPaymentHistoryService";

export const getVendorPaymentHistory = createAsyncThunk(
  "vendorPaymentHistory/getVendorPaymentHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await getVendorPaymentHistoryAPI();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment history"
      );
    }
  }
);

const vendorPaymentHistorySlice = createSlice({
  name: "vendorPaymentHistory",
  initialState: {
    loading: false,
    error: null,
    transactions: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVendorPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendorPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions || [];
      })
      .addCase(getVendorPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default vendorPaymentHistorySlice.reducer;