

# Make Hero Logo Bigger, Colored, and Reduce Gap to Buttons

## Changes in `src/components/landing/HeroSection.tsx`

1. **Show original colored logo** — remove `brightness-0 invert` from the `<img>` class so the SVG renders in its original green/olive colors

2. **Make logo bigger** — change size classes from `max-w-xs sm:max-w-sm lg:max-w-lg` to `max-w-sm sm:max-w-md lg:max-w-2xl`

3. **Reduce space between logo and buttons** — change container `space-y-4` to `space-y-2` and remove `pt-4` from the buttons wrapper

| File | Change |
|------|--------|
| `src/components/landing/HeroSection.tsx` | Remove `brightness-0 invert`, increase max-w sizes, reduce spacing |

