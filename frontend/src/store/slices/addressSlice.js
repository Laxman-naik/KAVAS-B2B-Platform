// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getAddresses, createAddress, updateAddress, deleteAddress,} from "@/services/addressService";

// /* ================= THUNKS ================= */

// // GET all addresses
// export const fetchAddresses = createAsyncThunk(
//   "address/fetchAll",
//   async (_, thunkAPI) => {
//     try {
//       const res = await getAddresses();
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data || err.message
//       );
//     }
//   }
// );

// // CREATE address
// export const addAddress = createAsyncThunk(
//   "address/create",
//   async (data, thunkAPI) => {
//     try {
//       const res = await createAddress(data);
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data || err.message
//       );
//     }
//   }
// );

// // UPDATE address
// export const editAddress = createAsyncThunk(
//   "address/update",
//   async ({ id, data }, thunkAPI) => {
//     try {
//       const res = await updateAddress(id, data);
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data || err.message
//       );
//     }
//   }
// );

// // DELETE address
// export const removeAddress = createAsyncThunk(
//   "address/delete",
//   async (id, thunkAPI) => {
//     try {
//       await deleteAddress(id);
//       return id;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data || err.message
//       );
//     }
//   }
// );

// /* ================= SLICE ================= */

// const addressSlice = createSlice({
//   name: "address",
//   initialState: {
//     addresses: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     // optional: reset (useful on logout)
//     clearAddresses: (state) => {
//       state.addresses = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder

//       /* ===== FETCH ===== */
//       .addCase(fetchAddresses.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAddresses.fulfilled, (state, action) => {
//         state.loading = false;
//         state.addresses = action.payload;
//       })
//       .addCase(fetchAddresses.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       /* ===== CREATE ===== */
//       .addCase(addAddress.fulfilled, (state, action) => {
//         // API should return created address
//         state.addresses.unshift(action.payload);
//       })

//       /* ===== UPDATE ===== */
//       .addCase(editAddress.fulfilled, (state, action) => {
//         state.addresses = state.addresses.map((addr) =>
//           addr.id === action.payload.id ? action.payload : addr
//         );
//       })

//       /* ===== DELETE ===== */
//       .addCase(removeAddress.fulfilled, (state, action) => {
//         state.addresses = state.addresses.filter(
//           (addr) => addr.id !== action.payload
//         );
//       });
//   },
// });

// export const { clearAddresses } = addressSlice.actions;

// export default addressSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress,} from "@/services/addressService";

const normalize = (a) => ({
  id: a.id,
  address_line1: a.address_line1 || "",
  address_line2: a.address_line2 || "",
  city: a.city || "",
  state: a.state || "",
  country: a.country || "",
  postal_code: a.postal_code || "",
  label: a.label || "Address",
  phone: a.phone || "",
  type: a.type || "other",
  is_default: Boolean(a.is_default),
  active: a.active !== undefined ? Boolean(a.active) : true,
});

export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getAddresses();
      return res.data.map(normalize);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  "address/create",
  async (data, thunkAPI) => {
    try {
      const res = await createAddress(data);
      return normalize(res.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editAddress = createAsyncThunk(
  "address/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateAddress(id, data);
      return normalize(res.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeAddress = createAsyncThunk(
  "address/delete",
  async (id, thunkAPI) => {
    try {
      await deleteAddress(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const changeDefaultAddress = createAsyncThunk(
  "address/setDefault",
  async (id, thunkAPI) => {
    try {
      const res = await setDefaultAddress(id);
      return normalize(res.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearAddresses: (state) => {
      state.addresses = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch addresses";
      })

      .addCase(addAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.unshift(action.payload);
        state.error = null;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add address";
      })

      .addCase(editAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload;

        state.addresses = state.addresses.map((addr) =>
          addr.id === updated.id ? updated : addr
        );

        state.error = null;
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update address";
      })

      .addCase(removeAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.loading = false;

        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload
        );

        state.error = null;
      })
      .addCase(removeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete address";
      })

      .addCase(changeDefaultAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload;

        state.addresses = state.addresses.map((addr) => {
          if (addr.id === updated.id) return updated;
          return { ...addr, is_default: false };
        });

        state.error = null;
      })
      .addCase(changeDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to set default address";
      });
  },
});

export const { clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;