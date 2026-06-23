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
  makeProductFlashDealAPI,
  updateProductFlashDealAPI,
  removeProductFlashDealAPI,
  getVendorInventoryAPI
} from "../../services/productService";

/* ================= FETCH ALL PRODUCTS ================= */

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getProducts();
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

/* ================= ADD PRODUCT ================= */

export const addProduct = createAsyncThunk(
  "products/add",
  async (formData, thunkAPI) => {
    try {
      const res = await createProduct(formData);
      return res.product || res.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: err.message || "Failed to create product",
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
      return res?.product || res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
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
      return res?.products || res?.data || res || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const makeProductFlashDeal = createAsyncThunk(
  "products/makeProductFlashDeal",
  async ({ productId, data }, thunkAPI) => {
    try {
      const res = await makeProductFlashDealAPI(productId, data);
      return res?.product || res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateProductFlashDeal = createAsyncThunk(
  "products/updateProductFlashDeal",
  async ({ productId, data }, thunkAPI) => {
    try {
      const res = await updateProductFlashDealAPI(productId, data);
      return res?.product || res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeProductFlashDeal = createAsyncThunk(
  "products/removeProductFlashDeal",
  async (productId, thunkAPI) => {
    try {
      const res = await removeProductFlashDealAPI(productId);
      return res?.product || res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= ADD FLASH DEAL TO CART ================= */

export const addFlashDealToCart = createAsyncThunk(
  "products/addFlashDealToCart",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      const res = await addFlashDealToCartAPI({
        productId,
        quantity,
      });

      return res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= VENDOR PRODUCTS ================= */

export const fetchVendorProducts = createAsyncThunk(
  "products/fetchVendorProducts",
  async (organizationId, thunkAPI) => {
    try {
      const res = await getVendorProductsAPI(organizationId);
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
    flashDealActionLoading: false,

    cartLoading: false,
    cartSuccess: false,

    success: false,
    error: null,
  },

  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },

    clearCartSuccess: (state) => {
      state.cartSuccess = false;
    },

    clearProductSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= PRODUCTS ================= */

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
        state.success = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload) {
          state.products.unshift(action.payload);
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedProduct =
          action.payload?.product || action.payload?.data || action.payload;

        state.vendorProducts = state.vendorProducts.map((p) =>
          p.id === updatedProduct?.id ? { ...p, ...updatedProduct } : p
        );

        state.products = state.products.map((p) =>
          p.id === updatedProduct?.id ? { ...p, ...updatedProduct } : p
        );

        state.vendorProducts = state.vendorProducts.map((p) =>
          p.id === updatedProduct?.id ? updatedProduct : p
        );
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.vendorProducts = state.vendorProducts.filter(
          (p) => p.id !== action.payload
        );
      })

      /* ================= NEW ARRIVALS ================= */

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

      /* ================= TRENDING ================= */

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

      /* ================= FETCH FLASH DEALS ================= */

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

      /* ================= MAKE FLASH DEAL ================= */

      .addCase(makeProductFlashDeal.pending, (state) => {
        state.flashDealActionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(makeProductFlashDeal.fulfilled, (state, action) => {
        state.flashDealActionLoading = false;
        state.success = true;

        const product = action.payload;

        state.flashDeals = state.flashDeals.filter(
          (item) => item.id !== product.id
        );

        state.flashDeals.unshift(product);

        state.products = state.products.map((item) =>
          item.id === product.id ? product : item
        );

        state.vendorProducts = state.vendorProducts.map((item) =>
          item.id === product.id ? product : item
        );
      })
      .addCase(makeProductFlashDeal.rejected, (state, action) => {
        state.flashDealActionLoading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE FLASH DEAL ================= */

      .addCase(updateProductFlashDeal.pending, (state) => {
        state.flashDealActionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProductFlashDeal.fulfilled, (state, action) => {
        state.flashDealActionLoading = false;
        state.success = true;

        const product = action.payload;

        state.flashDeals = state.flashDeals.map((item) =>
          item.id === product.id ? product : item
        );

        state.products = state.products.map((item) =>
          item.id === product.id ? product : item
        );

        state.vendorProducts = state.vendorProducts.map((item) =>
          item.id === product.id ? product : item
        );
      })
      .addCase(updateProductFlashDeal.rejected, (state, action) => {
        state.flashDealActionLoading = false;
        state.error = action.payload;
      })

      /* ================= REMOVE FLASH DEAL ================= */

      .addCase(removeProductFlashDeal.pending, (state) => {
        state.flashDealActionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(removeProductFlashDeal.fulfilled, (state, action) => {
        state.flashDealActionLoading = false;
        state.success = true;

        const product = action.payload;

        state.flashDeals = state.flashDeals.filter(
          (item) => item.id !== product.id
        );

        state.products = state.products.map((item) =>
          item.id === product.id ? product : item
        );

        state.vendorProducts = state.vendorProducts.map((item) =>
          item.id === product.id ? product : item
        );
      })
      .addCase(removeProductFlashDeal.rejected, (state, action) => {
        state.flashDealActionLoading = false;
        state.error = action.payload;
      })

      /* ================= ADD FLASH DEAL TO CART ================= */

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

      /* ================= VENDOR PRODUCTS ================= */

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

export const {
  clearProductError,
  clearCartSuccess,
  clearProductSuccess,
} = productSlice.actions;

export default productSlice.reducer;