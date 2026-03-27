// import axios from "axios";

// const api = axios.create({baseURL: "http://localhost:5000/api", withCredentials: true,});

// export default api;

// lib/axios.js
import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/slices/authSlice";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // If token expired
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // retry original request
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;