

# Redesign Stats & Banner Sections

## Problem
The "Three Decades of Excellence" section is a basic 2-column grid with plain bordered cards — visually flat. The DarkStatsBanner repeats the same stats (30+ years, 8+ partners, 3 channels) making the page feel redundant.

## Plan

### 1. StatsSection — Interactive Bento-Style Layout with Mouse Tilt

Replace the current plain stat cards with an interactive bento grid where each card has:
- **3D tilt on mouse hover** using a lightweight `onMouseMove` handler that calculates rotateX/rotateY based on cursor position within the card (no library needed, just `transform: perspective(800px) rotateX() rotateY()`)
- **Animated gradient border** that shifts on hover (CSS `background: conic-gradient` behind a slightly inset inner card)
- **Staggered entrance** via Framer Motion
- Layout: Large featured card (spans 2 cols) for "30+ Years" with a horizontal timeline graphic (simple CSS dots + line), then 3 smaller cards below for other stats

Stats stay the same: 30+ years, 8+ brand partners, 8+ countries, 3 distribution channels.

Left side keeps the heading + paragraph + CTA but with refined spacing.

### 2. DarkStatsBanner — Change to Operational Stats

Replace the repeated stats with **different, operational metrics** that showcase scale:
- **500+** — Products Distributed
- **1,000+** — Active Retail Partners  
- **24/7** — Cold-Chain Monitoring
- **Island-Wide** — Delivery Coverage

Keep the dark gradient background + mouse-follow glow. Add a subtle horizontal scrolling line animation behind the numbers (thin animated SVG line that pulses).

Each stat gets a micro-icon (Lucide) above the number for visual anchoring.

## Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/StatsSection.tsx` — bento grid with 3D tilt cards |
| Modify | `src/components/landing/DarkStatsBanner.tsx` — new operational stats + icons |

