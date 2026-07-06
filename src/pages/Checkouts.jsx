import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  Leaf,
  Minus,
  Plus,
  Trash2,
  Truck,
  Zap,
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Package,
  MapPin,
  Loader2,
  Sparkles,
} from "lucide-react";
import StepProgress from "../components/orders/StepProgress.jsx";
import { useCurrencyProvider, CURRENCIES } from "../hooks/useCurrencyProvider";
import { orderApi } from "../api/orderApi";
import { useInitializeTransaction } from "../hooks/payments/useInitializeTransaction";
import { useCartStore } from "../store/cart/cartStore.js";
import { useUiStore } from "../store/uiStore.js";
import { useAuthStore, selectUser } from "../store/user/authStore.js";
import { useCreateOrder } from "../hooks/orders/useCreateOrder.js";
import { getPaystack } from "./lib/paystack.js";

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard Shipping",
    priceKobo: 0,
    days: "5–7 business days",
    icon: Truck,
  },
  {
    id: "express",
    label: "Express Shipping",
    priceKobo: 1_299_00,
    days: "2–3 business days",
    icon: Zap,
  },
];

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD_KOBO = 200_000_00;

const STEPS = [
  { label: "Cart", icon: Package },
  { label: "Shipping", icon: MapPin },
  { label: "Payment", icon: CreditCard },
  { label: "Review", icon: CheckCircle2 },
];

let paystackPopup = null;

const SHIPPING_FIELDS = [
  {
    label: "Full Name",
    key: "name",
    type: "text",
    placeholder: "Your full name",
    required: true,
  },
  {
    label: "Phone Number",
    key: "phone",
    type: "tel",
    placeholder: "Your phone number",
    required: true,
  },
  {
    label: "Email",
    key: "email",
    type: "email",
    placeholder: "Your email",
    required: true,
  },
  {
    label: "Street Address",
    key: "address",
    type: "text",
    placeholder: "Your address",
    required: true,
  },
  {
    label: "City",
    key: "city",
    type: "text",
    placeholder: "Your city",
    required: true,
  },
  {
    label: "State",
    key: "state",
    type: "text",
    placeholder: "Your state",
    required: true,
  },
  {
    label: "Zip / House No.",
    key: "zip",
    type: "text",
    placeholder: "Zip or house no. (optional)",
    required: false,
  },
];

