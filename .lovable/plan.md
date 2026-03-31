

# Fix FAQ Gradient, WhatsApp Visibility, Horizontal Scrollbar

## 1. FAQ Section — Dark Gradient on Bottom
**File**: `src/components/landing/FAQSection.tsx`
- Flip the linear gradient: change from `hsl(150 40% 10%), hsl(140 50% 14%), hsl(150 40% 10%)` to lighter top → darker bottom: `hsl(140 50% 14%), hsl(150 40% 10%), hsl(150 40% 6%)`

## 2. WhatsApp Button — Always Visible
**File**: `src/components/FloatingWhatsApp.tsx`
- Already `fixed bottom-6 right-6 z-50` — should always be visible
- Increase `z-index` to `z-[9999]` to ensure it floats above everything including the custom cursor and any sticky/fixed elements

## 3. Horizontal Scrollbar Fix
**File**: `src/pages/Index.tsx`
- The root wrapper has no `overflow-x-hidden`, so decorative elements (parallax orbs, floating elements, ImmersiveBackground blobs) can extend beyond viewport width
- Add `overflow-x-hidden` to the root `<div>` wrapper

**File**: `src/index.css`
- Add `overflow-x: hidden` on `html` and `body` as a safety net

## Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/FAQSection.tsx` — flip gradient dark to bottom |
| Modify | `src/components/FloatingWhatsApp.tsx` — higher z-index |
| Modify | `src/pages/Index.tsx` — add `overflow-x-hidden` |
| Modify | `src/index.css` — add `overflow-x: hidden` on html/body |

