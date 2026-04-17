import { productapi } from "../lib/axios";

export const getProducts = () => productapi.get("/api/products/all");

export const getSingleProduct = (id) => productapi.get(`/api/products/${id}`);

export const createProduct = (data) => productapi.post("/api/products", data);

export const updateProduct = (id, data) => productapi.put(`/api/products/${id}`, data);

export const deleteProduct = (id) => productapi.delete(`/api/products/${id}`);