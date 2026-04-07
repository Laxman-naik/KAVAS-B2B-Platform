// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { loginAdminAPI, logoutAdminAPI, getAdminProfile, } from "../../services/adminServer";

// // ================== THUNKS ==================

// // Admin Login
// export const loginAdminThunk = createAsyncThunk(
//   "admin/loginAdmin",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await loginAdminAPI(data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Admin login failed");
//     }
//   }
// );

// // Load Admin Profile
// export const loadAdminThunk = createAsyncThunk(
//   "admin/loadAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getAdminProfile();
//       return res.data;
//     } catch {
//       return rejectWithValue("Admin not authenticated");
//     }
//   }
// );

// // Admin Logout
// export const logoutAdminThunk = createAsyncThunk(
//   "admin/logoutAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       await logoutAdminAPI();
//       return true;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Logout failed");
//     }
//   }
// );

// // ================== INITIAL STATE ==================

// const initialState = {
//   admin: typeof window !== "undefined"
//     ? JSON.parse(localStorage.getItem("admin"))
//     : null,

//   token: typeof window !== "undefined"
//     ? localStorage.getItem("token")
//     : null,

//   isAdminAuthenticated: typeof window !== "undefined"
//     ? !!localStorage.getItem("admin")
//     : false,

//   loading: false,
//   loginLoading: false,
//   error: null,
// };

// // ================== SLICE ==================

// const adminSlice = createSlice({
//   name: "admin",
//   initialState,

//   reducers: {
//     // Local logout (Redux only)
//     adminLogout: (state) => {
//       state.admin = null;
//       state.token = null;
//       state.isAdminAuthenticated = false;
//     },

//     setAdmin: (state, action) => {
//       state.admin = action.payload;
//       state.isAdminAuthenticated = true;
//     },

//     setAdminToken: (state, action) => {
//       state.token = action.payload;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       // LOGIN ADMIN
//       .addCase(loginAdminThunk.pending, (state) => {
//         state.loginLoading = true;
//         state.error = null;
//       })
//       .addCase(loginAdminThunk.fulfilled, (state, action) => {
//         state.admin = action.payload.user;
//         state.token = action.payload.accessToken;
//         state.isAdminAuthenticated = true;
//         state.loginLoading = false;
//         // localStorage.setItem("admin", JSON.stringify(action.payload.user));
//         // localStorage.setItem("token", action.payload.accessToken);
//       })
//       .addCase(loginAdminThunk.rejected, (state, action) => {
//         state.loginLoading = false;
//         state.error = action.payload?.message || action.payload || action.error.message;
//       })

//       // LOAD ADMIN PROFILE
//       .addCase(loadAdminThunk.pending, (state) => {
//         state.loading = true;
//       }) 
//       .addCase(loadAdminThunk.fulfilled, (state, action) => {
//         state.admin = action.payload.user;
//         state.isAdminAuthenticated = true;
//         state.loading = false;
//       })
//       .addCase(loadAdminThunk.rejected, (state) => {
//         state.admin = null;
//         state.isAdminAuthenticated = false;
//         state.loading = false;
//       })

//       // LOGOUT ADMIN
//       .addCase(logoutAdminThunk.fulfilled, (state) => {
//         state.admin = null;
//         state.token = null;
//         state.isAdminAuthenticated = false;
//         // localStorage.removeItem("admin");
//         // localStorage.removeItem("token");
//       });
//   },
// });

// // ================== EXPORTS ==================

// export const { adminLogout, setAdmin, setAdminToken } = adminSlice.actions;
// export default adminSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAdminAPI,
  logoutAdminAPI,
  getAdminProfile,
} from "../../services/adminServer";

// ================== THUNKS ==================

// LOGIN ADMIN (cookie-based auth)
export const loginAdminThunk = createAsyncThunk(
  "admin/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginAdminAPI(data);

      if (!res || !res.data) {
        return rejectWithValue("Invalid server response");
      }

      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Admin login failed"
      );
    }
  }
);

// LOAD ADMIN PROFILE (from cookie session)
export const loadAdminThunk = createAsyncThunk(
  "admin/loadAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminProfile();
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Admin not authenticated"
      );
    }
  }
);

// LOGOUT ADMIN (clears backend cookies + DB refresh token)
export const logoutAdminThunk = createAsyncThunk(
  "admin/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      await logoutAdminAPI();
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Logout failed"
      );
    }
  }
);

// ================== INITIAL STATE ==================

const initialState = {
  admin: null,
  isAdminAuthenticated: false,
  loading: false,
  loginLoading: false,
  error: null,
};

// ================== SLICE ==================

const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    // local reset only (NOT real logout)
    adminLogout: (state) => {
      state.admin = null;
      state.isAdminAuthenticated = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================== LOGIN ==================
      .addCase(loginAdminThunk.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.isAdminAuthenticated = true;
        state.loginLoading = false;
      })
      .addCase(loginAdminThunk.rejected, (state, action) => {
        state.loginLoading = false;
        state.error =
          action.payload?.message ||
          action.payload ||
          action.error.message;
      })

      // ================== LOAD ADMIN ==================
      .addCase(loadAdminThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAdminThunk.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.isAdminAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadAdminThunk.rejected, (state) => {
        state.admin = null;
        state.isAdminAuthenticated = false;
        state.loading = false;
      })

      // ================== LOGOUT ==================
      .addCase(logoutAdminThunk.fulfilled, (state) => {
        state.admin = null;
        state.isAdminAuthenticated = false;
      });
  },
});

// ================== EXPORTS ==================

export const { adminLogout } = adminSlice.actions;
export default adminSlice.reducer;