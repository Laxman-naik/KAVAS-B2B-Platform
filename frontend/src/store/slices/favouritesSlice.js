// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getFavouritesAPI, addToFavouritesAPI, removeFromFavouritesAPI,clearFavouritesAPI,} from "@/services/favouritesService";

// const normalizeError = (err) =>
//   err?.response?.data?.message ||
//   err?.message ||
//   "Something went wrong";

// const getArrayFromResponse = (payload) => {
//   if (Array.isArray(payload?.favourites)) return payload.favourites;
//   if (Array.isArray(payload?.data?.favourites)) return payload.data.favourites;
//   if (Array.isArray(payload?.items)) return payload.items;
//   if (Array.isArray(payload?.data?.items)) return payload.data.items;
//   if (Array.isArray(payload)) return payload;
//   return null;
// };

// export const getProductIdFromItem = (item) =>
//   item?.productId ||
//   item?.product_id ||
//   item?.id ||
//   item?._id;

// export const fetchFavourites = createAsyncThunk(
//   "favourites/fetchAll",
//   async (_, thunkAPI) => {
//     try {
//       const res = await getFavouritesAPI();
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(normalizeError(err));
//     }
//   }
// );

// export const addToFavourites = createAsyncThunk(
//   "favourites/add",
//   async (productId, thunkAPI) => {
//     try {
//       const res = await addToFavouritesAPI(productId);
//       return { productId, data: res.data };
//     } catch (err) {
//       return thunkAPI.rejectWithValue(normalizeError(err));
//     }
//   }
// );

// export const removeFromFavourites = createAsyncThunk(
//   "favourites/remove",
//   async (productId, thunkAPI) => {
//     try {
//       const res = await removeFromFavouritesAPI(productId);
//       return { productId, data: res.data };
//     } catch (err) {
//       return thunkAPI.rejectWithValue(normalizeError(err));
//     }
//   }
// );

// export const clearFavourites = createAsyncThunk(
//   "favourites/clear",
//   async (_, thunkAPI) => {
//     try {
//       const res = await clearFavouritesAPI();
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(normalizeError(err));
//     }
//   }
// );

// const initialState = {
//   items: [],
//   loading: false,
//   error: null,
//   success: false,
// };

// const favouritesSlice = createSlice({
//   name: "favourites",
//   initialState,
//   reducers: {
//     clearFavouritesState: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.success = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchFavourites.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchFavourites.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = getArrayFromResponse(action.payload) || [];
//       })
//       .addCase(fetchFavourites.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(addToFavourites.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(addToFavourites.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;

//         const serverList = getArrayFromResponse(action.payload?.data);
//         if (serverList) {
//           state.items = serverList;
//           return;
//         }

//         const addedId = action.payload?.productId;
//         const exists = state.items.some(
//           (item) =>
//             String(getProductIdFromItem(item)) === String(addedId)
//         );

//         if (!exists) {
//           state.items.push({
//             id: addedId,
//             productId: addedId,
//           });
//         }
//       })
//       .addCase(addToFavourites.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(removeFromFavourites.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(removeFromFavourites.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;

//         const serverList = getArrayFromResponse(action.payload?.data);
//         if (serverList) {
//           state.items = serverList;
//           return;
//         }

//         const removedId = action.payload?.productId;
//         state.items = state.items.filter(
//           (item) =>
//             String(getProductIdFromItem(item)) !== String(removedId)
//         );
//       })
//       .addCase(removeFromFavourites.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(clearFavourites.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(clearFavourites.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//         state.items = [];
//       })
//       .addCase(clearFavourites.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearFavouritesState } = favouritesSlice.actions;
// export default favouritesSlice.reducer;

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

        // ensure unique IDs
        state.items = [...new Set(action.payload)];
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addToFavourites.pending, (state) => {
        state.error = null;
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
      .addCase(removeFromFavourites.pending, (state) => {
        state.error = null;
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