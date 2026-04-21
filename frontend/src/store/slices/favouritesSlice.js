import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFavouritesAPI,
  addToFavouritesAPI,
  removeFromFavouritesAPI,
  clearFavouritesAPI,
} from "@/services/favouritesService";

/* ================= ERROR HELPER ================= */
const normalizeError = (err) =>
  err?.response?.data?.message ||
  err?.message ||
  "Something went wrong";

/* ================= THUNKS ================= */

export const fetchFavourites = createAsyncThunk(
  "favourites/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getFavouritesAPI();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const addToFavourites = createAsyncThunk(
  "favourites/add",
  async (productId, thunkAPI) => {
    try {
      const res = await addToFavouritesAPI(productId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const removeFromFavourites = createAsyncThunk(
  "favourites/remove",
  async (productId, thunkAPI) => {
    try {
      const res = await removeFromFavouritesAPI(productId);
      return { productId, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const clearFavourites = createAsyncThunk(
  "favourites/clear",
  async (_, thunkAPI) => {
    try {
      const res = await clearFavouritesAPI();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

/* ================= STATE ================= */

const initialState = {
  items: [],
  loading: false,
  error: null,
  success: false,
};

/* ================= SLICE ================= */

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,

  reducers: {
    clearFavouritesState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.favourites || [];
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addToFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items = action.payload?.favourites || [];
      })
      .addCase(addToFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeFromFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items = action.payload?.data?.favourites || [];
      })
      .addCase(removeFromFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(clearFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items = action.payload?.favourites || [];
      })
      .addCase(clearFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavouritesState } = favouritesSlice.actions;
export default favouritesSlice.reducer;