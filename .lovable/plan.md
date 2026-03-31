

# Replace Hero Logo + Add Glow Effects

## Changes in `src/components/landing/HeroSection.tsx`

1. **Swap logo asset** — copy `user-uploads://LogoOlive.svg` → `src/assets/olive-foods-hero-logo.svg` (overwrite existing), update import if needed

2. **Add logo glow effect** — wrap the `<img>` in a container with layered CSS glow:
   - A pulsing `drop-shadow` filter on the image itself using green tones from the logo (`#5c7928`, `#174a22`)
   - A radial gradient glow behind the logo using `absolute` positioned div with `animate-pulse` (slow, ~3s)
   - Subtle `filter: drop-shadow(0 0 40px hsl(100 40% 30% / 0.5)) drop-shadow(0 0 80px hsl(140 50% 20% / 0.3))`

3. **Keep everything else** — buttons, marquee, mouse gradient, parallax all stay as-is

| File | Change |
|------|--------|
| `src/assets/olive-foods-hero-logo.svg` | Overwrite with new uploaded logo |
| `src/components/landing/HeroSection.tsx` | Add glow wrapper around logo image |

