// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getCart,
//   addToCartAPI,
//   updateCartItemAPI,
//   removeCartItemAPI,
//   clearCartAPI,
// } from "../../services/cartService";

// const normalizeCart = (res) =>
//   res?.data?.cart?.items ?? [];

// /* ================= THUNKS ================= */

// export const fetchCart = createAsyncThunk(
//   "cart/fetchCart",
//   async (_, thunkAPI) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return [];

//       const res = await getCart();
//       return normalizeCart(res);
//     } catch (error) {
//       console.error("FETCH CART ERROR:", error);

//       return thunkAPI.rejectWithValue(
//         error.response?.data || error.message
//       );
//     }
//   }
// );

// export const addToCart = createAsyncThunk(
//   "cart/addToCart",
//   async (payload, thunkAPI) => {
//     try {
//       const res = await addToCartAPI(payload);
//       return normalizeCart(res);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const updateCartItem = createAsyncThunk(
//   "cart/updateCartItem",
//   async ({ itemId, quantity }, thunkAPI) => {
//     try {
//       await updateCartItemAPI(itemId, { quantity });
//       return { itemId, quantity };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const removeCartItem = createAsyncThunk(
//   "cart/removeCartItem",
//   async (itemId, thunkAPI) => {
//     try {
//       await removeCartItemAPI(itemId);
//       return itemId;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const clearCart = createAsyncThunk(
//   "cart/clearCart",
//   async (_, thunkAPI) => {
//     try {
//       await clearCartAPI();
//       return [];
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data);
//     }
//   }
// );

// /* ================= STATE ================= */

// const initialState = {
//   items: [],
//   loading: false,
//   error: null,
// };

// /* ================= SLICE ================= */

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,

//   reducers: {
//     // INSTANT RESET (used on logout)
//     resetCart: (state) => {
//       state.items = [];
//       state.loading = false;
//       state.error = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       .addCase(fetchCart.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchCart.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(addToCart.fulfilled, (state, action) => {
//         state.items = action.payload;
//       })

//       .addCase(updateCartItem.fulfilled, (state, action) => {
//         const { itemId, quantity } = action.payload;
//         const item = state.items.find((i) => i.id === itemId);
//         if (item) item.quantity = quantity;
//       })

//       .addCase(removeCartItem.fulfilled, (state, action) => {
//         state.items = state.items.filter((i) => i.id !== action.payload);
//       })

//       .addCase(clearCart.fulfilled, (state) => {
//         state.items = [];
//       });
//   },
// });

// export const { resetCart } = cartSlice.actions;
// export default cartSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  addToCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from "../../services/cartService";

/* ================= HELPERS ================= */

const normalizeCart = (res) => res?.data?.cart?.items ?? [];

const normalizeError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

/* ================= THUNKS ================= */

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await getCart();
      return normalizeCart(res);
    } catch (error) {
      console.error("FETCH CART ERROR:", error);
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload, thunkAPI) => {
    try {
      const res = await addToCartAPI(payload);
      return normalizeCart(res);
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

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

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      await clearCartAPI();
      return [];
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

/* ================= STATE ================= */

const initialState = {
  items: [],
  loading: false,
  error: null,
};

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH CART */
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // now always string
      })

      /* ADD */
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
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
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;