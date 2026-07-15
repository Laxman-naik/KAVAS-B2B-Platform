import axios from "axios";

const API = "http://localhost:5002/api/analytics";

export const getAnalytics = async () => {
  const response = await axios.get(API);
  return response.data;
};