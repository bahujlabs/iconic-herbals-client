export const queryKeys = {
  // Auth
  me: ["me"],

  // Users
  users: (filters) => ["users", filters ?? {}],
  user: (id) => ["users", id],

  // Products
  products: (filters) => ["products", filters ?? {}],
  product: (id) => ["products", id],

  // Orders
  orders: (filters) => ["orders", filters ?? {}],
  order: (id) => ["orders", id],

  // Payments
  paymentIntent: (orderId) => ["payment-intent", orderId],
  paymentMethods: ["payment-methods"],
};
