

# Fix Cursor Visibility, Modern White Location Section, DarkStatsBanner Sticky Issue

## 1. Custom Cursor — Always Visible

**Problem**: The cursor dot and glow use `hidden md:block`, making them invisible below `md` breakpoint. Also, the accent color dot may blend into light backgrounds.

**Fix** in `CustomCursor.tsx`:
- Remove `hidden md:block` — show on all screen sizes (the `pointer: coarse` check already handles touch devices)
- Add a subtle dark outline/shadow to the dot so it's visible on both light and dark backgrounds
- Keep the `pointer: coarse` early return for mobile/touch

## 2. Location Section — White Background, Modern Style

**File**: `LocationsSection.tsx`

- Replace the dark gradient background with a clean white/light `bg-background` 
- Change all text from `text-primary-foreground` to `text-foreground` (dark on white)
- Icon containers: `bg-accent/10` with `text-accent` icons
- Map border: `border-border` instead of `border-primary-foreground/10`
- Badge: light style with `bg-accent/10 text-accent border-accent/20`
- Add subtle decorative blurred orbs at low opacity for visual interest
- Keep the parallax and scroll animations

## 3. DarkStatsBanner — Stop Following on Scroll

**Problem**: The `DarkStatsBanner` is wrapped in a `sticky top-0` container inside a parent `div.relative`. Because the parent extends all the way to the footer, the banner stays pinned for too long.

**Fix** in `Index.tsx`:
- Remove the nested sticky wrapper around `DarkStatsBanner`
- Make it a normal flow element — just render `<DarkStatsBanner />` inline like other sections
- This stops it from following the user down the page

## Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/CustomCursor.tsx` — remove `hidden md:block`, add outline for visibility |
| Modify | `src/components/landing/LocationsSection.tsx` — white bg, dark text, modern light style |
| Modify | `src/pages/Index.tsx` — remove sticky wrapper around DarkStatsBanner |

