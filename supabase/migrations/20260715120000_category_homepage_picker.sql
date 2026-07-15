-- Let admins curate which categories show on the homepage instead of the
-- site picking whichever 5 categories sort first alphabetically.
alter table public.categories add column if not exists homepage_featured boolean not null default false;
alter table public.categories add column if not exists homepage_order integer not null default 0;
