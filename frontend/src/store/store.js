import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";  
import adminReducer from "./slices/adminSlice"; 
import favouritesReducer from "./slices/favouritesSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    favourites: favouritesReducer,
    cart: cartReducer,
  },
});