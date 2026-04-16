import { authapi } from "../lib/axios";

export const getCartAPI = () =>
  authapi.get("/api/cart");

/**
 * Add product to cart
 * body: { productId, quantity }
 */
export const addToCartAPI = (data) =>
  authapi.post("/api/cart", data);

/**
 * Update cart item quantity
 * body: { quantity }
 */
export const updateCartItemAPI = (itemId, data) =>
  authapi.put(`/api/cart/item/${itemId}`, data);

/**
 * Remove single cart item
 */
export const removeCartItemAPI = (itemId) =>
  authapi.delete(`/api/cart/item/${itemId}`);

/**
 * Clear all carts
 */
export const clearCartAPI = () =>
  authapi.delete("/api/cart/clear");