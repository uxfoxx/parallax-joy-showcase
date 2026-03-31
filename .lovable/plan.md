

# Smooth & Optimize Landing Page + Match Style Across All Pages

## Overview
The landing page has a premium dark immersive aesthetic with animated gradient backgrounds, noise textures, floating elements, and smooth transitions. The inner pages (About, Products, Brands, Featured, Brand Detail, Product Detail, NotFound) currently use `PageLayout` which gives them a plain white `bg-background` with no immersive feel. This plan unifies them.

## Part 1 — Landing Page Smoothness & Optimization

### 1a. Reduce motion overhead
- **ImmersiveBackground.tsx**: Reduce particle count from 12 to 6. Simplify orb transforms to use CSS animations only (remove `useScroll`/`useTransform` from framer-motion for the orbs — use pure CSS `animate-orb` which already exists).
- **ScrollFloatingElement.tsx**: Simplify the scroll-linked transforms — reduce keyframe breakpoints from 6 to 4 for smoother interpolation. Add `will-change: transform, opacity` to the motion div.
- **CustomCursor.tsx**: Increase dot lerp from 0.35 to 0.5 for snappier tracking. Add `will-change: transform` inline.

### 1b. Smoother section transitions
- Add `will-change: opacity, transform` to framer-motion `whileInView` animations across landing sections.
- Reduce animation durations slightly (0.7s → 0.5s) for snappier feel.

## Part 2 — Match Inner Pages to Landing Page Style

### 2a. Update PageLayout to include immersive elements
**File**: `src/components/PageLayout.tsx`
- Add `ImmersiveBackground` as a fixed background layer (same as Index.tsx)
- Add `ScrollFloatingElement` for visual consistency
- Remove `bg-background` from root div (let immersive bg show through)
- Keep `overflow-x-hidden` and `smooth-scroll`

### 2b. Restyle all page hero banners
Currently all inner pages have an inline gradient hero. Convert them to use **transparent backgrounds** so the immersive background shows through, with just a subtle overlay for contrast.

**AboutPage.tsx hero** (lines 38-59): Remove the solid gradient `div`, use a semi-transparent overlay instead. Keep noise texture but reduce opacity.

**ProductsPage.tsx hero** (lines 42-49): Same treatment.

**BrandsPage.tsx hero** (lines 17-24): Same treatment.

**FeaturedPage.tsx hero** (lines 12-22): Same treatment.

**BrandDetailPage.tsx hero** (lines 29-52): Same treatment.

### 2c. Restyle content sections
Make content sections use semi-transparent dark cards/backgrounds instead of opaque white:
- Replace `bg-background` → `bg-background/90 backdrop-blur-sm` on content sections
- Replace `bg-muted/30` → `bg-background/80 backdrop-blur-sm`
- This lets the immersive gradient subtly bleed through

### 2d. NotFound page
**File**: `src/pages/NotFound.tsx`
- Wrap in `PageLayout` for consistent navbar/footer
- Style with dark theme matching the landing page

### 2e. ProductDetailPage content sections
- Apply same semi-transparent treatment to the two-column layout and related products section

## Part 3 — Add animated gradient dividers to inner pages
Add `SectionTransition` dividers between major sections on the About page (which has multiple sections) for visual rhythm matching the landing page.

## Files Changed

| File | Change |
|------|--------|
| `src/components/PageLayout.tsx` | Add ImmersiveBackground + ScrollFloatingElement, transparent bg |
| `src/components/landing/ImmersiveBackground.tsx` | Reduce particles 12→6, remove framer-motion scroll transforms for orbs |
| `src/components/landing/ScrollFloatingElement.tsx` | Simplify keyframes, add will-change |
| `src/components/landing/CustomCursor.tsx` | Faster lerp, will-change hints |
| `src/pages/AboutPage.tsx` | Transparent hero, semi-transparent sections, add SectionTransition dividers |
| `src/pages/ProductsPage.tsx` | Transparent hero, semi-transparent content bg |
| `src/pages/BrandsPage.tsx` | Transparent hero, semi-transparent content bg |
| `src/pages/FeaturedPage.tsx` | Transparent hero, semi-transparent content bg |
| `src/pages/BrandDetailPage.tsx` | Transparent hero, semi-transparent content bg, fix grid to `md:grid-cols-3` |
| `src/pages/ProductDetailPage.tsx` | Semi-transparent sections |
| `src/pages/NotFound.tsx` | Wrap in PageLayout, dark styling |

