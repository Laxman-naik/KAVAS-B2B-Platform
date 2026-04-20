import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAddresses, createAddress, updateAddress, deleteAddress,} from "@/services/addressService";

/* ================= THUNKS ================= */

// GET all addresses
export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getAddresses();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// CREATE address
export const addAddress = createAsyncThunk(
  "address/create",
  async (data, thunkAPI) => {
    try {
      const res = await createAddress(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// UPDATE address
export const editAddress = createAsyncThunk(
  "address/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateAddress(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// DELETE address
export const removeAddress = createAsyncThunk(
  "address/delete",
  async (id, thunkAPI) => {
    try {
      await deleteAddress(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

/* ================= SLICE ================= */

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {
    // optional: reset (useful on logout)
    clearAddresses: (state) => {
      state.addresses = [];
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== FETCH ===== */
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
        state.error = action.payload;
      })

      /* ===== CREATE ===== */
      .addCase(addAddress.fulfilled, (state, action) => {
        // API should return created address
        state.addresses.unshift(action.payload);
      })

      /* ===== UPDATE ===== */
      .addCase(editAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((addr) =>
          addr.id === action.payload.id ? action.payload : addr
        );
      })

      /* ===== DELETE ===== */
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload
        );
      });
  },
});

export const { clearAddresses } = addressSlice.actions;

export default addressSlice.reducer;