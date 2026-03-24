

# Fix Gradient Animations

## Problem
The `animate-gradient` class uses `background-position` shifting (`0% 50%` -> `50% 100%` -> `100% 50%` etc.), but most sections use `radial-gradient` which doesn't visually respond to `background-position` changes. Only sections with `linear-gradient` components show visible animation. The radial gradients stay static despite having the class applied.

## Solution
Replace the `background-position`-based animation with a subtle **scale and position transform** animation on the gradient overlay divs themselves. This makes radial gradients visually shift and pulse.

### 1. `src/index.css` — New animation keyframes
- Add a new `@keyframes gradient-move` that animates `transform` (slight translate + scale shifts) instead of `background-position`
- Update `.animate-gradient` to use this new transform-based animation so radial gradients visually move
- Keep `background-size` at normal (no need for 300%)

```
@keyframes gradient-move {
  0%   { transform: scale(1) translate(0, 0); }
  25%  { transform: scale(1.05) translate(1%, -1%); }
  50%  { transform: scale(1.1) translate(-1%, 1%); }
  75%  { transform: scale(1.05) translate(1%, 1%); }
  100% { transform: scale(1) translate(0, 0); }
}

.animate-gradient {
  animation: gradient-move 8s ease infinite;
}
```

- Remove the old `gradient-shift` keyframe and `.animate-gradient` / `.animate-gradient-slow` rules
- The gradient overlay divs already have `absolute inset-0` and parent has `overflow-hidden`, so the slight scale-up won't cause overflow issues

### Files Changed
- `src/index.css` — Replace gradient animation keyframes and utility classes

