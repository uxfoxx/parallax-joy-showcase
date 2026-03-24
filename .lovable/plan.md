

# Particle System + Scroll Improvements

## 1. Add Floating Particles to Hero 3D Scene

**File: `src/components/landing/Hero3DScene.tsx`**

Add a `FloatingParticles` component using Three.js `Points` and `BufferGeometry`:
- ~200 particles spread in a sphere of radius ~10
- Each particle is a small dot (size 0.03-0.06) with varying opacity
- Colors: mix of gold (#d4a017), forest-green (#6a9f5b), and cream (#f5f0e8)
- Animate in `useFrame`: slow rotation of the entire points group + individual subtle drift using sine waves on each particle's position
- Use `PointsMaterial` with `transparent`, `sizeAttenuation`, and a soft circular texture (or `alphaMap`)

This creates a starfield/dust effect around the blob, adding significant visual depth.

## 2. Improve Scroll Behavior

**File: `src/index.css`**

Remove `scroll-snap-type: y mandatory` from `.snap-container` — mandatory snapping feels jarring. Replace with `scroll-snap-type: y proximity` so sections gently guide but don't lock. This creates a smoother, more natural scroll feel.

Also reduce `min-height: 100vh` constraint on `.snap-section` to allow more natural content flow — keep it but add `scroll-snap-stop: normal` so users can scroll past multiple sections.

### Files Changed

| Action | File |
|--------|------|
| Modify | `src/components/landing/Hero3DScene.tsx` — add `FloatingParticles` component |
| Modify | `src/index.css` — change snap to `proximity`, smoother scroll |

