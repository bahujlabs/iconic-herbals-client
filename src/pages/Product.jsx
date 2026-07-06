import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Plus, Star } from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { PRODUCT_CATEGORIES } from "./lib/product.js"; // categories can stay static for now
import { useGroupedProducts } from "../hooks/products/useGroupedProducts.js";
import { useCartStore } from "../store/cart/cartStore";
import { useUiStore } from "../store/uiStore";
import { useCurrencyProvider } from "../hooks/useCurrencyProvider";

const Product = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");

  const { data: PRODUCTS, isLoading, isError, error } = useGroupedProducts();

  const addItem = useCartStore((s) => s.addItem);
  const toast = useUiStore((s) => s.toast);
  const { convert } = useCurrencyProvider("NGN");

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice();
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.heroIngredient, p.tagline, p.description].some((f) =>
          (f || "").toLowerCase().includes(q),
        ),
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.sizes[0].price - b.sizes[0].price);
        break;
      case "price-desc":
        list.sort((a, b) => b.sizes[0].price - a.sizes[0].price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return list;
  }, [PRODUCTS, query, category, sort]);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    const variant = product.sizes[0]; // smallest/default size on quick-add
    addItem({
      id: variant.productId, // the real Mongo _id of that size's document
      name: product.name,
      price: variant.price,
      size: variant.label,
    });
    toast(`${product.name} · ${variant.label} added to cart`, "success");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <p className="text-[hsl(var(--muted-foreground))]">
            Loading remedies...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <p className="text-[hsl(var(--muted-foreground))]">
            Couldn't load products: {error.message}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Navbar />

      {/* Page header */}
      <section className="pt-32 pb-16 border-b border-hsl(var(--border))">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7 space-y-6">
              <span className="eyebrow">The Full Apothecary</span>
              <h1 className="text-5xl md:text-7xl font-display text-[hsl(var(--foreground))] leading-tight">
                All <span className="italic">Remedies</span>
              </h1>
              <p className="text-[hsl(var(--muted-foreground))] text-lg max-w-xl">
                A complete collection of small-batch botanical formulas. Browse
                by ritual, filter by intention, find your daily ally.
              </p>
            </div>
            <div className="md:col-span-5 md:text-right">
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                <span className="font-display text-3xl text-[hsl(var(--foreground))] italic mr-2">
                  {filtered.length}
                </span>
                {filtered.length === 1 ? "remedy" : "remedies"} available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-[68px] z-30 bg-[hsl(var(--background))]/90 backdrop-blur-md border-b border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors border ${
                  category === cat.id
                    ? "bg-[hsl(var(--foreground))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--foreground))]"
                    : "bg-transparent text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--foreground))]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search remedies"
                className="pl-9 pr-4 py-2 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm focus:outline-none focus:border-[hsl(var(--accent))] w-full lg:w-56"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm font-medium focus:outline-none focus:border-[hsl(var(--accent))]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-3xl italic text-[hsl(var(--foreground))] mb-2">
              Nothing here
            </p>
            <p className="text-[hsl(var(--muted-foreground))]">
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.06 }}
                className="group"
              >
                <Link to={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[hsl(var(--secondary))] mb-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={667}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                    {product.badge && (
                      <span className="absolute top-4 left-4 bg-[hsl(var(--foreground))] text-[hsl(var(--primary-foreground))] text-[10px] px-3 py-1.5 uppercase tracking-widest">
                        {product.badge}
                      </span>
                    )}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-6 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shadow-xl inline-flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3" /> Quick Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
                      {product.categoryLabel}
                    </p>
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-display text-2xl text-[hsl(var(--foreground))]">
                        {product.name}
                      </h3>
                      <span className="text-sm text-[hsl(var(--foreground))] font-medium whitespace-nowrap">
                        from {convert(product.sizes[0].price)}
                      </span>
                    </div>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed line-clamp-2">
                      {product.tagline}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <Star className="w-3.5 h-3.5 fill-[hsl(var(--accent))] text-accent" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating}{" "}
                        <span className="text-muted-foreground/60">
                          ({product.reviews})
                        </span>
                      </span>
                      <span className="text-muted-foreground/40 mx-2">·</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        {product.sizes.map((s) => s.label).join(" / ")}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Product;
