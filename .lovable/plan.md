

# Team Section → Animated Carousel Slider

## Concept

Replace the static 4-column grid with a full-width carousel slider featuring:
- Large, immersive slides — each team department gets a full-width card with a big icon area, name, role, and bio
- Auto-playing with smooth transitions, pause on hover
- Drag/swipe support via Embla Carousel (already installed)
- Animated progress dots + prev/next arrows
- Each slide entrance uses Framer Motion for staggered content reveal (icon scales in, text fades up)
- Background parallax orbs retained

## Layout Per Slide

```text
┌─────────────────────────────────────────────────┐
│                                                 │
│      ┌──────────┐                               │
│      │   Icon   │   Department Name             │
│      │  Circle  │   Role subtitle               │
│      │  (large) │                               │
│      └──────────┘   Bio text paragraph           │
│                     spanning 2-3 lines           │
│                                                 │
└─────────────────────────────────────────────────┘
```

Each slide is a horizontal layout (icon left, text right) on desktop, stacked on mobile. Cards use glassmorphic styling (`bg-card/80 backdrop-blur border`).

## Animations
- **Auto-play**: cycles every 5 seconds
- **Slide transition**: Embla's default smooth scroll + Framer Motion `AnimatePresence` for content within active slide
- **Active slide content**: icon scales from 0.8→1, text staggers fade-in with 0.1s delays
- **Progress indicator**: animated bar under dots showing auto-play timer
- **Hover**: pauses auto-play, card lifts slightly

## Technical Details
- Uses `embla-carousel-react` (already in deps) with `autoplay` via `embla-carousel-autoplay`
- Need to install `embla-carousel-autoplay` plugin
- Track active slide index via Embla API `on('select')` callback
- Framer Motion `key={activeIndex}` triggers re-animation on slide change

## Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/TeamSection.tsx` — full rewrite to carousel |
| Install | `embla-carousel-autoplay` package |

