

# Fix Gradient Animations — More Visible + Scroll-Reactive Speed

## Problem
The current `gradient-move` animation only translates 1% and scales 10% over 8 seconds — far too subtle to notice. Also, the user wants the animation to speed up when the user is actively scrolling.

## Changes

### 1. `src/index.css` — Bigger, faster gradient animation
- Increase translate range from 1% to **4-5%** and scale from 1.1 to **1.15**
- Reduce duration from 8s to **5s**
- Use CSS custom property `--gradient-duration` so JS can dynamically change speed

```css
@keyframes gradient-move {
  0%   { transform: scale(1) translate(0, 0); }
  25%  { transform: scale(1.08) translate(4%, -3%); }
  50%  { transform: scale(1.15) translate(-3%, 4%); }
  75%  { transform: scale(1.08) translate(3%, 3%); }
  100% { transform: scale(1) translate(0, 0); }
}

.animate-gradient {
  animation: gradient-move var(--gradient-duration, 5s) ease infinite;
}
```

### 2. New hook: `src/hooks/useScrollSpeed.ts`
- Listen to scroll events, calculate scroll velocity
- Set CSS variable `--gradient-duration` on `document.documentElement` based on velocity:
  - Idle: `5s` (default)
  - Scrolling: interpolate down to `1.5s` based on speed
- Use `requestAnimationFrame` and debounce to reset back to `5s` after scrolling stops (~300ms timeout)

### 3. `src/App.tsx` or `src/pages/Index.tsx`
- Import and invoke `useScrollSpeed()` once at the top level

