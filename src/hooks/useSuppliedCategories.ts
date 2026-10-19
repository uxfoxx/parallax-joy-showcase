import { useMemo } from "react";
import { useProducts, type Product } from "@/lib/api";

/** Categories on a product (the generated DB types predate the `categories` array). */
export const productCategories = (p: Product): string[] => {
  const cats = (p as Product & { categories?: string[] | null }).categories;
  return cats?.length ? cats : p.category ? [p.category] : [];
};

/**
 * Categories that currently have products — exactly the ones with a landing
 * page and a sitemap entry — most products first.
 */
export const useSuppliedCategories = () => {
  const { data: products = [] } = useProducts();
  return useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) for (const c of productCategories(p)) counts[c] = (counts[c] ?? 0) + 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [products]);
};
