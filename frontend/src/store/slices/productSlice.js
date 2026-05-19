import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getNewArrivalsAPI,
  getTrendingProductsAPI,
  getVendorProductsAPI,
} from "../../services/productService";

/* ================= FETCH ALL PRODUCTS ================= */

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getProducts();

      return res.products || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

/* ================= FETCH SINGLE PRODUCT ================= */

export const fetchSingleProduct = createAsyncThunk(
  "products/fetchOne",
  async (id, thunkAPI) => {
    try {
      const res = await getSingleProduct(id);

      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

/* ================= CREATE PRODUCT ================= */

export const addProduct = createAsyncThunk(
  "products/create",
  async (formData, thunkAPI) => {
    try {
      const res = await createProduct(formData);
      return res.product;
    } catch (err) {
      console.log("CREATE PRODUCT ERROR FULL:", err);
      console.log("ERROR RESPONSE:", err.response);
      console.log("ERROR DATA:", err.response?.data);

      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: err.message || "Create product failed",
        }
      );
    }
  }
);

/* ================= UPDATE PRODUCT ================= */

export const editProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateProduct(id, data);

      return res.product || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

/* ================= DELETE PRODUCT ================= */

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

/* ================= NEW ARRIVALS ================= */

export const fetchNewArrivals = createAsyncThunk(
  "products/newArrivals",
  async (_, thunkAPI) => {
    try {
      const res = await getNewArrivalsAPI();

      return res.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

/* ================= TRENDING PRODUCTS ================= */

export const fetchTrendingProducts = createAsyncThunk(
  "products/trending",
  async (_, thunkAPI) => {
    try {
      const res = await getTrendingProductsAPI();

      return res.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

/* ================= VENDOR PRODUCTS ================= */

export const fetchVendorProducts = createAsyncThunk(
  "products/fetchVendorProducts",
  async (vendorId, thunkAPI) => {
    try {
      const res = await getVendorProductsAPI(vendorId);

      return res.products || [];
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
    vendorProducts: [],
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
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH SINGLE */
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
        state.products = state.products.map((product) =>
          product.id === action.payload.id
            ? action.payload
            : product
        );
      })

      /* DELETE */
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })

      /* NEW ARRIVALS */
      .addCase(fetchNewArrivals.pending, (state) => {
        state.loading = true;
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
      })

      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })

      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* VENDOR PRODUCTS */
      .addCase(fetchVendorProducts.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorProducts = action.payload;
      })

      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
