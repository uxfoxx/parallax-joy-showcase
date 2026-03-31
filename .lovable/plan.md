

# Replace Leaf Icon with Official Olive Foods Logo SVG

## Summary

The uploaded SVG is the official Olive Foods logo containing the brand icon + "OLIVE FOODS" text. It needs to replace the generic Lucide `Leaf` icon everywhere it appears as the brand mark — Navbar, Footer, and optionally the ScrollFloatingElement. Since the logo already includes the text "OLIVE FOODS", the separate text label next to the logo in the Navbar and Footer should be removed to avoid duplication.

## Changes

### 1. Copy logo to project assets
- Copy `user-uploads://logo_olive-01_1.svg` → `src/assets/olive-foods-logo.svg`

### 2. Navbar (`src/components/landing/Navbar.tsx`)
- Remove `Leaf` import from lucide-react
- Import the SVG logo: `import logoSvg from "@/assets/olive-foods-logo.svg"`
- Replace the circular Leaf icon + "Olive Foods" text with an `<img>` tag using the SVG logo
- Size it appropriately (~h-10 on desktop, ~h-8 on mobile) with proper contrast handling (the logo is dark green, so on the dark navbar it may need a CSS `filter: brightness(2)` or `invert` when on dark backgrounds, or we can use `className="brightness-200"` for the scrolled/landing state)
- Remove the separate "Olive Foods" text `<span>` since the logo contains it

### 3. Footer (`src/components/landing/Footer.tsx`)
- Remove `Leaf` import
- Import the SVG logo
- Replace the Leaf icon + "Olive Foods" text span with the logo `<img>` at ~h-10
- Apply a brightness/contrast filter so the dark green logo is visible on the dark footer background

### 4. Mobile menu (already in Navbar)
- The mobile menu doesn't show the logo, so no change needed there

## Technical Notes
- The SVG logo uses dark green fills (`#194B22`, `#5C7928`, etc.) — these work on light backgrounds but need brightness boost on dark backgrounds
- Using `className="brightness-0 invert"` will make it white on dark contexts, or `brightness-[2]` for a lighter green appearance
- The logo viewBox is `0 0 595.3 841.9` (portrait orientation) — the actual content sits in the middle, so the rendered image will have natural whitespace; setting a fixed height and `object-contain` will handle this

## Files

| Action | File |
|--------|------|
| Copy | `user-uploads://logo_olive-01_1.svg` → `src/assets/olive-foods-logo.svg` |
| Modify | `src/components/landing/Navbar.tsx` — replace Leaf icon + text with logo img |
| Modify | `src/components/landing/Footer.tsx` — replace Leaf icon + text with logo img |

