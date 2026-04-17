import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartAPI,
  addToCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from "@/services/cartService";

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCartAPI();
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, variantId }, { rejectWithValue, dispatch }) => {
    try {
      const res = await addToCartAPI({ productId, quantity, variantId });
      await dispatch(fetchCart());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const res = await updateCartItemAPI(itemId, { quantity });
      await dispatch(fetchCart());
      return { itemId, quantity, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId, { rejectWithValue, dispatch }) => {
    try {
      const res = await removeCartItemAPI(itemId);
      await dispatch(fetchCart());
      return { itemId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await clearCartAPI();
      await dispatch(fetchCart());
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      });
  },
});

export default cartSlice.reducer;