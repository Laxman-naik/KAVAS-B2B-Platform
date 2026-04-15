import { productapi } from "../lib/axios";

// Get all products
export const getProducts = () =>
  productapi.get("/api/products/all");

// Get single product
export const getSingleProduct = (id) =>
  productapi.get(`/${id}`);

// Create product (Protected)
export const createProduct = (data) =>
  productapi.post("/", data);

// Update product (Protected)
export const updateProduct = (id, data) =>
  productapi.put(`/${id}`, data);

// Delete product (Protected)
export const deleteProduct = (id) =>
  productapi.delete(`/${id}`);