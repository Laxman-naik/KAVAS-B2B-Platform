import { productapi } from "../lib/axios";

export const createCheckoutAPI = (data) => productapi.post("/api/payment/checkout", data);

export const verifyPaymentAPI = (data) => productapi.post("/api/payment/verify", data);