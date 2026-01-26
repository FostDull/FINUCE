import api from "./api";

export const createPayment = (amount) =>
  api.post("/payments", { amount });

export const payPayment = (paymentId) =>
  api.post(`/payments/${paymentId}/pay`);
