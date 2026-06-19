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
  getFlashDealsAPI,
  addFlashDealToCartAPI,
  getVendorInventoryAPI,
} from "../../services/productService";

/* ================= FETCH ALL PRODUCTS ================= */

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getProducts();
      console.log("ALL PRODUCTS RESPONSE:", res);

      return res?.products || res?.data || res || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
// FETCH VENDOR INVENTORY 

export const fetchVendorInventory = createAsyncThunk(
  "products/fetchVendorInventory",
  async (organizationId, thunkAPI) => {
    try {
      const res = await getVendorInventoryAPI(organizationId);
      console.log("VENDOR INVENTORY RESPONSE:", res);
      return res?.products || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= FETCH SINGLE PRODUCT ================= */

export const fetchSingleProduct = createAsyncThunk(
  "products/fetchOne",
  async (id, thunkAPI) => {
    try {
      const res = await getSingleProduct(id);

      console.log("SINGLE PRODUCT RESPONSE:", res);

      return res?.product || res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: err.message || "Failed to fetch product",
        }
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (formData, thunkAPI) => {
    try {
      console.log("SENDING PRODUCT DATA:");

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await createProduct(formData);

      console.log("CREATE PRODUCT RESPONSE:", res);

      return res.product || res.data || res;
    } catch (err) {
      console.log("CREATE PRODUCT ERROR STATUS:", err.response?.status);
      console.log("CREATE PRODUCT ERROR DATA:", err.response?.data);

      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: err.message || "Failed to create product",
        }
      );
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateProduct(id, data);
      return res;
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

/* ================= NEW ARRIVALS ================= */

export const fetchNewArrivals = createAsyncThunk(
  "products/newArrivals",
  async (_, thunkAPI) => {
    try {
      const res = await getNewArrivalsAPI();
      console.log("NEW ARRIVALS RESPONSE:", res);

      return res?.products || res?.data || res || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= TRENDING PRODUCTS ================= */

export const fetchTrendingProducts = createAsyncThunk(
  "products/trending",
  async (_, thunkAPI) => {
    try {
      const res = await getTrendingProductsAPI();
      console.log("TRENDING PRODUCTS RESPONSE:", res);

      return res?.products || res?.data || res || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= FLASH DEALS ================= */

export const fetchFlashDeals = createAsyncThunk(
  "products/flashDeals",
  async (_, thunkAPI) => {
    try {
      const res = await getFlashDealsAPI();
      console.log("FLASH DEALS RESPONSE:", res);

      return res?.products || res?.data || res || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addFlashDealToCart = createAsyncThunk(
  "products/addFlashDealToCart",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      const res = await addFlashDealToCartAPI({
        product_id: productId,
        quantity,
      });

      console.log("FLASH DEAL ADD TO CART RESPONSE:", res);

      return res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchVendorProducts = createAsyncThunk(
  "products/fetchVendorProducts",
  async (organizationId, thunkAPI) => {
    try {
      const res = await getVendorProductsAPI(organizationId);
      console.log("VENDOR PRODUCTS RESPONSE:", res);

      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    trending: [],
    newArrivals: [],
    flashDeals: [],
    products: [],
    vendorProducts: [],
    inventory: [],
    inventoryLoading: false,
    product: null,

    loading: false,
    flashDealsLoading: false,

    cartLoading: false,
    cartSuccess: false,


    error: null,
  },

  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },

    clearCartSuccess: (state) => {
      state.cartSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product =
          action.payload?.product || action.payload?.data || action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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

      .addCase(editProduct.fulfilled, (state, action) => {
        const updatedProduct =
          action.payload?.product || action.payload?.data || action.payload;

        state.vendorProducts = state.vendorProducts.map((p) =>
          p.id === updatedProduct?.id ? { ...p, ...updatedProduct } : p
        );

        state.products = state.products.map((p) =>
          p.id === updatedProduct?.id ? { ...p, ...updatedProduct } : p
        );
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
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

      .addCase(fetchFlashDeals.pending, (state) => {
        state.flashDealsLoading = true;
        state.error = null;
      })
      .addCase(fetchFlashDeals.fulfilled, (state, action) => {
        state.flashDealsLoading = false;
        state.flashDeals = action.payload;
      })
      .addCase(fetchFlashDeals.rejected, (state, action) => {
        state.flashDealsLoading = false;
        state.error = action.payload;
      })

      .addCase(addFlashDealToCart.pending, (state) => {
        state.cartLoading = true;
        state.cartSuccess = false;
        state.error = null;
      })
      .addCase(addFlashDealToCart.fulfilled, (state) => {
        state.cartLoading = false;
        state.cartSuccess = true;
      })
      .addCase(addFlashDealToCart.rejected, (state, action) => {
        state.cartLoading = false;
        state.cartSuccess = false;
        state.error = action.payload;
      })

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
      .addCase(fetchVendorInventory.pending, (state) => {
        state.inventoryLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorInventory.fulfilled, (state, action) => {
        state.inventoryLoading = false;
        state.inventory = action.payload;
      })
      .addCase(fetchVendorInventory.rejected, (state, action) => {
        state.inventoryLoading = false;
        state.error = action.payload;
      });

  },

});

export const { clearProductError, clearCartSuccess } = productSlice.actions;

export default productSlice.reducer;