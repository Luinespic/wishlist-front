import api from "./axios";

export const getMyLists = () => api.get("/lists/my-lists");
export const createList = (data) => api.post("/lists", data);
export const updateList = (id, data) => api.patch(`/lists/${id}`, data);
export const deleteList = (id) => api.delete(`/lists/${id}`);
export const getListByToken = (token) => api.get(`/lists/token/${token}`);
export const getListById = (id) => api.get(`/lists/${id}`);
