

# More Dramatic Section Reactions + Parallax Backgrounds

## Changes

### 1. Amplify Section Reactions (`useScrollSectionReaction.ts`)
- Increase `peakShift` default from 40 to 80
- Increase gap from 60 to 140
- More dramatic fade: nearFade from 0.7 to 0.4, farFade now animates to 0.85
- ScaleNear from 0.95 to 0.88
- Add `scaleUp` value (1 → 1.08 → 1) for elements that grow as element approaches

### 2. Amplify Individual Section Reactions

**LogoStrip** — split gap from 120 to 250, shifts from ±30 to ±60, add vertical bounce (translateY pulse)

**FeaturedProducts** — grid shift from 50 to 100, first card scale from 0.92 to 0.82, opacity from 0.6 to 0.35, add subtle rotation on the grid (2deg tilt)

**WhyChooseUs** — grid shift from -45 to -90, header shift from -20 to -50, last card scale/opacity more extreme, add skew transform on header

**CategoriesSection** — fan gap from 24→48 to 16→72, add slight rotation on individual cards during fan-out

### 3. Add Parallax Backgrounds to All Sections

Each section gets a **parallax background layer** using `useScroll` + `useTransform` to shift a decorative background element at a different rate than content, creating depth.

**Implementation per section:**
- Wrap existing background `div` content with a `motion.div` that has `y` bound to scroll progress
- Each section's background shifts by ~50-80px over its visible scroll range (slower than content = parallax)
- Add subtle decorative shapes (large blurred circles/ellipses in brand colors) that move at parallax speed

**Sections getting parallax:**
- **HeroSection** — existing gradient bg shifts upward slowly as you scroll past
- **FeaturedProducts** — dark gradient bg with parallax offset + floating blurred gold circle
- **WhyChooseUs** — dark gradient bg parallax + floating green orb
- **CategoriesSection** — light bg with parallax-shifted subtle radial gradient accent
- **StatsSection** — light muted bg with parallax decorative element
- **DarkStatsBanner** — parallax on the pulsing SVG line + bg gradient
- **TeamSection** — parallax decorative blurred circle
- **LocationsSection** — dark bg parallax + floating accent
- **FAQSection** — dark bg parallax

**Parallax technique** (consistent across all):
```tsx
const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
const bgY = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);
// Applied to a motion.div wrapping decorative bg elements
```

This uses element-scoped scroll tracking (not global) so each section's parallax is independent and correctly timed.

## Files

| Action | File |
|--------|------|
| Modify | `src/hooks/useScrollSectionReaction.ts` — amplified values |
| Modify | `src/components/landing/LogoStrip.tsx` — bigger splits + parallax |
| Modify | `src/components/landing/FeaturedProducts.tsx` — bigger shifts + parallax bg |
| Modify | `src/components/landing/WhyChooseUs.tsx` — bigger shifts + parallax bg |
| Modify | `src/components/landing/CategoriesSection.tsx` — bigger fan + parallax bg |
| Modify | `src/components/landing/HeroSection.tsx` — parallax on gradient bg |
| Modify | `src/components/landing/StatsSection.tsx` — parallax decorative element |
| Modify | `src/components/landing/DarkStatsBanner.tsx` — parallax bg |
| Modify | `src/components/landing/TeamSection.tsx` — parallax decorative element |
| Modify | `src/components/landing/LocationsSection.tsx` — parallax bg |
| Modify | `src/components/landing/FAQSection.tsx` — parallax bg |

