import { productapi } from "../lib/axios";

export const getCartAPI = () =>
  productapi.get("/api/cart");

export const addToCartAPI = (data) =>
  productapi.post("/api/cart", data);

export const updateCartItemAPI = (itemId, data) =>
  productapi.put(`/api/cart/${itemId}`, data);

export const removeCartItemAPI = (itemId) =>
  productapi.delete(`/api/cart/${itemId}`);


export const clearCartAPI = () =>
  productapi.delete("/api/cart/clear");