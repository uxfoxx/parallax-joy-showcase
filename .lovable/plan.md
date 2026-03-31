

# Context-Aware Card Styling: Dark vs Light Backgrounds

## Problem
The recent visibility fix applied stronger borders and shadows (`border-border`, `shadow-lg hover:shadow-2xl`) to all cards uniformly. On dark backgrounds (like the landing page Featured section), cards looked fine before — the stronger styling is only needed on light/white backgrounds.

## Solution
Add a `variant` prop to `ProductCard` (`"dark" | "light"`, default `"light"`) that controls border and shadow intensity. Apply the same logic inline for brand cards on `BrandsPage`.

### Card styles by variant

| Variant | Border | Shadow |
|---------|--------|--------|
| `dark` | `border-white/10` | `shadow-md hover:shadow-xl` |
| `light` (default) | `border-border` | `shadow-lg hover:shadow-2xl` |

### File changes

**`src/components/ProductCard.tsx`**
- Add `variant?: "dark" | "light"` prop (default `"light"`)
- Conditionally apply border/shadow classes based on variant

**`src/components/landing/FeaturedProducts.tsx`**
- Pass `variant="dark"` to `ProductCard`

**`src/pages/ProductsPage.tsx`**
- No change needed (light bg, default variant is correct)

**`src/pages/FeaturedPage.tsx`**
- No change needed (light bg, default variant is correct)

**`src/pages/BrandsPage.tsx`**
- No change needed (light bg, current styling is correct)

**`src/pages/BrandDetailPage.tsx`**
- Check bg color; if dark, pass `variant="dark"` to ProductCard

| File | Change |
|------|--------|
| `src/components/ProductCard.tsx` | Add `variant` prop, conditional card classes |
| `src/components/landing/FeaturedProducts.tsx` | Pass `variant="dark"` |
| `src/pages/BrandDetailPage.tsx` | Pass `variant="dark"` if on dark bg |

