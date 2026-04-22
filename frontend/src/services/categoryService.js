import { productapi } from "../lib/axios";

export const createCategory = (data) =>
  productapi.post("/api/categories", data);

export const getAllCategories = () =>
  productapi.get("/api/categories");

export const getMainCategories = () =>
  productapi.get("/api/categories/main");

export const getSubcategoriesByParent = (parentId) =>
  productapi.get(`/api/categories/subcategories/${parentId}`);

export const getCategoryById = (id) =>
  productapi.get(`/api/categories/${id}`);

export const getCategoryBySlug = (slug) =>
  productapi.get(`/api/categories/slug/${slug}`);

export const updateCategory = (id, data) =>
  productapi.put(`/api/categories/${id}`, data);

export const deleteCategory = (id) =>
  productapi.delete(`/api/categories/${id}`);