import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUserAPI, loginUser, logoutUser, getMe,} from "@/services/authService";
import { loginAdminAPI, logoutAdminAPI, getAdminMeAPI, getAllUsersAPI, getOnboardingVendorsAPI, approveVendorAPI,} from "@/services/adminServer";

import { resetCart } from "./cartSlice";

/* ================= USER ================= */

// REGISTER
export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      return await registerUserAPI(data);
    } catch (err) {
      return rejectWithValue(err.message || "Register failed");
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
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

// LOAD USER
export const loadUserThunk = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const role = localStorage.getItem("role");

      if (!role) {
        return rejectWithValue("No role");
      }

      const token = localStorage.getItem(
        `${role}_accessToken`
      );

      if (!token) {
        return rejectWithValue("No token");
      }

      return await getMe();

    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
        err.message ||
        "Not authenticated"
      );
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

    const role = localStorage.getItem("role");

if (role) {
  localStorage.removeItem(`${role}_accessToken`);
  localStorage.removeItem(`${role}_refreshToken`);
}

localStorage.removeItem("role");

    dispatch(resetCart());
  }
);

/* ================= ADMIN ================= */

// LOGIN
export const loginAdminThunk = createAsyncThunk(
  "auth/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginAdminAPI(data);

      const { user, accessToken, refreshToken } = res;

      localStorage.setItem("role", "admin");

      localStorage.setItem("admin_accessToken", accessToken);
      localStorage.setItem("admin_refreshToken", refreshToken);

      return { user };
    } catch (err) {
      return rejectWithValue(err.message || "Admin login failed");
    }
  }
);

// LOAD ADMIN
export const loadAdminThunk = createAsyncThunk(
  "auth/loadAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const role = localStorage.getItem("role");

      if (role !== "admin") {
        return rejectWithValue("Not admin");
      }

      const token = localStorage.getItem("admin_accessToken");

      if (!token) {
        return rejectWithValue("No admin token");
      }

      return await getAdminMeAPI();

    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Admin session invalid"
      );
    }
  }
);

// LOGOUT ADMIN
export const logoutAdminThunk = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { dispatch }) => {
    try {
      await logoutAdminAPI();
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("admin_accessToken");
localStorage.removeItem("admin_refreshToken");
localStorage.removeItem("role");

    dispatch(resetCart());
  }
);

// USERS
export const fetchUsersThunk = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllUsersAPI(); // { users }
      return res.users;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch users");
    }
  }
);

// ONBOARDING VENDORS
export const fetchOnboardingVendorsThunk = createAsyncThunk(
  "admin/fetchOnboardingVendors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getOnboardingVendorsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch onboarding vendors"
      );
    }
  }
);

// ================= UPDATE VENDOR STATUS =================

export const updateVendorStatusThunk = createAsyncThunk(
  "admin/updateVendorStatus",
  async (
    { onboarding_id, status, rejection_reason },
    { rejectWithValue }
  ) => {
    try {
      const res = await approveVendorAPI({
        onboarding_id,
        status,
        rejection_reason,
      });

      return {
        onboarding_id,
        status,
        rejection_reason,
        message: res.message,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to update vendor status"
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

  // admin data
  users: [],
  onboardingVendors: [],
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

    const role = localStorage.getItem("role");

    if (role) {
      localStorage.removeItem(`${role}_accessToken`);
      localStorage.removeItem(`${role}_refreshToken`);
    }

    localStorage.removeItem("role");
  },
},

  extraReducers: (builder) => {
    builder

      /* USER LOGIN */
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || null;
        state.role = action.payload?.role || "buyer";
        state.isAuthenticated = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOAD USER */
      .addCase(loadUserThunk.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
        state.role = "buyer";
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(loadUserThunk.rejected, (state) => {
        state.initialized = true;
      })

      /* ADMIN LOGIN */
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
      .addCase(loadAdminThunk.rejected, (state) => {
        state.initialized = true;
      })

      /* LOGOUT (both) */
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutAdminThunk.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })

      /* USERS */
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
      })

      /* ONBOARDING VENDORS */
      .addCase(fetchOnboardingVendorsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOnboardingVendorsThunk.fulfilled, (state, action) => {
        state.onboardingVendors = action.payload;
        state.loading = false;
      })
      .addCase(fetchOnboardingVendorsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE VENDOR STATUS */
.addCase(updateVendorStatusThunk.pending, (state) => {
  state.loading = true;
})

.addCase(updateVendorStatusThunk.fulfilled, (state, action) => {
  state.loading = false;

  const { onboarding_id, status } = action.payload;

  state.onboardingVendors = state.onboardingVendors.map((vendor) =>
    vendor.onboarding_id === onboarding_id
      ? {
          ...vendor,
          status,
        }
      : vendor
  );
})

.addCase(updateVendorStatusThunk.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;