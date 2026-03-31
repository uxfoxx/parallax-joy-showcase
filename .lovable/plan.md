

# Team Section — Curved Carousel with Center-Focus Effect

## Concept
Replace the current single-slide card carousel with a **multi-visible-item curved carousel** inspired by the reference image. All items visible at once in a row, center item is larger/elevated, sides are smaller and slightly rotated — creating a "curved gallery" feel. Auto-slides continuously, no card/border styling.

## Layout
```text
  ┌─────┐   ┌───────────┐   ┌─────┐
  │ sm  │   │   LARGE   │   │ sm  │
  │     │   │  (active)  │   │     │
  └─────┘   └───────────┘   └─────┘
   rotated    scale 1.15     rotated
   opacity     full opacity   opacity
```

Each team item shows: large icon circle + department name overlaid. No card borders, no glassmorphism — clean image-card style with icon as the visual. The active (center) item scales up, side items scale down + slight Y rotation for depth.

## Data
Keep the same 4 team entries. Add 2 more to make the carousel fuller (e.g., Quality Control, Customer Service) — or duplicate for loop effect.

## Implementation

### No Embla — Pure CSS/Framer Motion approach
- Render all items in a flex row, each with `transition-all duration-500`
- Track `activeIndex` with auto-increment timer (4s interval, pause on hover)
- Each item's transform computed based on distance from activeIndex:
  - Distance 0 (center): `scale(1.15)`, full opacity, `z-10`
  - Distance 1: `scale(0.85)`, opacity 0.6, slight `rotateY(±8deg)`
  - Distance 2+: `scale(0.7)`, opacity 0.3
- Click on any item to make it active
- Below the carousel: department name + role + bio text that animates on change (AnimatePresence)

### Auto-slide
- `setInterval` every 4 seconds, cycles through items
- Pause on hover

## Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/TeamSection.tsx` — full rewrite to curved carousel |

