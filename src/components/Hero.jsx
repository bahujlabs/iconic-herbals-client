import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Leaf } from "lucide-react";
import heroBottle from "../assets/iconic_bottle.png";

const Hero = () => {
  /* const [scrolled, setScrolled] = useState(false) 
  useEffect(()=>{
     if(window.innerHeight > 20){
        setScrolled(true)
        console.log(scrolled)
     }
  }) */
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-background">
      {/* 🌑 LEFT DARK OVERLAY (FIX TEXT VISIBILITY) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* 🌿 FLOATING LEAVES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 25, -25, 0],
              rotate: [0, 20, -20, 0],
            }}
            transition={{
              duration: 14 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Leaf
              size={28 + i * 4}
              strokeWidth={1}
              className="text-green-400/40"
              style={{
                fill: "rgba(74, 222, 128, 0.25)", // soft green fill
                filter:
                  "blur(0.5px) drop-shadow(0 0 6px rgba(74,222,128,0.35))",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* ✨ SOFT LIGHT GLOW */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-125 h-125 bg-white/20 blur-3xl rounded-full top-[20%] left-1/2 -translate-x-1/2" />
      </div>

      {/* 📦 CONTENT */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 pt-24">
        {/* LEFT TEXT */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6"
            style={{
              background: "hsla(42, 60%, 50%, 0.2)",
              color: "hsl(42, 80%, 70%)",
            }}
          >
            100% Natural · Herbal Wellness
          </motion.span>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
            style={{ color: "#ffffff" }}
          >
            Drink Pure
            <br />
            <span className="text-gradient-gold">Live Well.</span>
          </h1>

          <p
            className="text-lg max-w-lg mx-auto lg:mx-0 mb-8"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Handcrafted from rare botanical ingredients, our premium herbal
            liquid nurtures your body and revitalizes your spirit — naturally.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <motion.a
              href="#order"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-full font-semibold text-sm gradient-gold shadow-xl"
              style={{ color: "hsl(150, 30%, 10%)" }}
            >
              Buy Now
            </motion.a>

            <motion.a
              href="#benefits"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-full font-semibold text-sm border"
              style={{
                borderColor: "hsl(140, 20%, 40%)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>

        {/* RIGHT BOTTLE */}
        <motion.div
          className="flex-1 flex justify-center relative"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.img
            src={heroBottle}
            alt="Herbal bottle"
            className="max-w-125 sm:max-w-[360px] lg:max-w-[420px]"
            style={{
              filter:
                "drop-shadow(0 30px 60px rgba(0,0,0,0.25)) drop-shadow(0 0 30px rgba(76,175,80,0.35))",
            }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* ⬇️ SCROLL INDICATOR */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-white/60" />
      </motion.div>
    </section>
  );
};

export default Hero;
