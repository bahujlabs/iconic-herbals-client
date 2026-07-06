// components/CartIcon.jsx
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../store/cart/cartStore.js";
import { selectTotalItems } from "../store/cart/cartSelectors.js";

const CartIcon = () => {
  const totalItems = useCartStore(selectTotalItems);
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/checkouts")}
      className="relative p-2 rounded-xl hover:bg-[hsl(var(--muted))] transition-colors"
      aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
    >
      <ShoppingCart className="w-5 h-5 text-[hsl(var(--foreground))]" />

      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-[10px] font-bold flex items-center justify-center"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default CartIcon;
