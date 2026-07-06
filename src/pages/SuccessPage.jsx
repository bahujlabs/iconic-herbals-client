import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Share2,
  Mail,
  Gift,
  Copy,
  Check,
  RefreshCw,
  LifeBuoy,
} from "lucide-react";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state ?? null;

  const status = state?.status ?? (state?.reason ? "failed" : "success");

  const isFailed = status === "failed";

  const [showAccount, setShowAccount] = useState(false);
  const [copied, setCopied] = useState(false);

  const orderId =
    state?.reference || `HV-${Date.now().toString(36).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hsl(var(--background)) p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass-strong rounded-3xl p-8 sm:p-10 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {isFailed ? (
            <XCircle className="w-20 h-20 text-hsl(var(--destructive)) mx-auto mb-6" />
          ) : (
            <CheckCircle2 className="w-20 h-20 text-hsl(var(--primary)) mx-auto mb-6" />
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-hsl(var(--foreground)) mb-2 font-display"
        >
          {isFailed ? "Payment Failed" : "Order Confirmed!"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[hsl(var(--muted-foreground))] mb-2"
        >
          {isFailed
            ? state?.reason ||
              "Your payment could not be completed. No charge was made."
            : `Thank you${state?.name ? `, ${state.name}` : ""}!`}
        </motion.p>

        {/* Reference / Order ID */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span className="text-xs text-[hsl(var(--muted-foreground))] ">
            {isFailed ? "Reference" : "Order"}
          </span>

          <code className="text-xs font-mono bg-muted px-2 py-1 rounded-lg text-[hsl(var(--foreground))] ">
            {orderId}
          </code>

          <button
            onClick={handleCopy}
            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]  transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[hsl(var(--primary))] " />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </motion.div>

        {/* Order summary */}
        {!isFailed && state?.product && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-text-[hsl(var(--muted))]  rounded-xl p-5 mb-6 text-left space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">
                Product
              </span>
              <span className="font-semibold text-[hsl(var(--foreground))]">
                {state.product}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">
                Quantity
              </span>
              <span className="font-semibold text-[hsl(var(--foreground))] ">
                {state.quantity}
              </span>
            </div>

            {state.shipping && (
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(var(--muted-foreground))]">
                  Shipping
                </span>
                <span className="font-semibold text-foreground">
                  {state.shipping}
                </span>
              </div>
            )}

            {state.total && (
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-[hsl(var(--muted-foreground))]">
                  Total
                </span>
                <span className="font-bold text-[hsl(var(--muted-foreground))]  text-lg">
                  ${state.total}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Failed State */}
        {isFailed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/checkout")}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-[hsl(var(--primary-foreground))] font-semibold text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </motion.button>

            <button
              onClick={() => navigate("/")}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]  font-semibold text-sm hover:bg-[hsl(var(--muted))] /80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </button>

            <a
              href="mailto:support@herbavita.com"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[hsl(var(--muted-foreground))]    text-sm hover:text-[hsl(var(--foreground))]  transition-colors"
            >
              <LifeBuoy className="w-4 h-4" />
              Contact Support
            </a>
          </motion.div>
        ) : (
          <>
            {/* Success State */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3 mb-6"
            >
              {!showAccount ? (
                <button
                  onClick={() => setShowAccount(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-semibold text-sm hover:bg-[hsl(var(--primary))]/20 transition-colors"
                >
                  <Gift className="w-4 h-4" />
                  Create account for 10% off next order
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-[hsl(var)] rounded-xl p-4 space-y-3"
                >
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Save your details & get 10% off your next order!
                  </p>

                  <input
                    type="password"
                    placeholder="Create a password"
                    className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm  text-[hsl(var(--foreground))] placeholder: text-[hsl(var(--muted-foreground))]"
                  />

                  <button className="w-full py-2.5 rounded-lg bg-[hsl(var(--primary))]  text-[hsl(var(--primary-foreground))] text-sm font-semibold">
                    Create Account
                  </button>
                </motion.div>
              )}

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[hsl(var(--muted))]  text-[hsl(var(--muted-foreground))] text-sm font-medium hover:bg-[hsl(var(--muted))]/80 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[hsl(var(--muted))] text-muted-foreground text-sm font-medium hover:bg-[hsl(var(--muted))]/80 transition-colors">
                  <Mail className="w-4 h-4" />
                  Subscribe
                </button>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Success;
