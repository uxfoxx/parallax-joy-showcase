

# Team Section — White Background with Matching Components

## Changes to `src/components/landing/TeamSection.tsx`

### Background
- Replace dark gradient mesh background (`bg-[hsl(150_40%_6%)]` + dark orbs + `bg-black/40` overlay) with a **clean white/cream background**
- Keep the animated orbs but make them very subtle light green tints on white

### Text Colors
- Heading: change from `text-white` to `text-foreground` (dark green)
- Subtitle: change from `text-white/50` to `text-muted-foreground`
- Badge: keep accent color but adjust border/bg for light background

### Cards
- Change from dark glassmorphism (`bg-white/[0.05]`) to light glassmorphism with soft green-tinted cards
- Card bg: `bg-white/80 backdrop-blur-md border border-border shadow-lg`
- Hover: `hover:bg-white hover:shadow-xl`
- Icon text: change from `text-white/70` to the brand green colors
- Card name text: change from `text-white/80` to `text-foreground`

### Orbs
- Keep parallax orbs but use much lower opacity on a white base, creating subtle colored light effects on the white background

