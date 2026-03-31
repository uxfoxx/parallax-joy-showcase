

# Redesign Product & Brand Pages — Clean Editorial Style

## Reference Style
The uploaded image shows a clean, editorial e-commerce layout: white/cream background, no hero banners, products displayed on clean white/neutral backgrounds with centered product images (not full-bleed), product name below in uppercase, minimal borders (thin lines), and a grid with mixed sizing. The overall feel is minimalist, editorial, and gallery-like.

## Changes

### 1. New Product Card — Clean Editorial Style
**File**: `src/components/ProductCard.tsx`
- Remove the current dark overlay/full-image approach
- New design: white/cream card with thin `border-border` line, no rounded corners (or very subtle `rounded-sm`)
- Product image centered on a neutral `bg-[#f5f2ed]` background with `object-contain` (not cover) and generous padding — so the product "floats" on a clean background
- Below image: product name in uppercase `tracking-wide text-xs font-body`, brand name smaller underneath
- On hover: subtle scale on image only (1.03), no card movement
- Remove badges overlay, shine effects, gradient overlays — keep it minimal

### 2. Products Page — Editorial Grid Layout
**File**: `src/pages/ProductsPage.tsx`
- Remove the dark green hero banner entirely
- Replace with a clean white header section: large left-aligned title ("ALL PRODUCTS" uppercase), description paragraph below, then inline filter controls (sort dropdown + filter by category/brand)
- Grid: `grid-cols-2 lg:grid-cols-4` with thin border dividers between cells (use border on cards or negative margins with shared borders)
- Search bar becomes a minimal inline text input, not a chunky rounded pill
- Category/brand filters shown as simple text buttons or a dropdown, not pill badges

### 3. Featured Page — Same Editorial Style
**File**: `src/pages/FeaturedPage.tsx`
- Remove dark hero banner
- Clean white header with "FEATURED PRODUCTS" uppercase title, left-aligned
- Same editorial grid as products page
- Use `ProductCard` component directly

### 4. Brands Page — Gallery Grid
**File**: `src/pages/BrandsPage.tsx`
- Remove dark hero banner
- White page with "OUR BRANDS" uppercase title, left-aligned
- Brand cards: large image area on neutral background (`object-contain`), brand name uppercase below, origin + product count as subtle metadata
- Clean thin borders, minimal hover effects
- Grid: `grid-cols-2 lg:grid-cols-3`

### 5. Brand Detail Page — Clean Header
**File**: `src/pages/BrandDetailPage.tsx`
- Remove dark hero/noise banner
- White background with brand logo/image, brand name as large uppercase heading, description, origin/established as inline metadata
- Products section below uses same `ProductCard` grid

### 6. Product Detail Page — Editorial Layout
**File**: `src/pages/ProductDetailPage.tsx`
- Remove any remaining dark elements
- Two-column layout: left = large product image on neutral cream background (`object-contain`), right = product info
- Clean breadcrumbs at top
- Product name uppercase, category as subtle label, brand as text link
- Details (origin, SKU, tags) as clean list with thin separators
- Related products section uses `ProductCard` grid

## Files

| File | Change |
|------|--------|
| `src/components/ProductCard.tsx` | Editorial card: white bg, centered image, name below, minimal |
| `src/pages/ProductsPage.tsx` | Remove dark hero, editorial white layout, inline filters |
| `src/pages/FeaturedPage.tsx` | Remove dark hero, clean white header, editorial grid |
| `src/pages/BrandsPage.tsx` | Remove dark hero, gallery grid with brand images |
| `src/pages/BrandDetailPage.tsx` | White header, clean layout |
| `src/pages/ProductDetailPage.tsx` | Clean two-column editorial layout |

