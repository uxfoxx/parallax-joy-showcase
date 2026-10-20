import { describe, expect, it } from "vitest";
import { copyApplies, withBrandCopy, withProductCopy } from "./copy";
import type { Brand, Product } from "./api";

const brand = (slug: string, description: string, origin = "", established: number | null = null) =>
  ({ id: slug, slug, name: slug, description, origin, established, image_url: null, created_at: "" }) as Brand;

describe("copyApplies", () => {
  it("applies to empty admin text and to the text it replaces, ignoring markup and spacing", () => {
    expect(copyApplies("", "old")).toBe(true);
    expect(copyApplies(null)).toBe(true);
    expect(copyApplies("<p>Mavees  Smooth</p>", "Mavees Smooth")).toBe(true);
  });
  it("lets edited admin text win", () => {
    expect(copyApplies("Something the client wrote", "old")).toBe(false);
    expect(copyApplies("Anything", undefined)).toBe(false);
  });
});

describe("withBrandCopy", () => {
  it("replaces the admin description it was written for and fills empty origin/established", () => {
    const b = withBrandCopy(brand("tabasco", "Tabasco sauce is a famous American brand of hot sauce created in 1868 by Edmund McIlhenny on Avery Island, Louisiana. Made from tabasco peppers, vinegar, and salt, the mash is aged in oak barrels for up to three years. It is known for its versatile, sharp heat and is sold in over 195 countries."));
    expect(b.description).toMatch(/^The pepper sauce made by McIlhenny Company/);
    expect(b.origin).toBe("United States");
    expect(b.established).toBe(1868);
  });
  it("keeps a description edited in the admin, and the admin's own origin", () => {
    const b = withBrandCopy(brand("tabasco", "New text from the admin", "USA"));
    expect(b.description).toBe("New text from the admin");
    expect(b.origin).toBe("USA");
  });
  it("leaves brands without a profile untouched", () => {
    const raw = brand("no-such-brand", "x");
    expect(withBrandCopy(raw)).toBe(raw);
  });
});

describe("withProductCopy", () => {
  const product = (slug: string, description: string) => ({ slug, description, brands: brand("mavees", "") }) as unknown as Product;
  it("fills an empty description and the nested brand", () => {
    const p = withProductCopy(product("premium-cooking-cream", ""));
    expect(p.description).toMatch(/Premium Cooking Cream/);
    expect(p.brands?.description).toMatch(/Mavee Foods/);
  });
  it("never touches held products", () => {
    const p = withProductCopy(product("acroyali-apple-pie-filling-50", "Live text"));
    expect(p.description).toBe("Live text");
  });
});
