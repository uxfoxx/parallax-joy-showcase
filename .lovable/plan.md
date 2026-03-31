

# Navbar Section-Aware Colors + WhatsApp Button + Video Fix

## 1. Navbar — Section-Aware Color Switching

**Approach**: Use `IntersectionObserver` to detect which section is currently in view. Each section declares whether it's "dark" or "light" via a `data-navbar-theme` attribute. The navbar reads this and switches between light text (on dark sections) and dark text (on light sections) with a smooth CSS transition.

### Changes:
- **`Navbar.tsx`**: Replace the simple `scrolled` + `isLanding` logic with a `currentTheme` state (`"dark" | "light"`) driven by an `IntersectionObserver` that watches elements with `data-navbar-theme`. When a dark section is in view → white text, dark glass bg. When a light section is in view → dark text, white glass bg. Smooth `transition-all duration-500` handles the color change.
- **`Index.tsx`**: Add `data-navbar-theme="dark"` or `data-navbar-theme="light"` to each section wrapper. Dark sections: Hero, FeaturedProducts, StatsSection, DarkStatsBanner, TeamSection, FAQSection, Footer. Light sections: LogoStrip, WhyChooseUs, CategoriesSection, LocationsSection.

### Navbar color modes:
| Mode | Background | Text | Logo | Button |
|------|-----------|------|------|--------|
| Dark section | `bg-forest-deep/80 backdrop-blur-xl` | white | inverted (white) | white fill |
| Light section | `bg-white/80 backdrop-blur-xl shadow-md` | dark | normal | green fill |

## 2. Floating WhatsApp Button

Create a new component `src/components/FloatingWhatsApp.tsx`:
- Fixed position `bottom-6 right-6 z-50`
- Green circle button with WhatsApp icon (SVG inline or lucide `MessageCircle` styled green)
- On click: `window.open("https://wa.me/94XXXXXXXXXX")` — use a placeholder number the user can update
- Pulse animation on idle to draw attention
- Tooltip on hover: "Chat with us"
- Render in `Index.tsx` and `PageLayout.tsx`

## 3. Team Section Video — Ensure Playback

The video element exists but may not autoplay due to browser policies. Fix:
- Add `preload="auto"` attribute
- Use a higher quality video URL (current one is 360p SD)
- Add an `onCanPlay` handler to explicitly call `.play()` as fallback
- Ensure `muted` is set (required for autoplay)

## Files

| Action | File |
|--------|------|
| Modify | `src/components/landing/Navbar.tsx` — IntersectionObserver-based theme switching |
| Modify | `src/pages/Index.tsx` — add `data-navbar-theme` attributes to sections |
| Create | `src/components/FloatingWhatsApp.tsx` — floating WhatsApp chat button |
| Modify | `src/components/PageLayout.tsx` — add FloatingWhatsApp |
| Modify | `src/components/landing/TeamSection.tsx` — fix video autoplay |

