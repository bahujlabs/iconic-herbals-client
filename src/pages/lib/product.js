import immunity from "../../assets/iconic_bottle.png";
import midnight from "../../assets/iconic_bottle.png";

export const PRODUCTS = [
  {
    id: "Iconic Herbal MIxture(25cm)",
    slug: "immunity-mixture",
    name: "Immunity mixyure",
    category: "immunity",
    categoryLabel: "Immunity",
    tagline: "Bio-available reinforcement for the modern immune system.",
    description:
      "A potent daily defense formulated with European elderberry, echinacea root, and Siberian astragalus. Cold-pressed to preserve the full spectrum of bioactive compounds.",
    image: immunity,
    sizes: [{ id: "25cl", label: "25cl", price: 3000 }],
    rating: 4.9,
    reviews: 214,
    benefits: [
      "Supports immune system resilience",
      "Rich in natural antioxidants",
      "Daily defense formula",
      "Cold-pressed extraction",
    ],

    usage: "Take 15ml twice daily with meals. Shake well before use.",
    badge: "Best Seller",
    featured: true,
  },
  {
    id: "Iconic Herbal MIxture(50cm)",
    slug: "immunity-mixture",
    name: "Immunity mixyure",
    category: "immunity",
    categoryLabel: "Immunity",
    tagline: "Bio-available reinforcement for the modern immune system.",
    description:
      "A potent daily defense formulated with European elderberry, echinacea root, and Siberian astragalus. Cold-pressed to preserve the full spectrum of bioactive compounds.",
    image: immunity,
    sizes: [{ id: "50cl", label: "50cl", price: 6000 }],
    rating: 4.9,
    reviews: 214,
    benefits: [
      "Supports immune system resilience",
      "Rich in natural antioxidants",
      "Daily defense formula",
      "Cold-pressed extraction",
    ],

    usage: "Take 15ml twice daily with meals. Shake well before use.",
    badge: "Best Seller",
    featured: true,
  },
  {
    id: "Pura-flush",
    slug: "Pura-flush",
    name: "Pura-flush",
    category: "sleep",
    categoryLabel: "Rest & Recovery",
    tagline: "Deeply calming botanicals to induce restorative REM cycles.",
    description:
      "An evening ritual built around French lavender, valerian root, and chamomile flower — designed to ease the nervous system into deep, uninterrupted sleep.",
    image: midnight,
    sizes: [{ id: " ", label: "50cl", price: 8000 }],
    rating: 4.8,
    reviews: 187,
    benefits: [
      "Promotes restful, restorative sleep",
      "Calms the nervous system",
      "Non-habit forming",
      "Gentle, plant-based formula",
    ],
    ingredients: [],
    usage: "Take 10ml 30 minutes before bedtime.",
    featured: true,
  },
];

export const PRODUCT_CATEGORIES = [
  { id: "all", label: "All Remedies" },
  { id: "immunity", label: "Immunity" },
  { id: "sleep", label: "Rest & Recovery" },
  { id: "vitality", label: "Vitality" },
  { id: "focus", label: "Focus & Clarity" },
  { id: "digestion", label: "Digestion" },
];

export const getProductBySlug = (slug) =>
  PRODUCTS.find((product) => product.slug === slug);

export const getProductById = (id) =>
  PRODUCTS.find((product) => product.id === id);

export const getRelatedProducts = (slug, limit = 3) =>
  PRODUCTS.filter((product) => product.slug !== slug).slice(0, limit);
