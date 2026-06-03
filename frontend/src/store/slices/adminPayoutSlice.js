import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminPayoutsAPI,
  approveAdminPayoutAPI,
  rejectAdminPayoutAPI,
  markAdminPayoutPaidAPI,
} from "@/services/adminPayoutService";

const normalizeError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export const getAdminPayouts = createAsyncThunk(
  "adminPayout/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await getAdminPayoutsAPI();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const approveAdminPayout = createAsyncThunk(
  "adminPayout/approve",
  async ({ id, admin_note }, thunkAPI) => {
    try {
      const res = await approveAdminPayoutAPI(id, { admin_note });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const rejectAdminPayout = createAsyncThunk(
  "adminPayout/reject",
  async ({ id, admin_note }, thunkAPI) => {
    try {
      const res = await rejectAdminPayoutAPI(id, { admin_note });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const markAdminPayoutPaid = createAsyncThunk(
  "adminPayout/paid",
  async ({ id, reference_number, admin_note }, thunkAPI) => {
    try {
      const res = await markAdminPayoutPaidAPI(id, {
        reference_number,
        admin_note,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

const adminPayoutSlice = createSlice({
  name: "adminPayout",
  initialState: {
    loading: false,
    error: null,
    payouts: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminPayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload.payouts || [];
      })
      .addCase(getAdminPayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addMatcher(
        (action) =>
          action.type === approveAdminPayout.fulfilled.type ||
          action.type === rejectAdminPayout.fulfilled.type ||
          action.type === markAdminPayoutPaid.fulfilled.type,
        (state, action) => {
          const updated = action.payload.payout;

          state.payouts = state.payouts.map((item) =>
            item.id === updated.id ? { ...item, ...updated } : item
          );
        }
      );
  },
});

export default adminPayoutSlice.reducer;