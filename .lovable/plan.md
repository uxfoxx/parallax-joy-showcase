

# Unify Grid Layouts to 3-Column Across All Pages

## Problem
- **Featured section (landing)**: `md:grid-cols-3` with `ProductCard large` — the target style
- **Brands page**: `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` — too many columns
- **Featured page**: `sm:grid-cols-2 lg:grid-cols-3` — close but missing `large` prop
- **Products page**: `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` — too many columns, no `large` prop

## Changes

| File | Change |
|------|--------|
| `src/pages/BrandsPage.tsx` | Grid → `md:grid-cols-3 gap-5` (remove `sm:grid-cols-2 xl:grid-cols-4`) |
| `src/pages/FeaturedPage.tsx` | Grid → `md:grid-cols-3 gap-5`, add `large` prop to `ProductCard` (already has it) |
| `src/pages/ProductsPage.tsx` | Grid → `md:grid-cols-3 gap-5` (remove `sm:grid-cols-2 xl:grid-cols-4`), add `large` prop to `ProductCard` |

All three pages will match the featured section's exact grid: `grid md:grid-cols-3 gap-5` with `ProductCard large`.

