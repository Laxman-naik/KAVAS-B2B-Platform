// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { registerUserAPI, loginUser, logoutUser, getMe, } from "@/services/authService";
// import { loginAdminAPI, logoutAdminAPI, getAdminMe, } from "@/services/adminServer";
// import { resetCart } from "./cartSlice";

// /* ================= USER ================= */

// // REGISTER
// export const registerUserThunk = createAsyncThunk(
//   "auth/registerUser",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await registerUserAPI(data);
//       return res;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Register failed");
//     }
//   }
// );

// // LOGIN
// export const loginUserThunk = createAsyncThunk(
//   "auth/loginUser",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await loginUser(data);
//       return res;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Login failed");
//     }
//   }
// );

// // LOAD USER
// export const loadUserThunk = createAsyncThunk(
//   "auth/loadUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getMe();
//       return res;
//     } catch (err) {
//       return rejectWithValue("Not authenticated");
//     }
//   }
// );

// // LOGOUT USER
// export const logoutUserThunk = createAsyncThunk(
//   "auth/logoutUser",
//   async (_, { dispatch }) => {
//     try {
//       await logoutUser();
//     } catch (err) {
//       console.error(err);
//     }

//     // clear storage (IMPORTANT for JWT)
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");

//     dispatch(resetCart());
//   }
// );

// /* ================= ADMIN ================= */

// // LOGIN
// export const loginAdminThunk = createAsyncThunk(
//   "auth/loginAdmin",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await loginAdminAPI(data);

//       const { user, accessToken, refreshToken } = res.data;

//       // ✅ STORE TOKENS
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       return { user };
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Admin login failed");
//     }
//   }
// );

// // LOAD ADMIN
// export const loadAdminThunk = createAsyncThunk(
//   "auth/loadAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) return rejectWithValue("No token");

//       const res = await getAdminMe();
//       return res.data;
//     } catch {
//       return rejectWithValue("Not admin");
//     }
//   }
// );

// // LOGOUT ADMIN
// export const logoutAdminThunk = createAsyncThunk(
//   "auth/logoutAdmin",
//   async (_, { dispatch }) => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       await logoutAdminAPI({ refreshToken });
//     } catch (err) {
//       console.error(err);
//     }

//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");

//     dispatch(resetCart());
//   }
// );

// export const fetchUsersThunk = createAsyncThunk(
//   "admin/fetchUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getAllUsersAPI();
//       return res.data.users;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch users"
//       );
//     }
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
//   users: [],
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

//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       /* REGISTER */
//       .addCase(registerUserThunk.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(registerUserThunk.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(registerUserThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       /* LOGIN */
//       .addCase(loginUserThunk.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUserThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload?.user || null;
//         state.role = "user";
//         state.isAuthenticated = !!action.payload?.user;
//       })
//       .addCase(loginUserThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.isAuthenticated = false;
//       })

//       /* LOAD USER */
//       .addCase(loadUserThunk.fulfilled, (state, action) => {
//         state.user = action.payload?.user || null;
//         state.role = "user";
//         state.isAuthenticated = !!action.payload?.user;
//         state.initialized = true;
//       })
//       .addCase(loadUserThunk.rejected, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//         state.initialized = true;
//       })

//       /* LOGOUT USER */
//       .addCase(logoutUserThunk.fulfilled, (state) => {
//         state.user = null;
//         state.role = null;
//         state.isAuthenticated = false;
//       })

//       /* ADMIN LOGIN */
//       .addCase(loginAdminThunk.fulfilled, (state, action) => {
//         state.user = action.payload?.user || null;
//         state.role = "admin";
//         state.isAuthenticated = true;
//       })

//       /* ADMIN LOAD */
//       .addCase(loadAdminThunk.fulfilled, (state, action) => {
//         state.user = action.payload?.user || null;
//         state.role = "admin";
//         state.isAuthenticated = true;
//         state.initialized = true;
//       })

//       .addCase(loadAdminThunk.rejected, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//         state.initialized = true;
//       })

//       /* ADMIN LOGOUT */
//       .addCase(logoutAdminThunk.fulfilled, (state) => {
//         state.user = null;
//         state.role = null;
//         state.isAuthenticated = false;
//       })

//       .addCase(fetchUsersThunk.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchUsersThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload;
//       })
//       .addCase(fetchUsersThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
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
  getAllUsersAPI, // ✅ FIXED
} from "@/services/adminServer";

import { resetCart } from "./cartSlice";

/* ================= USER ================= */

// REGISTER
export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUserAPI(data);
      return res.data; // ✅ FIXED
    } catch (err) {
      return rejectWithValue(err.response?.data || "Register failed");
    }
  }
);

// LOGIN USER
export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);

      const { user, accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { user }; // ✅ clean
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
      return res.data;
    } catch {
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

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    dispatch(resetCart());
  }
);

/* ================= ADMIN ================= */

// LOGIN ADMIN
export const loginAdminThunk = createAsyncThunk(
  "auth/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginAdminAPI(data);

      const { user, accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { user };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Admin login failed");
    }
  }
);

// LOAD ADMIN
export const loadAdminThunk = createAsyncThunk(
  "auth/loadAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No token");

      const res = await getAdminMe();
      return res.data;
    } catch {
      return rejectWithValue("Not admin");
    }
  }
);

// LOGOUT ADMIN
export const logoutAdminThunk = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { dispatch }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logoutAdminAPI({ refreshToken });
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    dispatch(resetCart());
  }
);

/* ================= FETCH USERS ================= */

export const fetchUsersThunk = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No token"); // ✅ FIXED

      const res = await getAllUsersAPI();
      console.log("API RESPONSE:", res); // 👈 full axios response
      console.log("USERS DATA:", res.data.users); // 👈 actual data
      return res.data.users;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
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

  users: [], // admin data
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

      /* LOGIN USER */
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = "user";
        state.isAuthenticated = true;
      })

      /* LOAD USER */
      .addCase(loadUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = "user";
        state.isAuthenticated = true;
        state.initialized = true;
      })

      /* LOGIN ADMIN */
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = "admin";
        state.isAuthenticated = true;
      })

      /* LOAD ADMIN */
      .addCase(loadAdminThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = "admin";
        state.isAuthenticated = true;
        state.initialized = true;
      })

      /* LOGOUT */
      .addCase(logoutAdminThunk.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })

      /* FETCH USERS */
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;