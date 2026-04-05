

# Restructure Products & Our Products Sections

## Overview
Remove the standalone `/our-products` page. Split the landing page into two sections: a new **Featured Products** section (3 products) and the existing **Our Products** section. Both link to `/products` with appropriate filters. Add a new `our_product` boolean column to the database.

## Database Change
- Add `our_product` boolean column to `products` table (default `false`)
- This separates "featured" (3 products shown in new section) from "our product" (curated selection)

## Files to Change

### 1. DB Migration
Add column: `ALTER TABLE products ADD COLUMN our_product boolean NOT NULL DEFAULT false;`

### 2. `src/lib/api.ts`
- Add `useOurProducts()` hook — fetches products where `our_product = true`
- Keep `useFeaturedProducts()` as-is (fetches `featured = true`)

### 3. `src/components/landing/FeaturedProducts.tsx` → Rename to show "Featured Products"
- Title: "Featured Products" instead of "Our Products"
- Button: "View All Products →" linking to `/products`
- Still uses `useFeaturedProducts()`, shows 3

### 4. New `src/components/landing/OurProductsSection.tsx`
- Uses `useOurProducts()` to show "our product" items
- Title: "Our Products"
- Button: "View Our Products →" linking to `/products?our=true`

### 5. `src/pages/Index.tsx`
- Add `OurProductsSection` AFTER `FeaturedProducts`
- Order: LogoStrip → FeaturedProducts → OurProductsSection → WhyChooseUs

### 6. `src/pages/ProductsPage.tsx`
- Read `?our=true` from URL search params
- When present, filter products to `our_product = true` and show "Our Products" title instead of "All Products"

### 7. Remove `src/pages/OurProductsPage.tsx`
- Delete the file

### 8. `src/App.tsx`
- Remove `/our-products` route and import

### 9. `src/components/landing/Navbar.tsx`
- Remove "Our Products" from nav links

### 10. Admin Panel Changes

**`src/pages/admin/AdminFeatured.tsx`** → Rename to "Our Products" admin
- Manage `our_product` flag instead of `featured`
- Add a separate section or tab for managing the 3 featured products
- Enforce max 3 featured products with validation

**`src/components/admin/AdminSidebar.tsx`**
- Update sidebar: "Our Products" manages `our_product`, add "Featured" for `featured` (or combine into one page with two tabs)

### 11. `src/components/landing/Footer.tsx`
- Update "Our Products" link to `/products?our=true`

