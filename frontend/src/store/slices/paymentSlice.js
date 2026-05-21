import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createCheckoutAPI, verifyPaymentAPI, } from "@/services/paymentService";

/* ================= ERROR HELPER ================= */
const normalizeError = (err) =>
  err?.response?.data?.message ||
  err?.message ||
  "Something went wrong";

/* ================= CREATE CHECKOUT ================= */
export const createCheckout = createAsyncThunk(
  "payment/createCheckout",
  async (data, thunkAPI) => {
    try {
      const res = await createCheckoutAPI(data);

      return res.data;

    } catch (err) {

      console.log("===== REAL AXIOS ERROR =====");

      console.log("FULL ERROR:", err);

      console.log("MESSAGE:", err.message);

      console.log("STATUS:", err.response?.status);

      console.log("RESPONSE DATA:", err.response?.data);

      console.log("HEADERS:", err.response?.headers);

      console.log("REQUEST:", err.request);

      return thunkAPI.rejectWithValue({
        message:
          err.response?.data?.message ||
          err.message ||
          "Something went wrong",

        status: err.response?.status,

        data: err.response?.data,
      });
    }
  }
);

/* ================= VERIFY PAYMENT ================= */
export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (payload, thunkAPI) => {
    try {
      const res = await verifyPaymentAPI(payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

/* ================= STATE ================= */
const initialState = {
  loading: false,
  error: null,
  success: false,
  paymentData: null,
};

/* ================= SLICE ================= */
const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    clearPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.paymentData = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== CREATE CHECKOUT ===== */
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload; // key, orderId, amount
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== VERIFY PAYMENT ===== */
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;