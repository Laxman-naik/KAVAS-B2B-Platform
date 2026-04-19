// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   registerUserAPI,
//   loginUser,
//   logoutUser,
//   getMe,
// } from "@/services/authService";

// import {
//   loginAdminAPI,
//   logoutAdminAPI,
//   getAdminMe,
// } from "@/services/adminServer";

// /* ================= USER ================= */

// // Register user
// export const registerUserThunk = createAsyncThunk(
//   "auth/registerUser",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await registerUserAPI(data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Register failed");
//     }
//   }
// );

// // Login user
// export const loginUserThunk = createAsyncThunk(
//   "auth/loginUser",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await loginUser(data);
//       // console.log("LOGIN RESPONSE:", res.data);
//       const token = res.data.token || res.data.accessToken;
//       if (token) {
//         localStorage.setItem("token", token);
//       }
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Login failed");
//     }
//   }
// );

// // Load user
// export const loadUserThunk = createAsyncThunk(
//   "auth/loadUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getMe();
//       return res.data;
//     } catch {
//       return rejectWithValue("Not authenticated");
//     }
//   }
// );

// // Logout user
// export const logoutUserThunk = createAsyncThunk(
//   "auth/logoutUser",
//   async (_, { dispatch }) => {
//     await logoutUser();
//     dispatch(clearAuth());
//   }
// );

// /* ================= ADMIN ================= */

// // Login admin
// export const loginAdminThunk = createAsyncThunk(
//   "auth/loginAdmin",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await loginAdminAPI(data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Admin login failed");
//     }
//   }
// );

// // Load admin (ONLY ONE SOURCE OF TRUTH)
// export const loadAdminThunk = createAsyncThunk(
//   "auth/loadAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getAdminMe();
//       return res.data; // { user }
//     } catch {
//       return rejectWithValue("Not admin");
//     }
//   }
// );

// // Logout admin
// export const logoutAdminThunk = createAsyncThunk(
//   "auth/logoutAdmin",
//   async (_, { dispatch }) => {
//     await logoutAdminAPI();
//     dispatch(clearAuth());
//   }
// );

// /* ================= STATE ================= */

// const initialState = {
//   user: null,
//   role: null,
//   isAuthenticated: false,
//   loading: false,
//   error: null,
//   initialized: false,
// };

// /* ================= SLICE ================= */

// const authSlice = createSlice({
//   name: "auth",
//   initialState,

//   reducers: {
//     clearAuth: (state) => {
//       state.user = null;
//       state.role = null;
//       state.isAuthenticated = false;
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       /* ===== USER ===== */

//       .addCase(loginUserThunk.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(loginUserThunk.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.role = "user";
//         state.isAuthenticated = true;
//         state.loading = false;
//       })
//       .addCase(loginUserThunk.rejected, (state) => {
//         state.loading = false;
//         state.isAuthenticated = false;
//       })

//       .addCase(loadUserThunk.fulfilled, (state, action) => {
//         if (action.payload.user) {
//           state.user = action.payload.user;
//           state.role = "user";
//           state.isAuthenticated = true;
//         } else {
//           state.user = null;
//           state.role = null;
//           state.isAuthenticated = false;
//         }
//       })

//       .addCase(logoutUserThunk.fulfilled, (state) => {
//         state.user = null;
//         state.role = null;
//         state.isAuthenticated = false;
//       })

//       /* ===== ADMIN ===== */

//       .addCase(loginAdminThunk.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(loginAdminThunk.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.role = "admin";
//         state.isAuthenticated = true;
//         state.loading = false;
//       })
//       .addCase(loginAdminThunk.rejected, (state) => {
//         state.loading = false;
//       })

//       .addCase(loadAdminThunk.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(loadAdminThunk.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.role = "admin";
//         state.isAuthenticated = true;
//         state.loading = false;
//         state.initialized = true;
//       })
//       .addCase(loadAdminThunk.rejected, (state) => {
//         state.user = null;
//         state.role = null;
//         state.isAuthenticated = false;
//         state.loading = false;
//         state.initialized = true;
//       })

//       .addCase(logoutAdminThunk.fulfilled, (state) => {
//         state.user = null;
//         state.role = null;
//         state.isAuthenticated = false;
//       });
//   },
// });

// export const { clearAuth } = authSlice.actions;
// export default authSlice.reducer;



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

import { resetCart } from "./cartSlice";

/* ================= USER ================= */

// REGISTER
export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUserAPI(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Register failed");
    }
  }
);

// LOGIN
export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// LOAD USER
export const loadUserThunk = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMe();
      return res;
    } catch (err) {
      return rejectWithValue("Not authenticated");
    }
  }
);

// LOGOUT USER
export const logoutUserThunk = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    }

    // clear storage (IMPORTANT for JWT)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    dispatch(resetCart());
  }
);

/* ================= ADMIN ================= */

export const loginAdminThunk = createAsyncThunk(
  "auth/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginAdminAPI(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Admin login failed");
    }
  }
);

export const loadAdminThunk = createAsyncThunk(
  "auth/loadAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminMe();
      return res;
    } catch {
      return rejectWithValue("Not admin");
    }
  }
);

export const logoutAdminThunk = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { dispatch }) => {
    try {
      await logoutAdminAPI();
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    dispatch(resetCart());
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

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },

  extraReducers: (builder) => {
    builder

      /* REGISTER */
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGIN */
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || null;
        state.role = "user";
        state.isAuthenticated = !!action.payload?.user;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      /* LOAD USER */
      .addCase(loadUserThunk.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
        state.role = "user";
        state.isAuthenticated = !!action.payload?.user;
        state.initialized = true;
      })
      .addCase(loadUserThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })

      /* LOGOUT USER */
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })

      /* ADMIN LOGIN */
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
        state.role = "admin";
        state.isAuthenticated = true;
      })

      /* ADMIN LOAD */
      .addCase(loadAdminThunk.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
        state.role = "admin";
        state.isAuthenticated = true;
        state.initialized = true;
      })

      .addCase(loadAdminThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })

      /* ADMIN LOGOUT */
      .addCase(logoutAdminThunk.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;