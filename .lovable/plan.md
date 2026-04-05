

# Remove Fly-In Animation from Categories Section

## What
Remove the fly-in animation (scattered off-screen positions with spring physics) from the category cards. Replace with simple fade-in. Keep everything else: dynamic categories from DB, icon mapping, "View All Categories" button, layout.

## Changes in `src/components/landing/CategoriesSection.tsx`

1. **Remove** the `flyInPositions` array (lines 35-41)
2. **Replace** the `motion.div` wrappers around category cards (lines 67-77 and 86-97) with simple fade-in animations using `initial={{ opacity: 0, y: 20 }}` and `whileInView={{ opacity: 1, y: 0 }}` with staggered delays
3. Keep the `CategoryCard` component's `whileHover` effects as-is (those are subtle hover interactions, not the fly-in)

| File | Change |
|------|--------|
| `src/components/landing/CategoriesSection.tsx` | Remove `flyInPositions`, replace scattered fly-in with simple fade-in on cards |

