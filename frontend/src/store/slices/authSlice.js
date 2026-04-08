// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { registerUserAPI, loginUser, logoutUser, getMe,} from "@/services/authService";
// import { loginAdminAPI, logoutAdminAPI, getAdminMe,} from "@/services/adminServer";

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
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Login failed");
//     }
//   }
// );

// // Get logged-in user
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

// export const getAdminMeThunk = createAsyncThunk(
//   "auth/getAdminMe",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getAdminMe();
//       return res.data.user;
//     } catch (err) {
//       return rejectWithValue(err.response?.data);
//     }
//   }
// );

// // Get logged-in admin
// export const loadAdminThunk = createAsyncThunk(
//   "auth/loadAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getAdminMe();
//       return res.data;
//     } catch {
//       return rejectWithValue("Not admin");
//     }
//   }
// );

// // Logout admin
// export const logoutAdminThunk = createAsyncThunk(
//   "auth/logoutAdmin",
//   async () => {
//     await logoutAdminAPI();
//   }
// );

// /* ================= STATE ================= */

// const initialState = {
//   user: null,
//   role: null, 
//   isAuthenticated: false,

//   loading: false,
//   authLoading: false,
//   error: null,
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

//       /* ================= USER ================= */

//       .addCase(registerUserThunk.fulfilled, (state) => {
//         // optional: auto-login after register if backend returns session
//       })

//       .addCase(loginUserThunk.pending, (state) => {
//         state.loading= true;
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

//       /* ================= ADMIN ================= */

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

//       .addCase(getAdminMeThunk.fulfilled, (state, action) => {
//   state.loading = false;
//   state.user = action.payload;
//   state.role = action.payload?.role;
//   state.isAuthenticated = true;
// })

//       .addCase(loadAdminThunk.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(loadAdminThunk.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.role = "admin";
//         state.isAuthenticated = true;
//         state.loading = false;
//       })
//       .addCase(loadAdminThunk.rejected, (state) => {
//         state.user = null;
//         state.role = null;
//         state.isAuthenticated = false;
//         state.loading = false;
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

// Logout admin
export const logoutAdminThunk = createAsyncThunk(
  "auth/logoutAdmin",
  async () => {
    await logoutAdminAPI();
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

      // .addCase(loadAdminThunk.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(loadAdminThunk.fulfilled, (state, action) => {
      //   state.user = action.payload.user;
      //   state.role = "admin";
      //   state.isAuthenticated = true;
      //   state.loading = false;
      // })
      // .addCase(loadAdminThunk.rejected, (state) => {
      //   state.user = null;
      //   state.role = null;
      //   state.isAuthenticated = false;
      //   state.loading = false;
      // })

      .addCase(logoutAdminThunk.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;