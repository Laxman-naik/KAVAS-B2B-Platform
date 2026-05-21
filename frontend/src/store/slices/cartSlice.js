import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  addToCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from "../../services/cartService";

/* ================= HELPERS ================= */

const normalizeCart = (data) => {
  return data?.cart?.items || [];
};

const normalizeError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

/* ================= THUNKS ================= */

// FETCH CART
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const data = await getCart();
      return normalizeCart(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

// ADD
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, thunkAPI) => {
    try {
      const response = await addToCartAPI(cartData);

      console.log("ADD TO CART API RESPONSE:", response.data);

      return response.data;

    } catch (error) {
      console.error(
        "ADD CART ERROR:",
        error.response?.data || error.message
      );

      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message,
        }
      );
    }
  }
);

// UPDATE
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      await updateCartItemAPI(itemId, { quantity });
      return { itemId, quantity };
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

// REMOVE
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId, thunkAPI) => {
    try {
      await removeCartItemAPI(itemId);
      return itemId;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

// CLEAR CART
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      await clearCartAPI();
      return true;
    } catch (error) {
      console.log("CLEAR CART ERROR:", error);
      return thunkAPI.rejectWithValue(normalizeError(error));
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
  },
  error: null,
};

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.loading = initialState.loading;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH */
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
      })

      /* ADD */
      .addCase(addToCart.fulfilled, (state, action) => {
  if (action.payload?.cart?.items) {
    state.items = action.payload.cart.items;
  }
})

      /* UPDATE */
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { itemId, quantity } = action.payload;
        const item = state.items.find((i) => i.id === itemId);
        if (item) item.quantity = quantity;
      })

      /* REMOVE */
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      })

      /* CLEAR */
      .addCase(clearCart.pending, (state) => {
        state.loading.clear = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading.clear = false;
        state.items = []; // 🔥 THIS is what triggers empty UI
      })
      .addCase(clearCart.rejected, (state) => {
        state.loading.clear = false;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;