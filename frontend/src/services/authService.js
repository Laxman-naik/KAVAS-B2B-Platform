import {authapi, saveAuthData, clearAuthData,} from "../lib/axios";

/* ================= REGISTER ================= */

export const registerUserAPI = async (data) => {
  const res = await authapi.post(
    "/api/auth/register",
    data,
    {
      skipAuth: true,
    }
  );

  return res.data;
};

/* ================= LOGIN ================= */

// export const loginUser = async (data) => {
//   const res = await authapi.post(
//     "/api/auth/login",
//     data,
//     {
//       skipAuth: true,
//     }
//   );
//   saveAuthData({
//     role: res.data.role,
//     accessToken: res.data.accessToken,
//     refreshToken: res.data.refreshToken,
//   });

//   return res.data;
// };
export const loginUser = async (data) => {
  const res = await authapi.post(
    "/api/auth/login",
    data,
    { skipAuth: true }
  );

  const role = res.data?.user?.role;

  if (!role) {
    throw new Error("Role missing from response");
  }

  saveAuthData({
    role,
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,

  });

    console.log("LOGIN RESPONSE:", res.data);
  console.log("LOCAL ROLE:", localStorage.getItem("role"));
  console.log(
    "ACCESS TOKEN:",
    localStorage.getItem(`${role}_accessToken`)
  );
  console.log(
    "REFRESH TOKEN:",
    localStorage.getItem(`${role}_refreshToken`)
  );


  return {
    user: res.data.user,
    role,
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
  };
};

/* ================= GET ME ================= */

export const getMe = async () => {
  const res = await authapi.get("/api/auth/me");

  return res.data;
};

/* ================= MANUAL REFRESH ================= */

export const refreshTokenAPI = async () => {
  const role = localStorage.getItem("role");

  if (!role) {
    throw new Error("No role found");
  }

  const refreshToken = localStorage.getItem(
    `${role}_refreshToken`
  );

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const refreshRoutes = {
    buyer: "/api/auth/refresh",
  };

  const res = await authapi.post(
    refreshRoutes[role],
    {
      refreshToken,
    },
    {
      skipAuth: true,
    }
  );

  localStorage.setItem(
    `${role}_accessToken`,
    res.data.accessToken
  );

  return res.data.accessToken;
};

/* ================= LOGOUT ================= */

export const logoutUser = () => {
  clearAuthData();
};

