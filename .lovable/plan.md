

# Section Layout Reactions to Floating Scroll Element

## Concept

Instead of the olive branch simply floating over sections, each section **responds to its presence** — content splits apart, shifts, or rearranges to "make room" for the element as it passes through. This creates a feeling that the floating element is physically interacting with the page.

## How It Works

Each section uses `useScroll` + `useTransform` to detect when the floating element is in its scroll range, then animates its own layout properties (padding, gap, translate, scale) accordingly. The floating element's scroll ranges (from `ScrollFloatingElement.tsx`) serve as the reference for when each section should react.

## Section Reactions

### 1. LogoStrip (scroll 10–25% — element slides right)
- The logo row **splits in the middle** — left logos shift left, right logos shift right, creating a gap where the olive branch passes through
- Uses `useTransform` on `scrollYProgress` [0.1–0.2] to animate a `gap` or `translateX` on two halves

### 2. FeaturedProducts (scroll 25–50% — element goes left)
- The 3-column grid **shifts right** as a group, leaving space on the left for the element
- The left-most card slightly scales down and fades while the other two cards shift right
- Smooth `translateX` and `opacity` transforms on the grid

### 3. WhyChooseUs (scroll 50–75% — element goes right)
- The 4-column grid content **shifts left**, mirroring the FeaturedProducts behavior
- The rightmost card fades/scales slightly while others compress left
- Header text shifts left with a subtle parallax offset

### 4. CategoriesSection (scroll ~35–45%)
- Cards **fan out** slightly — top row cards spread apart with increased gap
- Creates a breathing effect as the element passes overhead

## Implementation

### New hook: `useScrollSectionReaction.ts`
A reusable hook that takes a scroll range `[start, end]` and returns motion values for common reactions (shift, gap, scale, opacity). Each section imports this and applies the values.

```typescript
function useScrollSectionReaction(scrollRange: [number, number]) {
  const { scrollYProgress } = useScroll();
  const shift = useTransform(scrollYProgress, 
    [scrollRange[0], midpoint, scrollRange[1]], 
    [0, peakShift, 0]
  );
  // ... returns { shift, gap, fadeLeft, fadeRight }
}
```

### Modified sections
Each section wraps its content grid in a `<motion.div>` that uses the hook's output values.

## Files

| Action | File | Changes |
|--------|------|---------|
| Create | `src/hooks/useScrollSectionReaction.ts` | Reusable hook returning scroll-linked motion values |
| Modify | `src/components/landing/LogoStrip.tsx` | Split logos into two halves that separate |
| Modify | `src/components/landing/FeaturedProducts.tsx` | Grid shifts right during element pass-through |
| Modify | `src/components/landing/WhyChooseUs.tsx` | Grid shifts left during element pass-through |
| Modify | `src/components/landing/CategoriesSection.tsx` | Cards fan out with increased gap |

## Technical Notes
- All transforms use Framer Motion `useTransform` for GPU-accelerated, frame-synced animation
- Reactions are subtle (20–40px shifts, 0.95 scale) so content stays readable
- Hidden on mobile (same as the floating element itself)
- Each reaction peaks at the midpoint of the element's presence in that section, then smoothly returns to normal

