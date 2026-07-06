import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Sparkles, X, ShoppingCart, Star } from "lucide-react";
import heroBottle from "../../assets/iconic_bottle.png";

// Rating stars component
const RatingStars = () => (
  <div className="flex items-center gap-1.5">
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="w-3 h-3 text-[hsl(var(--accent))] fill-[hsl(var(--accent))]"
        />
      ))}
    </div>
    <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-medium">
      4.9 (200+)
    </span>
  </div>
);

// Add/Remove quantity panel
const GlassInfoPanel = ({
  data,
  selected,
  qty,
  onAdd,
  onRemove,
  onQty,
  convert,
  loading,
}) => (
  <div className="relative z-10 m-4 mt-0 rounded-2xl overflow-hidden">
    <div className="absolute inset-0 backdrop-blur-2xl bg-[hsl(var(--card))]/72 border border-[hsl(var(--foreground))]/10" />
    <div className="relative p-5 space-y-3">
      {/* Product Title */}
      <div>
        <h3 className="font-display text-lg font-bold text-[hsl(var(--foreground))] leading-tight">
          Iconic Herbal Mixture {data.label}
        </h3>
        <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
          {data.tagline}
        </p>
      </div>

      {/* Price & Rating */}
      <div className="flex items-end justify-between">
        <span className="font-display text-3xl font-bold text-[hsl(var(--foreground))] tracking-tight">
          {loading ? "..." : convert(data.price)}
        </span>
        <RatingStars />
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="controls"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 pt-1"
          >
            {/* Quantity Controls */}
            <div className="flex items-center justify-between bg-[hsl(var(--foreground))]/5 backdrop-blur-sm border border-foreground/10 rounded-full px-2 py-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQty(-1);
                }}
                className="w-8 h-8 rounded-full bg-[hsl(var(--background))]/80 flex items-center justify-center text-foreground hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <motion.span
                key={qty}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="font-bold text-foreground text-sm"
              >
                {qty}
              </motion.span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQty(1);
                }}
                className="w-8 h-8 rounded-full bg-[hsl(var(--background))]/80 flex items-center justify-center text-foreground hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Subtotal & Remove */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-[hsl(var(--foreground))]">
                Subtotal · {loading ? "..." : convert(data.price * qty)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          </motion.div>
        ) : (
          <CTAButton onClick={onAdd} />
        )}
      </AnimatePresence>
    </div>
  </div>
);

// Add-to-cart button
const CTAButton = ({ onClick }) => (
  <motion.button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.96 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative w-full overflow-hidden rounded-full py-3 px-5 font-semibold text-sm
      bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary))] to-[hsl(var(--primary))]/85 text-[hsl(var(--primary-foreground))]
      shadow-[0_8px_25px_-8px_hsl(var(--primary)/0.6)] hover:shadow-[0_12px_30px_-8px_hsl(var(--primary)/0.8)]
      transition-shadow duration-300 group/btn"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
    <span className="relative flex items-center justify-center gap-2">
      <ShoppingCart className="w-4 h-4" />
      Add to Cart
    </span>
  </motion.button>
);

// Product background
const ProductImageBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <img
      src={heroBottle}
      alt="Product Bottle"
      aria-hidden
      className="absolute h-full w-auto object-contain right-[-18%] top-[-3%] drop-shadow-[0_30px_50px_hsl(var(--primary)/0.25)]"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--secondary))]/30 via-[hsl(var(--background))] to-[hsl(var(--primary))]/10" />
  </div>
);

const OrderProductCard = ({
  data,
  selected,
  qty,
  index,
  onAdd,
  onRemove,
  onQty,
  convert,
  loading,
}) => (
  <div
    className={`group relative cursor-pointer h-[480px] flex flex-col isolate transition-shadow duration-500 ease-out
      ${selected ? "ring-2 ring-[hsl(var(--primary))]" : ""}`}
    onClick={() => !selected && onAdd()}
  >
    <ProductImageBackground />

    {/* Gradient overlay */}
    <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
      <div className="absolute -inset-x-20 -top-40 h-80 bg-gradient-to-r from-[hsl(var(--transparent))] via-[hsl(var(--primary-forground))]/15 to-[hsl(var(--transparent))] transition-transform duration-1000 ease-out" />
    </div>

    {/* Selected animation */}
    {selected && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-[2rem] ring-2 ring-[hsl(var(--primary))]/40 pointer-events-none z-[5]"
      />
    )}

    {/* Badge */}
    {data.badge && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
        className="absolute top-5 right-5 z-20"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-accent/40 blur-md rounded-full" />
          <span className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-accent/80 text-accent-foreground text-[11px] font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-3 h-3 fill-current" />
            {data.badge}
          </span>
        </div>
      </motion.div>
    )}

    {/* Top label */}
    <div className="relative z-10 p-5">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 backdrop-blur-md border border-foreground/10">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/70">
          {data.label}
        </span>
      </div>
    </div>

    <div className="flex-1" />

    {/* Glass info panel */}
    <GlassInfoPanel
      data={data}
      selected={selected}
      qty={qty}
      onAdd={onAdd}
      onRemove={onRemove}
      onQty={onQty}
      convert={convert}
      loading={loading}
    />
  </div>
);

export default OrderProductCard;