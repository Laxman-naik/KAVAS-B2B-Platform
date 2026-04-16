import { productapi } from "../lib/axios";

// persistent idempotency key
const getIdempotencyKey = () => {
  let key = localStorage.getItem("order_key");

  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("order_key", key);
  }

  return key;
};

// CREATE ORDER
export const createOrder = async (token) => {
  const idempotency_key = getIdempotencyKey();

  try {
    const res = await productapi.post(
      "/api/orders",
      { idempotency_key },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data?.orders?.length) {
      localStorage.removeItem("order_key");
    }

    return res.data;

  } catch (err) {
    console.error("Create order failed:", err.response?.data || err.message);
    throw err;
  }
};

// GET USER ORDERS
export const getOrders = async (token) => {
  const res = await productapi.get("/api/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// GET ORDER DETAILS
export const getOrderDetails = async (orderId, token) => {
  const res = await productapi.get(`/api/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};