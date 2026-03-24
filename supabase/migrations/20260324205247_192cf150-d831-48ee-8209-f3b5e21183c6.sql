
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create brands table
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  origin TEXT NOT NULL DEFAULT '',
  established INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admins can insert brands" ON public.brands FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update brands" ON public.brands FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete brands" ON public.brands FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  origin TEXT NOT NULL DEFAULT '',
  sku TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed brands
INSERT INTO public.brands (slug, name, description, origin, established) VALUES
  ('golden-harvest', 'Golden Harvest', 'Premium grains and cereals sourced from the finest farms across Southeast Asia. Known for consistent quality and sustainable farming practices.', 'Thailand', 1998),
  ('pacific-seas', 'Pacific Seas', 'Wild-caught and sustainably farmed seafood from the pristine waters of the Pacific Ocean. Certified for quality and freshness.', 'New Zealand', 2005),
  ('alpine-fresh', 'Alpine Fresh', 'European dairy excellence — artisan cheeses, butter, and cream from Alpine pastures with centuries-old traditions.', 'Switzerland', 1985),
  ('sahara-spice', 'Sahara Spice', 'Exotic spices and seasonings handpicked from markets across North Africa and the Middle East. Bold flavors, pure ingredients.', 'Morocco', 2010),
  ('eastern-delight', 'Eastern Delight', 'Traditional Asian processed foods and ready-to-use ingredients crafted with authentic recipes and modern food safety standards.', 'Japan', 2002),
  ('nordic-naturals', 'Nordic Naturals', 'Clean-label beverages and health-focused products from Scandinavia. Organic, minimally processed, and naturally delicious.', 'Sweden', 2012);

-- Seed categories
INSERT INTO public.categories (name, description) VALUES
  ('Grains & Cereals', 'Premium grains, rice, and cereal products'),
  ('Beverages', 'Organic and specialty beverages'),
  ('Dairy', 'Artisan cheeses, butter, and cream'),
  ('Processed Foods', 'Ready-to-use sauces, pastes, and ingredients'),
  ('Spices & Seasonings', 'Exotic spices and blends from around the world'),
  ('Seafood', 'Wild-caught and sustainably farmed seafood');

