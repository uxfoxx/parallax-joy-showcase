

# Updated Plan — Exact Design Match with Animated Gradients

## Summary
Rework all components to precisely match the reference image, including animated/shifting gradients, exact layout structures, and correct text content.

---

## Changes by Component

### 1. Navbar (`Navbar.tsx`)
- Convert to a **pill-shaped floating navbar** centered at top with `rounded-full`, dark green bg, ~max-w-4xl
- Logo on left (green circle with leaf icon), nav links centered, Login + Contact Us on right
- All contained in a single rounded pill bar with padding

### 2. Hero Section (`HeroSection.tsx`)
- Keep dark green background with parallax
- **Add animated gradient**: use CSS `@keyframes gradient-shift` to slowly animate a multi-stop radial/linear gradient background (shifting hue/position over ~8s)
- Wrap left-side content (badge, heading, subtitle, CTAs) inside a **rounded-2xl bordered card** with semi-transparent dark bg and subtle border — matching the reference's boxed content area
- **Remove** the right-side floating cards/orbs entirely — reference shows no floating elements
- Keep the "Premium Food Imports" badge, headline, subtitle, and two CTA buttons

### 3. Logo Strip (`LogoStrip.tsx`)
- Keep existing marquee animation — already close to reference

### 4. Featured Products (`FeaturedProducts.tsx`)
- Rename all products to **"Daily Multivitamin"** with subtitle "Nutritional Supplements"
- Keep 3-card grid with dark gradient cards
- **Add animated gradient** on each card's image area: CSS keyframe that shifts the gradient colors/positions subtly on loop
- Keep hover lift + glow effects

### 5. Why Choose Us (`WhyChooseUs.tsx`)
- Update heading to: **"Reliable Food Import Solutions for Your Business"**
- Update subtitle to: "Go steadily sourcing with a strong global network, strict quality control, and efficient logistics."
- Keep 3 feature cards with staggered entrance animations

### 6. Categories Section (`CategoriesSection.tsx`)
- Convert from 4-column grid to **2-visible-card carousel/slider**
- Each card: blue/teal icon at top, title, description text
- Add **prev/next arrow buttons** and **dot indicators** below
- Add animated gradient backgrounds on cards

### 7. Stats Section (`StatsSection.tsx`)
- Change to **staggered/zigzag layout** — alternating vertical offsets on stat cards
- Keep animated counters and hover effects

### 8. Dark Stats Banner (`DarkStatsBanner.tsx`)
- Add **animated gradient background**: slowly shifting radial gradients behind the stats
- Keep counter animations

### 9. FAQ Section (`FAQSection.tsx`)
- Convert to **2-column layout**: left side has badge + heading + description paragraph; right side has accordion
- Style accordion items with **dark green/forest background** and white text
- Use `+` icon instead of chevron for expand trigger

### 10. Footer (`Footer.tsx`)
- Adjust to 3-column: Brand (logo + tagline), Quick Links, Social/Rules column
- Match reference layout

### 11. Global CSS (`index.css`)
- Add `@keyframes gradient-shift` for animated gradient backgrounds:
  ```
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  ```
- Add `.animate-gradient` utility class with `background-size: 200% 200%` and the animation
- Add any additional animated gradient keyframes for card backgrounds

---

## Files to Modify
1. `src/index.css` — animated gradient keyframes + utility classes
2. `src/components/landing/Navbar.tsx` — pill-shaped floating bar
3. `src/components/landing/HeroSection.tsx` — bordered content card, animated gradient bg, remove floating elements
4. `src/components/landing/FeaturedProducts.tsx` — "Daily Multivitamin" labels, animated card gradients
5. `src/components/landing/WhyChooseUs.tsx` — updated heading/subtitle text
6. `src/components/landing/CategoriesSection.tsx` — carousel with 2 visible cards, arrows, dots
7. `src/components/landing/StatsSection.tsx` — staggered/zigzag stat layout
8. `src/components/landing/DarkStatsBanner.tsx` — animated gradient background
9. `src/components/landing/FAQSection.tsx` — 2-column layout, dark green accordion items
10. `src/components/landing/Footer.tsx` — 3-column layout matching reference

