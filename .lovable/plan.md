

# Redesign Product Detail Page, Replace Featured with Our Products, Add Rich Text Editor, Remove Custom Cursor

## Summary
Redesign the product detail page to match the reference layout (large image + thumbnails on left, details on right), replace the "Featured" page/nav with "Our Products", add a rich text editor for product descriptions in admin, and remove the custom cursor.

## Changes

### 1. Remove Custom Cursor
- Delete `src/components/landing/CustomCursor.tsx`
- Remove import and `<CustomCursor />` from `src/App.tsx`

### 2. Redesign Product Detail Page (`src/pages/ProductDetailPage.tsx`)
Inspired by the reference image layout while keeping our dark/green style:
- **Left side (55%)**: Large main product image with thumbnail strip below it (small clickable thumbnails in a horizontal row, active one highlighted with border)
- **Right side (45%)**: Breadcrumb → Product name → Brand → Description (rendered as HTML from rich text) → Details table (Category, Origin, SKU, Brand) → Tags → Inquire button
- Keep the "More from brand" related products section below

### 3. Replace Featured Page with "Our Products" Page
- Rename `FeaturedPage.tsx` → remove it
- Rename `/featured` route → `/our-products` in `App.tsx`
- Create new `OurProductsPage.tsx` — a curated page showing "Our Products" (products marked as featured or a dedicated flag), same style as current products page but titled "Our Products"
- Update `FeaturedProducts` landing section link from `/featured` to `/our-products`, button text to "View Our Products →"

### 4. Update Navigation
- In `Navbar.tsx` links array: change `{ label: "Featured", href: "/featured" }` → `{ label: "Our Products", href: "/our-products" }`
- In `AdminSidebar.tsx`: rename "Featured" → "Our Products" (keeps same admin page for toggling featured flag)

### 5. Rich Text Editor for Product Description (Admin)
- Install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-underline` — lightweight rich text editor
- Create `src/components/admin/RichTextEditor.tsx` — toolbar with bold, italic, underline, bullet list, ordered list, link buttons + the tiptap editor area
- Replace `<Textarea>` for description in `AdminProducts.tsx` with this rich text editor component
- Store HTML string in the `description` field
- In `ProductDetailPage.tsx` and `ProductCard.tsx`, render description using `dangerouslySetInnerHTML` (detail page) or strip tags for card preview

### 6. Product Detail Page — Thumbnail Strip
Instead of prev/next arrows + dots (current), show a horizontal row of small square thumbnails below the main image (matching the reference). Clicking a thumbnail switches the main image. Active thumbnail gets a visible border highlight.

## Files

| File | Change |
|------|--------|
| `src/components/landing/CustomCursor.tsx` | Delete |
| `src/App.tsx` | Remove CustomCursor, replace `/featured` route with `/our-products`, remove FeaturedPage import, add OurProductsPage |
| `src/pages/ProductDetailPage.tsx` | Redesign layout — thumbnail strip below main image, HTML description rendering |
| `src/pages/OurProductsPage.tsx` | New — replaces FeaturedPage, shows featured/curated products |
| `src/pages/FeaturedPage.tsx` | Delete |
| `src/components/admin/RichTextEditor.tsx` | New — Tiptap-based rich text editor component |
| `src/pages/admin/AdminProducts.tsx` | Replace Textarea with RichTextEditor for description |
| `src/components/landing/Navbar.tsx` | "Featured" → "Our Products" in links |
| `src/components/admin/AdminSidebar.tsx` | "Featured" → "Our Products" label |
| `src/components/landing/FeaturedProducts.tsx` | Link → `/our-products`, button text update |
| `src/components/ProductCard.tsx` | Strip HTML tags from description for card preview |
| `package.json` | Add tiptap dependencies |

