import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getNotificationsAPI,
  getUnreadCountAPI,
  markAsReadAPI,
  markAllReadAPI,
  deleteNotificationAPI,
  deleteAllNotificationsAPI,
} from "../../services/notificationService";

/* ─── Thunks ─────────────────────────────────────────────────── */

export const fetchNotificationsThunk = createAsyncThunk(
  "notifications/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getNotificationsAPI(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load notifications");
    }
  }
);

export const fetchUnreadCountThunk = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      return await getUnreadCountAPI();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const markAsReadThunk = createAsyncThunk(
  "notifications/markRead",
  async (id, { rejectWithValue }) => {
    try {
      await markAsReadAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const markAllReadThunk = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      return await markAllReadAPI();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const deleteNotificationThunk = createAsyncThunk(
  "notifications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteNotificationAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const deleteAllNotificationsThunk = createAsyncThunk(
  "notifications/deleteAll",
  async (_, { rejectWithValue }) => {
    try {
      return await deleteAllNotificationsAPI();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/* ─── Slice ──────────────────────────────────────────────────── */

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items:      [],       // current page of notifications
    pagination: null,     // { page, limit, total, totalPages }
    unreadCount: 0,
    loading:    false,
    error:      null,
  },
  reducers: {},
  extraReducers: (builder) => {
    /* ── fetchAll ─────────────────────────────────── */
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading    = false;
        state.items      = action.payload.notifications;
        state.pagination = action.payload.pagination;
        state.unreadCount = action.payload.notifications.filter((n) => !n.is_read).length;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    /* ── fetchUnreadCount ────────────────────────── */
    builder.addCase(fetchUnreadCountThunk.fulfilled, (state, action) => {
      state.unreadCount = action.payload.unreadCount;
    });

    /* ── markAsRead ──────────────────────────────── */
    builder.addCase(markAsReadThunk.fulfilled, (state, action) => {
      const id = action.payload;
      const n  = state.items.find((x) => x.id === id);
      if (n && !n.is_read) {
        n.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    /* ── markAllRead ─────────────────────────────── */
    builder.addCase(markAllReadThunk.fulfilled, (state) => {
      state.items.forEach((n) => { n.is_read = true; });
      state.unreadCount = 0;
    });

    /* ── deleteNotification ──────────────────────── */
    builder.addCase(deleteNotificationThunk.fulfilled, (state, action) => {
      const id = action.payload;
      const idx = state.items.findIndex((x) => x.id === id);
      if (idx !== -1) {
        if (!state.items[idx].is_read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items.splice(idx, 1);
      }
    });

    /* ── deleteAll ───────────────────────────────── */
    builder.addCase(deleteAllNotificationsThunk.fulfilled, (state) => {
      state.items       = [];
      state.unreadCount = 0;
      state.pagination  = null;
    });
  },
});

export default notificationSlice.reducer;
