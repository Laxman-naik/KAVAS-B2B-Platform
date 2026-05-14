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
  getProductReviewsAPI,
  addProductReviewAPI,
} from "../../services/productService";

/* ================= THUNKS ================= */

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

export const addProduct = createAsyncThunk(
  "products/add",
  async (data, thunkAPI) => {
    try {
      const res = await createProduct(data);
      return res.data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateProduct(id, data);
      return res.data?.product || res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

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

export const fetchNewArrivals = createAsyncThunk(
  "products/newArrivals",
  async (_, thunkAPI) => {
    try {
      const res = await getNewArrivalsAPI();
      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
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
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchVendorProducts = createAsyncThunk(
  "products/vendorProducts",
  async (vendorId, thunkAPI) => {
    try {
      const res = await getVendorProductsAPI(vendorId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  "products/fetchProductReviews",
  async (productId, thunkAPI) => {
    try {
      const res = await getProductReviewsAPI(productId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const submitProductReview = createAsyncThunk(
  "products/submitProductReview",
  async ({ productId, rating, comment }, thunkAPI) => {
    try {
      const res = await addProductReviewAPI(productId, {
        rating,
        comment,
      });

      await thunkAPI.dispatch(fetchProductReviews(productId));

      return res.data;
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
    newArrivals: [],
    trending: [],
    vendorProducts: [],
    product: null,

    reviews: [],
    reviewSummary: {
      avg_rating: 0,
      total_reviews: 0,
    },

    loading: false,
    reviewLoading: false,
    error: null,
  },

  reducers: {
    clearSingleProduct: (state) => {
      state.product = null;
      state.reviews = [];
      state.reviewSummary = {
        avg_rating: 0,
        total_reviews: 0,
      };
    },

    clearProductError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH ALL PRODUCTS */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.products || action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH SINGLE PRODUCT */
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product =
          action.payload?.product ||
          action.payload?.data ||
          action.payload ||
          null;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.product = null;
      })

      /* CREATE PRODUCT */
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.products.unshift(action.payload);
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE PRODUCT */
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;

        const updatedProduct = action.payload?.product || action.payload;

        state.products = state.products.map((p) =>
          p.id === updatedProduct?.id ? updatedProduct : p
        );

        if (state.product?.id === updatedProduct?.id) {
          state.product = {
            ...state.product,
            ...updatedProduct,
          };
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE PRODUCT */
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p.id !== action.payload
        );

        if (state.product?.id === action.payload) {
          state.product = null;
        }
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* NEW ARRIVALS */
      .addCase(fetchNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload || [];
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* TRENDING PRODUCTS */
      .addCase(fetchTrendingProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload || [];
      })
      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* VENDOR PRODUCTS */
      .addCase(fetchVendorProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorProducts = action.payload?.products || [];
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH PRODUCT REVIEWS */
      .addCase(fetchProductReviews.pending, (state) => {
        state.reviewLoading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviews = action.payload?.reviews || [];
        state.reviewSummary = action.payload?.summary || {
          avg_rating: 0,
          total_reviews: 0,
        };
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload;
      })

      /* SUBMIT PRODUCT REVIEW */
      .addCase(submitProductReview.pending, (state) => {
        state.reviewLoading = true;
        state.error = null;
      })
      .addCase(submitProductReview.fulfilled, (state) => {
        state.reviewLoading = false;
      })
      .addCase(submitProductReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSingleProduct, clearProductError } = productSlice.actions;

export default productSlice.reducer;