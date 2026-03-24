

# Add Staff and Locations Sections

## Overview
Add two new sections between DarkStatsBanner and FAQSection:
1. **Our Team** — staff members displayed in a grid, white/light background
2. **Locations We Cover** — map-style or card grid of regions, dark gradient background (matching site style)

## New Files

### 1. `src/components/landing/TeamSection.tsx`
- **White/cream background** (`bg-muted/30`) — matches StatsSection's light style
- Badge: "Our Team"
- Heading: "Meet the People Behind Our Success"
- Subtitle text
- **4-column grid** (2 cols on mobile) of team member cards
- Each card: circular avatar placeholder (initials on forest-deep bg), name, role, short bio
- Cards use `rounded-2xl bg-card border border-border` style (same as stat cards)
- Hover effects: lift + shadow + border accent, consistent with existing cards
- `useInView` for scroll-triggered fade-in animations with staggered delays
- 4-6 placeholder team members (CEO, Operations Manager, Quality Assurance Lead, Logistics Coordinator, etc.)

### 2. `src/components/landing/LocationsSection.tsx`
- **Dark gradient background** with `animate-gradient` — use a radial gradient similar to WhyChooseUs (`radial-gradient(ellipse at 50% 100%, #5C7928 0%, #194B22 24%, #08120A 100%)`)
- Badge: "Our Reach"
- Heading: "Locations We Cover"
- Subtitle about global sourcing network
- **Grid of location cards** (3 cols desktop, 1 mobile) — each card shows:
  - Region name (e.g., "Middle East", "Southeast Asia", "East Africa")
  - Country list or brief description
  - MapPin icon
- Cards: semi-transparent dark bg with border (`border-primary-foreground/10`), same style as WhyChooseUs feature cards
- Static card backgrounds (no animation per the rule), section bg animates
- `useInView` animations

## Modified File

### 3. `src/pages/Index.tsx`
- Import both new components
- Insert `<TeamSection />` and `<LocationsSection />` between `<DarkStatsBanner />` and `<FAQSection />`

