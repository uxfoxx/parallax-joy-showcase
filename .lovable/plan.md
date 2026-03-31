

# Improve Product Cards, Use in Featured Section, Fix Stats Section Background

## 1. Product Card UI Upgrade
**File**: `src/components/ProductCard.tsx`

Current card is functional but basic. Improvements:
- Add a subtle inner shadow and border for depth
- Smoother gradient overlay (three-stop gradient)
- Always show product name at bottom (not just on hover) with a clean text shadow
- On hover: reveal description + brand/origin with a slide-up panel effect
- Add a subtle shine/highlight effect on hover (pseudo-element or gradient overlay)
- Slightly larger bottom padding for breathing room
- Add `shadow-lg` on hover for lift effect

## 2. Featured Section — Use ProductCard Component
**File**: `src/components/landing/FeaturedProducts.tsx`

Currently the featured section builds its own custom cards (lines 62-108) with dark green gradient backgrounds, badges, and "View Product" buttons — completely different from ProductCard. Replace with the shared `ProductCard` component:
- Import `ProductCard` from `@/components/ProductCard`
- Replace the custom card markup with `<ProductCard product={product} large />`
- Remove the scroll-linked `gridShift`, `gridRotate`, `firstCardScale`, `firstCardOpacity` transforms (they cause jank and distort the cards)
- Keep the section background, heading, and "View All" button as-is

## 3. Stats Section — Full White Background
**File**: `src/components/landing/StatsSection.tsx`

The section currently has `bg-muted/30` (line 74) which gives it a grayish tint, plus green decorative orbs. Fix:
- Change `bg-muted/30` to `bg-white`
- Remove the parallax green orbs entirely (lines 77-89)
- Keep the TiltCard borders and content styling — they already use `bg-card` which works on white
- The section will read as fully white with clean stat cards

Also update `src/pages/Index.tsx` to set `data-navbar-theme="light"` on the StatsSection wrapper (it's currently `"dark"`).

## Files

| File | Change |
|------|--------|
| `src/components/ProductCard.tsx` | Better shadows, always-visible name, smoother hover, shine effect |
| `src/components/landing/FeaturedProducts.tsx` | Use `ProductCard` component, remove scroll distortion transforms |
| `src/components/landing/StatsSection.tsx` | `bg-white`, remove green orbs |
| `src/pages/Index.tsx` | StatsSection wrapper → `data-navbar-theme="light"` |

