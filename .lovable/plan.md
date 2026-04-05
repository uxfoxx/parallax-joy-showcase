

# Our Products → Light, Stats → Dark, Categories → Dynamic with Fly-In Animation

## Summary
1. Make "Our Products" (FeaturedProducts) section light/white background
2. Make "Three Decades of Excellence" (StatsSection) dark background
3. Add fly-in card animation to CategoriesSection
4. Pull categories dynamically from DB (first 5), add "View More" button

## Changes

### 1. FeaturedProducts → Light Background
**File: `src/components/landing/FeaturedProducts.tsx`**
- Remove the dark radial gradient background div, use `bg-background` (white)
- Heading: `text-foreground` instead of `text-primary-foreground`
- Subtitle: `text-muted-foreground` instead of `text-primary-foreground/50`
- ProductCard: remove `variant="dark"` (default light)
- Button: `bg-forest-deep text-white hover:bg-forest-deep/90` instead of translucent white

### 2. StatsSection → Dark Background
**File: `src/components/landing/StatsSection.tsx`**
- Replace `bg-white` with dark forest gradient (matching other dark sections)
- All text colors: `text-foreground` → `text-primary-foreground`, `text-muted-foreground` → `text-primary-foreground/50`
- TiltCard: `bg-card border-border` → `bg-white/5 border-white/10`, text to light
- Accent icon containers: `bg-accent/10` → `bg-white/10`
- Count values and labels: light text
- Timeline dots and lines: adapt for dark bg
- Button: `bg-white/10 text-primary-foreground border-white/10` style

### 3. CategoriesSection → Dynamic + Fly-In Animation
**File: `src/components/landing/CategoriesSection.tsx`**
- Import `useCategories` from `@/lib/api`
- Fetch categories from DB, display first 5
- Map category names to Lucide icons (Frozen→Snowflake, Dairy→Milk, Oil→Droplets, Flour/Grain→Wheat, Beverage→Coffee, Chocolate→Cookie, default→Sparkles)
- Replace current fade-in with dramatic fly-in: each card starts from scattered off-screen positions with rotation and scale, animates into grid position using spring physics and staggered delays
- Add "View All Categories →" button at bottom linking to `/products`
- Keep current light background styling

### 4. Update Navbar Themes in Index.tsx
**File: `src/pages/Index.tsx`**
- FeaturedProducts wrapper: `data-navbar-theme="dark"` → `"light"`
- StatsSection wrapper: `data-navbar-theme="light"` → `"dark"`

## Fly-In Animation Details
Each of the 5 cards starts from a unique scattered position:
- Card 0: `x: -400, y: -200, rotate: -30, scale: 0.3`
- Card 1: `x: 100, y: -400, rotate: 15, scale: 0.2`
- Card 2: `x: 400, y: -150, rotate: 25, scale: 0.3`
- Card 3: `x: -300, y: 300, rotate: -20, scale: 0.3`
- Card 4: `x: 350, y: 250, rotate: 18, scale: 0.3`

Animates to final position with `type: "spring", damping: 20, stiffness: 80` and staggered delays.

## Files

| File | Change |
|------|--------|
| `src/components/landing/FeaturedProducts.tsx` | Light background, light text, light button |
| `src/components/landing/StatsSection.tsx` | Dark forest gradient, light text, glass cards |
| `src/components/landing/CategoriesSection.tsx` | Dynamic categories from DB (first 5), fly-in animation, "View All" button |
| `src/pages/Index.tsx` | Swap navbar themes for FeaturedProducts and StatsSection |

