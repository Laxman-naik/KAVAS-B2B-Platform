import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFavouritesAPI, addToFavouritesAPI, removeFromFavouritesAPI, clearFavouritesAPI,} from "@/services/favouritesService";

/* ---------- HELPERS ---------- */

const normalizeError = (err) =>
  err?.response?.data?.message ||
  err?.message ||
  "Something went wrong";

/* ---------- THUNKS ---------- */

export const fetchFavourites = createAsyncThunk(
  "favourites/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await getFavouritesAPI();
      return res.data?.favourites || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const addToFavourites = createAsyncThunk(
  "favourites/add",
  async (productId, thunkAPI) => {
    try {
      await addToFavouritesAPI(productId);
      return productId;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const removeFromFavourites = createAsyncThunk(
  "favourites/remove",
  async (productId, thunkAPI) => {
    try {
      await removeFromFavouritesAPI(productId);
      return productId;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

export const clearFavourites = createAsyncThunk(
  "favourites/clear",
  async (_, thunkAPI) => {
    try {
      await clearFavouritesAPI();
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);

/* ---------- SLICE ---------- */

const initialState = {
  items: [], // productIds
  loading: false,
  error: null,
};

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
  state.loading = false;

  state.items = [
    ...new Set(
      action.payload.map((item) =>
        typeof item === "object" ? item.productId || item.id : item
      )
    ),
  ];
})
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addToFavourites.pending, (state, action) => {
  const id = action.meta.arg;
  if (!state.items.includes(id)) {
    state.items.push(id);
  }
})
      .addCase(addToFavourites.fulfilled, (state, action) => {
        const id = action.payload;

        if (!state.items.includes(id)) {
          state.items.push(id);
        }
      })
      .addCase(addToFavourites.rejected, (state, action) => {
        state.error = action.payload;
      })

      /* REMOVE */
      .addCase(removeFromFavourites.pending, (state, action) => {
  const id = action.meta.arg;
  state.items = state.items.filter((i) => i !== id);
})
      .addCase(removeFromFavourites.fulfilled, (state, action) => {
        const id = action.payload;

        state.items = state.items.filter((i) => i !== id);
      })
      .addCase(removeFromFavourites.rejected, (state, action) => {
        state.error = action.payload;
      })

      /* CLEAR */
      .addCase(clearFavourites.pending, (state) => {
        state.error = null;
      })
      .addCase(clearFavourites.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearFavourites.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = favouritesSlice.actions;
export default favouritesSlice.reducer;