

# Replace Hero 3D with Spline Embed

## Change

Replace the React Three Fiber `Hero3DScene` background with the Spline interactive iframe embed. Remove the lazy-loaded `Hero3DScene` component and the dark gradient base div. The Spline iframe becomes the full-screen background layer.

## File: `src/components/landing/HeroSection.tsx`

- Remove `lazy`, `Suspense` imports and `Hero3DScene` reference
- Replace the 3D background + gradient base with a single `iframe` element pointing to `https://my.spline.design/ticktockinteractivelanding-iGikwv60VbyZBfhah4IvESxV/`
- iframe: `absolute inset-0`, `w-full h-full`, `border-0`, `pointer-events-auto`
- Keep the dark overlay gradient for text readability
- Keep all text content and animations as-is

## Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/HeroSection.tsx` |

No other files affected. `Hero3DScene.tsx` remains in the codebase but is no longer imported by the hero.

