import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; 
import favouritesReducer from "./slices/favouritesSlice";
import cartReducer from "./slices/cartSlice";
import productssclices from "./slices/productSlice"
import categorySlice from "./slices/categorySlice";
import addressSclice from "./slices/addressSlice";
import paymentReducer from "./slices/paymentSlice"
import orderReducer from "./slices/orderSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouritesReducer,
    cart: cartReducer,
    products: productssclices,
    category: categorySlice,
    address: addressSclice,
    payment: paymentReducer,
    order: orderReducer,
  },
});