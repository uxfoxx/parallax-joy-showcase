-- Admin-configurable company contact phone for the "Save Contact" (vCard)
-- option on profile link pages (/profile/:slug). Joins the shared brochure /
-- certificate settings in the singleton settings row. Public read + admin write
-- already apply to this table.
alter table public.brochure_settings add column if not exists contact_phone text;
