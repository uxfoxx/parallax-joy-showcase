

# Fix Incomplete Tasks: Team Section, Location Section, Product Cards, Page Connections

## Issues Found

1. **Team Section ("Three Decades of Excellence")** — User asked for white background, but it still has dark video background with overlay. Video URL may also not load (Pexels video).
2. **Location Section** — Still basic layout, not modernized as requested. Needs a more polished, modern white-section design.
3. **Product Cards** — Show image in fixed-height container with text below. User wants full-image cards with details overlaid on hover.
4. **Featured section landing page not connected to Featured page** — Landing FeaturedProducts has no "View All" link to `/featured`. Similarly Categories section doesn't link to `/products?category=X`.
5. **ProductDetailPage** — Shows a placeholder letter instead of the product image (line 44-45).
6. **Team video not playing** — Pexels video URL may be blocked/invalid. Need a reliable video source or fallback.

## Plan

### 1. Team Section — White Background (as requested)
**File**: `src/components/landing/TeamSection.tsx`
- Remove the video background entirely
- Change to white background with subtle accent orbs (matching LocationsSection style)
- Change all text colors from `primary-foreground` to `foreground` (dark text on white)
- Keep the marquee photo cards and heading
- Update the "Our Team" badge to light theme styling

### 2. Location Section — Modern Redesign
**File**: `src/components/landing/LocationsSection.tsx`
- Full-width map as hero background with overlay card for contact details
- Or: Side-by-side with larger map, glassmorphism contact card
- Add subtle iconography, better spacing, modern card with rounded corners and shadow
- Keep white background

### 3. Product Cards — Full Image with Hover Overlay
**File**: `src/components/ProductCard.tsx`
- Make the card fully image-based: image fills entire card (aspect-ratio 3/4)
- Product name, brand, category shown as overlay on hover with gradient from bottom
- Remove the separate text section below image
- Keep Featured badge and category badge always visible

### 4. Connect Featured Section to Featured Page
**File**: `src/components/landing/FeaturedProducts.tsx`
- Add "View All Featured" button/link at bottom pointing to `/featured`

### 5. Connect Categories Section to Products Page
**File**: `src/components/landing/CategoriesSection.tsx`
- Make each category card clickable, linking to `/products` (with category filter in URL or state)

### 6. Fix ProductDetailPage — Show Product Image
**File**: `src/pages/ProductDetailPage.tsx`
- Replace the placeholder letter (line 44-45) with actual `product.image_url` when available
- Keep letter fallback if no image

### 7. FeaturedProducts Landing Cards — Show "View All"
**File**: `src/components/landing/FeaturedProducts.tsx`
- Add a "View All Featured Products →" link below the grid

## Files to Modify

| File | Change |
|------|--------|
| `src/components/landing/TeamSection.tsx` | White bg, remove video, dark text |
| `src/components/landing/LocationsSection.tsx` | Modern white layout redesign |
| `src/components/ProductCard.tsx` | Full-image card with hover overlay |
| `src/components/landing/FeaturedProducts.tsx` | Add "View All" link to `/featured` |
| `src/components/landing/CategoriesSection.tsx` | Make cards link to `/products` filtered |
| `src/pages/ProductDetailPage.tsx` | Show product image instead of letter |

