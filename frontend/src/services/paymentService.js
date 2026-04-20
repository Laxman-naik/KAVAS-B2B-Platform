import { productapi } from "../lib/axios";

export const createCheckoutAPI = () => productapi.post("/api/payment/checkout");

export const verifyPaymentAPI = (data) => productapi.post("/api/payment/verify", data);