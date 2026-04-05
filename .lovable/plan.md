

# Update Website with Company Portfolio Data + Enhance Product Detail Page

## Summary
Two main objectives: (1) Update all website content to match the official company portfolio PDF, and (2) significantly improve the product detail page with better animations and effects.

## Content Updates from Company Portfolio

### 1. About Page (`src/pages/AboutPage.tsx`)
Content is already well-aligned with the PDF. Minor updates:
- Update "Who We Are" paragraph to match PDF verbatim (currently close but not exact)
- Ensure Vision & Mission text matches PDF exactly
- Add "Nationwide delivery coverage" and "Experienced, service-driven team" to competitive advantages (PDF lists 6 items, we show 4)
- Update client segments to match PDF exactly: Hotels & Resorts, Restaurants & Cafes, Catering companies, Supermarket chains (remove "Retail Distributors" and "Food Manufacturers" which aren't in the PDF)

### 2. Product Categories — Update to match PDF
The PDF defines these product categories: **Frozen, Dairy, Grocery & Staples, Edible Oils, Specialty Imports**. Update the `src/data/products.ts` categories array and ensure the categories in the DB align.

### 3. Footer (`src/components/landing/Footer.tsx`)
- Update contact info: `info@olivefoods.lk` and `+94 11 207 1717` (already correct)
- Fix "Featured" link → "Our Products"

### 4. FAQ Section (`src/components/landing/FAQSection.tsx`)
- Update FAQ answers to reference actual product categories from the PDF (Frozen, Dairy, Grocery & Staples, Edible Oils, Specialty Imports)
- Update delivery answer to mention HoReCa, Modern Trade, General Trade channels

### 5. Stats/Numbers Updates
- `StatsSection.tsx`: Update brand partners count to match PDF (8 listed: AZIZAA, Hungritos, Fletcher, Granoro, Daily Dairy, Snorre Foods, Wai Wai, Royal Arm) — already shows 8+, good
- `DarkStatsBanner.tsx`: Keep as-is (500+ products, etc.)

### 6. WhyChooseUs (`src/components/landing/WhyChooseUs.tsx`)
- Already well-aligned with PDF's "Why Olive Foods" section. No changes needed.

### 7. LogoStrip (`src/components/landing/LogoStrip.tsx`)
- Already has correct brand names from PDF. No changes needed.

### 8. Contact Page (`src/pages/ContactPage.tsx`)
- Already has correct contact info. No changes needed.

## Product Detail Page Enhancement (`src/pages/ProductDetailPage.tsx`)

Major visual upgrade with animations and effects:

### Layout Improvements
- Add a subtle gradient hero bar at the top with the product category
- Staggered entrance animations for each section (currently basic fade-in)
- Add a parallax scroll effect on the main image

### Animation Enhancements
- **Image hover**: Add a ken-burns slow zoom effect on the main image
- **Section reveals**: Use staggered `whileInView` animations with different delays for each info block
- **Floating badges**: Animate the category/origin badges with a subtle bounce-in
- **Inquiry card**: Add a pulsing glow border effect on the CTA card
- **Related products**: Add horizontal scroll entrance animation
- **Breadcrumb**: Subtle slide-in from left

### Visual Enhancements
- Add a gradient accent line under the product name
- Add subtle background texture/pattern to the info column
- Make the specifications table more visual with alternating row backgrounds
- Add a "Product Highlights" section with icon chips if tags exist (replacing plain badge list)
- Increase spacing and typography hierarchy for better readability
- Add subtle separator animations (width expansion on scroll)

## Files

| File | Change |
|------|--------|
| `src/pages/AboutPage.tsx` | Update text content to match PDF, add 2 more competitive advantages, fix client segments |
| `src/pages/ProductDetailPage.tsx` | Major visual enhancement with animations, effects, better layout |
| `src/components/landing/Footer.tsx` | Fix "Featured" → "Our Products" link |
| `src/components/landing/FAQSection.tsx` | Update FAQ content to reference actual product categories |
| `src/data/products.ts` | Update categories array to match PDF |

