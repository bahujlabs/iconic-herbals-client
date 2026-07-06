export const selectItems = (s) => s.items;
export const selectCoupon = (s) => s.coupon;

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