const Checkouts = () => {
  const navigate = useNavigate();

  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore(selectUser);
  const toast = useUiStore((s) => s.toast);

  const {
    selected,
    setSelected,
    convert,
    loading: ratesLoading,
    currencies,
  } = useCurrencyProvider("NGN");

  const popupOpenRef = useRef(false);

  const [step, setStep] = useState(0);
  const [cart, setCart] = useState(
    cartItems.map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  );
  const [shipping, setShipping] = useState(SHIPPING_OPTIONS[0]);
  const [paymentError, setPaymentError] = useState(null);

  const defaultAddress =
    user?.address?.find((a) => a.isDefault) ?? user?.address?.[0];

  const [form, setForm] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email ?? "",
    phone: user?.phoneNumber ?? "",
    address: defaultAddress?.street ?? "",
    city: defaultAddress?.city ?? "",
    state: defaultAddress?.state ?? "",
    zip: defaultAddress?.postalCode ?? "",
    country: defaultAddress?.country ?? "Nigeria",
  });

  const createOrder = useCreateOrder();
  const initTransaction = useInitializeTransaction();
  const loading = createOrder.isPending || initTransaction.isPending;

  const canProceed = useCallback(() => {
    if (step === 0) return cart.length > 0;
    if (step === 1)
      return (
        form.name.trim() !== "" &&
        form.email.trim() !== "" &&
        form.phone.trim() !== "" &&
        form.address.trim() !== "" &&
        form.city.trim() !== "" &&
        form.state.trim() !== ""
      );
    return true;
  }, [step, form, cart]);

  const updateQty = useCallback((i, delta) => {
    setCart((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], quantity: Math.max(1, next[i].quantity + delta) };
      return next;
    });
  }, []);

  const removeItem = useCallback((i) => {
    setCart((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const subtotalKobo = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const qualifiesFree = subtotalKobo >= FREE_SHIPPING_THRESHOLD_KOBO;
  const isFreeShipping = qualifiesFree && shipping.id === "standard";
  const shippingKobo = isFreeShipping ? 0 : shipping.priceKobo;
  const taxKobo = Math.round(subtotalKobo * TAX_RATE);
  const totalKobo = subtotalKobo + shippingKobo + taxKobo;

  const handleNext = useCallback(() => {
    if (canProceed()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [canProceed]);
  const handleBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);
  const handleStepClick = useCallback((i) => setStep(i), []);

  const handlePaystackSubmit = async () => {
    if (popupOpenRef.current) return;
    setPaymentError(null);
    try {
      const createdOrder = await createOrder.mutateAsync({
        items: cart.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        shippingAddress: {
          name: form.name,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        contact: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        shippingMethod: shipping.id,
      });

      const order = createdOrder.data;

      const paymentData = await initTransaction.mutateAsync({
        orderId: order._id,
        provider: "paystack",
        email: form.email,
      });

      popupOpenRef.current = true;

      const handler = getPaystack().setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: paymentData.data.amount * 100, // naira → kobo
        ref: paymentData.data.reference,
        currency: "NGN",
        callback: (response) => {
          popupOpenRef.current = false;
          clearCart();
          navigate(`/orders/${order._id}/confirmation`, {
            state: { reference: response.reference },
          });
        },
        onClose: () => {
          popupOpenRef.current = false;
          toast("Payment cancelled.", "info");
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Create order error:", err, err.stack);
      setPaymentError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };
  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[hsl(var(--background))] border border-[hsl(var(--border))] " +
    "text-[hsl(var(--foreground))] text-sm placeholder:text-[hsl(var(--muted-foreground))] " +
    "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/40 focus:border-[hsl(var(--primary))] " +
    "transition-all duration-200";

  const fadeIn = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.3 },
  };

  const stepLabels = [
    "Reviewing cart",
    "Shipping details",
    "Payment method",
    "Final review",
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* ── Header ── */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-[hsl(var(--background))]/80 border-b border-[hsl(var(--border))]/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => (step > 0 ? handleBack() : navigate("/"))}
              className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors group"
            >
              <span className="w-8 h-8 rounded-full border border-[hsl(var(--border))] flex items-center justify-center group-hover:border-[hsl(var(--foreground))] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
              <span className="hidden sm:block">
                {step > 0 ? "Back" : "Shop"}
              </span>
            </button>

            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[hsl(var(--primary))]" />
              </div>
              <span className="text-sm font-bold text-[hsl(var(--foreground))] tracking-tight">
                Iconic{" "}
                <span className="text-[hsl(var(--primary))]">Herbal</span>
              </span>
            </a>

            <div className="flex items-center gap-3">
              <select
                value={selected.code}
                onChange={(e) =>
                  setSelected(CURRENCIES.find((c) => c.code === e.target.value))
                }
                className="text-xs bg-[hsl(var(--muted))]/60 border border-[hsl(var(--border))] rounded-lg px-2.5 py-1.5 text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/40 cursor-pointer"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                <Lock className="w-3 h-3 text-[hsl(var(--primary))]" />
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Step banner ── */}
      <div className="bg-[hsl(var(--primary))]/5 border-b border-[hsl(var(--primary))]/10">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-semibold">
                Step {step + 1} of {STEPS.length}
              </p>
              <p className="text-sm font-semibold text-[hsl(var(--foreground))] mt-0.5">
                {stepLabels[step]}
              </p>
            </div>
            {/* Pill progress */}
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => i < step && handleStepClick(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step
                      ? "w-8 bg-[hsl(var(--primary))]"
                      : i < step
                        ? "w-4 bg-[hsl(var(--primary))]/40 cursor-pointer"
                        : "w-4 bg-[hsl(var(--border))] cursor-default"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Main ── */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* STEP 0 — Cart */}
            {step === 0 && (
              <motion.div key="cart" {...fadeIn} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
                    Your Cart
                  </h2>
                  <span className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))]/50 px-2.5 py-1 rounded-full">
                    {cart.reduce((s, i) => s + i.quantity, 0)} item
                    {cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
                  </span>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-20 text-[hsl(var(--muted-foreground))]">
                    <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--muted))]/40 flex items-center justify-center mx-auto mb-4">
                      <Package className="w-7 h-7 opacity-40" />
                    </div>
                    <p className="text-sm font-medium mb-1">
                      Your cart is empty
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]/60 mb-4">
                      Add some products to get started
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="text-sm text-[hsl(var(--primary))] font-semibold hover:underline"
                    >
                      Browse products →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, i) => (
                      <motion.div
                        key={item.productId}
                        layout
                        className="flex items-center gap-4 p-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary))]/20 transition-colors"
                      >
                        {/* Product icon */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))]/15 to-[hsl(var(--primary))]/5 flex items-center justify-center shrink-0">
                          <Leaf className="w-6 h-6 text-[hsl(var(--primary))]" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[hsl(var(--foreground))] truncate">
                            Iconic Herbal Mixture
                          </p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                            {item.name} ·{" "}
                            {ratesLoading
                              ? `₦${(item.price / 100).toFixed(2)}`
                              : convert(item.price)}{" "}
                            each
                          </p>
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-[hsl(var(--border))] rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQty(i, -1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[hsl(var(--muted))]/60 transition-colors text-[hsl(var(--muted-foreground))]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-8 text-center border-x border-[hsl(var(--border))]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(i, 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[hsl(var(--muted))]/60 transition-colors text-[hsl(var(--muted-foreground))]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right min-w-[70px]">
                            <p className="text-sm font-bold text-[hsl(var(--foreground))]">
                              {ratesLoading
                                ? `₦${((item.price * item.quantity) / 100).toFixed(2)}`
                                : convert(item.price * item.quantity)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(i)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:text-destructive hover:bg-destructive/5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {isFreeShipping && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="flex items-center gap-3 text-sm bg-[hsl(var(--primary))]/8 border border-[hsl(var(--primary))]/20 rounded-2xl px-4 py-3 text-[hsl(var(--primary))] font-medium"
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      You've unlocked free standard shipping!
                    </motion.div>
                  )}
                  {qualifiesFree && shipping.id === "express" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 text-xs bg-[hsl(var(--muted))]/40 border border-[hsl(var(--border))] rounded-2xl px-4 py-3 text-[hsl(var(--muted-foreground))]"
                    >
                      <Truck className="w-4 h-4 shrink-0" />
                      Switch to Standard to save {convert(shipping.priceKobo)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* STEP 1 — Shipping */}
            {step === 1 && (
              <motion.div key="shipping" {...fadeIn} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
                    Delivery Details
                  </h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                    Where should we send your order?
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SHIPPING_FIELDS.map(
                      ({ label, key, type, placeholder, required }) => (
                        <div
                          key={key}
                          className={key === "address" ? "sm:col-span-2" : ""}
                        >
                          <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 block tracking-wide uppercase">
                            {label}
                            {required && (
                              <span className="text-[hsl(var(--primary))] ml-0.5">
                                *
                              </span>
                            )}
                          </label>
                          <input
                            type={type}
                            placeholder={placeholder}
                            value={form[key]}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, [key]: e.target.value }))
                            }
                            className={`${inputClass} ${
                              form[key].trim() !== "" && required
                                ? "border-[hsl(var(--primary))]/50 bg-[hsl(var(--primary))]/2"
                                : ""
                            }`}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Shipping method */}
                <div>
                  <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] mb-3 tracking-wide uppercase">
                    Shipping Method
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SHIPPING_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSel = shipping.id === opt.id;
                      const thisIsFree = qualifiesFree && opt.id === "standard";
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setShipping(opt)}
                          className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                            isSel
                              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                              : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/40 bg-[hsl(var(--card))]"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isSel
                                ? "bg-[hsl(var(--primary))]/15"
                                : "bg-[hsl(var(--muted))]/60"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${isSel ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                              {opt.label}
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                              {opt.days}
                            </p>
                          </div>
                          <span
                            className={`text-sm font-bold ${thisIsFree ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))]"}`}
                          >
                            {thisIsFree ? "FREE" : convert(opt.priceKobo)}
                          </span>
                          {isSel && (
                            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <motion.div key="payment" {...fadeIn} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
                    Payment
                  </h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                    All payments secured by Paystack
                  </p>
                </div>

                {/* Info box */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border))]">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[hsl(var(--foreground))] mb-0.5">
                      Secure Payment via Paystack
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                      You'll complete payment on Paystack's encrypted screen.
                      Choose your preferred method (card, bank transfer, USSD,
                      and more) on the next screen. Your financial details never
                      touch our servers.
                    </p>
                  </div>
                </div>

                {paymentError && (
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive text-sm p-4">
                    <span className="text-base mt-0.5">⚠️</span>
                    <p>{paymentError}</p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-6 pt-2">
                  {[
                    { icon: ShieldCheck, text: "Secure Checkout" },
                    { icon: Lock, text: "SSL Encrypted" },
                    { icon: CreditCard, text: "PCI Compliant" },
                  ].map((b) => (
                    <div
                      key={b.text}
                      className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"
                    >
                      <b.icon className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
                      <span>{b.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <motion.div key="review" {...fadeIn} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
                    Review Order
                  </h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                    Check everything before paying
                  </p>
                </div>

                {/* Items */}
                <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20">
                    <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
                      Items
                    </p>
                  </div>
                  <div className="p-5 space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                            <Leaf className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
                          </div>
                          <div>
                            <p className="font-medium text-[hsl(var(--foreground))]">
                              Iconic Herbal Mixture {item.name}
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                              Qty {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-[hsl(var(--foreground))]">
                          {convert(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery + Payment — 2 cards in a grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
                      <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
                        Delivery
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-[hsl(var(--foreground))] font-medium">
                        {form.name}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">
                        {form.address}
                        <br />
                        {form.city}, {form.state}
                        {form.zip ? ` ${form.zip}` : ""}
                        <br />
                        {form.country}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {shipping.id === "express" ? (
                          <Zap className="w-3 h-3 text-[hsl(var(--primary))]" />
                        ) : (
                          <Truck className="w-3 h-3 text-[hsl(var(--primary))]" />
                        )}
                        <p className="text-xs text-[hsl(var(--primary))] font-medium">
                          {shipping.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
                      <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
                        Payment
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-[hsl(var(--foreground))] font-medium">
                        via Paystack
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                        Card, bank transfer, USSD & more
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
                        {form.email}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {form.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {paymentError && (
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive text-sm p-4">
                    <span className="text-base mt-0.5">⚠️</span>
                    <p>{paymentError}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            {/* Summary card */}
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
              <div className="px-5 py-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20">
                <h3 className="text-sm font-bold text-[hsl(var(--foreground))]">
                  Order Summary
                </h3>
              </div>
              <div className="p-5 space-y-5">
                {/* Items */}
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-[hsl(var(--muted-foreground))] truncate mr-2">
                        {item.name}{" "}
                        <span className="text-[hsl(var(--muted-foreground))]/60">
                          ×{item.quantity}
                        </span>
                      </span>
                      <span className="font-medium text-[hsl(var(--foreground))] shrink-0">
                        {convert(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="space-y-2 pt-3 border-t border-[hsl(var(--border))]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Subtotal
                    </span>
                    <span className="text-[hsl(var(--foreground))]">
                      {convert(subtotalKobo)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Shipping
                    </span>
                    <span
                      className={
                        isFreeShipping
                          ? "text-[hsl(var(--primary))] font-semibold"
                          : "text-[hsl(var(--foreground))]"
                      }
                    >
                      {isFreeShipping ? "FREE" : convert(shippingKobo)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Tax (8%)
                    </span>
                    <span className="text-[hsl(var(--foreground))]">
                      {convert(taxKobo)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-3 border-t border-[hsl(var(--border))]">
                  <span className="font-bold text-[hsl(var(--foreground))]">
                    Total
                  </span>
                  <motion.span
                    key={`${totalKobo}-${selected.code}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xl font-bold text-[hsl(var(--foreground))]"
                  >
                    {convert(totalKobo)}
                  </motion.span>
                </div>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))]/70 -mt-2">
                  Final amount confirmed server-side at checkout.
                </p>
              </div>
            </div>

            {/* CTA */}
            {step < STEPS.length - 1 ? (
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: canProceed() ? 1.01 : 1 }}
                  whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="w-full py-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[hsl(var(--primary))]/20"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </motion.button>
                {step === 1 && !canProceed() && (
                  <p className="text-xs text-center text-destructive">
                    Fill in all required fields to continue
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePaystackSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold text-sm rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-[hsl(var(--primary))]/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Pay {convert(totalKobo)}
                    </>
                  )}
                </motion.button>
                <p className="text-[10px] text-center text-[hsl(var(--muted-foreground))]">
                  By paying you agree to our terms. Payments processed by
                  Paystack.
                </p>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: ShieldCheck, text: "Secure" },
                { icon: Lock, text: "Encrypted" },
                { icon: CreditCard, text: "PCI Safe" },
              ].map((b) => (
                <div
                  key={b.text}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border))]"
                >
                  <b.icon className="w-4 h-4 text-[hsl(var(--primary))]" />
                  <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))]">
                    {b.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkouts;
