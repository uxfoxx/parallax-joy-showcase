-- Seed placeholder product images for the 200-SKU catalog.
-- OF-0006 / OF-0015 get their real matching images; the other 198
-- alternate between the two so card grids show visual variety.

UPDATE public.products
SET image_url = CASE
  WHEN sku = 'OF-0006' THEN '/products/006_hungritos_frozen-french-fries-9mm.png'
  WHEN sku = 'OF-0015' THEN '/products/015_azizaa_basmathi-rice-20kg.png'
  WHEN (regexp_replace(sku, '\D', '', 'g')::int) % 2 = 0
    THEN '/products/006_hungritos_frozen-french-fries-9mm.png'
  ELSE '/products/015_azizaa_basmathi-rice-20kg.png'
END;
