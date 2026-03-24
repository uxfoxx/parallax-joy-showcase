

# Navbar Upgrade + 3D Hero + Mouse-Following Gradients

## 1. Navbar Improvements

**Current**: Two separate pills (left nav + right CTA). Functional but basic.

**New design** — single unified glassmorphism bar with active link indicator and scroll-aware morphing:
- Merge into one centered bar with logo left, links center, CTA right
- Add an animated pill/blob that slides behind the active link (using `motion.div` `layoutId`)
- Smoother scroll transition: bar shrinks slightly, gains stronger blur + border on scroll
- Add a subtle separator line between nav links and CTA area
- Mobile menu: full-screen overlay with staggered link animations instead of small dropdown

### File: `src/components/landing/Navbar.tsx` — rewrite

---

## 2. Hero Section — Interactive 3D Element

Replace the right side of the hero with an interactive 3D scene using React Three Fiber.

**Layout change**: Split hero into two columns — text content left, 3D canvas right.

**3D scene**: A floating, slowly rotating organic shape (torus knot or sphere with displacement) in forest-green/gold material, with:
- Mouse-follow rotation (subtle tilt toward cursor)
- Ambient + point lighting with gold accent light
- Float animation (gentle up/down bob)
- Environment reflection for premium feel

### Dependencies to install:
- `@react-three/fiber@^8.18`
- `three@^0.160`
- `@react-three/drei@^9.122.0`

### New file: `src/components/landing/Hero3DScene.tsx`
- Canvas with `<OrbitControls enableZoom={false}>` for subtle interaction
- Custom mesh with `MeshDistortMaterial` or `MeshWobbleMaterial` from drei
- Mouse-tracking via `useFrame` + pointer state

### File: `src/components/landing/HeroSection.tsx` — restructure
- Two-column layout: content left (max-w-2xl), 3D canvas right
- Keep the dark green rounded card as the full container
- 3D canvas fills right column with `pointer-events: auto`

---

## 3. Mouse-Following Gradients

Create a reusable hook and apply to select dark sections (WhyChooseUs, LocationsSection, DarkStatsBanner).

### New file: `src/hooks/useMouseGradient.ts`
- Track mouse position relative to a container ref
- Return `{ ref, gradientStyle }` where `gradientStyle` is a CSS radial-gradient string centered on cursor position
- Smoothly interpolate position using `requestAnimationFrame` for buttery movement
- Adds a subtle glow spot (e.g., `radial-gradient(circle 400px at X Y, hsl(42 80% 55% / 0.06), transparent)`) that layers on top of existing gradients

### Modified files:
- `src/components/landing/WhyChooseUs.tsx` — add mouse-follow gradient overlay div
- `src/components/landing/LocationsSection.tsx` — same
- `src/components/landing/DarkStatsBanner.tsx` — same

The mouse-follow layer is an additional `absolute inset-0` div with `pointer-events-none` that renders the cursor-tracking radial gradient on top of the existing animated background.

---

## Summary of files

| Action | File |
|--------|------|
| Rewrite | `src/components/landing/Navbar.tsx` |
| Rewrite | `src/components/landing/HeroSection.tsx` |
| Create | `src/components/landing/Hero3DScene.tsx` |
| Create | `src/hooks/useMouseGradient.ts` |
| Modify | `src/components/landing/WhyChooseUs.tsx` |
| Modify | `src/components/landing/LocationsSection.tsx` |
| Modify | `src/components/landing/DarkStatsBanner.tsx` |
| Install | `@react-three/fiber@^8.18`, `three@^0.160`, `@react-three/drei@^9.122.0`, `@types/three` |

