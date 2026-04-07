import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; 
import favouritesReducer from "./slices/favouritesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouritesReducer,
  },
});