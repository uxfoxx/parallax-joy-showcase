

# Fix Card Visibility on Light Backgrounds

## Problem
Product and brand cards use `border-border/30` (very faint) and `shadow-md` which barely registers on white/light backgrounds. The no-image placeholder gradient is also too subtle.

## Solution
Increase card border opacity and shadow depth on both ProductCard and BrandsPage brand cards, plus darken the no-image placeholder. Keep light section backgrounds unchanged.

### Changes

**`src/components/ProductCard.tsx`** (line 26):
- Border: `border-border/30` → `border-border`
- Shadow: `shadow-md hover:shadow-xl` → `shadow-lg hover:shadow-2xl`
- No-image placeholder (line 36): increase gradient opacity `from-forest-deep/30 via-forest-mid/20 to-accent/15` and icon opacity `text-forest-mid/40`

**`src/pages/BrandsPage.tsx`** (line 37):
- Border: `border-border/30` → `border-border`
- Shadow: `shadow-md hover:shadow-xl` → `shadow-lg hover:shadow-2xl`
- No-image placeholder (line 41): increase gradient opacity to match ProductCard

| File | Change |
|------|--------|
| `src/components/ProductCard.tsx` | Stronger border + shadow + darker placeholder |
| `src/pages/BrandsPage.tsx` | Stronger border + shadow + darker placeholder |

