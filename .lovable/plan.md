

# Scroll-Driven Floating Element Animation

## Concept

A **floating 3D element** (an olive/leaf icon or the Olive Foods logo) that stays fixed on screen and **transforms as you scroll** through sections — changing position, scale, rotation, and opacity to create a cinematic scroll-linked experience.

The element will travel from the Hero section down through LogoStrip, FeaturedProducts, and WhyChooseUs, animating smoothly based on scroll progress.

## How It Works

Using **Framer Motion's `useScroll` + `useTransform`** (already installed, no new packages):

1. A single `<motion.div>` is rendered in `Index.tsx` as a **fixed-position overlay** (z-index between content and navbar)
2. `useScroll()` tracks the page scroll progress
3. `useTransform()` maps scroll ranges to CSS properties: `y`, `x`, `scale`, `rotate`, `opacity`
4. As the user scrolls through each section, the element smoothly transitions between predefined keyframe states

## Animation Keyframes (by scroll progress)

| Scroll % | Position | Scale | Rotation | Opacity | Context |
|-----------|----------|-------|----------|---------|---------|
| 0–10% | Center of hero | 1.0 | 0° | 0.15 | Subtle behind hero text |
| 10–25% | Slides right | 0.6 | 15° | 0.25 | Passes through LogoStrip |
| 25–50% | Left side | 0.8 | -10° | 0.2 | Alongside FeaturedProducts |
| 50–75% | Right side | 1.2 | 20° | 0.15 | Behind WhyChooseUs |
| 75–100% | Center, shrinks | 0.3 | 45° | 0 | Fades out for lower sections |

## The Floating Element

An **olive branch SVG** — a simple, elegant inline SVG with 2-3 leaves and an olive. Rendered in the brand's gold/green colors with a subtle blur/glow. This ties to the "Olive Foods" brand without being heavy.

## Files

| Action | File | Changes |
|--------|------|---------|
| Create | `src/components/landing/ScrollFloatingElement.tsx` | The floating element component with `useScroll`/`useTransform` logic and inline olive branch SVG |
| Modify | `src/pages/Index.tsx` | Import and render `ScrollFloatingElement` as a sibling to all sections |

## Technical Details

- Uses `framer-motion`'s `useScroll({ offset: ["start start", "end end"] })` on the page container
- `useTransform` maps `scrollYProgress` (0→1) to arrays of values for x, y, scale, rotate, opacity
- The element is `position: fixed` with `pointer-events-none` so it never blocks interaction
- Hidden on mobile (`hidden md:block`) to avoid performance issues on smaller devices
- Pure CSS/Framer Motion — no GSAP or ScrollTrigger needed

