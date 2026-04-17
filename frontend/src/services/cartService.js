import { productapi } from "../lib/axios";

/* CART */
export const getCart = () =>
  productapi.get("/api/cart");

export const getCartCount = () =>
  productapi.get("/api/cart/count");

export const getCartSummary = () =>
  productapi.get("/api/cart/summary");

export const addToCartAPI = (data) =>
  productapi.post("/api/cart", data);

export const updateCartItemAPI = (itemId, data) =>
  productapi.put(`/api/cart/${itemId}`, data);

export const removeCartItemAPI = (itemId) =>
  productapi.delete(`/api/cart/${itemId}`);

export const clearCartAPI = () =>
  productapi.delete("/api/cart/clear");

export const mergeCartAPI = (items) =>
  productapi.post("/api/cart/merge", { items });