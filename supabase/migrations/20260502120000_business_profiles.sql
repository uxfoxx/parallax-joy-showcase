-- E Business Profiles: digital business-card records for staff, each with a
-- public shareable slug. Public can read active profiles; admins manage all.
create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  title text,
  company text not null default 'Olive Foods',
  phone text,
  phone_secondary text,
  whatsapp text,
  email text,
  bio text,
  photo_url text,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_profiles enable row level security;

create policy "business_profiles_public_read" on public.business_profiles
  for select using (active = true);

create policy "business_profiles_admin_all" on public.business_profiles
  for all to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

create index if not exists business_profiles_order_idx
  on public.business_profiles (display_order);
