// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import { loginUser, logoutUser, registerUserAPI, getMe, } from "@/services/authService";

// // // ================== THUNKS ==================

// // export const loginUserThunk = createAsyncThunk( "auth/loginUser",
// //   async (data, { rejectWithValue }) => {
// //     try {
// //       const res = await loginUser(data);
// //       return res.data;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data || "Login failed");
// //     }
// //   }
// // );

// // export const loadUserThunk = createAsyncThunk( "auth/loadUser",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const res = await getMe(); // 🔥 uses cookie
// //       return res.data;
// //     } catch (err) {
// //       return rejectWithValue("Not authenticated");
// //     }
// //   }
// // );

// // export const registerUserThunk = createAsyncThunk( "auth/registerUser",
// //   async (data, { rejectWithValue }) => {
// //     try {
// //       const res = await registerUserAPI(data);
// //       return res.data;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data || "Register failed");
// //     }
// //   }
// // );

// // // export const logoutUserThunk = createAsyncThunk( "auth/logoutUser",
// // //   async (_, { rejectWithValue }) => {
// // //     try {
// // //       await logoutUser();
// // //       return true;
// // //     } catch (err) {
// // //       return rejectWithValue(err.response?.data || "Logout failed");
// // //     }
// // //   }
// // // );
// // export const logoutUserThunk = createAsyncThunk(
// //   "auth/logoutUser",
// //   async (_, { rejectWithValue, dispatch }) => {
// //     try {
// //       await logoutUser();

// //       // 🔥 IMPORTANT CLEANUP
// //       if (typeof window !== "undefined") {
// //         localStorage.removeItem("token");
// //       }

// //       dispatch(logout()); 

// //       return true;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data || "Logout failed");
// //     }
// //   }
// // );

// // // ================== SLICE ==================

// // const initialState = {
// //    user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) || null : null,
// //   token: typeof window !== "undefined" ? localStorage.getItem("token") || null : null,
// //   isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("user") : false,
// //   loading: false, 
// //   loginLoading: false,
// //   error: null,
// // };

// // const authSlice = createSlice({
// //   name: "auth",
// //   initialState,

// //   reducers: {
// //     logout: (state) => {
// //       state.user = null;
// //       state.token = null;
// //       state.isAuthenticated = false;
// //     },

// //     setUser: (state, action) => {
// //       state.user = action.payload;
// //       state.isAuthenticated = true;
// //     },

// //     setToken: (state, action) => {
// //       state.token = action.payload;
// //     },
// //   },

// //   extraReducers: (builder) => {
// //     builder

// //       // LOGIN
// //       .addCase(loginUserThunk.pending, (state) => {
// //         state.loginLoading = true;
// //         state.error = null;
// //       })

// //       .addCase(loginUserThunk.fulfilled, (state, action) => {
// //         state.user = action.payload.user;
// //         state.token = action.payload.accessToken; 
// //         state.isAuthenticated = true;
// //         state.loginLoading = false;
// //         localStorage.setItem("user", JSON.stringify(action.payload.user));
// //         localStorage.setItem("token", action.payload.accessToken);
// //       })

// //       .addCase(loginUserThunk.rejected, (state, action) => {
// //         state.loginLoading = false;
// //         state.error = action.payload || action.error;
// //        })

// //       // LOAD USER (🔥 KEY PART)
// //       .addCase(loadUserThunk.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(loadUserThunk.fulfilled, (state, action) => {
// //         state.user = action.payload.user;
// //         state.isAuthenticated = true;
// //         state.loading = false;
// //       })
// //       .addCase(loadUserThunk.rejected, (state) => {
// //         state.user = null;
// //         state.isAuthenticated = false;
// //         state.loading = false;
// //       })

// //       // LOGOUT
// //       .addCase(logoutUserThunk.fulfilled, (state) => {
// //         state.user = null;
// //         state.token = null;
// //         state.isAuthenticated = false;
// //          state.loading = false;
// //       });
// //   },
// // });

// // export const { logout, setUser, setToken } = authSlice.actions;
// // export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   loginUser,
//   logoutUser,
//   registerUserAPI,
//   getMe,
// } from "@/services/authService";

// // ================== THUNKS ==================

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

// export const loadUserThunk = createAsyncThunk(
//   "auth/loadUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getMe();
//       return res.data;
//     } catch (err) {
//       return rejectWithValue("Not authenticated");
//     }
//   }
// );

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

// export const logoutUserThunk = createAsyncThunk(
//   "auth/logoutUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       await logoutUser();
//       return true;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Logout failed");
//     }
//   }
// );

// // ================== STATE ==================

// const initialState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   loading: false,
//   loginLoading: false,
//   error: null,
// };

// // ================== SLICE ==================

// const authSlice = createSlice({
//   name: "auth",
//   initialState,

//   reducers: {
//     logoutLocal: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;

//       if (typeof window !== "undefined") {
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//       }
//     },

//     setUser: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       // LOGIN
//       .addCase(loginUserThunk.pending, (state) => {
//         state.loginLoading = true;
//         state.error = null;
//       })

//       .addCase(loginUserThunk.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.token = action.payload.accessToken;
//         state.isAuthenticated = true;
//         state.loginLoading = false;

//         if (typeof window !== "undefined") {
//           localStorage.setItem("user", JSON.stringify(action.payload.user));
//           localStorage.setItem("token", action.payload.accessToken);
//         }
//       })

//       .addCase(loginUserThunk.rejected, (state, action) => {
//         state.loginLoading = false;
//         state.error = action.payload;
//       })

//       // LOAD USER
//       .addCase(loadUserThunk.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(loadUserThunk.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.isAuthenticated = true;
//         state.loading = false;
//       })

//       .addCase(loadUserThunk.rejected, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//         state.loading = false;
//       })

//       // LOGOUT
//       .addCase(logoutUserThunk.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//         state.isAuthenticated = false;

//         if (typeof window !== "undefined") {
//           localStorage.removeItem("user");
//           localStorage.removeItem("token");
//         }
//       });
//   },
// });

// export const { logoutLocal, setUser } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUserAPI, loginUser, logoutUser, getMe,} from "@/services/authService";
import { loginAdminAPI, logoutAdminAPI, getAdminMe,} from "@/services/adminServer";

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

// Get logged-in user
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
  async () => {
    await logoutUser();
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

// Get logged-in admin
export const loadAdminThunk = createAsyncThunk(
  "auth/loadAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminMe();
      return res.data;
    } catch {
      return rejectWithValue("Not admin");
    }
  }
);

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
  role: null, // "user" | "admin"
  isAuthenticated: false,

  loading: false,
  authLoading: false,
  error: null,
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

      /* ================= USER ================= */

      .addCase(registerUserThunk.fulfilled, (state) => {
        // optional: auto-login after register if backend returns session
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = "user";
        state.isAuthenticated = true;
        state.authLoading = false;
      })
      .addCase(loginUserThunk.rejected, (state) => {
        state.authLoading = false;
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

      /* ================= ADMIN ================= */

      .addCase(loginAdminThunk.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = "admin";
        state.isAuthenticated = true;
        state.authLoading = false;
      })
      .addCase(loginAdminThunk.rejected, (state) => {
        state.authLoading = false;
      })

      .addCase(loadAdminThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = "admin";
        state.isAuthenticated = true;
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