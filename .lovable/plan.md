

# WhyChooseUs Gradient Flip + Team Section Video Background

## 1. WhyChooseUs — Dark gradient on top
**File**: `src/components/landing/WhyChooseUs.tsx` (line 62)

Change the linear gradient from `hsl(150 40% 10%), hsl(140 50% 19%), hsl(150 40% 10%)` to dark-top:
```
linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 10%))
```

## 2. Team Section — Factory video background
**File**: `src/components/landing/TeamSection.tsx`

- Remove white background and decorative orbs (lines 21-36)
- Add a full-bleed `<video>` element with `autoPlay muted loop playsInline` using a royalty-free factory/warehouse video from Pixabay (MP4)
- Add dark overlay (`bg-black/50`) for text readability
- Switch text from dark to white: `text-foreground` → `text-white`, `text-muted-foreground` → `text-white/70`
- Update badge: `bg-accent/10 text-accent border-accent/20` → `bg-white/10 text-white border-white/20`
- Update accent span from `text-forest-mid` to `text-olive-mid` for better contrast on dark
- Update `data-navbar-theme` wrapper in `Index.tsx` from `"dark"` to `"light"` (or ensure it says `"dark"` since it's now a dark section)

## Files

| File | Change |
|------|--------|
| `src/components/landing/WhyChooseUs.tsx` | Flip gradient — dark on top |
| `src/components/landing/TeamSection.tsx` | Video background + dark overlay + white text |

