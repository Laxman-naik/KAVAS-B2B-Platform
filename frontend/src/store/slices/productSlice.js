import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getSingleProduct, createProduct, updateProduct, deleteProduct, getNewArrivalsAPI, getTrendingProductsAPI } from "../../services/productService";

/* ================= THUNKS ================= */

// Get all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getProducts();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// FIXED: consistent naming
export const fetchSingleProduct = createAsyncThunk(
  "products/fetchOne",
  async (id, thunkAPI) => {
    try {
      const res = await getSingleProduct(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// Create product
export const addProduct = createAsyncThunk(
  "products/create",
  async (data, thunkAPI) => {
    try {
      const res = await createProduct(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// Update product
export const editProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateProduct(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// Delete product
export const removeProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  "products/newArrivals",
  async (_, thunkAPI) => {
    try {
      const res = await getNewArrivalsAPI();
      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const fetchTrendingProducts = createAsyncThunk(
  "products/trending",
  async (_, thunkAPI) => {
    try {
      const res = await getTrendingProductsAPI();
      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

/* ================= SLICE ================= */

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    newArrivals: [],
    trending: [], 
    product: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* FETCH ALL */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ safe handling (array OR object response)
        state.products = action.payload?.products || action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH ONE */
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })

      /* UPDATE */
      .addCase(editProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      })

      /* DELETE */
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.id !== action.payload
        );
      })

       .addCase(fetchNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* TRENDING */
      .addCase(fetchTrendingProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default productSlice.reducer;