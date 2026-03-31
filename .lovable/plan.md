

# Team Section Redesign — Video Background + Sliding Cards + Font Update

## Changes

### 1. Font Update
Current fonts (Space Grotesk + Inter) are already modern. Swap to **Sora** (headings) + **Inter** (body) for an even cleaner, more geometric feel that matches the dark theme better.

- `src/index.css` — update Google Fonts import URL
- `tailwind.config.ts` — change `fontFamily.display` to `["Sora", "sans-serif"]`

### 2. Team Section — Complete Rewrite

**Layout**: Full-width section with a looping background video (stock food/warehouse footage via a free MP4 URL or a dark ambient video). A dark overlay sits on top for readability. The sliding team cards float over the video.

**Cards**: Minimal, no description text below. Each card is a tall frosted-glass rectangle with:
- Large centered Lucide icon
- Department name at bottom
- Subtle glassmorphism (`backdrop-blur`, semi-transparent bg)
- No bio text, no role subtitle, no description area below the carousel

**Sliding mechanism**: Infinite auto-sliding horizontal strip using CSS `@keyframes marquee` (already defined in tailwind config). Cards slide continuously left-to-right. On hover, the strip pauses. No active/inactive state, no center-focus — just a smooth continuous scroll of all cards repeating.

**Overlay text**: A large heading ("Our Team") positioned on the left side of the section, vertically centered, while cards slide on the right — creating an asymmetric modern layout.

**Structure**:
```text
┌──────────────────────────────────────────────┐
│  [VIDEO BACKGROUND - full width, looping]    │
│  [DARK OVERLAY 60% opacity]                  │
│                                              │
│   OUR TEAM          [card][card][card]→→→    │
│   Three Decades     [sliding continuously]   │
│   of Excellence                              │
│                                              │
└──────────────────────────────────────────────┘
```

**Video**: Use a subtle dark ambient/abstract video. Since we can't host video files easily, use a CSS animated gradient background that simulates video motion (multiple layered gradients with different animation speeds), or embed a free stock video URL.

**Alternative to video**: Animated dark gradient mesh background using CSS keyframes — 3-4 large color blobs slowly morphing/drifting. This is more reliable than external video URLs and still creates that "living background" feel.

### Implementation Details

- Remove all: `activeIndex`, `isHovered`, `getDistance`, `getItemStyle`, `AnimatePresence` bio section, dots navigation
- Add: CSS marquee animation for continuous card sliding (duplicate the card array for seamless loop)
- Add: Animated gradient mesh background with `@keyframes` for blob movement
- Cards: `backdrop-blur-md bg-white/5 border border-white/10` glassmorphism style
- Section height: `min-h-[80vh]` for impact
- Asymmetric grid: `grid-cols-1 lg:grid-cols-[1fr_2fr]` — text left, cards right

## Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/TeamSection.tsx` — full rewrite |
| Modify | `src/index.css` — update font import to include Sora |
| Modify | `tailwind.config.ts` — change display font to Sora |

