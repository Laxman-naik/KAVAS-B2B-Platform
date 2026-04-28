import {authapi} from "../lib/axios";

export const getAddresses = () => authapi.get("/api/address");
export const createAddress = (data) => authapi.post("/api/address", data);
export const updateAddress = (id, data) => authapi.put(`/api/address/${id}`, data);
export const deleteAddress = (id) => authapi.delete(`/api/address/${id}`);
export const setDefaultAddress = async (id) => {
  const res = await authapi.patch(`/api/address/${id}/set-default`);
  return res;
};