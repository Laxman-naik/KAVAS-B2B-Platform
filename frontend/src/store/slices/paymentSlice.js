import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= CREATE CHECKOUT ================= */
export const createCheckout = createAsyncThunk(
  "payment/createCheckout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/api/payment/checkout",
        {},
        { withCredentials: true }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= VERIFY PAYMENT ================= */
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/api/payment/verify",
        payload,
        { withCredentials: true }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);