import axios from "axios";

const PRODUCT_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:5002";

const getRole = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
};

const getAccessToken = () => {
  const role = getRole();
  if (!role) return null;
  return localStorage.getItem(`${role}_accessToken`);
};

export const getVendorPaymentHistoryAPI = async () => {
  const token = getAccessToken();

  const res = await axios.get(
    `${PRODUCT_BASE_URL}/api/vendor/payments/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};