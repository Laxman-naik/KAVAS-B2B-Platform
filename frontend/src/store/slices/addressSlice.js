import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/services/addressService";

/* ================= NORMALIZE ================= */
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

/* ================= THUNKS ================= */
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

/* ================= SAFE UPDATE ================= */
/*
IMPORTANT:
Do NOT send partial overwrite blindly from UI.
Backend should accept partial updates OR you must merge.
*/
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

/* ================= SEPARATE DEFAULT FLOW ================= */
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

/* ================= SLICE ================= */
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

      /* ===== FETCH ===== */
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.loading = false;
      })

      /* ===== ADD ===== */
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.unshift(action.payload);
        state.loading = false;
      })

      /* ===== UPDATE (FULL EDIT ONLY) ===== */
      .addCase(editAddress.fulfilled, (state, action) => {
        const updated = action.payload;

        state.addresses = state.addresses.map((addr) =>
          addr.id === updated.id ? updated : addr
        );

        state.loading = false;
      })

      /* ===== DELETE ===== */
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload
        );
        state.loading = false;
      })

      /* ===== DEFAULT ADDRESS ===== */
      .addCase(changeDefaultAddress.fulfilled, (state, action) => {
        const updated = action.payload;

        state.addresses = state.addresses.map((addr) =>
          addr.id === updated.id
            ? updated
            : { ...addr, is_default: false }
        );

        state.loading = false;
      });
  },
});

export const { clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;