import axios from "axios";

const AUTH_BASE_URL = "https://kavas-b2b-platform-2.onrender.com";
const PRODUCT_BASE_URL = "https://kavas-b2b-platform-2.onrender.com";

const authapi = axios.create({ baseURL: AUTH_BASE_URL, withCredentials: true,});

export default authapi;