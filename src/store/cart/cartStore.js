// store/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const selectTotalItems = (s) =>
  s.items.reduce((acc, i) => acc + i.quantity, 0);

export const selectSubtotal = (s) =>
  s.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

export const selectDiscountedTotal = (s) => {
  const sub = selectSubtotal(s);
  if (!s.coupon) return sub;
  if (s.coupon.type === "flat") return Math.max(0, sub - s.coupon.value);
  if (s.coupon.type === "pct") return sub * (1 - s.coupon.value / 100);
  return sub;
};

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      coupon: null,

      // ✅ FIXED: always normalize product ID
      addItem: (product) =>
        set((state) => {
          const productId = product._id || product.id;

          if (!productId) {
            console.error("Missing product ID:", product);
            return state;
          }

          const existing = state.items.find((i) => i.productId === productId);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId, 
                name: product.name,
                price: product.price,
                quantity: 1,
              },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQty: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i,
                ),
        })),

      applyCoupon: (coupon) => set({ coupon }),
      clearCoupon: () => set({ coupon: null }),
      clearCart: () => set({ items: [], coupon: null }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
