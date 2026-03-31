import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser, registerUserAPI, getMe, } from "@/services/authService";

// ================== THUNKS ==================

export const loginUserThunk = createAsyncThunk( "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

export const loadUserThunk = createAsyncThunk( "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMe(); // 🔥 uses cookie
      return res.data;
    } catch (err) {
      return rejectWithValue("Not authenticated");
    }
  }
);

export const registerUserThunk = createAsyncThunk( "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUserAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Register failed");
    }
  }
);

export const logoutUserThunk = createAsyncThunk( "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  }
);

// ================== SLICE ==================

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  loginLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUserThunk.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })

      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken; 
        state.isAuthenticated = true;
        state.loginLoading = false;
      })

      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload || action.error;
       })

      // LOAD USER (🔥 KEY PART)
      .addCase(loadUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUserThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // LOGOUT
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;