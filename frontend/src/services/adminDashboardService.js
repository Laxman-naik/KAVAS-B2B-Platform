import { productapi } from "@/lib/axios";

export const getAdminDashboardAPI = async () => {
  const res = await productapi.get("/api/admin/dashboard");
  return res.data;
};