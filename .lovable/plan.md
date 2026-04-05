

# Our Products → Light Background, Categories → Dark with Fly-In Animation, Dynamic Categories from DB

## Summary
Three changes: (1) Make the "Our Products" section light-themed, (2) Make "Product Categories" dark-themed with a dramatic fly-in card animation on scroll, (3) Pull categories from the database (first 5) with a "View More" button.

## Changes

### 1. FeaturedProducts (Our Products) → Light Background
**File: `src/components/landing/FeaturedProducts.tsx`**
- Remove the dark radial gradient background, use `bg-background` (white/light)
- Change text colors: heading and subtitle to `text-foreground` / `text-muted-foreground`
- Pass `variant="light"` to ProductCard (already default)
- Change the "View Our Products" button to light-theme styling (forest-deep bg, white text)

**File: `src/pages/Index.tsx`**
- Change `data-navbar-theme` for FeaturedProducts from `"dark"` to `"light"`
- Change `data-navbar-theme` for CategoriesSection from `"light"` to `"dark"`

### 2. CategoriesSection → Dark Background with Fly-In Animation
**File: `src/components/landing/CategoriesSection.tsx`**
- Replace `bg-background` with dark forest gradient (same style as other dark sections)
- Update text colors to `text-primary-foreground` / `text-primary-foreground/50`
- Update card styling: dark glass cards with `bg-white/5 border-white/10`, light text
- Icon containers: `bg-white/10` with `text-accent` icons

**Fly-in animation**: Each card starts from a random off-screen position (scattered — some from left, right, top, bottom with rotation) and flies into its grid position when scrolled into view. Using Framer Motion `whileInView` with custom `initial` positions per card:
- Card 0: starts from `x: -300, y: -200, rotate: -25, scale: 0.5`
- Card 1: starts from `x: 0, y: -350, rotate: 15, scale: 0.3`
- Card 2: starts from `x: 300, y: -150, rotate: 20, scale: 0.5`
- Card 3: starts from `x: -250, y: 200, rotate: -15, scale: 0.4`
- Card 4: starts from `x: 250, y: 250, rotate: 10, scale: 0.4`

Each animates to `x: 0, y: 0, rotate: 0, scale: 1` with staggered delays and spring physics.

### 3. Dynamic Categories from Database
**File: `src/components/landing/CategoriesSection.tsx`**
- Import `useCategories` from `@/lib/api`
- Fetch categories, display first 5 (ordered by name)
- Map category names to icons using a lookup object (fallback to a generic icon)
- Add "View All Categories →" button at the bottom linking to `/products`
- Remove hardcoded categories array

### 4. Admin: Add Icon Field to Categories (optional enrichment)
Not needed — we'll use a name-to-icon mapping in the frontend code. The existing 26 categories in the DB already have names that can be mapped to Lucide icons.

## Icon Mapping Strategy
```
Frozen* → Snowflake
Dairy/Cheese/Butter → Milk  
Oil* → Droplets
Flour/Grain/Rice/Pasta → Wheat
Beverage* → Coffee
Chocolate/Pastry → Cookie
default → Sparkles
```

## Files

| File | Change |
|------|--------|
| `src/components/landing/FeaturedProducts.tsx` | Light background, light text colors, light button |
| `src/components/landing/CategoriesSection.tsx` | Dark background, dynamic categories from DB (first 5), fly-in animation, "View All" button |
| `src/pages/Index.tsx` | Swap navbar themes for FeaturedProducts (light) and Categories (dark) |

