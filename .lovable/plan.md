

# Fix: Team Video Background, Hero Sticky Issue, Cursor Visibility

## Three Issues

### 1. Team Section — Video Background
**Problem**: "Three Decades of Excellence" section uses animated CSS gradient orbs instead of a video.
**Fix** in `TeamSection.tsx`: Replace the dark gradient orbs background (lines 26-49) with a full-width `<video>` element using a royalty-free factory/warehouse video (e.g. from Pexels/Pixabay CDN). Add a dark overlay on top for text readability. Keep the parallax effect on the video via `motion.div` with `style={{ y: bgY }}`.

### 2. Hero Section — Still Follows When Scrolling
**Problem**: The hero is wrapped in `sticky top-0 z-0` in `Index.tsx` (line 28), so it stays pinned behind all content. The user wants it to scroll away normally, not follow.
**Fix** in `Index.tsx`: Remove the sticky wrapper. Change the structure so HeroSection is just a normal block element, and the rest of the content follows naturally below it. Remove the `z-0`/`z-[1]` layering.

### 3. Custom Cursor Green Dot — Not Visible
**Problem**: The CSS rule `.immersive-cursor * { cursor: none !important; }` hides the native cursor, but the green dot itself starts at position `(-100, -100)` — off-screen until the user moves the mouse. Also the dot may be too small or blend into backgrounds.
**Fixes**:
- **`CustomCursor.tsx`**: Increase lerp speed from `0.12` to `0.25` for snappier following. Increase dot size to `w-4 h-4`. Add a stronger `boxShadow` with both white and dark outlines so it's visible on ALL backgrounds: `0 0 0 2px white, 0 0 0 3.5px rgba(0,0,0,0.3), 0 0 8px hsl(75 38% 45% / 0.9)`. Increase glow lerp from `0.06` to `0.12`.
- **`src/index.css`**: Keep `cursor: none` rule — this is correct (hides native cursor so only the green dot shows). The issue is the dot itself not being visible enough, which the above fixes address.

## Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/TeamSection.tsx` — replace gradient orbs with `<video>` background |
| Modify | `src/pages/Index.tsx` — remove sticky hero wrapper, make hero scroll normally |
| Modify | `src/components/landing/CustomCursor.tsx` — bigger dot, stronger contrast outline, faster lerp |

