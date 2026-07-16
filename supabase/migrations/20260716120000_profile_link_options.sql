-- Per-profile toggles for the new /profile/:slug chooser (Website /
-- E Business Profile / Brochure), plus a singleton table for the one
-- shared brochure PDF used by every profile.
alter table public.business_profiles add column if not exists show_website boolean not null default true;
alter table public.business_profiles add column if not exists show_card boolean not null default true;
alter table public.business_profiles add column if not exists show_brochure boolean not null default true;

create table if not exists public.brochure_settings (
  id boolean primary key default true check (id),
  pdf_url text,
  updated_at timestamptz not null default now()
);

insert into public.brochure_settings (id)
values (true)
on conflict (id) do nothing;

alter table public.brochure_settings enable row level security;

drop policy if exists "Public read brochure settings" on public.brochure_settings;
create policy "Public read brochure settings" on public.brochure_settings for select using (true);

drop policy if exists "Admins can update brochure settings" on public.brochure_settings;
create policy "Admins can update brochure settings" on public.brochure_settings for update to authenticated using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can insert brochure settings" on public.brochure_settings;
create policy "Admins can insert brochure settings" on public.brochure_settings for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
