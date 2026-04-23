import { productapi } from "../lib/axios";

export const getFavouritesAPI = () => {
  return productapi.get("/api/favourites");
};

export const addToFavouritesAPI = (productId) => {
  if (!productId) throw new Error("productId is required");
  return productapi.post("/api/favourites/add", { productId });
};

export const removeFromFavouritesAPI = (productId) => {
  if (!productId) throw new Error("productId is required");
  return productapi.delete(`/api/favourites/remove/${productId}`);
};

export const clearFavouritesAPI = () => {
  return productapi.delete("/api/favourites/clear");
};