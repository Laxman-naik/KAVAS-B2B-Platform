import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAdminDashboardAPI } from "@/services/adminDashboardService";

export const fetchAdminDashboard = createAsyncThunk(
    "adminDashboard/fetch",
    async (_, thunkAPI) => {
        try {
            return await getAdminDashboardAPI();
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

const adminDashboardSlice = createSlice({
    name: "adminDashboard",

    initialState: {
        loading: false,
        error: null,

        stats: {},

        recentOrders: [],
        recentUsers: [],
        recentVendors: [],
        recentRFQs: [],
        recentTransactions: [],
    },

    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
                state.loading = false;

                state.stats = action.payload.stats;
                state.recentOrders = action.payload.recentOrders;
                state.recentUsers = action.payload.recentUsers;
                state.recentVendors = action.payload.recentVendors;
                state.recentRFQs = action.payload.recentRFQs;
                state.recentTransactions = action.payload.recentTransactions;
            })

            .addCase(fetchAdminDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default adminDashboardSlice.reducer;