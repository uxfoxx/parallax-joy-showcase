

# Animated Gradient + Noise Hero with Full-Height Marquee

## Changes

### `src/components/landing/HeroSection.tsx`
- Remove `lazy`, `Suspense`, and `Hero3DScene` imports
- Background layer: animated gradient using brand colors (forest greens, gold, cream) with multiple radial/linear gradients that shift via CSS animation
- Noise layer: inline SVG `feTurbulence` filter rendered as a semi-transparent overlay div for grain texture
- Marquee layer (on top, z-10): "OLIVE FOODS" text at `text-[100vh] leading-[100vh]` to fill full hero height, with `pointer-events-none`
- Layer order: gradient (z-0) → noise (z-[1]) → marquee text (z-10)

### `src/index.css`
- Add `@keyframes gradient-shift` for slow background-position animation (already has gradient-move, but add a new one for background-position based shifting)

### Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/HeroSection.tsx` |
| Modify | `src/index.css` (if needed for new keyframes) |

