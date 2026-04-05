

# Remove Tabs, Stack Sections, Make Gallery Sticky

## Summary
Replace the tabbed content with stacked sections (Description, Specifications, Tags all visible), and make the left gallery column sticky so it stays in view while the user scrolls through the right-side info.

## Changes in `src/pages/ProductDetailPage.tsx`

### 1. Remove Tabs, Stack All Sections Vertically
Replace the `<Tabs>` component with stacked sections separated by headings and dividers:
- **Description** section with an "About this product" heading
- **Specifications** table (Category, Origin, SKU, Brand)
- **Tags** section (if any)

Each section separated by a `<Separator />` for clean visual hierarchy.

### 2. Make Gallery Sticky
- Add `lg:sticky lg:top-24 lg:self-start` to the left gallery column so it stays pinned while the right column scrolls
- This creates the effect where the image stays visible as the user reads through the product details below

### 3. Remove unused Tabs imports
- Remove `Tabs, TabsContent, TabsList, TabsTrigger` imports since they're no longer needed

## Files

| File | Change |
|------|--------|
| `src/pages/ProductDetailPage.tsx` | Remove Tabs, stack sections vertically, add `sticky` to gallery column |

