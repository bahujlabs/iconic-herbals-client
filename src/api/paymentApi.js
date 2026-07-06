import { api } from "../api/axios.js";
export const PaymentApi = {
  initializeTransaction: (payload) =>
    api
      .post("/api/payments/initialize", payload)
      .then((response) => response.data),

  confirmPayment: (reference) =>
    api.get(`/payments/verify/${reference}`).then((response) => response.data),

  // Fetch saved cards (Paystack authorizations) for current user
  getSavedMethods: () =>
    api.get("/payments/methods").then((response) => response.data),

  // Save/tokenize a card (Paystack requires a real charge)
  saveMethod: (payload) =>
    api.post("/payments/methods", payload).then((response) => response.data),

  // Delete a saved authorization/card
  deleteMethod: (authorizationCode) =>
    api
      .delete(`/payments/methods/${authorizationCode}`)
      .then((response) => response.data),
};
