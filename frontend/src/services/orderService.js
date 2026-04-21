import { productapi } from "../lib/axios";

/* ================= CREATE ORDER FROM CART ================= */
export const createOrderFromCartAPI = (data) =>
  productapi.post("/api/orders/from-cart", data);

/* ================= CREATE MANUAL ORDER ================= */
export const createOrderAPI = async (payload) => {
  const res = await productapi.post("/api/orders", payload);
  return res.data;
};

/* ================= GET ALL ORDERS ================= */
export const getUserOrdersAPI = async () => {
  const res = await productapi.get("/api/orders");
  return res.data;
};

/* ================= GET SINGLE ORDER ================= */
export const getOrderDetailsAPI = async (orderId) => {
  const res = await productapi.get(`/api/orders/${orderId}`);
  return res.data;
};

/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatusAPI = async (orderId, status) => {
  const res = await productapi.put(`/api/orders/${orderId}/status`, {
    status,
  });

  return res.data;
};