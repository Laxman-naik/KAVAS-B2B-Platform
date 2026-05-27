import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createRFQAPI,
  getRFQsAPI,
  getSingleRFQAPI,
  getBuyerRFQsAPI,
  updateRFQStatusAPI,
  deleteRFQAPI,
} from "../services/rfqService";

export const createRFQ = createAsyncThunk(
  "rfq/createRFQ",
  async (payload, { rejectWithValue }) => {
    try {
      return await createRFQAPI(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create RFQ"
      );
    }
  }
);

export const fetchRFQs = createAsyncThunk(
  "rfq/fetchRFQs",
  async (_, { rejectWithValue }) => {
    try {
      return await getRFQsAPI();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch RFQs"
      );
    }
  }
);

export const fetchSingleRFQ = createAsyncThunk(
  "rfq/fetchSingleRFQ",
  async (id, { rejectWithValue }) => {
    try {
      return await getSingleRFQAPI(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch RFQ"
      );
    }
  }
);

export const fetchBuyerRFQs = createAsyncThunk(
  "rfq/fetchBuyerRFQs",
  async (buyerOrgId, { rejectWithValue }) => {
    try {
      return await getBuyerRFQsAPI(buyerOrgId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch buyer RFQs"
      );
    }
  }
);

export const updateRFQStatus = createAsyncThunk(
  "rfq/updateRFQStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateRFQStatusAPI({ id, status });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update RFQ status"
      );
    }
  }
);

export const deleteRFQ = createAsyncThunk(
  "rfq/deleteRFQ",
  async (id, { rejectWithValue }) => {
    try {
      await deleteRFQAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete RFQ"
      );
    }
  }
);

const rfqSlice = createSlice({
  name: "rfq",
  initialState: {
    rfqs: [],
    selectedRFQ: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearRFQState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearSelectedRFQ: (state) => {
      state.selectedRFQ = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRFQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRFQ.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.rfqs.unshift(action.payload.rfq);
      })
      .addCase(createRFQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRFQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRFQs.fulfilled, (state, action) => {
        state.loading = false;
        state.rfqs = action.payload.rfqs || [];
      })
      .addCase(fetchRFQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSingleRFQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleRFQ.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRFQ = action.payload.rfq;
      })
      .addCase(fetchSingleRFQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBuyerRFQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuyerRFQs.fulfilled, (state, action) => {
        state.loading = false;
        state.rfqs = action.payload.rfqs || [];
      })
      .addCase(fetchBuyerRFQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateRFQStatus.fulfilled, (state, action) => {
        state.success = true;

        const updatedRFQ = action.payload.rfq;

        state.rfqs = state.rfqs.map((rfq) =>
          rfq.id === updatedRFQ.id ? updatedRFQ : rfq
        );

        if (state.selectedRFQ?.id === updatedRFQ.id) {
          state.selectedRFQ = updatedRFQ;
        }
      })

      .addCase(deleteRFQ.fulfilled, (state, action) => {
        state.success = true;
        state.rfqs = state.rfqs.filter((rfq) => rfq.id !== action.payload);
      });
  },
});

export const { clearRFQState, clearSelectedRFQ } = rfqSlice.actions;

export default rfqSlice.reducer;