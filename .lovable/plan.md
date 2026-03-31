

# Unify Card Styles + Redesign Product Detail Page

## 1. Brand Cards — Match ProductCard Style
**File**: `src/pages/BrandsPage.tsx`

Replace the current text-heavy brand cards (lines 34-58) with full-image overlay cards matching `ProductCard`:
- Full-bleed image background with `aspect-[4/5]`
- Brand name always visible at bottom with gradient overlay
- On hover: reveal description, origin, product count
- Fallback: gradient + large initial letter if no `image_url`

**File**: `src/pages/BrandDetailPage.tsx`
- Update grid gap from `gap-8` to `gap-5` for consistency

## 2. Product Detail Page — Luxury Layout (Reference Image Style)
**File**: `src/pages/ProductDetailPage.tsx`

Redesign to match the uploaded reference (Maison Margiela product page) adapted to our forest-green theme:

**Layout**: Full-width two-column split
- **Left column (55%)**: Large product image filling full height, no rounded corners, edge-to-edge within column. If multiple images existed, show thumbnail strip on the left side (future-ready)
- **Right column (45%)**: Clean white space with product details

**Right column content** (top to bottom):
- Breadcrumb: `Home / Products / Category` in small muted text
- Product name in large `font-display` bold (text-3xl md:text-5xl)
- Brand name as subtle link
- Description paragraph
- Details table (key-value pairs): Origin, SKU, Category — styled as uppercase labels with values, separated by subtle borders
- Tags displayed as minimal badges
- Back link at bottom

**Styling**:
- Clean white background, no gradients on this page
- Generous whitespace and typography hierarchy
- Remove the current `aspect-square` constraint on image — let it be tall (`min-h-[500px] lg:min-h-[700px]`)
- Related products section stays but with `gap-5` grid

## 3. Ensure Consistency Across All Pages
- `ProductsPage.tsx`: Already uses `ProductCard` — just tighten gap from `gap-6` to `gap-5`
- `FeaturedPage.tsx`: Already uses `ProductCard` with `gap-5` — no changes needed
- `BrandDetailPage.tsx`: Already uses `ProductCard` — tighten gap to `gap-5`

## Files

| File | Change |
|------|--------|
| `src/pages/BrandsPage.tsx` | Full-image overlay brand cards matching ProductCard style |
| `src/pages/ProductDetailPage.tsx` | Luxury two-column layout inspired by reference image |
| `src/pages/ProductsPage.tsx` | Tighten grid gap to `gap-5` |
| `src/pages/BrandDetailPage.tsx` | Tighten grid gap to `gap-5` |

