

# Fix Green Dot Cursor — Always Visible + Smoother Motion

## Problem
The green accent dot that follows the cursor works but: (1) can blend into backgrounds making it hard to see, and (2) the animation could be smoother — the lerp at `0.08` with `setState` on every frame causes micro-jitter since React re-renders each frame.

## Changes to `src/components/landing/CustomCursor.tsx`

### Always Visible Green Dot
- Increase dot size from `w-2 h-2` (8px) to `w-3 h-3` (12px) so it's more prominent
- Add a bright green glow/shadow: `0 0 6px hsl(75 38% 45% / 0.8), 0 0 12px hsl(75 38% 45% / 0.4)` so it stands out on both dark and light backgrounds
- Add a thin white ring outline (`0 0 0 1.5px white`) for contrast on dark sections
- Keep the `bg-accent` color

### Smoother Motion
- Stop using React `setState` on every animation frame — this causes unnecessary re-renders
- Instead, use `useRef` for DOM elements and update `transform` directly via `ref.current.style.transform` inside the rAF loop
- This bypasses React's render cycle entirely, giving buttery-smooth 60fps movement
- Increase lerp factor slightly to `0.12` for the dot (snappier follow) and keep the glow trailing behind at `0.06` (creates a nice separation effect)
- Remove the Framer Motion `<motion.div>` for the glow — use the same direct DOM approach for consistency

### Hover State
- On hover over interactive elements: dot scales to `1.5x` and glow scales to `2x` — applied via direct style manipulation, not React state for the transform

## File
| Action | File |
|--------|------|
| Modify | `src/components/landing/CustomCursor.tsx` — ref-based animation, larger dot with glow |

