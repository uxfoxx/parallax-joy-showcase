import { describe, expect, it } from "vitest";
import { packSize, variantGroupName, variantLabel, variantsOf } from "./products";

const p = (id: string, name: string, brand_id: string | null = "b1") => ({ id, name, brand_id });

describe("packSize", () => {
  it("reads sizes and counts from the name", () => {
    expect(packSize("Basmati Rice 20Kg")).toBe("20 kg");
    expect(packSize(`Albertos Flour Tortilla Wraps 10" 6'S`)).toBe("10 in · 6 per pack");
    expect(packSize("Paper Cup 12 Oz White Hd 50'S")).toBe("12 oz · 50 per pack");
    expect(packSize("Edam Cheese 40%")).toBeNull();
  });
});

describe("variants", () => {
  it("names the group and the variant", () => {
    expect(variantGroupName("Apple Pie Filling 50%")).toBe("Apple Pie Filling");
    expect(variantLabel("Apple Pie Filling 50%")).toBe("50%");
    expect(variantLabel("Cheese Slice 128'S")).toBe("128 per pack");
    expect(variantLabel("Mixed Veg 3 Way")).toBeNull();
  });

  // The near-duplicate pairs the build's audit found in the real catalogue.
  const catalogue = [
    p("1", "Apple Pie Filling 50%"),
    p("2", "Apple Pie Filling 70%"),
    p("3", "Basmati Rice 5Kg"),
    p("4", "Basmati Rice 20Kg"),
    p("5", "Aluminium Container With Lid 750Ml"),
    p("6", "Aluminium Container With Lid 1200Ml"),
    p("7", "Cheese Slice 90'S"),
    p("8", "Cheese Slice 128'S"),
    // Different products that only look alike — must NOT be grouped.
    p("9", "Cheddar Cheese Coloured 50%"),
    p("10", "Cheddar Cheese White 50%"),
    p("11", "Vinyl Gloves Medium Black 100'S"),
    p("12", "Vinyl Gloves Medium Blue 100'S"),
    p("13", "Extra Long Grain Basmati Rice Gold"),
    p("14", "Apple Pie Filling 60%", "other-brand"),
    p("15", "Honey"),
    p("16", "Honey 1Kg"),
  ];
  const ids = (id: string) => variantsOf(catalogue.find((x) => x.id === id)!, catalogue).map((x) => x.id);

  it("groups pack sizes and percentages of the same product", () => {
    expect(ids("1")).toEqual(["2"]);
    expect(ids("4")).toEqual(["3"]);
    expect(ids("5")).toEqual(["6"]);
    expect(ids("8")).toEqual(["7"]);
  });

  it("keeps different products and other brands apart", () => {
    expect(ids("9")).toEqual([]);
    expect(ids("11")).toEqual([]);
    expect(ids("13")).toEqual([]);
    expect(ids("14")).toEqual([]);
  });

  it("reads the same from either page (no one-sided groups)", () => {
    expect(ids("15")).toEqual([]);
    expect(ids("16")).toEqual([]);
  });
});
