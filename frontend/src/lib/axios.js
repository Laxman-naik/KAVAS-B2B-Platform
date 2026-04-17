import axios from "axios";

const AUTH_BASE_URL = "https://kavas-b2b-platform-3.onrender.com";
const PRODUCT_BASE_URL = "https://kavas-b2b-platform-4.onrender.com";

//  CREATE FIRST
export const authapi = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true,
});

export const productapi = axios.create({
  baseURL: PRODUCT_BASE_URL,
  withCredentials: true,
});

//  THEN attach interceptor
const attachToken = (config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN SENT:", token); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

authapi.interceptors.request.use(attachToken);
productapi.interceptors.request.use(attachToken);