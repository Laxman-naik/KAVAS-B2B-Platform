import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getSingleProduct, createProduct, updateProduct, deleteProduct, } from "../../services/productService";

/* ================= THUNKS ================= */

// Get all products
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

// Get single product
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

// Create product
export const addProduct = createAsyncThunk(
  "products/create",
  async (data, thunkAPI) => {
    try {
      const res = await createProduct(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
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
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
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
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= SLICE ================= */

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
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
        state.products = action.payload; // ✅ now always array
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH ONE */
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        // state.product = action.payload;
        state.product = action.payload; // ✅ FIX (store single product correctly)
      })

      /* CREATE */
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })

      /* UPDATE */
      .addCase(editProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })

      /* DELETE */
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;