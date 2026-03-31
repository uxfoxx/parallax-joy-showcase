

# Apply Brand Color Palette Across All Gradients

## Brand Colors (from uploaded palette)
- **#0F241A** → `hsl(150 40% 10%)` — near-black green (deepest backgrounds)
- **#194B22** → `hsl(140 50% 19%)` — deep forest green (primary dark)
- **#5C7928** → `hsl(80 50% 31%)` — olive green (mid accent)
- **#879D48** → `hsl(75 38% 45%)` — sage/gold-green (highlight, replaces gold/amber)

## What Changes

### 1. CSS Variables (`src/index.css`)
Update all `:root` and `.dark` variables:
- `--forest-deep` → based on #0F241A
- `--forest-mid` → based on #194B22
- `--forest-light` → based on #5C7928
- `--gold` / `--gold-light` → based on #879D48 (sage-gold replaces warm amber)
- `--accent` → #879D48 hue
- `--primary` → #194B22 hue
- `.text-gradient-gold` → gradient from #5C7928 to #879D48
- `.glow-border` → updated gradient colors
- `pulse-glow` keyframe → use #879D48 tones

### 2. Hero Section (`HeroSection.tsx`)
Replace all hardcoded `hsl(140...)` and `hsl(42...)` gradient stops with brand colors:
- Base gradient: #0F241A → #194B22 → #0F241A
- Accent glows: #879D48 at low opacity instead of gold
- Olive glow: #5C7928 at low opacity

### 3. All Dark Sections (hardcoded gradients in 10+ files)
Every file with `hsl(140 45% 8%)`, `hsl(140 40% 12%)`, `hsl(42 80% 55%)` etc. gets remapped:
- `hsl(140 45% 8%)` → `hsl(150 40% 10%)` (#0F241A)
- `hsl(140 40% 12%)` → `hsl(140 50% 19%)` (#194B22)
- `hsl(42 80% 55%)` → `hsl(75 38% 45%)` (#879D48)
- `hsl(42 70% 75%)` → `hsl(75 40% 60%)` (lighter #879D48)

Files affected:
- `FeaturedProducts.tsx`
- `Footer.tsx`
- `LocationsSection.tsx`
- `LogoStrip.tsx`
- `WhyChooseUs.tsx`
- `CategoriesSection.tsx`
- `StatsSection.tsx`
- `DarkStatsBanner.tsx`
- `TeamSection.tsx`
- `FAQSection.tsx`
- `ScrollFloatingElement.tsx`
- `ProductsPage.tsx`
- `BrandsPage.tsx`
- `AboutPage.tsx`
- `BrandDetailPage.tsx`
- `FeaturedPage.tsx`

### 4. Tailwind Config (`tailwind.config.ts`)
No structural changes needed — colors reference CSS variables which we update in index.css.

## Result
The entire site shifts from the generic green + warm amber/gold palette to the official Olive Foods brand colors — darker, more olive-toned greens with sage-gold highlights instead of yellow-gold.

