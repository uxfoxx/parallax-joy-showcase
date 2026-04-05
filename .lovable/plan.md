

# Add Image Lightbox to Product Detail Page

## Summary
Add a fullscreen lightbox modal that opens when clicking the main product image. Uses the existing shadcn `Dialog` component — no new packages needed.

## Changes in `src/pages/ProductDetailPage.tsx`

1. **Add lightbox state** — `const [lightboxOpen, setLightboxOpen] = useState(false)`

2. **Make main image clickable** — add `onClick={() => setLightboxOpen(true)}` to the main image container, with a cursor-zoom-in style

3. **Add lightbox Dialog** — a fullscreen `Dialog` overlay showing:
   - The currently active image at full size (`object-contain` on dark backdrop)
   - Left/right arrow buttons to navigate between images
   - Keyboard navigation (left/right arrows)
   - Thumbnail strip at the bottom for quick selection
   - Close button (already provided by Dialog)

4. **Import Dialog** from `@/components/ui/dialog`

5. **Import ChevronLeft, ChevronRight** from lucide-react for navigation arrows

## Files

| File | Change |
|------|--------|
| `src/pages/ProductDetailPage.tsx` | Add lightbox dialog with image navigation |

