import { productapi } from "@/lib/axios";

export const getVendorRFQsAPI = async (vendorOrgId) => {
  const res = await productapi.get("/api/vendor/rfqs", {
    headers: {
      "vendor-id": vendorOrgId,
    },
  });

  return res.data;
};

export const updateVendorRFQStatusAPI = async ({ id, status }) => {
  const res = await productapi.patch(`/api/vendor/rfqs/${id}`, {
    status,
  });

  return res.data;
};

export const submitQuoteAPI = async (payload) => {
  const res = await productapi.post("/api/vendor/quotes", payload);
  return res.data;
};

export const getVendorQuotesAPI = async (vendorOrgId) => {
  const res = await productapi.get("/api/vendor/quotes", {
    headers: {
      "vendor-id": vendorOrgId,
    },
  });

  return res.data;
};

export const updateQuoteStatusAPI = async ({ id, status }) => {
  const res = await productapi.patch(`/api/vendor/quotes/${id}`, {
    status,
  });

  return res.data;
};