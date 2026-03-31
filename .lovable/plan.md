

# Mix Dark & Light Sections on About and Contact Pages

## Problem
Every section on both pages is dark green gradient — it's visually monotonous. The landing page alternates between dark and light sections (e.g., LogoStrip, WhyChooseUs, Categories, Stats are light with `bg-background`; Featured, DarkStats, Team, FAQ are dark). Need to apply the same rhythm.

## About Page — Section Theme Map

| Section | Theme | Rationale |
|---------|-------|-----------|
| Hero | Dark (keep) | All page heroes are dark |
| Who We Are | **Light** | Text-heavy, white bg with `text-foreground` gives breathing room |
| Core Business | Dark (keep) | Card grid looks great on dark |
| Mission & Vision | **Light** | Two cards on white, matching Stats section style |
| Competitive Advantage | Dark (keep) | 4-column grid, keep dark |
| Who We Serve | **Light** | Simple icon grid, white bg like Categories section |
| Location | Dark (keep) | Map section, keep dark |
| CTA | Dark (keep) | Standard dark CTA |

### Light section pattern (matching landing page):
- Remove gradient background div, use `bg-background` on section
- Replace parallax orbs with subtle accent-colored orbs (like CategoriesSection)
- `data-navbar-theme="light"`
- Text: `text-foreground` headings, `text-muted-foreground` body
- Cards: `bg-card border-border` with hover effects, icons in `bg-accent/10` containers with `text-accent` icons
- Pill badges: `bg-accent/10 text-accent border-accent/20`

## Contact Page — Section Theme Map

| Section | Theme |
|---------|-------|
| Hero | Dark (keep) |
| Form + Details | **Light** | Form card on white bg with `bg-card border-border`, inputs with standard light styling |

### Light form section:
- Section: `bg-background` with subtle accent orbs
- Form card: `bg-card border-border shadow-lg` 
- Inputs: standard `border-border bg-background text-foreground` styling
- Labels: `text-muted-foreground`
- Contact detail cards: `bg-card border-border` with `text-foreground`
- Icons: `bg-accent/10` container, `text-accent` icon color
- `data-navbar-theme="light"`

## Files

| File | Change |
|------|--------|
| `src/pages/AboutPage.tsx` | Convert Who We Are, Mission & Vision, Who We Serve to light sections |
| `src/pages/ContactPage.tsx` | Convert Form + Details section to light |

