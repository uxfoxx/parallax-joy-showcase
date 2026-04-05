
# Convert DarkStatsBanner to Light/White Background

## Changes

### 1. `src/components/landing/DarkStatsBanner.tsx`
- **Background**: Replace the dark forest gradient with a clean white/light background (`bg-background`)
- **Remove** the dark gradient `motion.div`, the pulsing SVG line, and the mouse-follow glow overlay (they don't suit a light theme)
- **Text colors**: Change `text-primary-foreground` → `text-foreground` for stat numbers, `text-forest-light` → `text-muted-foreground` for labels
- **Icon container**: Change `bg-primary-foreground/5` → `bg-forest-deep/10`, keep icon color as `text-forest-mid` (matches the accent on light bg)
- **Dividers**: Change `sm:divide-primary-foreground/10` → `sm:divide-border`

### 2. `src/pages/Index.tsx`
- Change `data-navbar-theme="dark"` → `data-navbar-theme="light"` on the DarkStatsBanner wrapper (line 49)

| File | Change |
|------|--------|
| `src/components/landing/DarkStatsBanner.tsx` | Light background, remove dark overlays, update text/icon colors |
| `src/pages/Index.tsx` | Switch navbar theme to `light` for this section |
