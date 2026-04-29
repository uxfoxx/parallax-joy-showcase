-- Seed featured / our_product flags so the landing-page carousels
-- populate. Without this, FeaturedProducts and OurProductsSection
-- render nothing (both filter on these flags and bail when empty).
--
-- Featured: every 8th SKU → ~25 products, broad category coverage.
-- Our products: SKUs in a different stride so the two carousels show
-- different items.
-- Premium: a small hand-picked set spanning the marquee categories.

UPDATE public.products
SET featured = TRUE
WHERE (regexp_replace(sku, '\D', '', 'g')::int) % 8 = 1;

UPDATE public.products
SET our_product = TRUE
WHERE (regexp_replace(sku, '\D', '', 'g')::int) % 6 = 0;

UPDATE public.products
SET premium = TRUE
WHERE sku IN (
  'OF-0015',  -- Azizaa Basmati Rice 20KG
  'OF-0006',  -- Hungritos Frozen French Fries 9MM
  'OF-0028',  'OF-0044',  'OF-0061',  'OF-0083',
  'OF-0102',  'OF-0124',  'OF-0148',  'OF-0177'
);
