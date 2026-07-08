-- Normalize product.category to consistent Title Case values, add multi-category
-- support (products.categories text[]), and prune the categories table down to
-- only the values actually in use (it had ~65 rows, most orphaned leftovers from
-- an earlier seed that never matched real product data).

-- 1. Normalize category text on products (fixes a stray "Italian Pasta" vs
--    "ITALIAN PASTA" case mismatch and gives every category a readable label).
update public.products set category = case category
  when 'Australian Lamb' then 'Australian Lamb'
  when 'Australian Mutton' then 'Australian Mutton'
  when 'BEEF' then 'Beef'
  when 'CANNED VEGETABLE & DRIED FRUITS' then 'Canned Vegetables & Dried Fruits'
  when 'CHOCOLATE AND PASTRY' then 'Chocolate & Pastry'
  when 'DRY NUTS/SEEDS/DRY FRUITS' then 'Dry Nuts, Seeds & Dried Fruits'
  when 'EDIBLE OILS' then 'Edible Oils'
  when 'FLOUR' then 'Flour'
  when 'FROZEN FRENCH FRIES' then 'Frozen French Fries'
  when 'FROZEN FRUIT PUREE' then 'Frozen Fruit Puree'
  when 'FROZEN POTATO PRODUCTS' then 'Frozen Potato Products'
  when 'FROZEN VEGETABLES & FRUITS' then 'Frozen Vegetables & Fruits'
  when 'HERBS & SPICES' then 'Herbs & Spices'
  when 'HONEY' then 'Honey'
  when 'IMPORTED CHEESE' then 'Imported Cheese'
  when 'Italian Pasta' then 'Italian Pasta'
  when 'ITALIAN PASTA' then 'Italian Pasta'
  when 'JAPANESE PRODUCT' then 'Japanese Products'
  when 'LOCAL SAUCE' then 'Local Sauces'
  when 'MEXICAN' then 'Mexican'
  when 'PACKING MATERIAL' then 'Packing Material'
  when 'PIE FILLING & TOPPING' then 'Pie Filling & Topping'
  when 'POULTRY' then 'Poultry'
  when 'RICE' then 'Rice'
  when 'SEA FOOD' then 'Seafood'
  when 'SEASONINGS AND SAUCE' then 'Seasonings & Sauce'
  when 'THAI PRODUCT' then 'Thai Products'
  when 'VINEGAR' then 'Vinegar'
  else category
end;

-- 2. Add multi-category support: a product can belong to more than one category.
--    `category` remains the primary/display category; `categories` is the full set.
alter table public.products add column if not exists categories text[] not null default '{}';
update public.products set categories = array[category] where categories = '{}';

-- Soy/fish sauces are Thai-sourced but are genuinely also seasoning sauces —
-- a concrete example of a product that legitimately spans two categories.
update public.products
  set categories = array['Thai Products', 'Seasonings & Sauce']
  where name in ('Fish Sauce', 'Black (Dark) Soy Sauce Orange Label');

-- 3. Prune the categories table to just what's in use, with matching Title Case
--    names (it previously had ~65 rows, most never assigned to any product).
with used as (select distinct unnest(categories) as name from public.products)
delete from public.categories where name not in (select name from used);

insert into public.categories (name)
select name from (select distinct unnest(categories) as name from public.products) used
on conflict (name) do nothing;
