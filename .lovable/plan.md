

# Immersive Scroll Experience + Modern Font Update

## Summary

Two changes in one pass: (1) implement the approved immersive scroll design with seamless morphing, interactive backgrounds, and enhanced animations; (2) swap fonts from Playfair Display + DM Sans to a cleaner, modern pairing.

## Font Change

**Current**: Playfair Display (serif headings) + DM Sans (body)
**New**: **Inter** (body/UI) + **Space Grotesk** (headings) — geometric, clean, techy, pairs perfectly with dark gradient themes. Both are Google Fonts, free.

### Files for font change:
- `src/index.css` — update Google Fonts import, update `body` and heading font-family rules
- `tailwind.config.ts` — update `fontFamily.display` to `Space Grotesk` and `fontFamily.body` to `Inter`
- `index.html` — optionally add preconnect hints for faster font loading

## Immersive Scroll Changes (from approved plan)

### New Components
| File | Purpose |
|------|---------|
| `ImmersiveBackground.tsx` | Fixed layer: animated gradient orbs, mouse-following glow, floating CSS particles, noise overlay |
| `SectionTransition.tsx` | SVG wave divider that morphs colors between sections |
| `CustomCursor.tsx` | Accent dot cursor + trailing glow (desktop only) |

### Modified Components
| File | Change |
|------|--------|
| `Index.tsx` | Add ImmersiveBackground + CustomCursor, wrap in perspective container, insert SectionTransitions between sections |
| `index.css` | Custom cursor styles, particle keyframes, perspective utilities |
| `HeroSection.tsx` | Transparent bg, mouse-parallax on content |
| `LogoStrip.tsx` | Speed-reactive marquee, glow trails, transparent bg |
| `FeaturedProducts.tsx` | 3D flip card entry, enhanced hover, transparent bg |
| `WhyChooseUs.tsx` | Alternating entry animations, icon glow, transparent bg |
| `CategoriesSection.tsx` | Arc layout animation, transparent bg |
| `StatsSection.tsx` | Slot machine number roll, floating cards, transparent bg |
| `DarkStatsBanner.tsx` | Horizontal wipe reveal, transparent bg |
| `TeamSection.tsx` | Blurred backdrop behind active item |
| `LocationsSection.tsx` | Pin-drop bounce, connecting lines, transparent bg |
| `FAQSection.tsx` | Slide-from-right stagger, spring accordion, transparent bg |
| `Footer.tsx` | Cinematic reveal, scroll-to-top button, transparent bg |

### Technical Notes
- All section backgrounds become transparent to let ImmersiveBackground show through
- ImmersiveBackground gradient orbs shift with `scrollYProgress`
- Mouse glow uses a single page-level `mousemove` listener
- Custom cursor hidden on mobile; particles reduced on mobile
- No new packages — Framer Motion handles all animations
- Font swap is a simple find-and-replace across 3 files

