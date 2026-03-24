

# Animate Section Backgrounds, Remove Card Animations

## What
- Keep `animate-gradient` on all **section-level** backgrounds (Hero, Featured Products section bg, Why Choose Us, Dark Stats Banner, FAQ, Footer)
- **Remove** `animate-gradient-slow` from **card-level** elements (Featured Products cards, Categories cards)

## Changes

### 1. `src/components/landing/FeaturedProducts.tsx`
- Line 66: Remove `animate-gradient-slow` class from the card inner div — replace with empty string or no animation class

### 2. `src/components/landing/CategoriesSection.tsx`  
- Line 65: Remove `animate-gradient-slow` class from the category card div

No other files need changes — all section-level backgrounds already have `animate-gradient` applied correctly.

