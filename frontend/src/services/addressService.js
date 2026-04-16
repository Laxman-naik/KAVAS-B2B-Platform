import {authapi} from "../lib/axios";

export const getAddresses = () => authapi.get("/address");
export const createAddress = (data) => authapi.post("/address", data);
export const updateAddress = (id, data) => authapi.put(`/address/${id}`, data);
export const deleteAddress = (id) => authapi.delete(`/address/${id}`);