import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrderFromCartAPI,
  createOrderAPI,
  getUserOrdersAPI,
  getOrderDetailsAPI,
  updateOrderStatusAPI,
} from "@/services/orderService";

const normalizeError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export const createOrderFromCart = createAsyncThunk(
  "order/createFromCart",
  async (data, thunkAPI) => {
    try {
      const res = await createOrderFromCartAPI(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err.message
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/create",
  async (payload, thunkAPI) => {
    try {
      const res = await createOrderAPI(payload);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getUserOrdersAPI();
      return res.orders;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const fetchOrderStats = createAsyncThunk(
  "order/fetchStats",
  async (_, thunkAPI) => {
    try {
      const res = await getUserOrdersAPI();
      const orders = res.orders || [];

      const totalOrders = orders.length;

      const pendingOrders = orders.filter(
        (o) =>
          o.status === "Processing" ||
          o.status === "Pending" ||
          o.status === "Shipped"
      ).length;

      const deliveredOrders = orders.filter(
        (o) => o.status === "Delivered"
      ).length;

      const totalSpent = orders.reduce(
        (sum, o) =>
          sum + Number(o.total_amount || o.totalAmount || o.amount || 0),
        0
      );

      return {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalSpent,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const fetchRecentOrders = createAsyncThunk(
  "order/fetchRecent",
  async (_, thunkAPI) => {
    try {
      const res = await getUserOrdersAPI();
      const orders = res.orders || [];

      return orders.slice(0, 4);
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOne",
  async (orderId, thunkAPI) => {
    try {
      const res = await getOrderDetailsAPI(orderId);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const res = await updateOrderStatusAPI(orderId, status);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

const initialState = {
  orders: [],

  recentOrders: [],

  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0,
  },

  currentOrder: null,
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,

  reducers: {
    clearOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(createOrderFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrderFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload?.orders?.[0] || null;
      })
      .addCase(createOrderFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.recentOrders = action.payload || [];
      })

      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.currentOrder = action.payload?.order || null;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload?.order;

        if (!updatedOrder) return;

        const index = state.orders.findIndex((o) => o.id === updatedOrder.id);

        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }

        if (state.currentOrder?.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;