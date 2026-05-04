import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrderFromCartAPI, createOrderAPI, getUserOrdersAPI, getOrderDetailsAPI, updateOrderStatusAPI, } from "@/services/orderService";

const normalizeError = (err) => err?.response?.data?.message || err?.message || "Something went wrong";

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
      return { orderId, status, data: res };
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

/* ================= STATE ================= */

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
};

/* ================= SLICE ================= */

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

      /* ================= CREATE ORDER ================= */
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

      /* ================= FETCH ORDERS ================= */
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= SINGLE ORDER ================= */
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.currentOrder = action.payload?.order || null;
      })

      /* ================= STATUS UPDATE ================= */
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;

        const order = state.orders.find((o) => o.id === orderId);
        if (order) order.status = status;

        if (state.currentOrder?.id === orderId) {
          state.currentOrder.status = status;
        }
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;