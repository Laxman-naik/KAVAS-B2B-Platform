import axios from "axios";

const API_URL = "http://localhost:5000/api/favourites";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getFavouritesAPI = async () => {
  return await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });
};

export const addToFavouritesAPI = async (productId) => {
  return await axios.post(
    API_URL,
    { productId },
    {
      headers: getAuthHeaders(),
    }
  );
};

export const removeFromFavouritesAPI = async (productId) => {
  return await axios.delete(`${API_URL}/${productId}`, {
    headers: getAuthHeaders(),
  });
};

export const clearFavouritesAPI = async () => {
  return await axios.delete(API_URL, {
    headers: getAuthHeaders(),
  });
};