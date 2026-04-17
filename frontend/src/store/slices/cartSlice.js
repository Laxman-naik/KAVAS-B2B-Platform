import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  addToCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from "../../services/cartService";

const normalizeCart = (res) =>
  res?.data?.cart?.items ?? res?.data?.items ?? [];

/* ================= THUNKS ================= */

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await getCart();
      return normalizeCart(res);
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload, thunkAPI) => {
    try {
      const res = await addToCartAPI(payload);
      return normalizeCart(res);
    } catch {
      return thunkAPI.rejectWithValue("Failed to add item");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      await updateCartItemAPI(itemId, { quantity });
      return { itemId, quantity };
    } catch {
      return thunkAPI.rejectWithValue("Failed to update item");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId, thunkAPI) => {
    try {
      await removeCartItemAPI(itemId);
      return itemId;
    } catch {
      return thunkAPI.rejectWithValue("Failed to remove item");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      await clearCartAPI();
      return true;
    } catch {
      return thunkAPI.rejectWithValue("Failed to clear cart");
    }
  }
);

/* ================= STATE ================= */

const initialState = {
  items: [],
  loading: {
    fetch: false,
    update: null,
    remove: null,
    clear: false,
    add: false,
  },
  error: null,
};

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState,

  extraReducers: (builder) => {
    /* FETCH */
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading.fetch = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      });

    /* ADD TO CART */
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading.add = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading.add = false;
        state.items = action.payload; // full sync from backend
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading.add = false;
        state.error = action.payload;
      });

    /* UPDATE (OPTIMISTIC) */
    builder
      .addCase(updateCartItem.pending, (state, action) => {
        const { itemId, quantity } = action.meta.arg;
        state.loading.update = itemId;

        const item = state.items.find((i) => i.id === itemId);
        if (item) item.quantity = quantity;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.loading.update = null;
      })
      .addCase(updateCartItem.rejected, (state) => {
        state.loading.update = null;
      });

    /* REMOVE */
    builder
      .addCase(removeCartItem.pending, (state, action) => {
        state.loading.remove = action.meta.arg;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.loading.remove = null;
      });

    /* CLEAR */
    builder.addCase(clearCart.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export default cartSlice.reducer;