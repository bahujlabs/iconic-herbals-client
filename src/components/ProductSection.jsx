import { useState, useCallback } from "react";
import iconic_bottle from "../assets/iconic_bottle.png";
import { motion } from "framer-motion";
import {
  Leaf,
  Droplets,
  Shield,
  Sparkles,
  Star,
  ShoppingBag,
  ArrowUpRight,
  User,
} from "lucide-react";

const sizes = [
  { label: "25cl", price: 5000, desc: "Perfect daily dose" },
  { label: "50cl", price: 10000, desc: "Best value" },
];

const highlights = [
  { icon: Leaf, text: "100% Natural Ingredients" },
  { icon: Droplets, text: "Cold-Pressed Extraction" },
  { icon: Shield, text: "Lab Tested & Certified" },
  { icon: Sparkles, text: "No Artificial Additives" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 * i },
  }),
};

const ProductSection = () => {
  const [selectedSize] = useState(0);

  return (
    <section
      id="products"
      className="py-24 bg-[hsl(var(--background))] relative overflow-hidden"
    >
      {/* ambient background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[hsl(var(--primary))]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 w-[32rem] h-[32rem] rounded-full bg-[hsl(var(--primary))]/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/stardust.png')",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
        {/* ── LEFT — about the product / brand ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="lg:col-span-6 space-y-8"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
            <span className="w-6 h-px bg-[hsl(var(--accent))]" />
            Iconic Herbal Mixture
          </span>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[hsl(var(--foreground))]">
            Rooted in
            <span className="font-extrabold text-[hsl(var(--primary))]">
              {" "}
              Nature.
            </span>{" "}
            Crafted for Modern Wellness
          </h2>

          <p className="text-[hsl(var(--muted-foreground))] text-lg leading-relaxed max-w-xl font-light">
            We bridge ancestral herbal wisdom with rigorous modern science;
            sourcing rare botanicals from trusted growers and transforming them
            into elixirs that earn a permanent place on your shelf.
          </p>

          {/* feature grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {highlights.map(({ icon: Icon, text }, index) => (
              <motion.div
                key={text}
                custom={index}
                variants={fadeUp}
                className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/40 px-4 py-3.5 backdrop-blur-sm"
              >
                <span className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))] shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={2.25} />
                </span>
                <span className="text-[hsl(var(--foreground))]/85 flex items-center font-medium text-sm leading-snug">
                  {text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#about"
              className="group inline-flex items-center gap-2 px-8 py-4 border border-[hsl(var(--foreground))]/25 text-[hsl(var(--foreground))] uppercase tracking-widest text-[11px] font-bold hover:border-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground))]/5 transition-colors duration-300 rounded-full"
            >
              About Us
            </a>

            <a
              href="#products"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] uppercase tracking-widest text-[11px] font-bold shadow-elevated hover:bg-[hsl(var(--foreground))] transition-colors duration-300 rounded-full"
            >
              <ShoppingBag className="w-4 h-4" />
              View Products
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </a>
          </div>

          {/* social proof */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              4.9/5 · loved by 2,400+ customers
            </span>
          </div>
        </motion.div>

        {/* ── RIGHT — video (unchanged) ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="lg:col-span-6 relative"
        >
          {/* glow behind video */}
          <div className="absolute inset-0 bg-[hsl(var(--primary))]/20 rounded-3xl blur-2xl scale-95 pointer-events-none" />

          <div className="relative rounded-3xl overflow-hidden border border-[hsl(var(--border))]/50 shadow-2xl aspect-[4/5]">
            <video
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              controls
              className="w-full h-full object-cover"
            >
              <source
                src="https://iconic-herbals-dev.s3.us-east-1.amazonaws.com/videos/iconic-video.mp4"
                type="video/mp4"
              />
              {/* fallback — show bottle if no video */}
              <img
                src={iconic_bottle}
                alt="iconic-herbal-mix-bottle"
                className="w-full h-full object-contain p-12 bg-[hsl(var(--muted))]"
              />
            </video>

            {/* overlay badge bottom-left */}
            {/*   <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between bg-black/40 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
                <div>
                  <div className="text-white text-sm font-semibold">
                    ICONIC Herbal MIX
                  </div>
                  <div className="text-white/60 text-xs">
                    Premium Wellness Blend
                  </div>
                </div>
                <div className="text-white font-bold text-lg">
                  ₦{sizes[selectedSize].price}
                </div>
              </div>
            </div> */}
          </div>

          {/* floating social proof chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="absolute -top-3 -right-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2"
          >
            <div className="flex -space-x-1.5">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center border border-[hsl(var(--background))]"
                >
                  <User className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                </div>
              ))}
            </div>
            <div className="text-xs">
              <span className="font-semibold text-[hsl(var(--foreground))]">
                2.4k
              </span>
              <span className="text-[hsl(var(--muted-foreground))]">
                {" "}
                happy customers
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductSection;
