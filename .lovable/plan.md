

# Integrate Olive Foods Company Profile into Website

## Summary

Replace all placeholder/generic content with real Olive Foods (Pvt) Ltd company data from the uploaded profile. The brand name changes from "FreshLine" to "Olive Foods". Content updates span the landing page and About page.

## Changes

### Landing Page Updates

**1. Hero Section (`HeroSection.tsx`)**
- Subtitle: "Your trusted import, bonded warehousing & FMCG distribution partner serving Sri Lanka's HoReCa, Modern Trade and General Trade sectors."
- Keep "OLIVE FOODS" marquee as-is (already correct)

**2. Logo Strip (`LogoStrip.tsx`)**
- Replace generic logos (ADIRA, Holcim, etc.) with real brand partners: AZIZAA, Hungritos, Fletcher, Granoro, Daily Dairy, Snorre Foods, Wai Wai, Royal Arm
- Update header text to "Our Brand Partners"

**3. WhyChooseUs (`WhyChooseUs.tsx`)**
- Update to 4 cards matching the profile's competitive advantages:
  - Integrated Import-to-Distribution (import + brand representation)
  - Bonded Warehousing (customs-approved, duty optimization)
  - Cold-Chain Logistics (-18°C frozen/chilled)
  - Island-Wide Distribution (HoReCa, Modern Trade, General Trade)
- Add icons: Package, Warehouse, Thermometer, Truck

**4. Categories Section (`CategoriesSection.tsx`)**
- Replace with real product categories from profile:
  - Frozen (French fries, meats, seafood, fruits)
  - Dairy (Cheese, butter, specialty dairy)
  - Grocery & Staples (Rice, pasta, canned goods, condiments)
  - Edible Oils (Vegetable and specialty oils)
  - Specialty Imports (Seasonal and premium international foods)
- 5 cards in grid

**5. Stats Section (`StatsSection.tsx`)**
- Update stats to match profile: 30+ years experience, 8+ brand partners, sourcing from 8+ countries (Australia, Italy, Netherlands, Thailand, Singapore, UAE, India, China)

**6. DarkStatsBanner (`DarkStatsBanner.tsx`)**
- Update banner stats to reflect real figures from profile context

**7. Team Section (`TeamSection.tsx`)**
- Keep structure but update header copy to reference "three decades of industry experience"
- Note: profile doesn't list specific team members, so keep placeholder team but update bios to match Olive Foods context (sales, procurement, logistics teams mentioned)

**8. Footer (`Footer.tsx`)**
- Brand name: "Olive Foods (Pvt) Ltd"
- Email: info@olivefoods.lk
- Phone: +94 11 207 1717

### About Page Updates (`AboutPage.tsx`)

**1. Hero Banner**
- Title stays "Our Story"
- Subtitle updated to Olive Foods intro paragraph

**2. Our Story Section**
- Replace generic FreshLine copy with real Olive Foods description from profile (trusted import, bonded warehousing, FMCG distribution partner, 30+ years experience, strong global supplier relationships)

**3. Mission & Vision**
- **Mission**: "To deliver superior products and seamless distribution solutions through strong global sourcing, advanced logistics infrastructure and customer-focused service, empowering our partners to grow sustainably."
- **Vision**: "To be Sri Lanka's most trusted and progressive FMCG distribution partner, connecting world-class brands with businesses and households through reliability, innovation and operational excellence."

**4. Values Section → Competitive Advantage**
- Rename to "Our Competitive Advantage"
- Cards: Integrated model, Faster lead times, Strong supplier relationships, Consistent quality control, Nationwide delivery, Experienced team (pick top 4)

**5. Add Client Segments Section** (new section before CTA)
- Grid showing who they serve: Hotels & Resorts, Restaurants & Cafes, Catering Companies, Supermarket Chains, Retail Distributors, Food Manufacturers

**6. Add Core Business Activities Section** (new section after story)
- 5 cards: Import & Brand Representation, Bonded Warehousing, Cold-Chain Logistics, HoReCa Distribution, Modern Trade & General Trade

### Navbar (`Navbar.tsx`)
- Update brand name from "FreshLine" to "Olive Foods"

### PageLayout (`PageLayout.tsx`)
- No changes needed

## Files Modified

| File | Changes |
|------|---------|
| `src/components/landing/HeroSection.tsx` | Update subtitle copy |
| `src/components/landing/LogoStrip.tsx` | Real brand partners |
| `src/components/landing/WhyChooseUs.tsx` | 4 real service cards |
| `src/components/landing/CategoriesSection.tsx` | 5 real product categories |
| `src/components/landing/StatsSection.tsx` | Real stats (30+ years, etc.) |
| `src/components/landing/DarkStatsBanner.tsx` | Updated stats |
| `src/components/landing/TeamSection.tsx` | Updated copy |
| `src/components/landing/Footer.tsx` | Olive Foods name, real contact info |
| `src/components/landing/Navbar.tsx` | Brand name to "Olive Foods" |
| `src/pages/AboutPage.tsx` | Full rewrite with real company data, new sections |

