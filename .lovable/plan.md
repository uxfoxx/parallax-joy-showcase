

# Fully Immersive Scroll Experience — Enhanced 2D with 3D Touches + Seamless Morphing

## Concept

Transform the landing page from a "stacked sections" layout into a **single continuous scroll canvas** where sections flow into each other without clear boundaries. Every element reacts to scroll and mouse, creating a deeply interactive, modern feel.

## Key Changes

### 1. Seamless Section Morphing (`Index.tsx` + `index.css`)
- Remove hard section boundaries — no more individual section `py-28` padding with distinct backgrounds
- Wrap all content in a single container with one continuous gradient background that shifts color as you scroll (using `useTransform` to interpolate background hues)
- Each section's content fades/slides in as you scroll, but the background is one continuous flow
- Add a new `SectionTransition` component: a full-width SVG wave/mesh divider that morphs between colors, placed between content blocks

### 2. Persistent Interactive Background Layer (`components/landing/ImmersiveBackground.tsx`)
- New component: a `position: fixed` background layer behind all content
- Contains:
  - **Animated gradient mesh**: 3-4 large blurred color orbs that slowly drift and respond to scroll position (y changes their position/scale)
  - **Mouse-reactive glow**: a large radial gradient that follows the cursor across the entire page (not per-section)
  - **Floating particles**: CSS-only animated dots/circles using `@keyframes` (lightweight, no R3F)
  - **Noise texture overlay**: persistent grain for depth
- All sections become `bg-transparent` so this background shows through

### 3. Scroll-Triggered Content Animations (all section files)
- Every heading: staggered character-by-character or word-by-word reveal on scroll using Framer Motion
- Cards: 3D tilt on hover (already in StatsSection, extend to ALL cards everywhere)
- All content blocks: `useInView` with `whileInView` spring animations — slide up, scale in, rotate slightly
- Add `perspective` to the page container for subtle 3D depth on all transforms

### 4. Section-Specific Enhancements

**Hero**: Add subtle mouse-parallax to the entire content block (heading moves opposite to mouse). Remove separate parallax bg — use the global ImmersiveBackground instead.

**LogoStrip**: Make it a full-width infinite scroll with speed-reactive marquee that accelerates during fast scroll. Add blur/glow trails behind logos.

**FeaturedProducts**: Cards enter with a staggered 3D flip animation. On hover, card lifts with dramatic shadow + glow.

**WhyChooseUs**: Cards float in from alternating left/right sides with rotation. Icons pulse with accent glow on hover.

**CategoriesSection**: Cards arrange in a circular/arc layout on desktop, animating into position as section scrolls into view.

**StatsSection**: Numbers count up with a "slot machine" rolling effect. Bento cards have persistent subtle floating animation.

**DarkStatsBanner**: Full-bleed with horizontal scroll-linked number reveal (numbers wipe in from left as you scroll past).

**TeamSection**: Keep carousel but add a blurred, enlarged version of the active icon behind the carousel as a backdrop.

**LocationsSection**: Cards enter with a "map pin drop" bounce animation. Add a subtle animated dotted-line connecting cards.

**FAQSection**: Accordion items slide in from the right with stagger. Open/close has elastic spring animation.

**Footer**: Fade in with a cinematic slow reveal. Add a "scroll to top" floating button with smooth animation.

### 5. Global Mouse Cursor Enhancement (`index.css`)
- Custom cursor: a small accent-colored dot that scales up on hover over interactive elements
- Add a trailing glow circle that follows the cursor with delay (CSS `transition` on a fixed div)

### 6. Smooth Scroll Enhancements (`Index.tsx`)
- Add `scroll-behavior: smooth` already exists, but add Lenis-style momentum via CSS `overscroll-behavior: none` and a smoother easing feel
- Use `will-change: transform` on animated elements for GPU acceleration

## Files

| Action | File | What |
|--------|------|------|
| Create | `src/components/landing/ImmersiveBackground.tsx` | Fixed bg with gradient mesh, mouse glow, particles, noise |
| Create | `src/components/landing/SectionTransition.tsx` | SVG wave morph divider between sections |
| Create | `src/components/landing/CustomCursor.tsx` | Accent dot cursor + trailing glow |
| Modify | `src/pages/Index.tsx` | Add ImmersiveBackground, CustomCursor, remove section gaps, add perspective container |
| Modify | `src/index.css` | Custom cursor styles, global perspective, seamless section utilities, particle keyframes |
| Modify | `src/components/landing/HeroSection.tsx` | Remove self-contained bg, add mouse-parallax on content, transparent bg |
| Modify | `src/components/landing/LogoStrip.tsx` | Speed-reactive marquee, glow trails, transparent bg |
| Modify | `src/components/landing/FeaturedProducts.tsx` | 3D flip card entry, transparent bg, enhanced hover |
| Modify | `src/components/landing/WhyChooseUs.tsx` | Alternating entry, transparent bg, icon glow |
| Modify | `src/components/landing/CategoriesSection.tsx` | Arc layout, transparent bg |
| Modify | `src/components/landing/StatsSection.tsx` | Slot machine numbers, floating cards, transparent bg |
| Modify | `src/components/landing/DarkStatsBanner.tsx` | Horizontal wipe reveal, transparent bg |
| Modify | `src/components/landing/TeamSection.tsx` | Backdrop blur effect behind active item |
| Modify | `src/components/landing/LocationsSection.tsx` | Pin-drop bounce, connecting lines, transparent bg |
| Modify | `src/components/landing/FAQSection.tsx` | Slide-from-right stagger, spring accordion, transparent bg |
| Modify | `src/components/landing/Footer.tsx` | Cinematic reveal, scroll-to-top button, transparent bg |

## Technical Notes
- No additional packages needed — Framer Motion handles everything
- All section backgrounds become transparent/semi-transparent to let ImmersiveBackground show through
- Mouse cursor enhancement is CSS-only (hidden on mobile)
- Particle system is CSS `@keyframes` only — no canvas, no R3F for particles
- Mobile: disable custom cursor, reduce particle count, simpler animations
- The ImmersiveBackground gradient orbs shift position based on `scrollYProgress` mapped across the full page

