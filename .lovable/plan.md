

# Replace Spline iframe with React Three Fiber 3D Scene

## What Changes

You already have a fully built `Hero3DScene.tsx` with a morphing blob, orbiting spheres, and floating particles using React Three Fiber. The Spline iframe is currently blank/not loading. The fix is simply to swap the iframe back to using the existing `Hero3DScene` component.

## File: `src/components/landing/HeroSection.tsx`

- Remove the iframe
- Lazy-import `Hero3DScene` with `Suspense` fallback
- Render it as the full-screen background layer (`absolute inset-0`)
- Keep the section as full-screen with `min-h-screen`

The existing `Hero3DScene.tsx` already has everything needed:
- **Main blob**: Icosahedron with `MeshDistortMaterial` (morphing effect), mouse-interactive rotation
- **Orbiting spheres**: 4 glass-like orbs at different orbits
- **Floating particles**: 200 color-coded dots (gold, green, cream)
- **Lighting**: Ambient + directional + gold/green point lights
- **Environment**: Forest preset for reflections

No new packages needed — `@react-three/fiber`, `three`, and `@react-three/drei` are already installed.

## Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/HeroSection.tsx` |

