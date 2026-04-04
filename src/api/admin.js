import api from "./axios";

export const getAdminUsers = (page = 1) => api.get(`/admin/users?page=${page}`);
export const updateAdminUser = (id, data) =>
  api.patch(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);
export const getAdminLists = (page = 1) => api.get(`/admin/lists?page=${page}`);
export const deleteAdminList = (id) => api.delete(`/admin/lists/${id}`);
export const getAdminStats = () => api.get("/admin/stats");
