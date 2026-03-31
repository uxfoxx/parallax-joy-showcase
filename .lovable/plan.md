

# Fix Button Borders, Add Glassmorphism, Tune Logo Glow + Animate Entrance, Fix Navbar Vibration

## 1. Reduce Button Border Radius

The base `button.tsx` uses `rounded-md` (6px) which is fine, but many buttons throughout the site override with `rounded-xl` (12px) which is too curved. Change all `rounded-xl` on buttons to `rounded-lg` (8px) for a subtler, more refined curve.

**Files:** `src/components/ui/button.tsx`, `src/components/landing/HeroSection.tsx`, `src/components/landing/Navbar.tsx`, plus any other pages with `rounded-xl` on buttons.

## 2. Add Glassmorphism Vibe to Buttons

Add a subtle glass effect to the hero and navbar CTA buttons:
- Semi-transparent backgrounds with `backdrop-blur-sm`
- Faint white/light inner border using `border border-white/20`
- Slight transparency in the bg color (e.g., `bg-accent/90 backdrop-blur-sm border border-white/15`)
- The outline "Our Story" button already has some glass qualities — enhance with `backdrop-blur-sm`

**Files:** `src/components/landing/HeroSection.tsx`, `src/components/landing/Navbar.tsx`

## 3. Tune Logo Glow + Animate Entrance

Current glow is a static `animate-pulse` on a blur div + drop-shadows. Improvements:
- **Animate logo entrance**: Wrap logo `<img>` in a `motion.div` with `initial={{ opacity: 0, scale: 0.8 }}`, `animate={{ opacity: 1, scale: 1 }}`, with a spring transition and `delay: 0.2`
- **Animate glow entrance**: The glow div starts at `opacity: 0, scale: 0.5` and expands to full with a delayed transition (0.5s after logo)
- **Tune glow**: Reduce `animate-pulse` opacity swing — instead use a custom Framer Motion animation that smoothly oscillates opacity between 0.4 and 0.7, and scale between 0.95 and 1.05 for a breathing effect rather than harsh pulse

**File:** `src/components/landing/HeroSection.tsx`

## 4. Fix Navbar Vibration

The vibration code looks correct structurally — `vibrateControls` is applied to a `motion.div` wrapper (line 81). The issue is likely that the `x` animation on the wrapper is being clipped by the parent `motion.nav` or the inner `motion.div` with padding animation. The fix: move the `animate={vibrateControls}` to the inner bar div itself (the one with `rounded-xl` and `barBg`), merging it with the existing padding animation by using `vibrateControls` to fire the vibration while keeping the scroll-based padding as inline style or separate animation.

Actually, the simpler fix: the inner `motion.div` (line 85) already has its own `animate` prop for padding. The outer wrapper (line 81-84) with `vibrateControls` should work, but the issue is likely that `useAnimationControls` needs the component to be mounted with an initial `animate` value. Add `initial={{ x: 0 }}` to the vibrate wrapper div.

**File:** `src/components/landing/Navbar.tsx`

## Files

| File | Change |
|------|--------|
| `src/components/landing/HeroSection.tsx` | Reduce button radius to `rounded-lg`, add glassmorphism, animate logo entrance with scale+opacity, tune glow to breathing effect |
| `src/components/landing/Navbar.tsx` | Fix vibration by adding `initial={{ x: 0 }}`, reduce CTA button radius, add glass effect to CTA |
| `src/components/ui/button.tsx` | No change — keep base `rounded-md`, fixes are on per-component overrides |

