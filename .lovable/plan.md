

# Fix Product Detail Page: Responsive + Sticky Gallery

## Problems
1. **Not responsive on mobile** — the `lg:grid-cols-[55%_45%]` grid stacks on mobile but images/text sizing isn't optimized for small screens
2. **Gallery not sticking** — `lg:sticky lg:top-24` is set but likely fails because the grid row doesn't have enough height difference (both columns are similar height, so there's nothing to scroll against). The right column needs to be naturally taller than the left for sticky to work.
3. **Thumbnails use percentage-based `basis-1/5`** — too small on mobile

## Fixes in `src/pages/ProductDetailPage.tsx`

### 1. Fix Sticky Gallery
The sticky behavior only works when the parent grid row is taller than the sticky element. The right column content must be taller than the gallery. To ensure this:
- Add `lg:min-h-[120vh]` or use `lg:items-start` on the grid (already has `lg:self-start` on gallery which is correct)
- The real issue: the `motion.div` wrapper on the gallery column may be interfering. Change from `motion.div` to a plain `div` for the gallery wrapper, keep animations on inner elements
- Ensure `overflow` on parent containers isn't clipping — check `PageLayout`'s `overflow-x-hidden`
- Set explicit `lg:max-h-[calc(100vh-6rem)]` on the sticky gallery so it doesn't exceed viewport

### 2. Mobile Responsiveness
- Main image: change from `aspect-square` to `aspect-[4/3]` on mobile, `lg:aspect-square`
- Product name: scale down to `text-2xl` on small screens (currently `text-3xl`)
- Thumbnail carousel: change `basis-1/5` to `basis-1/4` on mobile, `sm:basis-1/5`
- Reduce `gap-12` to `gap-6` on mobile: `gap-6 lg:gap-12`
- Reduce padding: `px-4 sm:px-6`, `py-8 lg:py-20`
- Related products grid: add `grid-cols-2` for very small screens

### 3. Gallery Column Structure
- Use a regular `div` with sticky classes instead of `motion.div` to avoid transform-based positioning conflicts (CSS `position: sticky` doesn't work inside elements with CSS transforms applied by framer-motion)
- Move the fade-in animation to the inner elements instead

## Files

| File | Change |
|------|--------|
| `src/pages/ProductDetailPage.tsx` | Fix sticky (remove motion wrapper on gallery), improve mobile responsive classes |

