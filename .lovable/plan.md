

# Redesign Product Detail Page with Better Gallery and Richer Layout

## Summary
Overhaul the product detail page: replace the basic thumbnail strip with a proper image gallery using `embla-carousel` (already installed via shadcn carousel), add more visual sections to fill the page, and improve the overall layout.

## Changes

### 1. Image Gallery Upgrade
**File: `src/pages/ProductDetailPage.tsx`**

Replace the manual thumbnail strip with a proper carousel-based gallery:
- **Main image**: Large hero image with smooth crossfade transition (using `AnimatePresence` from framer-motion)
- **Thumbnail carousel**: Use Embla carousel (already available) for a scrollable thumbnail strip with active indicator, arrow buttons for overflow
- **Zoom on hover**: Add a CSS `hover:scale-110` effect on the main image with `overflow-hidden` container
- **Lightbox feel**: Click main image to see it larger (optional, keep simple with scale transform)

### 2. Richer Right Column Layout
Restructure the right side with more visual weight:

- **Brand badge**: Show brand name in a styled pill/badge above the product name (not just small text below)
- **Category + Origin badges**: Show as colored pills near the top instead of buried in the specs table
- **Tabbed content area**: Add tabs (using shadcn Tabs) for:
  - "Description" — the rich text description
  - "Specifications" — the existing details table (Category, Origin, SKU, Brand)
  - "Tags" — tag badges (if any)
- **Inquiry CTA card**: Wrap the inquiry button in a glassmorphism card with a subtle message like "Interested in this product?" to make it stand out

### 3. Visual Enhancements
- Add a subtle gradient divider between the product section and related products
- Stagger entrance animations for each element in the right column
- Add a "Share" or "Download spec sheet" placeholder button alongside the inquiry button for visual balance

### 4. Related Products Section
- Change heading from "More from {brand}" to include a decorative line
- Show 4 products instead of 3 on desktop (4-column grid)
- Add "View All from {brand}" link

## Technical Approach
- Use `embla-carousel-react` (already installed) for the thumbnail carousel
- Use shadcn `Tabs` component for the tabbed content
- Use framer-motion `AnimatePresence` for image transitions
- No new npm packages needed

## Files

| File | Change |
|------|--------|
| `src/pages/ProductDetailPage.tsx` | Complete redesign: carousel gallery, tabbed content, richer layout, better animations |

