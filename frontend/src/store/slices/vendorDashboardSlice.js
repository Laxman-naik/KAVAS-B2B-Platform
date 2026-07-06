import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getVendorDashboardAPI } from "@/services/vendorDashboardService";

export const fetchVendorDashboard = createAsyncThunk(
  "vendorDashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getVendorDashboardAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const vendorDashboardSlice = createSlice({
  name: "vendorDashboard",
  initialState: {
    orders: [],
    products: [],
    stats: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVendorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.products = action.payload.products || [];
        state.stats = action.payload.stats || {};
      })
      .addCase(fetchVendorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load dashboard";
      });
  },
});

export default vendorDashboardSlice.reducer;