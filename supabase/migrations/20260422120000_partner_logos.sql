-- Partner logos: curated, admin-managed list shown in the landing
-- "Our Brand Partners" marquee. Decoupled from the `brands` catalog so
-- partners can be reordered, toggled, and linked independently.

create table public.partner_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  link_url text,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.partner_logos enable row level security;

-- Public read of active logos (landing page).
create policy "partner_logos_public_read"
  on public.partner_logos for select
  using (active = true);

-- Authenticated admins can do anything.
create policy "partner_logos_admin_all"
  on public.partner_logos for all
  to authenticated
  using (true) with check (true);

create index partner_logos_order_idx on public.partner_logos (display_order);
