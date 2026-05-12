import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5002/api/products";

/* =========================================
   ADD PRODUCT
========================================= */
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      console.log("SENDING PRODUCT:", productData);

      const token = localStorage.getItem("accessToken");

      console.log("TOKEN:", token);

      const response = await axios.post(
        API_URL,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API RESPONSE:", response.data);

      return response.data;
    } catch (error) {
      console.error("AXIOS ERROR:", error);

      if (error.response) {
        console.error("ERROR RESPONSE:", error.response.data);

        return rejectWithValue(error.response.data);
      }

      return rejectWithValue({
        message: error.message,
      });
    }
  }
);
/* =========================================
   FETCH ALL PRODUCTS
========================================= */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch products",
        }
      );
    }
  }
);

/* =========================================
   FETCH NEW ARRIVALS
========================================= */
export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/new-arrivals`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch new arrivals",
        }
      );
    }
  }
);

/* =========================================
   FETCH TRENDING PRODUCTS
========================================= */
export const fetchTrendingProducts = createAsyncThunk(
  "products/fetchTrendingProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/trending`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch trending products",
        }
      );
    }
  }
);

/* =========================================
   SLICE
========================================= */
const productSlice = createSlice({
  name: "products",

  initialState: {
    products: [],
    newArrivals: [],
    trendingProducts: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* =========================
         ADD PRODUCT
      ========================= */
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.products.push(action.payload);
      })

      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || action.error.message;

        console.error("REDUX REJECTED:", action.payload);
      })

      /* =========================
         FETCH PRODUCTS
      ========================= */
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

      /* =========================
         FETCH NEW ARRIVALS
      ========================= */
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

      /* =========================
         FETCH TRENDING PRODUCTS
      ========================= */
      .addCase(fetchTrendingProducts.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.loading = false;

        state.trendingProducts = action.payload;
      })

      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;