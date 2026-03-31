

# Verification + Fix: Product Images, Remaining Issues

## Current Status

**Working correctly:**
- Navbar: Fixed, section-aware color switching with IntersectionObserver — working
- WhatsApp button: Fixed at `bottom-6 right-6 z-[9999]`, correct number (+94 11 207 1717) — working
- FAQ gradient: Dark at bottom — implemented
- Horizontal scrollbar: `overflow-x-hidden` on root + html/body — implemented
- Custom cursor: Ref-based animation with contrast outline — implemented
- Hero: No longer sticky — implemented

**Not yet done:**
1. **Product images missing** — The `products` table has no `image_url` column. ProductCard shows a Package icon placeholder. FeaturedProducts shows abstract gradient boxes instead of real product photos.
2. **No product images in database** — Need to add an `image_url` column and populate with sample food images (Unsplash URLs for each product type).
3. **Brands have no images** — The `brands` table also lacks an `image_url` or `logo_url` column.

## Plan

### 1. Add `image_url` column to products and brands tables
- Migration: `ALTER TABLE products ADD COLUMN image_url text;`
- Migration: `ALTER TABLE brands ADD COLUMN image_url text;`
- Update all 21 products with relevant Unsplash food images (rice, salmon, cheese, spices, etc.)
- Update all 6 brands with brand-style images

### 2. Update ProductCard to show images
- Replace the `Package` icon placeholder with an `<img>` tag using `product.image_url`
- Fallback to the current gradient + icon if no image

### 3. Update FeaturedProducts cards to show product images
- Replace the abstract gradient box mock-up with actual product images
- Keep the hover animation and card styling

### 4. Update BrandsPage / BrandDetailPage cards
- Show brand images where available

## Files

| Action | File |
|--------|------|
| Migration | Add `image_url` to `products` and `brands` tables + seed with Unsplash URLs |
| Modify | `src/components/ProductCard.tsx` — show product image |
| Modify | `src/components/landing/FeaturedProducts.tsx` — show product image in featured cards |
| Modify | `src/pages/BrandsPage.tsx` — show brand images |

