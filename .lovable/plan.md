

# Full Plan: Sharper Borders, Tighter Spacing + All Previous Changes

## Summary

Seven changes in one pass: (1) reduce border radius site-wide from `rounded-2xl`/`rounded-3xl` to `rounded-lg`/`rounded-xl`, (2) reduce card padding/spacing, (3) navbar active link bold+glow instead of pill, (4) smoother custom cursor, (5) sticky scroll sections, (6) team section with video bg + photo-only cards, (7) locations section with Google Map + about page map.

---

## 1. Sharper Borders — Site-Wide

Replace overly rounded corners everywhere:
- `rounded-2xl` → `rounded-lg` on cards, containers, icon boxes
- `rounded-3xl` → `rounded-xl` where used
- `rounded-xl` on buttons stays (already reasonable)
- Navbar bar: `rounded-2xl` → `rounded-xl`
- Badge pills: `rounded-full` stays (they're small tags)

**Files**: Every landing component, `Navbar.tsx`, `AboutPage.tsx`, `ProductsPage.tsx`, `BrandsPage.tsx`, `FeaturedPage.tsx`, `ProductCard.tsx`, `StatsSection.tsx`

## 2. Tighter Card Spacing

- Reduce card padding from `p-10` → `p-6`, `p-8` → `p-5`
- Reduce `gap-8` → `gap-5` on card grids
- Reduce `mb-7` → `mb-4` on icon containers
- Team section cards: reduce `h-56`/`h-72` to `h-48`/`h-60`
- Section vertical padding: keep as-is (sections need breathing room)

**Files**: Same as above — all card-containing components

## 3. Navbar Active Link — Bold + Glow

**File**: `Navbar.tsx`
- Remove `motion.div` pill with `layoutId="nav-pill"`
- Active link: `font-bold` + `textShadow: "0 0 8px hsl(75 38% 45% / 0.6), 0 0 20px hsl(75 38% 45% / 0.3)"`
- Inactive: `font-medium`, no glow

## 4. Smoother Custom Cursor

**File**: `CustomCursor.tsx`
- Lerp: `0.12` → `0.08`
- Spring: `stiffness: 150` → `80`, `damping: 15` → `20`
- Glow: `w-10 h-10` → `w-14 h-14`, `blur-md` → `blur-xl`

## 5. Sticky Scroll Sections

**File**: `Index.tsx`
- Wrap `HeroSection` in `sticky top-0` container
- Wrap `DarkStatsBanner` in `sticky top-0` container
- Following sections get `relative z-10` to scroll over them

**File**: `index.css`
- Confirm `scroll-behavior: smooth` on html (already in `.smooth-scroll`)

## 6. Team Section — Video BG + Photo-Only Sliding Cards

**File**: `TeamSection.tsx` — full rewrite
- **Background**: Animated dark gradient mesh (3-4 slow-moving blobs) simulating video, with dark overlay
- **Cards**: Photo-only (placeholder professional photos from Unsplash), no text/icons. Portrait rectangles, `rounded-lg`, infinite marquee
- **Layout**: Asymmetric grid — heading left ("Our Team" / "Three Decades of Excellence"), photo strip right
- **Card style**: `overflow-hidden rounded-lg`, image fills card, hover scale-up + shadow

## 7. Locations Section → Google Maps

**File**: `LocationsSection.tsx` — full rewrite
- Remove 6-region card grid
- Split layout: heading + address + contact on left, Google Maps `<iframe>` on right
- Map: `rounded-lg overflow-hidden`, full height
- Dark gradient background

**File**: `AboutPage.tsx`
- Add "Our Location" section before CTA
- Light bg, same split layout with Google Map
- Compact version to match page rhythm

---

## Files Summary

| Action | File |
|--------|------|
| Modify | `src/components/landing/Navbar.tsx` — bold+glow, sharper corners |
| Modify | `src/components/landing/CustomCursor.tsx` — smoother motion |
| Modify | `src/components/landing/TeamSection.tsx` — full rewrite |
| Modify | `src/components/landing/LocationsSection.tsx` — full rewrite to Google Map |
| Modify | `src/components/landing/FeaturedProducts.tsx` — sharper corners, tighter spacing |
| Modify | `src/components/landing/WhyChooseUs.tsx` — sharper corners, tighter spacing |
| Modify | `src/components/landing/StatsSection.tsx` — sharper corners, tighter spacing |
| Modify | `src/components/landing/FAQSection.tsx` — sharper corners |
| Modify | `src/components/landing/DarkStatsBanner.tsx` — sharper corners |
| Modify | `src/components/landing/HeroSection.tsx` — sharper corners on buttons |
| Modify | `src/pages/Index.tsx` — sticky scroll wrappers |
| Modify | `src/pages/AboutPage.tsx` — sharper corners + Google Map section |
| Modify | `src/index.css` — ensure smooth scroll on html |

