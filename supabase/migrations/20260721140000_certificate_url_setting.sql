-- The GMP certificate shown on /about is now admin-changeable. It joins the
-- shared brochure PDF in the singleton settings row (both are one-per-site
-- company assets). Public read + admin write already apply to this table.
alter table public.brochure_settings add column if not exists certificate_url text;
