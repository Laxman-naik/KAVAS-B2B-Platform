import { productapi } from "@/lib/axios";

export const createRFQAPI = async (payload) => {
  const res = await productapi.post("/api/rfqs", payload);
  return res.data;
};

export const getRFQsAPI = async () => {
  const res = await productapi.get("/api/rfqs");
  return res.data;
};

export const getSingleRFQAPI = async (id) => {
  const res = await productapi.get(`/api/rfqs/${id}`);
  return res.data;
};

export const getBuyerRFQsAPI = async (buyerOrgId) => {
  const res = await productapi.get(`/api/rfqs/buyer/${buyerOrgId}`);
  return res.data;
};

export const getRFQQuotesAPI = async (rfqId) => {
  const res = await productapi.get(`/api/rfqs/${rfqId}/quotes`);
  return res.data;
};

export const acceptQuoteAPI = async (quoteId) => {
  const res = await productapi.put(
    `/api/rfqs/quotes/${quoteId}/accept`
  );

  return res.data;
};

export const updateRFQStatusAPI = async ({ id, status }) => {
  const res = await productapi.put(`/api/rfqs/${id}/status`, { status });
  return res.data;
};

export const deleteRFQAPI = async (id) => {
  const res = await productapi.delete(`/api/rfqs/${id}`);
  return res.data;
};