

# Aesthetic Overhaul — FreshLine Website

## Issues Identified

1. **Placeholder copy everywhere** — CategoriesSection uses "Effortlessly configure your preferred keyboard shortcuts" (SaaS boilerplate), WhyChooseUs has "No in-app analytics. No middle servers" (finance app copy), FAQ intro says "your voice on social media is your brand's heartbeat"
2. **Categories section uses wrong color scheme** — Dark cards on a light background look jarring; the blue SVG hexagon icon clashes with the green/gold palette
3. **LogoStrip looks cheap** — Text-only logos in bordered boxes feel placeholder-tier
4. **StatsSection (light bg) feels visually flat** — The tiny colored circles under each stat serve no purpose and look unfinished
5. **Hero section has no content** — Just a gradient with ghost marquee text, no headline, subtitle, or CTA
6. **ProductCard image area is empty** — Just shows first letter of product name in a gradient box; looks like a broken image
7. **Inner page headers are plain** — Same gradient rectangle across About, Products, Brands; no visual identity
8. **Footer is sparse** — Missing company name, contact info, and the "FreshLine" brand identity
9. **Categories carousel breaks on mobile** — Cards are 50% width which overflows on small screens
10. **Inconsistent section rhythms** — Some sections use `snap-section` (full viewport), others `snap-section-auto`; creates uneven scrolling
11. **WhyChooseUs feature descriptions don't match titles** — "Quality Assurance" talks about analytics; "Global Sourcing" talks about bank-level security
12. **Contact Us / Inquire buttons go nowhere**

## Plan

### 1. Hero Section — Add Content Layer
Add a centered headline ("Premium Food Imports"), a subtitle, and a CTA button floating on top of the gradient+marquee. Proper z-index layering so text sits above marquee but below navbar.

### 2. Fix All Placeholder Copy
- **WhyChooseUs**: Rewrite feature descriptions to match food import context
- **CategoriesSection**: Replace keyboard shortcut text with actual category descriptions
- **FAQSection**: Fix the intro paragraph about social media
- **Footer**: Add "FreshLine" name to copyright

### 3. Categories Section Redesign
- Switch to light-themed cards on the light background (currently dark cards look out of place)
- Replace blue hexagon SVG with category-specific icons from Lucide (Wheat, Coffee, Milk, Snowflake)
- Fix mobile layout: use full-width cards on small screens
- Remove broken carousel math, use responsive grid instead

### 4. LogoStrip Polish
- Make logos slightly larger, remove borders, use subtle opacity treatment
- Keep marquee animation but cleaner styling

### 5. StatsSection Cleanup
- Remove the meaningless colored circles under each stat
- Add a subtle accent underline or icon instead

### 6. ProductCard Image Enhancement
- Make the placeholder area more intentional: larger centered icon (Package icon from Lucide) with the product initial, styled as a proper placeholder
- Add subtle gradient animation on hover

### 7. Inner Page Headers — Add Noise + Depth
- Add the same noise texture overlay from the hero to inner page dark headers for consistency
- Subtle animated gradient instead of flat `bg-forest-deep`

### 8. Footer Enhancement
- Add "FreshLine" brand name next to leaf icon
- Add placeholder contact info (email, phone)
- Fix copyright to include brand name

### 9. Navbar "Contact Us" Button
- Link to a scroll-to-footer or `/about` page contact section instead of being a dead button

### 10. Global Consistency Fixes
- Ensure all dark sections use the same gradient pattern (radial greens + mouse-follow)
- Standardize card border-radius, padding, and hover effects across all pages
- Make `snap-section-auto` sections have consistent padding

## Technical Details

| Action | File |
|--------|------|
| Modify | `src/components/landing/HeroSection.tsx` — add content overlay |
| Modify | `src/components/landing/WhyChooseUs.tsx` — fix copy |
| Modify | `src/components/landing/CategoriesSection.tsx` — redesign cards, fix icons, fix copy, fix mobile |
| Modify | `src/components/landing/LogoStrip.tsx` — polish styling |
| Modify | `src/components/landing/StatsSection.tsx` — remove circles, refine |
| Modify | `src/components/landing/FAQSection.tsx` — fix intro copy |
| Modify | `src/components/landing/Footer.tsx` — add brand name, contact info |
| Modify | `src/components/landing/Navbar.tsx` — wire Contact Us button |
| Modify | `src/components/ProductCard.tsx` — better placeholder visual |
| Modify | `src/pages/AboutPage.tsx` — add noise texture to header |
| Modify | `src/pages/ProductsPage.tsx` — add noise texture to header |
| Modify | `src/pages/BrandsPage.tsx` — add noise texture to header |

