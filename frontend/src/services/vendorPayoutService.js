import { productapi } from "../lib/axios";

export const requestVendorPayoutAPI = (data) =>
  productapi.post("/api/vendor-payouts/request", data);

export const getMyVendorPayoutsAPI = () =>
  productapi.get("/api/vendor-payouts/my-payouts");

export const getVendorPayoutSummaryAPI = () =>
  productapi.get("/api/vendor-payouts/summary");