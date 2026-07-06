import { productapi } from "../lib/axios";

export const getVendorDashboardAPI = () => {
  return productapi.get("/api/vendor/dashboard");
};