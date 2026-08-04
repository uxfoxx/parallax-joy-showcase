-- Second admin-configurable company phone for the "Save Contact" vCard on
-- profile link pages, so the saved Olive Foods contact can carry two numbers.
alter table public.brochure_settings add column if not exists contact_phone_2 text;
