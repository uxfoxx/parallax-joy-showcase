

# Replace Wavy Section Transitions with Thin Animated Gradient Lines

## What's changing
Remove all the bulky wavy SVG `SectionTransition` components and replace them with a slim, animated gradient line divider. The line will use the brand palette (forest greens → olive → sage-gold) with a CSS shimmer animation that sweeps left-to-right continuously.

## Changes

### 1. Replace `SectionTransition.tsx`
Rewrite the component as a thin `h-[2px]` div with:
- A wide gradient background (`200% width`) using `#0F241A → #5C7928 → #879D48 → #5C7928 → #0F241A`
- CSS `@keyframes gradient-sweep` that translates the background position left-to-right over ~3s
- Slight vertical margin (`my-0`) — no more negative margins or tall SVG blocks
- Remove all SVG paths, `useScroll`, `useTransform` usage

### 2. Update `Index.tsx`
- All existing `<SectionTransition ... />` calls stay in place but no longer need `colorFrom`/`colorTo`/`flip` props (they become no-ops or removed)

### 3. Add keyframe to `src/index.css`
```css
@keyframes gradient-sweep {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
```

## Files

| File | Change |
|------|--------|
| `src/components/landing/SectionTransition.tsx` | Rewrite as thin animated gradient line |
| `src/index.css` | Add `gradient-sweep` keyframe |
| `src/pages/Index.tsx` | Remove props from `SectionTransition` usages (cleanup) |

