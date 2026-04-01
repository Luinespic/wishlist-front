import api from "./axios";

export const reserveProduct = (productId) =>
  api.post(`/reservations/${productId}`);
export const cancelReservation = (productId) =>
  api.delete(`/reservations/${productId}`);
export const getMyReservations = () => api.get("/reservations/my-reservations");
