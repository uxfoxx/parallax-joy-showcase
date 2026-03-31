

# Redesign Team Section — Clean Horizontal Carousel

## Problem
The current implementation uses absolute positioning with manual `x` offsets (`wrappedDiff * 180`) causing overlapping, messy layout. The 3D rotateY and z-index sorting creates visual clutter rather than elegance.

## New Design
A clean **horizontal strip carousel** similar to the reference image — all items visible in a row, center item smoothly scales up with a highlight, sides stay smaller. No 3D rotation, no absolute positioning chaos.

### Layout
```text
 [small] [small] [  ACTIVE  ] [small] [small]
                    ↑ bigger
                    ↑ lifted
                    ↑ glow border
```

### Implementation
- Use a single `flex` row with `overflow-hidden` on the container
- All 6 items rendered normally in flow, centered via `justify-center`
- Active item: `scale(1.1)`, full opacity, accent border glow, slight `translateY(-8px)` lift
- Adjacent items (distance 1): `scale(0.9)`, opacity 0.7
- Far items (distance 2+): `scale(0.8)`, opacity 0.4
- No `rotateY`, no absolute positioning, no z-index sorting
- Smooth Framer Motion `animate` transitions on scale/opacity/y
- Click any item to select it
- Auto-play with 4s interval, pause on hover
- Below: AnimatePresence bio text (keep existing)
- Below: animated progress dots (keep existing)
- Cards are taller portrait rectangles with gradient bg, centered icon, name at bottom

### Key Fixes
- Remove `absolute md:relative` — all items are `relative` in normal flow
- Remove `x: wrappedDiff * 180` manual offset
- Remove `rotateY` and `perspective`
- Remove `sortedIndices` z-index sorting hack
- Use simple `gap` between items and let flexbox handle layout

## File
| Action | File |
|--------|------|
| Modify | `src/components/landing/TeamSection.tsx` |

