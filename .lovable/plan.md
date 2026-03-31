

# Redesign About & Contact Pages to Match Landing Page Style

## Analysis of Landing Page Patterns

The landing page uses these consistent design patterns across sections:

1. **Dark sections** (Featured, WhyChooseUs, FAQ, DarkStats, Team): Multi-layered gradient backgrounds with radial glows + linear gradient base, parallax decorative orbs, mouse-follow gradients, `primary-foreground` (cream/white) text, pill badges with `bg-primary-foreground/10 border-primary-foreground/15`, cards with `border-primary-foreground/10` and green gradient fills
2. **Light sections** (Categories, Stats, Locations): `bg-background` or white, subtle accent orbs, `text-foreground` headings, `text-muted-foreground` body, cards with `border-border bg-card`
3. **Section structure**: `py-28 lg:py-36`, `max-w-7xl mx-auto px-6 lg:px-8`, pill badge → large heading → subtitle → content grid
4. **Transitions**: `SectionTransition` (thin gradient line) between sections
5. **Cards**: `rounded-lg`, icon in colored container, hover lift (`whileHover={{ y: -6 }}`), `hover:border-forest-mid/30 hover:shadow-lg`
6. **Typography**: pill badges with `tracking-widest uppercase`, headings `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight`
7. **No PageLayout wrapper** — landing page composes its own `ImmersiveBackground`, `ScrollFloatingElement`, `Navbar`, `FloatingWhatsApp`, `Footer` directly

## Problem

Both About and Contact pages use `PageLayout` which gives a basic wrapper. Their sections use generic `bg-background/90 backdrop-blur-sm` containers, standard `text-foreground` styling, and lack the immersive gradient backgrounds, parallax orbs, mouse-follow effects, pill badges, and section transitions that make the landing page feel premium.

## Changes

### 1. About Page — `src/pages/AboutPage.tsx`

Remove `PageLayout` wrapper. Compose like the landing page with direct `ImmersiveBackground`, `ScrollFloatingElement`, `Navbar`, `FloatingWhatsApp`, `Footer` imports. Rebuild each section:

- **Hero**: Full dark gradient background (like HeroSection) with radial glows, large `text-primary-foreground` heading, subtitle in `text-primary-foreground/50`. No `bg-black/40` overlay — use proper gradient layers instead.
- **Who We Are**: Dark section with multi-layer gradient (like WhyChooseUs), parallax orbs, pill badge "Our Story", heading in `text-primary-foreground`, body in `text-primary-foreground/45`
- **Core Business Activities**: Dark section with gradient bg, cards styled like WhyChooseUs feature cards (green gradient fill, `border-primary-foreground/10`, icon in `bg-primary-foreground` container, text in `text-primary-foreground`)
- **Mission & Vision**: Dark gradient section, two-column layout with cards matching FAQ item style (green gradient fill, border `primary-foreground/15`)
- **Competitive Advantage**: Dark section, 4-column grid with cards matching WhyChooseUs style
- **Who We Serve**: Dark section, 3-column grid with matching card style
- **Location**: Light section (like LocationsSection on landing) — white bg, accent orbs, map with glassmorphism overlay card
- **CTA**: Dark gradient with radial glows, buttons matching hero style (`bg-accent` primary, outline secondary)
- Add `SectionTransition` between each section
- Add `data-navbar-theme` wrappers for navbar color switching

### 2. Contact Page — `src/pages/ContactPage.tsx`

Remove `PageLayout` wrapper. Compose directly like landing page.

- **Hero**: Dark gradient background with radial glows (matching FeaturedProducts bg style), pill badge "Contact Us", large heading in `text-primary-foreground`, subtitle in `text-primary-foreground/50`
- **Form section**: Dark gradient background (like FAQ section), form card styled with green gradient fill (`linear-gradient(135deg, hsl(140 50% 19% / 0.8), hsl(150 40% 14% / 0.6))`), `border-primary-foreground/15`, inputs with dark-themed styling (`bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground`), labels in `text-primary-foreground/60`
- **Contact details panel**: Cards matching FAQ accordion style (green gradient, `border-primary-foreground/15`), icons in `bg-primary-foreground` containers, text in `text-primary-foreground`
- **Business hours card**: Same green gradient card style
- **Map section**: Light section (like LocationsSection) with glassmorphism overlay
- Add `SectionTransition` dividers, `data-navbar-theme` wrappers
- Button: `bg-accent text-accent-foreground` (matching landing CTA buttons)

## Files

| File | Change |
|------|--------|
| `src/pages/AboutPage.tsx` | Full rewrite — remove PageLayout, add immersive dark sections with gradient bgs, parallax orbs, pill badges, landing-style cards, SectionTransitions |
| `src/pages/ContactPage.tsx` | Full rewrite — remove PageLayout, dark gradient sections, green gradient form/detail cards, dark-themed inputs, map with glassmorphism |

