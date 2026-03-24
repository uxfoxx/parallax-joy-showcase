

# Hero Section — Full-Screen with 3D Background

## What Changes

### 1. `src/components/landing/Hero3DScene.tsx` — New 3D element
Replace the torus knot with a modern **icosahedron** (geometric sphere) with distort material — gives a fluid, organic blob effect that's more contemporary. Multiple smaller floating spheres orbit around it for depth.

- Main shape: `icosahedronGeometry` with `MeshDistortMaterial` (distort 0.4, speed 3) — creates a morphing blob
- 3-4 smaller glass-like orbs orbiting at different radii using `useFrame`
- Camera pulled back slightly, FOV wider for immersive feel
- Canvas fills entire section (`absolute inset-0`)

### 2. `src/components/landing/HeroSection.tsx` — Full-screen layout
- Remove the rounded card container and two-column layout
- Make section true full-screen (`min-h-screen`) with dark gradient background
- 3D Canvas as **absolute background layer** filling the entire section
- Text content overlaid on top (centered or left-aligned) with `relative z-10`
- Update content:
  - Badge: "Global Food Import Solutions"
  - Heading: "FROM FARM TO FORK, EXCELLENCE IN EVERY SHIPMENT"
  - Subtext: "Curating premium food products from 30+ countries — delivering quality, compliance, and reliability to businesses across Sri Lanka and beyond."
  - CTA: "Explore Our Products" + "Get a Quote" link
- Dark overlay gradient between 3D and text for readability
- Show 3D on all screen sizes (not hidden on mobile)

### Files
| Action | File |
|--------|------|
| Rewrite | `src/components/landing/HeroSection.tsx` |
| Rewrite | `src/components/landing/Hero3DScene.tsx` |

