import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUserAPI,
  loginUser,
  logoutUser,
  getMe,
} from "@/services/authService";

import {
  loginAdminAPI,
  logoutAdminAPI,
  getAdminMe,
} from "@/services/adminServer";

/* ================= USER ================= */

// Register user
export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUserAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Register failed");
    }
  }
);

// Login user
export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      // console.log("LOGIN RESPONSE:", res.data);
      const token = res.data.token || res.data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// Load user
export const loadUserThunk = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMe();
      return res.data;
    } catch {
      return rejectWithValue("Not authenticated");
    }
  }
);

// Logout user
export const logoutUserThunk = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    await logoutUser();
    dispatch(clearAuth());
  }
);

/* ================= ADMIN ================= */

// Login admin
export const loginAdminThunk = createAsyncThunk(
  "auth/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginAdminAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Admin login failed");
    }
  }
);

// Load admin (ONLY ONE SOURCE OF TRUTH)
export const loadAdminThunk = createAsyncThunk(
  "auth/loadAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminMe();
      return res.data; // { user }
    } catch {
      return rejectWithValue("Not admin");
    }
  }
);

// Logout admin
export const logoutAdminThunk = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { dispatch }) => {
    await logoutAdminAPI();
    dispatch(clearAuth());
  }
);

/* ================= STATE ================= */

const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
};

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== USER ===== */

      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = "user";
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUserThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })

      .addCase(loadUserThunk.fulfilled, (state, action) => {
        if (action.payload.user) {
          state.user = action.payload.user;
          state.role = "user";
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.role = null;
          state.isAuthenticated = false;
        }
      })

      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })

      /* ===== ADMIN ===== */

      .addCase(loginAdminThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = "admin";
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginAdminThunk.rejected, (state) => {
        state.loading = false;
      })

      .addCase(loadAdminThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAdminThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = "admin";
        state.isAuthenticated = true;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(loadAdminThunk.rejected, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.initialized = true;
      })

      .addCase(logoutAdminThunk.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;