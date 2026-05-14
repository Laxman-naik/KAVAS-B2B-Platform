import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../services/api";

import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getNewArrivalsAPI,
  getTrendingProductsAPI,
} from "../../services/productService";

/* ================= THUNKS ================= */

/* GET ALL PRODUCTS */
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getProducts();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* GET SINGLE PRODUCT */
export const fetchSingleProduct = createAsyncThunk(
  "products/fetchOne",
  async (id, thunkAPI) => {
    try {
      const res = await getSingleProduct(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* CREATE PRODUCT */
export const addProduct = createAsyncThunk(
  "products/create",
  async (formData, thunkAPI) => {
    try {
      const res = await createProduct(formData);
      return res.data?.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

/* UPDATE PRODUCT */
export const editProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateProduct(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* DELETE PRODUCT */
export const removeProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* NEW ARRIVALS */
export const fetchNewArrivals = createAsyncThunk(
  "products/newArrivals",
  async (_, thunkAPI) => {
    try {
      const res = await getNewArrivalsAPI();
      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* TRENDING */
export const fetchTrendingProducts = createAsyncThunk(
  "products/trending",
  async (_, thunkAPI) => {
    try {
      const res = await getTrendingProductsAPI();
      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ================= VENDOR PRODUCTS (FIX YOU NEEDED) ================= */

export const fetchVendorProducts = createAsyncThunk(
  "products/fetchVendorProducts",
  async (vendorId, thunkAPI) => {
    try {
      const res = await api.get(`/vendor/products/${vendorId}`);
      return res.data?.data || res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= SLICE ================= */

const productSlice = createSlice({
  name: "products",

  initialState: {
    products: [],
    vendorProducts: [],   // ✅ IMPORTANT FIX
    newArrivals: [],
    trending: [],
    product: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ================= ALL PRODUCTS ================= */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.products || action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= SINGLE PRODUCT ================= */
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.product = action.payload;
      })

      /* ================= CREATE ================= */
      .addCase(addProduct.fulfilled, (state, action) => {
       state.products.unshift(action.payload?.product || action.payload);
      })

      /* ================= UPDATE ================= */
      .addCase(editProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      })

      /* ================= DELETE ================= */
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.id !== action.payload
        );
      })

      /* ================= NEW ARRIVALS ================= */
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload;
      })

      /* ================= TRENDING ================= */
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.trending = action.payload;
      })

      /* ================= VENDOR PRODUCTS (FIX) ================= */
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