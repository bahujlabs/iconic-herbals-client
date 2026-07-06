import { useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, cartStore } from "../hooks/useCart";
import {
  ShoppingCart,
  Tag,
  Truck,
  Sparkles,
  Check,
  ShieldCheck,
} from "lucide-react";
import OrderProductCard from "./orders/OrderProductCard";
import { useCurrencyProvider } from "../hooks/useCurrencyProvider";
import { selectUser } from "../store/user/authStore.js";
import { useAuthStore } from "../store/user/authStore.js";

const products = [
  {
    id: "prod_25cl",
    label: "25cl",
    price: 5_000,
    tagline: "Perfect for trying",
    badge: "Most Popular",
  },
  {
    id: "prod_50cl",
    label: "50cl",
    price: 10_000,
    tagline: "Best value · 60-day supply",
    badge: "Best Value",
  },
];

const BULK_DISCOUNT_THRESHOLD = 2;
const BULK_DISCOUNT_RATE = 0.1;
const FREE_SHIPPING_THRESHOLD = 200_000;

const OrderSections = () => {
  const cart = useCart();
  const ref = useRef(null);
  const navigate = useNavigate();
  const user = useAuthStore(selectUser);

  const { selected: currency, convert, loading } = useCurrencyProvider("NGN");

  const toggleProduct = (i) => cartStore.toggle(i);
  const updateQty = (i, delta) => cartStore.updateQty(i, delta);

  const cartEntries = Object.entries(cart).map(([i, qty]) => ({
    index: Number(i),
    product: products[Number(i)],
    qty,
  }));

  const totalQty = cartEntries.reduce((s, e) => s + e.qty, 0);
  const subTotal = cartEntries.reduce(
    (sum, e) => sum + e.product.price * e.qty,
    0,
  );
  const hasBulkDiscount = totalQty >= BULK_DISCOUNT_THRESHOLD;
  const discountAmount = hasBulkDiscount ? subTotal * BULK_DISCOUNT_RATE : 0;
  const discountedSubtotal = subTotal - discountAmount;
  const qualifiesFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD;
  const freeShippingProgress =
    discountedSubtotal > 0
      ? Math.max(
          5,
          Math.min((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100),
        )
      : 0;
  const amountToFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - discountedSubtotal,
  );
  const hasItems = cartEntries.length > 0;

  const handleCheckout = () => {
    if (!hasItems) return;

    // Build the order shape CheckoutForm expects
    const order = {
      // No orderId yet — backend creates the order on checkout page mount
      customerEmail: user?.email,
      totalKobo: discountedSubtotal,
      items: cartEntries.map((e) => ({
        productId: e.product.id,
        name: e.product.label,
        price: e.product.price,
        quantity: e.qty,
      })),
      // Pass discount info so backend can validate
      discount: hasBulkDiscount
        ? { type: "pct", value: BULK_DISCOUNT_RATE * 100 }
        : null,
      freeShipping: qualifiesFreeShipping,
    };

    navigate("/checkouts", { state: { order } });
  };

  return (
    <section className="py-24 bg-[hsl(var(--background))]" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] mb-4">
            Choose Your <span>Bottle</span>
          </h2>
          <p>
            Select your preferred size, adjust quantity, and proceed to secure
            checkout.
          </p>
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--accent)/0.15)] rounded-full px-5 py-2 text-xs font-semibold">
            <Tag className="w-4 h-4 text-[hsl(var(--accent))]" />
            <p>{`BUY ${BULK_DISCOUNT_THRESHOLD}+ bottles and save ${BULK_DISCOUNT_RATE * 100}% instantly`}</p>
          </div>
        </div>

        {/* Product Cards */}
        <div className="max-w-3xl mx-auto sm:grid sm:grid-cols-2 sm:gap-6 flex sm:overflow-visible overflow-x-auto snap-x snap-mandatory gap-4 px-1 mx-1 pb-2 scroll-hide">
          {products.map((p, i) => {
            const selectedItem = cart[i] !== undefined;
            const qty = cart[i] || 0;
            return (
              <div key={i} className="snap-center shrink-0 w-[85%] sm:w-auto">
                <OrderProductCard
                  data={p}
                  index={i}
                  selected={selectedItem}
                  qty={qty}
                  onAdd={() => !selectedItem && toggleProduct(i)}
                  onRemove={() => toggleProduct(i)}
                  onQty={(d) => updateQty(i, d)}
                  currency={currency}
                  convert={convert}
                  loading={loading}
                />
              </div>
            );
          })}
        </div>

        {/* Dynamic Cart Summary */}
        <AnimatePresence>
          {hasItems && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-2xl mx-auto mt-8 space-y-8"
            >
              {/* Free shipping progress */}
              <div className="glass-strong rounded-2xl p-4">
                <div className="flex items-center justify-between text-sm font-bold text-[hsl(var(--foreground))] mb-2">
                  <span className="flex items-center gap-1.5">
                    <Truck /> Free shipping progress
                  </span>
                  <span className="font-semibold">
                    {loading ? "..." : convert(amountToFreeShipping)}
                  </span>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-[hsl(var(--secondary))]">
                  <div
                    className="h-full bg-[hsl(var(--primary))] transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Summary */}
              <div className="glass-strong rounded-2xl p-5">
                <h3 className="text-sm font-bold text-foreground mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm mb-3">
                  {cartEntries.map((item) => (
                    <div key={item.index} className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Iconic Herbal Mixture {item.product.label} × {item.qty}
                      </span>
                      <span className="font-medium text-[hsl(var(--foreground))]">
                        {loading
                          ? "..."
                          : convert(item.product.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <AnimatePresence>
                  {hasBulkDiscount && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-sm text-[hsl(var(--primary))] pb-2"
                    >
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Bulk Discount (10%)
                      </span>
                      <span className="font-semibold">
                        {loading ? "..." : `-${convert(discountAmount)}`}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="border-t border-[hsl(var(--border))] pt-3 flex items-center justify-between">
                  <div>
                    {qualifiesFreeShipping && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))] mb-1">
                        <Check className="w-4 h-4" />
                        <span>Free Shipping Included</span>
                      </div>
                    )}
                    <motion.p
                      key={discountedSubtotal}
                      initial={{ scale: 1.03 }}
                      animate={{ scale: 1 }}
                      className="text-xl font-bold text-[hsl(var(--foreground))]"
                    >
                      {loading ? "..." : convert(discountedSubtotal)}
                    </motion.p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCheckout}
                    className="/* bg-[hsl(var(--primary))] */ bg-red-500 px-8 py-3.5 rounded-xl text-[hsl(var(--primary-foreground))] font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <ShoppingCart className="w-4 h-4" />{" "}
                    {/* Proceed to Checkout */} Ordering Temporarily Unavailable
                  </motion.button>
                </div>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-6">
                {[
                  { icon: ShieldCheck, text: "Secure Checkout" },
                  { icon: Truck, text: "Free Shipping ₦200k+" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"
                  >
                    <b.icon className="w-4 h-4 text-[hsl(var(--primary))]" />
                    {b.text}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default OrderSections;
