

# Navbar Vibration Effect + Fix Button Text Visibility

## 1. Navbar Subtle Vibration Effect

Add a periodic micro-vibration to the navbar bar using Framer Motion. The effect will be a very subtle horizontal shake (±1px) that fires in bursts — 3 quick shakes every 8 seconds. It's decorative and barely perceptible, like a heartbeat pulse.

**File: `src/components/landing/Navbar.tsx`**
- Add a `useEffect` with `setInterval` (every 8s) that triggers a Framer Motion animation sequence on the inner bar
- Use `useAnimationControls()` from Framer Motion to programmatically trigger a shake sequence: `[0, -1, 1, -0.5, 0.5, 0]` over ~0.4s with spring easing
- Apply controls to the inner `motion.div` bar element

## 2. Button Text Visibility Fixes

**Problem**: `bg-accent text-accent-foreground` uses olive-gold bg (`hsl(75 38% 45%)`) with dark green text (`hsl(140 30% 10%)`). The contrast is poor — both are medium-dark tones. The dark green text on olive-gold background is hard to read.

**Fix**: Change `text-accent-foreground` to `text-white` across all accent-colored buttons, since white on olive-gold has excellent contrast. Also applies to accent badges.

**Affected locations** (all `bg-accent text-accent-foreground` → `bg-accent text-white`):

| File | Location |
|------|----------|
| `src/components/landing/Navbar.tsx` | Light-mode "Contact Us" button (line 123), mobile menu button (line 176) |
| `src/components/landing/HeroSection.tsx` | "Explore Products" button |
| `src/components/landing/StatsSection.tsx` | "View Products" button |
| `src/pages/AboutPage.tsx` | CTA "Contact Us" button |
| `src/pages/ContactPage.tsx` | "Send Message" submit button |
| `src/pages/admin/AdminLogin.tsx` | Login/signup button |
| `src/components/ProductCard.tsx` | "Featured" badge |
| `src/pages/admin/AdminProducts.tsx` | Featured "Yes" badge |

Additionally, the Product Detail page "Inquire" button uses `bg-primary text-primary-foreground` which on a light page means dark green bg with cream text — this is fine. The Brand Detail "Inquire" button uses `bg-primary-foreground text-forest-deep` (cream bg, dark green text) — also fine.

## Files

| File | Change |
|------|--------|
| `src/components/landing/Navbar.tsx` | Add vibration effect + fix accent button text |
| `src/components/landing/HeroSection.tsx` | Fix accent button text color |
| `src/components/landing/StatsSection.tsx` | Fix accent button text color |
| `src/pages/AboutPage.tsx` | Fix accent button text color |
| `src/pages/ContactPage.tsx` | Fix accent button text color |
| `src/pages/admin/AdminLogin.tsx` | Fix accent button text color |
| `src/components/ProductCard.tsx` | Fix accent badge text color |
| `src/pages/admin/AdminProducts.tsx` | Fix accent badge text color |

