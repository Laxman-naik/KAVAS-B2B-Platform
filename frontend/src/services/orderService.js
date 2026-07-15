import { productapi } from "../lib/axios";

export const createOrderFromCartAPI = (data) => productapi.post("/api/orders/from-cart", data);

export const createOrderAPI = async (payload) => {
  const res = await productapi.post("/api/orders", payload);
  return res.data;
};

export const getUserOrdersAPI = async () => {
  const res = await productapi.get("/api/orders");
  return res.data;
};

export const getOrderDetailsAPI = async (orderId) => {
  const res = await productapi.get(`/api/orders/${orderId}`);
  return res.data;
};

export const getOrderTrackingAPI = async (orderId) => {
  const res = await productapi.get(`/api/orders/${orderId}/tracking`);
  return res.data;
};

export const getVendorOrdersAPI = async () => {
  const res = await productapi.get("/api/orders/vendor");
  return res.data;
};

export const updateOrderStatusAPI = async (orderId, status) => {
  const res = await productapi.put(`/api/orders/${orderId}/status`, {
    status,
  });

  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await productapi.get(`/api/orders/by-id/${orderId}`);
  return res.data;
};
