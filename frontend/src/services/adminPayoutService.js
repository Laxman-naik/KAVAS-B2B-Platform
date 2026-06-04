import { productapi } from "../lib/axios";

export const getAdminPayoutsAPI = () =>
  productapi.get("/api/admin/payouts");

export const approveAdminPayoutAPI = (id, data) =>
  productapi.put(`/api/admin/payouts/${id}/approve`, data);

export const rejectAdminPayoutAPI = (id, data) =>
  productapi.put(`/api/admin/payouts/${id}/reject`, data);

export const markAdminPayoutPaidAPI = (id, data) =>
  productapi.put(`/api/admin/payouts/${id}/paid`, data);