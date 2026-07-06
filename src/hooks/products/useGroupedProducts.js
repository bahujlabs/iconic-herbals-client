import { useQuery } from "@tanstack/react-query";
import { productApi } from "../../api/productApi.js";

function stripSize(name = "") {
  return name.replace(/\s+\d+(\.\d+)?(cl|ml|l|oz)$/i, "").trim();
}

function groupBySizes(rawProducts) {
  const groups = new Map();
  for (const doc of rawProducts) {
    const baseName = stripSize(doc.name);
    const key = `${baseName}__${doc.category}`;
    const sizeEntry = {
      id: doc.size || doc._id,
      label: doc.size || "Standard",
      price: doc.price,
      stock: doc.stock,
      productId: doc._id,
    };
    if (!groups.has(key)) {
      groups.set(key, {
        ...doc,
        id: doc._id,
        name: baseName,
        sizes: [sizeEntry],
      });
    } else {
      groups.get(key).sizes.push(sizeEntry);
    }
  }
  for (const group of groups.values()) {
    group.sizes.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }
  return Array.from(groups.values());
}

export function useGroupedProducts(params = {}) {
  const query = useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await productApi.getAll(params);
      console.log("API response:", res); // remove after confirming shape
      return res;
    },
    staleTime: 1000 * 60 * 5,
  });

  const raw = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? query.data?.products ?? query.data?.items ?? []);

  const grouped = raw.length ? groupBySizes(raw) : [];

  return { ...query, data: grouped };
}
