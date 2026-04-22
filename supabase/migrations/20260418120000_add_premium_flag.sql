ALTER TABLE public.products ADD COLUMN premium boolean NOT NULL DEFAULT false;
CREATE INDEX idx_products_premium ON public.products(premium) WHERE premium = true;
