-- Merge Australian Lamb, Australian Mutton, and Beef into a single "Frozen
-- Meat" category, per client feedback ("we'll do mutton, beef and lamb
-- under frozen meat, it's easier").
insert into public.categories (name)
values ('Frozen Meat')
on conflict (name) do nothing;

update public.products
  set category = 'Frozen Meat', categories = array['Frozen Meat']
  where category in ('Australian Lamb', 'Australian Mutton', 'Beef');

delete from public.categories where name in ('Australian Lamb', 'Australian Mutton', 'Beef');
