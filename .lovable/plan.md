

# Food Import Landing Page — Full-Section Scroll with Parallax & Animations

## Overview
Recreate the client's food import business landing page with full-section scroll snapping, parallax hero effects, and rich micro-interactions throughout.

## Sections (each snaps into view on scroll)

### 1. Navigation Bar (Fixed)
- Dark green sticky navbar with logo, nav links (About, Brands, Products), Login button, and "Contact Us" CTA
- Subtle backdrop blur effect

### 2. Hero Section (Parallax)
- Dark gradient background with parallax-scrolling background imagery
- Badge: "Premium Food Imports"
- Large headline: "BRINGING THE WORLD'S FINEST FOODS TO YOUR TABLE"
- Subtitle text about sourcing and importing
- Two CTAs: "Contact Us" and "Take The Quiz →"
- Floating/animated food product images

### 3. Client Logos Bar
- Scrolling or static logo strip (ADIRA, ADIRA INC, Holcim, MNC, TELKOMSEL)
- Subtle fade-in animation

### 4. Featured Products Section
- Section title with description
- 3 product cards with dark gradient backgrounds, product images, "Shop Now" buttons
- Cards animate in with staggered fade-up on scroll, hover lift/glow effects

### 5. Why Choose Us Section
- "Why Choose Us" badge + heading + subtitle
- 3 feature cards: Quality Assurance, Global Sourcing, Efficient Distribution
- Cards with icons, hover scale and shadow effects
- Staggered entrance animations

### 6. Categories Section
- Heading + description
- Carousel/slider with category cards (Processed Foods, Grains & Staples)
- Navigation dots and arrows
- Cards with hover effects

### 7. Stats & Social Proof Section
- Descriptive text
- Animated counter stats: 10+ Years, 200+ Clients, 500+ Products, 25+ Countries
- Avatar groups beside each stat
- "Get Started →" CTA button with hover animation

### 8. Dark Stats Banner
- Dark background strip with large animated counters: 120K+ Products Delivered, 150+ Active Partnerships, 32K+ Orders Fulfilled

### 9. FAQ Section
- "FAQs" badge + "Frequently Asked Questions" heading
- Accordion items with smooth expand/collapse animations
- Questions about food import topics
- Hover highlight on each item

### 10. Footer
- Dark background with logo, tagline, Quick Links, and social links (Facebook, LinkedIn)
- Copyright notice

## Technical Approach
- **Scroll Snap**: CSS `scroll-snap-type: y mandatory` on the main container with each section as a snap point
- **Parallax**: CSS transform-based parallax on the hero background
- **Animations**: Intersection Observer-based reveal animations (fade-in, slide-up, scale-in, counter animations)
- **Hover Effects**: Scale transforms, shadow transitions, underline animations on links
- **Color Palette**: Dark green (#1a2e1a), white, light grays matching the design
- **Responsive**: Mobile-friendly with adjusted layouts