-- Seed products using subqueries for brand_id
INSERT INTO public.products (slug, name, brand_id, category, description, featured, tags, origin, sku) VALUES
  ('premium-jasmine-rice', 'Premium Jasmine Rice', (SELECT id FROM public.brands WHERE slug='golden-harvest'), 'Grains & Cereals', 'Fragrant long-grain jasmine rice, aged for optimal texture. Perfect for everyday cooking and specialty dishes.', true, ARRAY['organic','gluten-free'], 'Thailand', 'GH-JR-001'),
  ('organic-quinoa', 'Organic Quinoa', (SELECT id FROM public.brands WHERE slug='golden-harvest'), 'Grains & Cereals', 'Protein-rich tri-color quinoa sourced from certified organic farms.', false, ARRAY['organic','high-protein'], 'Peru', 'GH-OQ-002'),
  ('basmati-gold', 'Basmati Gold', (SELECT id FROM public.brands WHERE slug='golden-harvest'), 'Grains & Cereals', 'Extra-long grain basmati rice, aged 2 years for exceptional aroma and fluffy texture.', true, ARRAY['premium','aged'], 'India', 'GH-BG-003'),
  ('steel-cut-oats', 'Steel Cut Oats', (SELECT id FROM public.brands WHERE slug='golden-harvest'), 'Grains & Cereals', 'Hearty steel-cut oats for a nutritious breakfast. Minimally processed for maximum nutrition.', false, ARRAY['whole-grain','fiber-rich'], 'Australia', 'GH-SO-004'),
  ('wild-salmon-fillet', 'Wild Salmon Fillet', (SELECT id FROM public.brands WHERE slug='pacific-seas'), 'Seafood', 'Flash-frozen wild-caught Alaskan salmon fillets. Rich in omega-3 fatty acids.', true, ARRAY['wild-caught','omega-3'], 'Alaska', 'PS-SF-001'),
  ('king-prawns', 'King Prawns', (SELECT id FROM public.brands WHERE slug='pacific-seas'), 'Seafood', 'Jumbo king prawns, sustainably farmed and individually quick-frozen for freshness.', false, ARRAY['sustainable','IQF'], 'New Zealand', 'PS-KP-002'),
  ('blue-fin-tuna-steaks', 'Blue Fin Tuna Steaks', (SELECT id FROM public.brands WHERE slug='pacific-seas'), 'Seafood', 'Sashimi-grade tuna steaks, perfect for fine dining and premium cuisine.', true, ARRAY['sashimi-grade','premium'], 'Japan', 'PS-BT-003'),
  ('gruyere-reserve', 'Gruyère Reserve', (SELECT id FROM public.brands WHERE slug='alpine-fresh'), 'Dairy', '18-month aged Gruyère cheese with a complex, nutty flavor profile. AOC certified.', true, ARRAY['aged','AOC-certified'], 'Switzerland', 'AF-GR-001'),
  ('alpine-butter', 'Alpine Butter', (SELECT id FROM public.brands WHERE slug='alpine-fresh'), 'Dairy', 'Slow-churned European-style butter with 82% butterfat content. Rich and creamy.', false, ARRAY['european-style','premium'], 'France', 'AF-AB-002'),
  ('organic-cream', 'Organic Heavy Cream', (SELECT id FROM public.brands WHERE slug='alpine-fresh'), 'Dairy', 'Fresh organic heavy cream from grass-fed Alpine cows. 40% fat content.', false, ARRAY['organic','grass-fed'], 'Austria', 'AF-OC-003'),
  ('aged-parmesan', 'Aged Parmesan', (SELECT id FROM public.brands WHERE slug='alpine-fresh'), 'Dairy', '24-month aged Parmigiano-Reggiano with a rich, crystalline texture. DOP certified.', true, ARRAY['DOP','aged-24m'], 'Italy', 'AF-AP-004'),
  ('saffron-threads', 'Saffron Threads', (SELECT id FROM public.brands WHERE slug='sahara-spice'), 'Spices & Seasonings', 'Hand-harvested Grade-1 saffron threads. Intense color, aroma, and flavor.', true, ARRAY['grade-1','hand-harvested'], 'Iran', 'SS-ST-001'),
  ('ras-el-hanout', 'Ras el Hanout Blend', (SELECT id FROM public.brands WHERE slug='sahara-spice'), 'Spices & Seasonings', 'Traditional 27-spice North African blend. Warming, complex, and aromatic.', false, ARRAY['blend','traditional'], 'Morocco', 'SS-RH-002'),
  ('smoked-paprika', 'Smoked Paprika', (SELECT id FROM public.brands WHERE slug='sahara-spice'), 'Spices & Seasonings', 'Oak-smoked sweet paprika with a deep, smoky aroma. Perfect for stews and marinades.', false, ARRAY['smoked','sweet'], 'Spain', 'SS-SP-003'),
  ('miso-paste-white', 'White Miso Paste', (SELECT id FROM public.brands WHERE slug='eastern-delight'), 'Processed Foods', 'Traditionally fermented white miso paste. Mild, sweet, and versatile for soups and glazes.', false, ARRAY['fermented','traditional'], 'Japan', 'ED-WM-001'),
  ('sriracha-reserve', 'Sriracha Reserve', (SELECT id FROM public.brands WHERE slug='eastern-delight'), 'Processed Foods', 'Small-batch aged sriracha with fresh red jalapeños. Bold heat, balanced sweetness.', true, ARRAY['small-batch','aged'], 'Thailand', 'ED-SR-002'),
  ('coconut-cream', 'Organic Coconut Cream', (SELECT id FROM public.brands WHERE slug='eastern-delight'), 'Processed Foods', 'Cold-pressed organic coconut cream. No additives, preservatives, or emulsifiers.', false, ARRAY['organic','cold-pressed'], 'Sri Lanka', 'ED-CC-003'),
  ('ponzu-sauce', 'Yuzu Ponzu Sauce', (SELECT id FROM public.brands WHERE slug='eastern-delight'), 'Processed Foods', 'Citrus-infused soy sauce made with fresh yuzu juice. Light and refreshing.', true, ARRAY['yuzu','citrus'], 'Japan', 'ED-YP-004'),
  ('oat-milk-barista', 'Oat Milk Barista Edition', (SELECT id FROM public.brands WHERE slug='nordic-naturals'), 'Beverages', 'Barista-grade oat milk that froths beautifully. No added sugars, fortified with calcium.', true, ARRAY['barista','no-sugar'], 'Sweden', 'NN-OM-001'),
  ('lingonberry-juice', 'Lingonberry Juice', (SELECT id FROM public.brands WHERE slug='nordic-naturals'), 'Beverages', '100% pure wild lingonberry juice. Rich in antioxidants and vitamin C.', false, ARRAY['wild-harvested','antioxidant'], 'Finland', 'NN-LJ-002'),
  ('sparkling-elderflower', 'Sparkling Elderflower', (SELECT id FROM public.brands WHERE slug='nordic-naturals'), 'Beverages', 'Naturally carbonated elderflower drink with a delicate floral sweetness.', false, ARRAY['sparkling','floral'], 'Denmark', 'NN-SE-003');
