import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Leaf,
  Moon,
  Sun,
  Menu,
  X,
  ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CurrencySelector } from "./CurrencySelector"; // Import the context-based selector
import CartIcon from "./CartIcon";

const navLinks = [
  { label: "Products", href: "products" },
  //{ label: "Benefits", href: "#benefits" },
  //{ label: "How It Works", href: "#how-it-works" },
  //{ label: "Testimonials", href: "#testimonials" },
  //{ label: "Order", href: "#order" },
];

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [totalQty, setTotalQty] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 w-full z-100 h-0.5">
        <div
          className="h-full bg-[hsl(var(--primary))]"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-strong py-3" : "py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Leaf className="w-7 h-7 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-display text-xl font-bold text-[hsl(var(--foreground))]">
              Iconic
              <span className="text-[hsl(var(--primary))]">Herbal Mix</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors duration-200 relative"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* CurrencySelector managed by context */}
            {/* <CurrencySelector /> */}

            {/* Dark Mode Toggle */}
            <button
              className="p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
              aria-label="Toggle Theme"
              onClick={() => setDark(!dark)}
            >
              {dark ? (
                <Sun className="w-4 h-4 text-[hsl(var(--accent))]" />
              ) : (
                <Moon className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              )}
            </button>

            {/* Order Button */}

            <CartIcon />

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden glass-strong mt-2 mx-4 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="p-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2 px-3 text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  /*  onClick={() => cartDrawerStore.open()} */
                  className="relative p-2.5 hover:bg-secondary transition-colors"
                  aria-label="Open cart"
                >
                  <ShoppingBag className="w-4 h-4 text-foreground" />
                  <AnimatePresence>
                    {totalQty > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 bg-accent text-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                      >
                        {totalQty}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default NavBar;
