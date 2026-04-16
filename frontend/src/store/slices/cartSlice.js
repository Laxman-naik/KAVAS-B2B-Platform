import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartAPI,
  addToCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from "@/services/cartService";

/* ================= INITIAL STATE ================= */
const initialState = {
  carts: [], // grouped by organization
  loading: false,
  error: null,
};

/* ================= THUNKS ================= */

/**
 * GET CART
 */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCartAPI();
      return res.data.carts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/**
 * ADD TO CART
 */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await addToCartAPI({ productId, quantity });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/**
 * UPDATE ITEM QUANTITY
 */
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await updateCartItemAPI(itemId, { quantity });
      return { itemId, quantity, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/**
 * REMOVE ITEM
 */
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await removeCartItemAPI(itemId);
      return { itemId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/**
 * CLEAR CART
 */
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await clearCartAPI();
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ================= SLICE ================= */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ===== FETCH CART ===== */
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== ADD TO CART ===== */
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })

      /* ===== UPDATE ITEM ===== */
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { itemId, quantity } = action.payload;

        state.carts.forEach((cart) => {
          const item = cart.items.find((i) => i.id === itemId);
          if (item) item.quantity = quantity;
        });
      })

      /* ===== REMOVE ITEM ===== */
      .addCase(removeCartItem.fulfilled, (state, action) => {
        const { itemId } = action.payload;

        state.carts.forEach((cart) => {
          cart.items = cart.items.filter((i) => i.id !== itemId);
        });
      })

      /* ===== CLEAR CART ===== */
      .addCase(clearCart.fulfilled, (state) => {
        state.carts = [];
      });
  },
});

export default cartSlice.reducer;