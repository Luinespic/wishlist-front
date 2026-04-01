import api from "./axios";

export const createProduct = (listId, data) =>
  api.post(`/lists/${listId}/products`, data);
export const updateProduct = (listId, productId, data) =>
  api.patch(`/lists/${listId}/products/${productId}`, data);
export const deleteProduct = (listId, productId) =>
  api.delete(`/lists/${listId}/products/${productId}`);
