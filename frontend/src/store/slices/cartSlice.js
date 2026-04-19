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

const normalizeCart = (data) => {
  return data?.cart?.items || data?.items || [];
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
  async (payload, thunkAPI) => {
    try {
      const res = await addToCartAPI(payload);
      return normalizeCart(res.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
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

// CLEAR
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
        state.items = action.payload;
      })

      /* UPDATE */
      .addCase(updateCartItem.pending, (state, action) => {
        state.loading.update = action.meta.arg.itemId;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading.update = null;

        const { itemId, quantity } = action.payload;
        const item = state.items.find((i) => i.id === itemId);
        if (item) item.quantity = quantity;
      })
      .addCase(updateCartItem.rejected, (state) => {
        state.loading.update = null;
      })

      /* REMOVE */
      .addCase(removeCartItem.pending, (state, action) => {
        state.loading.remove = action.meta.arg;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading.remove = null;
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      .addCase(removeCartItem.rejected, (state) => {
        state.loading.remove = null;
      })

      /* CLEAR */
      .addCase(clearCart.pending, (state) => {
        state.loading.clear = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading.clear = false;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state) => {
        state.loading.clear = false;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;