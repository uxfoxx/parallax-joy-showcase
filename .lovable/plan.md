

# Fix Netlify SPA Routing + Reduce Page Header Sizes

## Problem 1: Admin panel URLs not working on Netlify
Netlify doesn't know how to handle client-side routes like `/admin` — it tries to find actual files and returns 404. Need a `public/_redirects` file for SPA fallback.

## Problem 2: Page headers take too much space
All non-home pages (About, Contact, Brands, Products, Our Products) have large hero sections with `py-28 lg:py-36` or `py-32 lg:py-44` padding, making the title/subtitle area consume most of the viewport before content appears.

## Changes

### 1. Create `public/_redirects`
Add a Netlify SPA catch-all redirect:
```
/*    /index.html   200
```

### 2. Reduce hero padding on all sub-pages

| Page | Current padding | New padding |
|------|----------------|-------------|
| `AboutPage.tsx` | `py-32 lg:py-44` | `py-16 lg:py-24` |
| `ContactPage.tsx` | `py-32 lg:py-44` | `py-16 lg:py-24` |
| `BrandsPage.tsx` | `py-28 lg:py-36` | `py-16 lg:py-24` |
| `ProductsPage.tsx` (via PageLayout `pt-24`) | `py-28 lg:py-36` (if hero exists) | Reduce similarly |
| `OurProductsPage.tsx` | `py-28 lg:py-36` | `py-16 lg:py-24` |

Additionally:
- Reduce title font sizes from `text-4xl md:text-6xl` → `text-3xl md:text-4xl`
- Reduce subtitle max-width and bottom margin
- Remove the large icon circle on OurProductsPage (the Star icon taking 64px)
- Tighten `mb-6` on headings to `mb-3`

### 3. Files

| File | Change |
|------|--------|
| `public/_redirects` | Create with `/*  /index.html  200` |
| `src/pages/AboutPage.tsx` | Reduce hero padding, font sizes |
| `src/pages/ContactPage.tsx` | Reduce hero padding, font sizes |
| `src/pages/BrandsPage.tsx` | Reduce hero padding, font sizes |
| `src/pages/OurProductsPage.tsx` | Reduce hero padding, font sizes, shrink icon |
| `src/pages/ProductsPage.tsx` | Check and reduce any header spacing |

