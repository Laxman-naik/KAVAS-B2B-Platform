// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// export const setupInterceptors = (store) => {
//   api.interceptors.request.use((config) => {
//     const token = store.getState().auth.token;
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   });

//   api.interceptors.response.use(
//     (res) => res,
//     async (err) => {
//       const originalRequest = err.config;

//       if (err.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;

//         try {
//           const res = await axios.post(
//             "http://localhost:5000/api/auth/refresh",
//             {},
//             { withCredentials: true }
//           );

//           const newAccessToken = res.data.accessToken;

//           store.dispatch({ type: "auth/setToken", payload: newAccessToken });

//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return api(originalRequest);
//         } catch (refreshError) {
//           store.dispatch({ type: "auth/logout" });
//           return Promise.reject(refreshError);
//         }
//       }

//       return Promise.reject(err);
//     }
//   );
// };

// export default api;

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const setupInterceptors = (store) => {

  api.interceptors.request.use(
    (config) => {
      const token = store.getState().auth?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry && !originalRequest.url.includes("/auth/refresh")
      ) {
        originalRequest._retry = true;

        try {
          const res = await axios.post(
            `${API_BASE_URL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = res.data?.accessToken;

          store.dispatch({
            type: "auth/setToken",
            payload: newAccessToken,
          });

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);

        } catch (refreshError) {
          store.dispatch({ type: "auth/logout" });
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default api;