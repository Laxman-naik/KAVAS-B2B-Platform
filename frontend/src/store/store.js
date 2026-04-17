import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; 
import favouritesReducer from "./slices/favouritesSlice";
import cartReducer from "./slices/cartSlice";
import productssclices from "./slices/productSlice"
import categorySlice from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouritesReducer,
    cart: cartReducer,
    products: productssclices,
    category: categorySlice,
  },
});