// import axios from "axios";
// import { store } from "@/store/store";
// import { logout, setToken } from "@/store/slices/authSlice";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true,
// });

// // ✅ Attach access token to every request
// api.interceptors.request.use((config) => {
//   const token = store.getState().auth.token;

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // ✅ Handle expired token
// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalRequest = err.config;

//     if (err.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const res = await axios.post(
//           "http://localhost:5000/api/auth/refresh",
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = res.data.accessToken;

//         // 🔥 update redux
//         store.dispatch(setToken(newAccessToken));

//         // 🔥 retry with new token
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return api(originalRequest);
//       } catch (refreshError) {
//         store.dispatch(logout());
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(err);
//   }
// );

// export default api;

// src/lib/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const setupInterceptors = (store) => {
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await axios.post(
            "http://localhost:5000/api/auth/refresh",
            {},
            { withCredentials: true }
          );

          const newAccessToken = res.data.accessToken;

          store.dispatch({ type: "auth/setToken", payload: newAccessToken });

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch({ type: "auth/logout" });
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(err);
    }
  );
};

export default api;