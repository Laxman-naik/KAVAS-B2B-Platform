import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, addToCartAPI, updateCartItemAPI, removeCartItemAPI, clearCartAPI, mergeCartAPI, } from "@/services/cartService";

const normalizeNumber = (value, fallback = 0) => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const parsed = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isNaN(parsed) ? fallback : parsed;
};

const normalizeMOQ = (payload) => {
  const rawMin =
    payload?.moq ??
    payload?.minQty ??
    payload?.minimumOrderQuantity ??
    payload?.min;

  if (typeof rawMin === "number" && !Number.isNaN(rawMin)) {
    return Math.max(1, rawMin);
  }

  const parsed = Number(String(rawMin || "").replace(/[^0-9.]/g, ""));
  return Math.max(1, parsed || 1);
};

const normalizeItem = (payload) => {
  const productId =
    payload?.product_id ??
    payload?.productId ??
    payload?._id ??
    payload?.id;

  const cartItemId =
    payload?.cartItemId ??
    payload?.cart_item_id ??
    payload?.id ??
    null;

  const price = normalizeNumber(payload?.price, 0);
  const moq = normalizeMOQ(payload);

  const quantity =
    payload?.quantity != null
      ? Math.max(moq, Math.floor(normalizeNumber(payload.quantity, moq)))
      : moq;

  return {
    _id: String(productId),
    cartItemId,

    name: payload?.name || payload?.title || "",
    image: payload?.image || "",
    price,
    min: `Min. ${moq} units`,
    moq,
    quantity,

    size: payload?.size || null,
    color: payload?.color || null,
    deliveryDate: payload?.deliveryDate || payload?.delivery_date || null,

    category: payload?.category || null,
    specifications: payload?.specifications || null,
  };
};

const normalizeApiCartItems = (items) => {
  const list = Array.isArray(items) ? items : [];

  return list
    .map((item) =>
      normalizeItem({
        product_id: item.product_id,
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        moq: item.moq,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        delivery_date: item.delivery_date,
        category: item.category,
        specifications: item.specifications,
      })
    )
    .filter((x) => Boolean(x._id));
};

const isSameCartItem = (a, b) => {
  return (
    String(a._id) === String(b._id) &&
    (a.size || null) === (b.size || null) &&
    (a.color || null) === (b.color || null) &&
    (a.deliveryDate || null) === (b.deliveryDate || null)
  );
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await getCart();
      return response?.data?.cart?.items || response?.cart?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const syncAddToCart = createAsyncThunk(
  "cart/syncAddToCart",
  async (payload, thunkAPI) => {
    try {
      const response = await addToCartAPI(payload);
      return response?.data?.cart?.items || response?.cart?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const syncUpdateCartItem = createAsyncThunk(
  "cart/syncUpdateCartItem",
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const response = await updateCartItemAPI(itemId, { quantity });
      return response?.data?.cart?.items || response?.cart?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);

export const syncRemoveCartItem = createAsyncThunk(
  "cart/syncRemoveCartItem",
  async (itemId, thunkAPI) => {
    try {
      const response = await removeCartItemAPI(itemId);
      return response?.data?.cart?.items || response?.cart?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to remove cart item"
      );
    }
  }
);

export const syncClearCart = createAsyncThunk(
  "cart/syncClearCart",
  async (_, thunkAPI) => {
    try {
      await clearCartAPI();
      return [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

export const syncMergeCart = createAsyncThunk(
  "cart/syncMergeCart",
  async (items, thunkAPI) => {
    try {
      const response = await mergeCartAPI(items);
      return response?.data?.cart?.items || response?.cart?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to merge cart"
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartFromApi: (state, action) => {
      state.items = normalizeApiCartItems(action.payload);
      state.error = null;
    },

    addToCart: (state, action) => {
      const item = normalizeItem(action.payload);
      if (!item._id) return;

      const existing = state.items.find((x) => isSameCartItem(x, item));

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: item.moq,
        });
      }
    },

    removeFromCart: (state, action) => {
      const payload = action.payload;

      state.items = state.items.filter((item) => {
        if (typeof payload === "string" || typeof payload === "number") {
          return String(item.cartItemId) !== String(payload);
        }
        return !isSameCartItem(item, payload);
      });
    },

    increaseQuantity: (state, action) => {
      const payload = action.payload;

      const item = state.items.find((x) => {
        if (typeof payload === "string" || typeof payload === "number") {
          return String(x.cartItemId) === String(payload);
        }
        return isSameCartItem(x, payload);
      });

      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const payload = action.payload;

      const item = state.items.find((x) => {
        if (typeof payload === "string" || typeof payload === "number") {
          return String(x.cartItemId) === String(payload);
        }
        return isSameCartItem(x, payload);
      });

      if (item) {
        const moq = item.moq || 1;
        if (item.quantity > moq) {
          item.quantity -= 1;
        }
      }
    },

    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;

      const item = state.items.find(
        (x) => String(x.cartItemId) === String(cartItemId)
      );

      if (item) {
        const moq = item.moq || 1;
        const parsedQty = Number(quantity);

        if (Number.isNaN(parsedQty)) {
          item.quantity = moq;
        } else {
          item.quantity = parsedQty < moq ? moq : Math.floor(parsedQty);
        }
      }
    },

    clearCartState: (state) => {
      state.items = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeApiCartItems(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      .addCase(syncAddToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncAddToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeApiCartItems(action.payload);
      })
      .addCase(syncAddToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add item";
      })

      .addCase(syncUpdateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncUpdateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeApiCartItems(action.payload);
      })
      .addCase(syncUpdateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update item";
      })

      .addCase(syncRemoveCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncRemoveCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeApiCartItems(action.payload);
      })
      .addCase(syncRemoveCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove item";
      })

      .addCase(syncClearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncClearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(syncClearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to clear cart";
      })

      .addCase(syncMergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncMergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeApiCartItems(action.payload);
      })
      .addCase(syncMergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to merge cart";
      });
  },
});

export const {
  setCartFromApi,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  clearCartState,
} = cartSlice.actions;

export default cartSlice.reducer;