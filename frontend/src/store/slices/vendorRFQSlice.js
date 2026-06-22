import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getVendorRFQsAPI,
  updateVendorRFQStatusAPI,
  submitQuoteAPI,
  getVendorQuotesAPI,
  updateQuoteStatusAPI,
} from "@/services/vendorRFQService";

export const fetchVendorRFQs = createAsyncThunk(
  "vendorRFQ/fetchVendorRFQs",
  async (vendorOrgId, { rejectWithValue }) => {
    try {
      return await getVendorRFQsAPI(vendorOrgId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor RFQs"
      );
    }
  }
);

export const updateVendorRFQStatus = createAsyncThunk(
  "vendorRFQ/updateVendorRFQStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateVendorRFQStatusAPI({ id, status });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update RFQ"
      );
    }
  }
);

export const submitVendorQuote = createAsyncThunk(
  "vendorRFQ/submitVendorQuote",
  async (payload, { rejectWithValue }) => {
    try {
      return await submitQuoteAPI(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit quote"
      );
    }
  }
);

export const fetchVendorQuotes = createAsyncThunk(
  "vendorRFQ/fetchVendorQuotes",
  async (vendorOrgId, { rejectWithValue }) => {
    try {
      return await getVendorQuotesAPI(vendorOrgId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch quotes"
      );
    }
  }
);

export const updateQuoteStatus = createAsyncThunk(
  "vendorRFQ/updateQuoteStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateQuoteStatusAPI({ id, status });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quote"
      );
    }
  }
);

const vendorRFQSlice = createSlice({
  name: "vendorRFQ",
  initialState: {
    rfqs: [],
    quotes: [],
    selectedRFQ: null,
    selectedQuote: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    setSelectedRFQ: (state, action) => {
      state.selectedRFQ = action.payload;
    },
    setSelectedQuote: (state, action) => {
      state.selectedQuote = action.payload;
    },
    clearVendorRFQState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorRFQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorRFQs.fulfilled, (state, action) => {
        state.loading = false;
        state.rfqs = action.payload?.rfqs || [];
        state.selectedRFQ = action.payload?.rfqs?.[0] || null;
      })
      .addCase(fetchVendorRFQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchVendorQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload?.quotes || [];
        state.selectedQuote = action.payload?.quotes?.[0] || null;
      })

      .addCase(submitVendorQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload?.quote) {
          state.quotes.unshift(action.payload.quote);
        }
      })

      .addCase(updateVendorRFQStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updated = action.payload?.rfq;

        if (updated) {
          state.rfqs = state.rfqs.map((item) =>
            item.id === updated.id ? { ...item, status: updated.status } : item
          );
        }
      })

      .addCase(updateQuoteStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updated = action.payload?.quote;

        if (updated) {
          state.quotes = state.quotes.map((quote) =>
            quote.id === updated.id ? updated : quote
          );
        }
      });
  },
});

export const {
  setSelectedRFQ,
  setSelectedQuote,
  clearVendorRFQState,
} = vendorRFQSlice.actions;

export default vendorRFQSlice.reducer;