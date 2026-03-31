

# Fix Button Visibility + Replace Hero Text with Logo

## 1. Replace Hero Text with Logo

**File: `src/components/landing/HeroSection.tsx`**

Replace the `<h1>` block ("Premium Food / Imports") with the uploaded SVG logo displayed large and centered. The logo will be imported from `src/assets/olive-foods-hero-logo.svg` (the new colored version). Keep the subtitle text and buttons below it. The logo will use `brightness-0 invert` to render white/cream on the dark hero background, sized at roughly `max-w-lg` to fill the hero nicely.

- Copy `user-uploads://logo_olive-01_1-2.svg` → `src/assets/olive-foods-hero-logo.svg`
- Replace lines 69-73 (the `<h1>` tag) with an `<img>` of the new logo, wrapped in a motion div for the same fade-in animation
- Keep the marquee "OLIVE FOODS" text in the background as-is

## 2. Button Visibility Audit & Fixes

After reviewing every button across the site, the issue is with the **default `Button` variant** (`bg-primary text-primary-foreground`). The base CSS defines `primary` = dark green and `primary-foreground` = cream — these are fine for contrast. However, several admin pages use `<Button>` with no explicit className override inside `DialogContent` and light backgrounds, which inherits the default variant. These are actually readable (dark green bg + cream text).

The **actual invisible buttons** are likely the `outline` variant buttons on hover: `hover:bg-accent hover:text-accent-foreground`. Since `accent` = olive-gold (`hsl(75 38% 45%)`) and `accent-foreground` = dark green (`hsl(140 30% 10%)`), this should have decent contrast.

Looking more carefully — the most probable "white on white" culprit is the **Navbar "Contact Us" button on light mode**: `bg-primary-foreground text-forest-deep`. `primary-foreground` = cream (`hsl(60 20% 95%)`) which is nearly white. On a white backdrop with the white/80 navbar, a cream button would be almost invisible. 

**Fix:** Change the light-mode navbar Contact Us button from `bg-primary-foreground` to `bg-forest-deep text-white` — dark green button with white text, clearly visible on the light navbar.

Also scan and fix any other instances where `bg-primary-foreground` is used as a button background on light sections:

| Location | Current | Fix |
|----------|---------|-----|
| Navbar light-mode CTA (line 137) | `bg-primary-foreground text-forest-deep` → cream bg on white navbar | `bg-forest-deep text-primary-foreground` — dark green bg, cream text |
| WhyChooseUs icon containers (line 129) | `bg-primary-foreground` — used as icon bg on dark section | Fine, keep as-is |
| About page icon containers | Same pattern on dark sections | Fine |
| BrandDetail "Inquire" button (line 52) | `bg-primary-foreground text-forest-deep` on dark section hero | Fine |

## Files

| File | Change |
|------|--------|
| `src/assets/olive-foods-hero-logo.svg` | New — copy from upload |
| `src/components/landing/HeroSection.tsx` | Replace h1 text with logo image |
| `src/components/landing/Navbar.tsx` | Fix light-mode Contact Us button colors |

