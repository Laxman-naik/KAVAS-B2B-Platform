import axios from "axios";

const BASE_URL = "https://kavas-b2b-platform-2.onrender.com";

const api = axios.create({ baseURL: BASE_URL, withCredentials: true,});

export default api;