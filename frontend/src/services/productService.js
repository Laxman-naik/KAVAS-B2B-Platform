

import { productapi } from "../lib/axios";


export const getProducts = async () => {
  const res = await productapi.get("/api/products/all", {
    skipAuth: true,
  });
  return res.data;
};


export const getSingleProduct = async (id) => {
  const res = await productapi.get(`/api/products/${id}`, {
    skipAuth: true,
  });
  return res.data;
};


export const updateProduct = async (id, data) => {
  const res = await productapi.put(`/api/products/${id}`, data);
  return res.data;
};


export const getVendorProductsAPI = async (organizationId) => {
  const res = await productapi.get(`/api/products/vendor/${organizationId}`);
  return res.data;
};

export const getVendorInventoryAPI = async (organizationId) => {
  const res = await productapi.get(
    `/api/products/vendor/${organizationId}/inventory`,
    {
      skipAuth: true,
    }
  );

  return res.data;
};


export const getProductReviewsAPI = async (productId) => {
  const res = await productapi.get(`/api/products/${productId}/reviews`, {
    skipAuth: true,
  });
  return res.data;
};

export const addProductReviewAPI = async (productId, data) => {
  const isFormData = data instanceof FormData;
  const res = await productapi.post(
    `/api/products/${productId}/reviews`,
    data,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined
  );
  return res.data;
};
export const deleteProduct = async (id) => {
  const res = await productapi.delete(`/api/products/${id}`);
  return res.data;
};
export const getNewArrivalsAPI = async () => {
  const res = await productapi.get("/api/products/new-arrivals?days=365", {
    skipAuth: true,
  });
  return res.data;
};

export const getTrendingProductsAPI = async () => {
  const res = await productapi.get("/api/products/trending", {
    skipAuth: true,
  });
  return res.data;
};

export const createProduct = async (data) => {
  const res = await productapi.post("/api/products", data);
  return res.data;
};

export const getFlashDealsAPI = async () => {
  const res = await productapi.get("/api/products/flash-deals", {
    skipAuth: true,
  });
  return res.data;
};

export const makeProductFlashDealAPI = async (productId, data) => {
  const res = await productapi.put(
    `/api/products/${productId}/flash-deal`,
    data
  );
  return res.data;
};

export const updateProductFlashDealAPI = async (productId, data) => {
  const res = await productapi.patch(
    `/api/products/${productId}/flash-deal`,
    data
  );
  return res.data;
};

export const removeProductFlashDealAPI = async (productId) => {
  const res = await productapi.delete(
    `/api/products/${productId}/flash-deal`
  );
  return res.data;
};

export const addFlashDealToCartAPI = async ({
  productId,
  quantity = 1,
}) => {
  const res = await productapi.post("/api/cart", {
    product_id: productId,
    quantity,
  });

  return res.data;
};

