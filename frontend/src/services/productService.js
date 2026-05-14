// import { productapi } from "../lib/axios";

// export const getProducts = () => productapi.get("/api/products/all", { skipAuth: true });

// export const getSingleProduct = (id) => productapi.get(`/api/products/${id}`, { skipAuth: true });

// export const createProduct = (data) => productapi.post("/api/products", data);

// export const updateProduct = (id, data) => productapi.put(`/api/products/${id}`, data);

// export const deleteProduct = (id) => productapi.delete(`/api/products/${id}`);

// export const getNewArrivalsAPI = () =>  productapi.get("/api/products/new-arrivals?limit=25");

// export const getTrendingProductsAPI = () => productapi.get("/api/products/trending?limit=25")

// export const getVendorProductsAPI = (vendorId) => productapi.get(`/api/products/vendor/${vendorId}`, {skipAuth: true,});

import { productapi } from "../lib/axios";

// ================= GET ALL PRODUCTS =================
export const getProducts = async () => {
  const res = await productapi.get("/api/products/all", {
    skipAuth: true,
  });

  return res.data;
};

// ================= GET SINGLE PRODUCT =================
export const getSingleProduct = async (id) => {
  const res = await productapi.get(`/api/products/${id}`, {
    skipAuth: true,
  });

  return res.data;
};

// ================= CREATE PRODUCT =================
export const createProduct = async (data) => {
  const res = await productapi.post("/api/products", data);

  return res.data;
};

// ================= UPDATE PRODUCT =================
export const updateProduct = async (id, data) => {
  const res = await productapi.put(`/api/products/${id}`, data);

  return res.data;
};

// ================= DELETE PRODUCT =================
export const deleteProduct = async (id) => {
  const res = await productapi.delete(`/api/products/${id}`);

  return res.data;
};

// ================= NEW ARRIVALS =================
export const getNewArrivalsAPI = async () => {
  const res = await productapi.get(
    "/api/products/new-arrivals?limit=25",
    {
      skipAuth: true,
    }
  );

  return res.data;
};

// ================= TRENDING PRODUCTS =================
export const getTrendingProductsAPI = async () => {
  const res = await productapi.get(
    "/api/products/trending?limit=25",
    {
      skipAuth: true,
    }
  );

  return res.data;
};

// ================= VENDOR PRODUCTS =================
export const getVendorProductsAPI = async (vendorId) => {
  const res = await productapi.get(
    `/api/products/vendor/${vendorId}`,
    {
      skipAuth: true,
    }
  );

  return res.data;
};