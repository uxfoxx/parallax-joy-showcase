

# Add Default Product Images to All Products

## What
Copy the 4 uploaded product images (Diamond Milk, Nescafe, Dove Soap, Dove Shampoo) into the project's public folder, then update all 206 products to cycle through these 4 images as their `image_url`. Also insert entries into the `product_images` table so each product has all 4 images available in their gallery.

## How

### 1. Copy images to `public/images/`
Copy the 4 uploaded images into `public/images/products/` so they're accessible via URL:
- `public/images/products/diamond-milk.png`
- `public/images/products/nescafe-classic.png`
- `public/images/products/dove-soap.png`
- `public/images/products/dove-shampoo.png`

### 2. Database migration
Create a migration that:
- Updates all products' `image_url` to cycle through the 4 images (using row_number modulo 4)
- Inserts 4 rows into `product_images` for each product (all 4 images per product, with sort_order 0-3)

The image URLs will use relative paths like `/images/products/diamond-milk.png`.

### 3. No code changes needed
The existing `ProductDetailPage`, `ProductCard`, and admin panel already handle `image_url` and `product_images` — they'll automatically display the new images.

## Files

| File | Change |
|------|--------|
| `public/images/products/` | 4 new image files copied from uploads |
| Migration SQL | Update all products' image_url + insert product_images rows |

