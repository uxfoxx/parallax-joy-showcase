-- Replace product catalog with Olive Foods Product List (200 SKUs)
-- Generated from Olive_Foods_Product_Catalog_with_Origin_SKU.xlsx

BEGIN;

-- Wipe existing catalog (product_images cascade via FK).
DELETE FROM public.products;
DELETE FROM public.brands;

-- Brands
INSERT INTO public.brands (slug, name, description, origin) VALUES
  ('falcon', 'FALCON', '', 'UAE'),
  ('abc', 'ABC', '', 'Indonesia'),
  ('royal-arm', 'ROYAL ARM', '', 'UAE'),
  ('swiss-garden', 'SWISS GARDEN', '', 'UAE'),
  ('generic', 'Generic', '', 'Imported'),
  ('cadbury', 'CADBURY', '', 'UK'),
  ('acroyali', 'ACROYALI', '', 'Imported'),
  ('colatta', 'Colatta', '', 'Indonesia'),
  ('wagu', 'WAGU', '', 'Imported'),
  ('mara', 'MARA', '', 'Morocco'),
  ('figaro', 'Figaro', '', 'Imported'),
  ('wadi', 'Wadi', '', 'Imported'),
  ('super-chef', 'SUPER CHEF', '', 'UAE'),
  ('american-gourmet', 'AMERICAN GOURMET', '', 'USA'),
  ('hp', 'HP', '', 'UK'),
  ('l-and-p', 'L & P', '', 'UK'),
  ('remia', 'REMIA', '', 'Netherlands'),
  ('kd', 'KD', '', 'Spain'),
  ('shams', 'SHAMS', '', 'UAE'),
  ('blue-diamond', 'Blue Diamond', '', 'USA'),
  ('bon-vegato', 'BON VEGATO', '', 'Belgium'),
  ('hungritos', 'HUNGRITOS', '', 'Belgium'),
  ('sriracha', 'SRIRACHA', '', 'USA'),
  ('tabasco', 'TABASCO', '', 'USA'),
  ('dedicato', 'Dedicato', '', 'Imported'),
  ('donna-chiara', 'Donna Chiara', '', 'Imported'),
  ('kikkoman', 'Kikkoman', '', 'Japan'),
  ('ko', 'Ko', '', 'Imported'),
  ('zao', 'Zao', '', 'Imported'),
  ('mizkan', 'Mizkan', '', 'Italy'),
  ('virgina', 'VIRGINA', '', 'Lebanon'),
  ('bio', 'Bio', '', 'Imported'),
  ('azizaa', 'AZIZAA', '', 'India'),
  ('grawings', 'GRAWINGS', '', 'Italy'),
  ('hershey-s', 'Hershey''s', '', 'USA');

-- Categories (skip if already present)
INSERT INTO public.categories (name, description) VALUES
  ('Aluminium Foil', ''),
  ('Asian Sauces', ''),
  ('Australian Lamb', ''),
  ('Australian Mutton', ''),
  ('Baking Chocolate', ''),
  ('Baking Fats', ''),
  ('Baking Fillings', ''),
  ('Baking Glazes', ''),
  ('Baking Ingredients', ''),
  ('Baking Supplies', ''),
  ('Beef Cuts', ''),
  ('Broths & Stocks', ''),
  ('Canned Beans', ''),
  ('Canned Fruit', ''),
  ('Canned Fruit Pie Filling', ''),
  ('Canned Olives', ''),
  ('Canned Vegetables', ''),
  ('Cheese', ''),
  ('Condiments', ''),
  ('Cooking Oils', ''),
  ('Corn Products', ''),
  ('Dairy Alternatives', ''),
  ('Disposable Cups', ''),
  ('Disposable Gloves', ''),
  ('Disposable Headwear', ''),
  ('Dried Fruits & Vegetables', ''),
  ('Dry Nuts/Seeds/Dry Fruits', ''),
  ('Edible Oils', ''),
  ('Food Containers', ''),
  ('Frozen Berry', ''),
  ('Frozen French Fries', ''),
  ('Frozen Potatoes', ''),
  ('Gluten-Free Baking Mixes', ''),
  ('Gluten-Free Flours', ''),
  ('Herbs & Spices', ''),
  ('Honey', ''),
  ('Hot Sauce', ''),
  ('Italian Pasta', ''),
  ('Japanese Condiment', ''),
  ('Japanese Cooking Ingredient', ''),
  ('Japanese Curry', ''),
  ('Japanese Miso', ''),
  ('Japanese Noodles', ''),
  ('Japanese Rice Wine', ''),
  ('Japanese Seaweed', ''),
  ('Japanese Vinegar', ''),
  ('Lamb Cuts', ''),
  ('Mediterranean Sauces', ''),
  ('Mexican Tortillas', ''),
  ('Organic Italian Pasta', ''),
  ('Pickles', ''),
  ('Pie Filling', ''),
  ('Poultry', ''),
  ('Processed Meats', ''),
  ('Rice', ''),
  ('Sauces & Condiments', ''),
  ('Sea Food', ''),
  ('Sweeteners', ''),
  ('Thickeners', ''),
  ('Topping', ''),
  ('Vinegar', ''),
  ('Wraps and Edible Paper', '')
ON CONFLICT (name) DO NOTHING;

-- Products
INSERT INTO public.products (slug, name, brand_id, category, description, origin, sku, tags) VALUES
  ('falcon-aluminium-foil-25-sq-ft', 'Aluminium Foil 25 SQ FT', (SELECT id FROM public.brands WHERE slug = 'falcon'), 'Aluminium Foil', 'Falcon brand aluminium foil, 25 square feet, ideal for everyday kitchen use. Supplied in a convenient roll.

Key specs: Brand: Falcon, Length: 25 sq ft, Material: Aluminium

Pack: 1X24 ROLL', 'UAE', 'OF-0001', ARRAY['roll','1x24']::text[]),
  ('falcon-aluminium-foil-37-5-sq-ft', 'Aluminium Foil 37.5 SQ FT', (SELECT id FROM public.brands WHERE slug = 'falcon'), 'Aluminium Foil', 'Falcon brand aluminium foil, 37.5 square feet, suitable for cooking, baking, and food storage. Comes in a roll.

Key specs: Brand: Falcon, Length: 37.5 sq ft, Material: Aluminium

Pack: 1X24 ROLL', 'UAE', 'OF-0002', ARRAY['roll','1x24']::text[]),
  ('abc-sweet-soya-sauce', 'SWEET SOYA SAUCE', (SELECT id FROM public.brands WHERE slug = 'abc'), 'Asian Sauces', 'Sweet and thick Indonesian soy sauce with a molasses-like consistency and flavor. Excellent for marinating, grilling, and dipping.

Key specs: Sweet, thick, Indonesian, molasses-like

Pack: 12X600ML BOTTLE', 'Indonesia', 'OF-0003', ARRAY['bottle','12x600ml']::text[]),
  ('royal-arm-hoi-sin-sauce', 'HOI SIN SAUCE', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Asian Sauces', 'Sweet and savory Hoi Sin sauce, a staple in Cantonese cuisine. Great for marinades, glazes, and dipping sauces.

Key specs: Sweet, savory, thick, versatile

Pack: 12X230ML BOTTLE', 'UAE', 'OF-0004', ARRAY['bottle','12x230ml']::text[]),
  ('royal-arm-light-soya-sauce', 'LIGHT SOYA SAUCE', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Asian Sauces', 'A light and savory soya sauce with a delicate umami flavor. Suitable for seasoning, dipping, and cooking Asian cuisine.

Key specs: Light, savory, umami, versatile

Pack: 12X500ML BOTTLE', 'UAE', 'OF-0005', ARRAY['bottle','12x500ml']::text[]),
  ('royal-arm-sweet-soya-sauce', 'SWEET SOYA SAUCE', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Asian Sauces', 'A sweet and savory soya sauce with a rich, thick texture. Ideal for enhancing the flavor of stir-fries, glazes, and marinades.

Key specs: Sweet, savory, thick, versatile

Pack: 12X500ML BOTTLE', 'UAE', 'OF-0006', ARRAY['bottle','12x500ml']::text[]),
  ('swiss-garden-dark-soya-sauce', 'DARK SOYA SAUCE', (SELECT id FROM public.brands WHERE slug = 'swiss-garden'), 'Asian Sauces', 'Rich and dark soya sauce, offering a deeper color and bolder flavor. Ideal for adding depth to stir-fries and marinades.

Key specs: Rich, dark, bold flavor, coloring agent

Pack: 12X500ML BOTTLE', 'UAE', 'OF-0007', ARRAY['bottle','12x500ml']::text[]),
  ('generic-lamb-leg-bone-in', 'Lamb Leg Bone In', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Australian Lamb', 'Bone-in Australian lamb leg, ideal for slow roasting to achieve a tender and juicy result. A classic choice for family meals.

Key specs: Bone-in, roasting cut, rich flavor

Pack: PER KG KG', 'Imported', 'OF-0008', ARRAY['kg','per kg']::text[]),
  ('generic-lamb-leg-boneless', 'Lamb Leg Boneless', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Australian Lamb', 'Boneless Australian lamb leg, offering convenience and easy carving. This versatile cut is suitable for various cooking methods.

Key specs: Boneless, easy to carve, versatile

Pack: PER KG KG', 'Imported', 'OF-0009', ARRAY['kg','per kg']::text[]),
  ('generic-lamb-rack-standard', 'Lamb Rack Standard', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Australian Lamb', 'A standard cut of Australian lamb rack, perfect for roasting or grilling. This high-quality lamb is tender and flavorful.

Key specs: Bone-in, premium cut, versatile cooking

Pack: PER KG KG', 'Imported', 'OF-0010', ARRAY['kg','per kg']::text[]),
  ('generic-lamb-shank', 'Lamb Shank', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Australian Lamb', 'Hearty Australian lamb shanks, excellent for slow cooking until fall-off-the-bone tender. A comforting and flavorful dish.

Key specs: Bone-in, slow cooking, rich flavor

Pack: PER KG KG', 'Imported', 'OF-0011', ARRAY['kg','per kg']::text[]),
  ('generic-lamb-square-cut-shoulder-slices', 'Lamb Square Cut Shoulder Slices', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Australian Lamb', 'Australian lamb square cut shoulder slices, perfect for stews, curries, or grilling. These tender slices offer rich lamb flavor.

Key specs: Sliced, tender, ideal for stews and grilling

Pack: PER KG KG', 'Imported', 'OF-0012', ARRAY['kg','per kg']::text[]),
  ('generic-mutton-cube', 'Mutton Cube', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Australian Mutton', 'Cubed Australian mutton, suitable for curries, stews, and other slow-cooked dishes. Offers a robust and distinctive flavor.

Key specs: Cubed, robust flavor, ideal for slow cooking

Pack: PER KG KG', 'Imported', 'OF-0013', ARRAY['kg','per kg']::text[]),
  ('generic-mutton-leg-bone-in', 'Mutton Leg Bone In', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Australian Mutton', 'Bone-in Australian mutton leg, perfect for traditional roasting or slow cooking. Delivers a rich, gamey flavor.

Key specs: Bone-in, roasting cut, robust flavor

Pack: PER KG KG', 'Imported', 'OF-0014', ARRAY['kg','per kg']::text[]),
  ('generic-mutton-leg-boneless', 'Mutton Leg Boneless', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Australian Mutton', 'Boneless Australian mutton leg, offering convenience and a strong, distinctive flavor. Versatile for various culinary applications.

Key specs: Boneless, strong flavor, versatile

Pack: PER KG KG', 'Imported', 'OF-0015', ARRAY['kg','per kg']::text[]),
  ('cadbury-drinking-chocolate', 'Drinking Chocolate', (SELECT id FROM public.brands WHERE slug = 'cadbury'), 'Baking Chocolate', 'Rich and smooth drinking chocolate for a delicious hot beverage. Perfect for making authentic hot chocolate beverages.

Key specs: 6x500G pack, Tin unit

Pack: 6x500G TIN', 'UK', 'OF-0016', ARRAY['tin','6x500g']::text[]),
  ('generic-imported-couverture-dark-chocolate', 'Imported Couverture Dark Chocolate', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Chocolate', 'Premium imported dark couverture chocolate for professional baking. Perfect for tempering, molding, and dipping.

Key specs: 5KG pack, Bag unit

Pack: 5KG BAG', 'Imported', 'OF-0017', ARRAY['bag','5kg']::text[]),
  ('generic-milk-chocolate-chips', 'Milk Chocolate Chips', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Chocolate', ' classic milk chocolate chips for cookies, muffins, and desserts. Melts beautifully and adds a rich, sweet chocolate flavor.

Key specs: 5KG pack, Bag unit

Pack: 5KG BAG', 'Imported', 'OF-0018', ARRAY['bag','5kg']::text[]),
  ('generic-white-chocolate-chips', 'White Chocolate Chips', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Chocolate', 'Sweet white chocolate chips for baking and decorating. Offers a creamy, vanilla-like flavor and smooth texture.

Key specs: 5KG pack, Bag unit

Pack: 5KG BAG', 'Imported', 'OF-0019', ARRAY['bag','5kg']::text[]),
  ('generic-cocoa-butter', 'Cocoa Butter', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Fats', 'Pure cocoa butter for chocolate making and confectionery. Adds richness and a smooth texture to chocolates and desserts.

Key specs: 3KG pack, Tub unit

Pack: 3KG TUB', 'Imported', 'OF-0020', ARRAY['tub','3kg']::text[]),
  ('generic-praline-cream', 'Praline Cream', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Fillings', 'Smooth and rich praline cream, perfect for fillings and desserts. Offers a delightful nutty flavor and creamy texture.

Key specs: 6KG pack, Tub unit

Pack: 6KG TUB', 'Imported', 'OF-0021', ARRAY['tub','6kg']::text[]),
  ('generic-apricot-gel', 'Apricot Gel', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Glazes', 'Shiny apricot gel for glazing pastries and tarts. Adds a beautiful sheen and a subtle apricot flavor to baked goods.

Key specs: 12.5 KG pack, Tub unit

Pack: 12.5 KG TUB', 'Imported', 'OF-0022', ARRAY['tub','12.5 kg']::text[]),
  ('acroyali-red-glace-cherries', 'RED GLACE CHERRIES', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Baking Ingredients', 'Candied red glace cherries in a 13.60 kg pack, perfect for fruitcakes, cookies, and other baked goods.

Key specs: Candied, Red, 13.60 kg

Pack: 13.60 KG KG', 'Imported', 'OF-0023', ARRAY['kg','13.60 kg']::text[]),
  ('colatta-chocolate-vermicelli', 'Chocolate Vermicelli', (SELECT id FROM public.brands WHERE slug = 'colatta'), 'Baking Ingredients', 'Rich chocolate vermicelli, perfect for garnishing desserts, cakes, and ice cream.

Key specs: 2X5KG pack size, KG unit

Pack: 2X5KG KG', 'Indonesia', 'OF-0024', ARRAY['kg','2x5kg']::text[]),
  ('colatta-coloured-vermicelli', 'Coloured Vermicelli', (SELECT id FROM public.brands WHERE slug = 'colatta'), 'Baking Ingredients', 'Bright and colorful vermicelli, perfect for decorating cakes, pastries, and desserts.

Key specs: 2X5KG pack size, KG unit

Pack: 2X5KG KG', 'Indonesia', 'OF-0025', ARRAY['kg','2x5kg']::text[]),
  ('colatta-white-vermicelli', 'White Vermicelli', (SELECT id FROM public.brands WHERE slug = 'colatta'), 'Baking Ingredients', 'Delicate white vermicelli, ideal for adding a decorative touch to your sweet creations.

Key specs: 2X5KG pack size, KG unit

Pack: 2X5KG KG', 'Indonesia', 'OF-0026', ARRAY['kg','2x5kg']::text[]),
  ('generic-almond-paste', 'Almond Paste', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Ingredients', 'Finely ground almond paste for baking and confectionery. Ideal for pastries, fillings, and desserts.

Key specs: 4x2.5KGS pack, Block unit

Pack: 4X2.5KGS BLOCK', 'Imported', 'OF-0027', ARRAY['block','4x2.5kgs']::text[]),
  ('generic-cocoa-powder', 'Cocoa Powder', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Ingredients', 'Finest cocoa powder for baking and chocolate creations. Essential for adding deep chocolate flavor to various recipes.

Key specs: 1KG pack, KG unit

Pack: 1KG KG', 'Imported', 'OF-0028', ARRAY['kg','1kg']::text[]),
  ('generic-icing-sugar', 'Icing Sugar', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Ingredients', 'Finely powdered icing sugar, perfect for frostings, glazes, and dusting baked goods. Comes in a 2.5kg can.

Key specs: Powdered, 2.5kg pack, Can

Pack: 2.5KG CAN', 'Imported', 'OF-0029', ARRAY['can','2.5kg']::text[]),
  ('generic-instant-dry-yeast', 'Instant Dry Yeast', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Ingredients', 'Fast-acting instant dry yeast, essential for baking bread and other risen goods.

Key specs: 20x450G pack size, PKT unit

Pack: 20x450G PKT', 'Imported', 'OF-0030', ARRAY['pkt','20x450g']::text[]),
  ('generic-baking-paper', 'Baking Paper', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Supplies', 'Roll of baking paper, 45cm x 75m, perfect for non-stick baking and cooking. Essential for any kitchen.

Key specs: Dimensions: 45cm x 75m, Usage: Baking, Non-stick

Pack: 45CM X  75M ROLL', 'Imported', 'OF-0031', ARRAY['roll','45cm x  75m']::text[]),
  ('generic-white-cake-cups-11-5-cm', 'White Cake Cups 11.5 CM', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Supplies', 'White paper cake cups with an 11.5cm diameter, perfect for larger muffins or individual desserts. Available in a pack of 25x1000 pieces.

Key specs: White, 11.5cm diameter, 25x1000 pieces pack

Pack: 25X1OOOPCS PC', 'Imported', 'OF-0032', ARRAY['pc','25x1ooopcs']::text[]),
  ('generic-white-cake-cups-9-cm', 'White Cake Cups 9 CM', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Baking Supplies', 'White paper cake cups with a 9cm diameter, suitable for baking and serving cupcakes or muffins. Comes in a pack of 25x1000 pieces.

Key specs: White, 9cm diameter, 25x1000 pieces pack

Pack: 25X1OOOPCS PC', 'Imported', 'OF-0033', ARRAY['pc','25x1ooopcs']::text[]),
  ('generic-beef-chuck-ribs', 'Beef Chuck Ribs', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Beef Cuts', 'Succulent beef chuck ribs, sold per kilogram, ideal for slow cooking, braising, or BBQ. Flavorful and tender when cooked properly.

Key specs: Type: Chuck Ribs, Meat: Beef, Unit: Per KG

Pack: PER KG KG', 'Imported', 'OF-0034', ARRAY['kg','per kg']::text[]),
  ('generic-beef-striploin', 'Beef Striploin', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Beef Cuts', 'High-quality beef striploin, sold per kilogram, known for its tenderness and flavor. Ideal for grilling or roasting.

Key specs: Type: Striploin, Meat: Beef, Unit: Per KG

Pack: PER KG KG', 'Imported', 'OF-0035', ARRAY['kg','per kg']::text[]),
  ('generic-beef-tenderloin', 'Beef Tenderloin', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Beef Cuts', 'Premium beef tenderloin, priced per kilogram, prized for its exceptional tenderness. Perfect for steaks and fine dining.

Key specs: Type: Tenderloin, Meat: Beef, Unit: Per KG

Pack: PER KG KG', 'Imported', 'OF-0036', ARRAY['kg','per kg']::text[]),
  ('generic-beef-topside', 'Beef Topside', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Beef Cuts', 'Versatile beef topside, sold per kilogram, great for roasting, slicing, or stews. A lean and flavorful cut.

Key specs: Type: Topside, Meat: Beef, Unit: Per KG

Pack: PER KG KG', 'Imported', 'OF-0037', ARRAY['kg','per kg']::text[]),
  ('wagu-beef-external-flank-plate', 'Beef External Flank Plate', (SELECT id FROM public.brands WHERE slug = 'wagu'), 'Beef Cuts', 'Wagu beef external flank plate, sold per kilogram, offering rich marbling and intense flavor. Excellent for special dishes.

Key specs: Brand: Wagu, Type: External Flank Plate, Meat: Beef, Unit: Per KG

Pack: PER KG KG', 'Imported', 'OF-0038', ARRAY['kg','per kg']::text[]),
  ('generic-chicken-stock-powder', 'Chicken Stock Powder', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Broths & Stocks', 'Flavorful chicken stock powder, ideal for enhancing soups, stews, and gravies. Packaged in a 500g can.

Key specs: Chicken flavored, Powder, 500g pack, Can

Pack: 500GR CAN', 'Imported', 'OF-0039', ARRAY['can','500gr']::text[]),
  ('acroyali-baked-beans', 'BAKED BEANS', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Beans', 'Classic baked beans in a 400g tin, a convenient and hearty side dish or meal component.

Key specs: Baked, 400g tin

Pack: 24X400 GM TIN', 'Imported', 'OF-0040', ARRAY['tin','24x400 gm']::text[]),
  ('acroyali-red-kidney-beans', 'RED KIDNEY BEANS', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Beans', 'Nutritious red kidney beans in a 400g tin, perfect for chilis, salads, and other savory dishes.

Key specs: Red kidney beans, 400g tin

Pack: 24X400GM TIN', 'Imported', 'OF-0041', ARRAY['tin','24x400gm']::text[]),
  ('acroyali-dark-sweet-pitted-cherry', 'DARK SWEET PITTED CHERRY', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Fruit', 'Dark sweet pitted cherries in a 425g tin, ideal for baking, desserts, or as a fruity snack.

Key specs: Dark sweet, Pitted, 425g tin

Pack: 12X425GM TIN', 'Imported', 'OF-0042', ARRAY['tin','12x425gm']::text[]),
  ('acroyali-fruit-cocktail', 'FRUIT COCKTAIL', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Fruit', 'A mix of delicious fruits in an 825g tin, perfect for desserts, salads, or as a light snack.

Key specs: Mixed fruit, 825g tin

Pack: 12x825GM TIN', 'Imported', 'OF-0043', ARRAY['tin','12x825gm']::text[]),
  ('acroyali-lychees', 'LYCHEES', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Fruit', 'Sweet and juicy lychees in a 567g tin, a delightful tropical fruit perfect for desserts or snacking.

Key specs: Lychees, 567g tin

Pack: 12X567GM TIN', 'Imported', 'OF-0044', ARRAY['tin','12x567gm']::text[]),
  ('acroyali-peach-halves', 'PEACH HALVES', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Fruit', 'Delicious peach halves in an 825g tin, a versatile fruit that can be used in desserts, salads, or eaten on its own.

Key specs: Peach halves, 825g tin

Pack: 12X825GM TIN', 'Imported', 'OF-0045', ARRAY['tin','12x825gm']::text[]),
  ('acroyali-pear-halves-in-syrup', 'PEAR HALVES IN SYRUP', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Fruit', 'Succulent pear halves in a sweet syrup, packaged in an 825g tin for a delightful dessert or snack.

Key specs: Pear halves, In syrup, 825g tin

Pack: 12X825GM TIN', 'Imported', 'OF-0046', ARRAY['tin','12x825gm']::text[]),
  ('mara-red-cherries-with-stem', 'RED CHERRIES WITH STEM', (SELECT id FROM public.brands WHERE slug = 'mara'), 'Canned Fruit', 'Vibrant red cherries with stems in a 1-gallon jar, perfect for cocktails, desserts, or garnishes.

Key specs: Red cherries, With stem, 1-gallon jar

Pack: 4X1GAL GALLON', 'Morocco', 'OF-0047', ARRAY['gallon','4x1gal']::text[]),
  ('acroyali-raspberry-pie-filling', 'Raspberry Pie Filling', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Fruit Pie Filling', 'ACROYALI Raspberry Pie Filling is a sweet and tangy fruit filling perfect for a variety of baked goods. Available in a 4x3.17kg tin pack.

Key specs: Raspberry, 50% fruit, 4x3.17kg pack, Tin

Pack: 4X3.17KG TIN', 'Imported', 'OF-0048', ARRAY['tin','4x3.17kg']::text[]),
  ('acroyali-red-cherry-pie-filling', 'Red Cherry Pie Filling', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Fruit Pie Filling', 'ACROYALI Red Cherry Pie Filling is a delicious fruit filling for pies and desserts. It comes in a convenient 4x3.17kg tin pack.

Key specs: Red Cherry, 50% fruit, 4x3.17kg pack, Tin

Pack: 4X3.17KG TIN', 'Imported', 'OF-0049', ARRAY['tin','4x3.17kg']::text[]),
  ('figaro-stuffed-green-olives', 'Stuffed Green Olives', (SELECT id FROM public.brands WHERE slug = 'figaro'), 'Canned Olives', 'Figaro green olives stuffed with pimiento, offering a delightful briny and slightly sweet flavor. Great for appetizers, salads, and cocktails.

Key specs: 340g, stuffed with pimiento, briny

Pack: 12X340GM JAR', 'Imported', 'OF-0050', ARRAY['jar','12x340gm']::text[]),
  ('royal-arm-pitted-black-olives', 'Pitted Black Olives', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Canned Olives', 'Royal Arm pitted black olives, conveniently ready to use in a variety of dishes. Enjoy their mild, savory flavor and tender texture in salads, pastas, and pizzas.

Key specs: 340g, pitted, savory

Pack: 12X340G M BOTTLE', 'UAE', 'OF-0051', ARRAY['bottle','12x340g m']::text[]),
  ('royal-arm-whole-black-olives', 'Whole Black Olives', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Canned Olives', 'Royal Arm whole black olives in a jar, perfect for antipasti, salads, and cooking. Offers a rich, fruity flavor and firm texture.

Key specs: 340g, whole, fruity

Pack: 12X340GM JAR', 'UAE', 'OF-0052', ARRAY['jar','12x340gm']::text[]),
  ('royal-arm-whole-black-olives-tins', 'Whole Black Olives Tins', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Canned Olives', 'Large tins of Royal Arm whole black olives, ideal for foodservice or large families. These olives have a rich flavor and firm texture, perfect for cooking or snacking.

Key specs: 2.6kg, whole, catering size

Pack: 6X2600GM TIN', 'UAE', 'OF-0053', ARRAY['tin','6x2600gm']::text[]),
  ('wadi-pitted-black-olives', 'Pitted Black Olives', (SELECT id FROM public.brands WHERE slug = 'wadi'), 'Canned Olives', 'Wadi pitted black olives, ready to use in salads, pasta, and Mediterranean dishes. Features a rich, savory flavor and smooth texture.

Key specs: 3kg, pitted, savory

Pack: 6X3KG CAN', 'Imported', 'OF-0054', ARRAY['can','6x3kg']::text[]),
  ('acroyali-cream-style-sweet-corn', 'Cream Style Sweet Corn', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Vegetables', 'Creamy and sweet corn from Acroyali, packed in a tin. This cream-style corn is perfect as a side dish or an ingredient in soups and casseroles.

Key specs: 410g, cream style, sweet

Pack: 24X410 GM TIN', 'Imported', 'OF-0055', ARRAY['tin','24x410 gm']::text[]),
  ('acroyali-green-asparagus', 'GREEN ASPARAGUS', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Vegetables', 'Tender green asparagus spears in a 330g bottle, a versatile vegetable that can be enjoyed in many ways.

Key specs: Green asparagus, 330g bottle

Pack: 12X330GM BOTTLE', 'Imported', 'OF-0056', ARRAY['bottle','12x330gm']::text[]),
  ('acroyali-straw-mushroom', 'STRAW MUSHROOM', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Vegetables', 'Whole straw mushrooms in a convenient 425g tin, perfect for adding to stir-fries, soups, and other dishes.

Key specs: Whole, 425g tin

Pack: 24X425GM TIN', 'Imported', 'OF-0057', ARRAY['tin','24x425gm']::text[]),
  ('acroyali-sweet-corn-kernels', 'Sweet Corn Kernels', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Vegetables', 'Acroyali sweet corn kernels, packed in a tin for convenience. These juicy and sweet kernels are a versatile addition to any meal, from salads to stir-fries.

Key specs: 425g, kernels, sweet

Pack: 24X425GM TIN', 'Imported', 'OF-0058', ARRAY['tin','24x425gm']::text[]),
  ('acroyali-white-asparagus', 'WHITE ASPARAGUS', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Vegetables', 'Delicate white asparagus spears in a 330g bottle, a gourmet vegetable option for various culinary creations.

Key specs: White asparagus, 330g bottle

Pack: 12X330GM BOTTLE', 'Imported', 'OF-0059', ARRAY['bottle','12x330gm']::text[]),
  ('acroyali-whole-mushrooms', 'Whole Mushrooms', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Vegetables', 'Acroyali whole mushrooms, preserved in a tin for extended freshness. These versatile mushrooms are perfect for adding to sauces, stir-fries, and casseroles.

Key specs: 425g, whole, versatile

Pack: 24X425GM TIN', 'Imported', 'OF-0060', ARRAY['tin','24x425gm']::text[]),
  ('acroyali-whole-peeled-tomato', 'WHOLE PEELED TOMATO', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Vegetables', 'Whole peeled tomatoes in a 2.84kg tin, a versatile ingredient for a variety of Italian and other cuisines.

Key specs: Whole, Peeled, 2.84kg tin

Pack: 6X2.840KG TIN', 'Imported', 'OF-0061', ARRAY['tin','6x2.840kg']::text[]),
  ('acroyali-young-corn', 'Young Corn', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Canned Vegetables', 'Acroyali young corn, also known as baby corn, packed in a tin. These tender and slightly sweet miniature corn cobs are excellent in stir-fries and salads.

Key specs: 410g, baby corn, tender

Pack: 24X410 GM TIN', 'Imported', 'OF-0062', ARRAY['tin','24x410 gm']::text[]),
  ('generic-canned-water-chestnuts', 'Canned Water Chestnuts', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Canned Vegetables', 'Crisp and subtly sweet water chestnuts, canned for convenience. Ideal for adding crunch to stir-fries, salads, and Asian-inspired dishes.

Key specs: 565g, sliced, crunchy

Pack: 24X565GM TIN', 'Imported', 'OF-0063', ARRAY['tin','24x565gm']::text[]),
  ('generic-capers', 'Capers', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Canned Vegetables', 'Briny and tangy capers, preserved in a jar, perfect for adding a burst of flavor to salads, sauces, and seafood dishes. Offers a distinctive piquant taste.

Key specs: 100g, brined, tangy

Pack: 24X100G M JAR', 'Imported', 'OF-0064', ARRAY['jar','24x100g m']::text[]),
  ('royal-arm-sliced-mushroom', 'SLICED MUSHROOM', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Canned Vegetables', 'Ready-to-use sliced mushrooms in a large 2.5kg tin, ideal for foodservice or large families.

Key specs: Sliced, 2.5kg tin

Pack: 6X2.5KG TIN', 'UAE', 'OF-0065', ARRAY['tin','6x2.5kg']::text[]),
  ('royal-arm-sliced-mushroom-2', 'SLICED MUSHROOM', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Canned Vegetables', 'Quality sliced mushrooms in a 737g bottle, ready to be added to your favorite recipes.

Key specs: Sliced, 737g bottle

Pack: 12X737GM BOTTLE', 'UAE', 'OF-0066', ARRAY['bottle','12x737gm']::text[]),
  ('super-chef-tomato-paste', 'TOMATO PASTE', (SELECT id FROM public.brands WHERE slug = 'super-chef'), 'Canned Vegetables', 'Concentrated tomato paste in a 2.2kg tin, perfect for enriching the flavor of sauces, stews, and other recipes.

Key specs: Concentrated, 2.2kg tin

Pack: 6X2.2KG TIN', 'UAE', 'OF-0067', ARRAY['tin','6x2.2kg']::text[]),
  ('generic-cheese-slice-128-s', 'Cheese Slice 128''s', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Cheese', 'Pre-sliced cheese in a convenient pack of 128 slices, perfect for sandwiches, burgers, or melting. Offers a mild and creamy flavor.

Key specs: Pre-sliced, mild flavor, versatile

Pack: 128''S PAC', 'Imported', 'OF-0068', ARRAY['pac','128''s']::text[]),
  ('generic-emmental-cheese', 'Emmental Cheese', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Cheese', 'Classic Emmental cheese with its distinctive holes and nutty, buttery flavor. Excellent for sandwiches, fondue, or cheese boards.

Key specs: Swiss cheese, nutty flavor, holstein

Pack: PER KG KG', 'Imported', 'OF-0069', ARRAY['kg','per kg']::text[]),
  ('generic-parmesan-cheese', 'Parmesan Cheese', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Cheese', 'Hard, granular Parmesan cheese, aged to perfection with a rich, nutty flavor. Ideal for grating over pasta, salads, or risottos.

Key specs: Hard cheese, nutty flavor, grating

Pack: 2 KG 2KG', 'Imported', 'OF-0070', ARRAY['2kg','2 kg']::text[]),
  ('american-gourmet-yellow-mustard', 'YELLOW MUSTARD', (SELECT id FROM public.brands WHERE slug = 'american-gourmet'), 'Condiments', 'Classic yellow mustard with a tangy and slightly spicy flavor. Perfect for hot dogs, burgers, and sandwiches.

Key specs: Tangy, slightly spicy, versatile condiment

Pack: 12X227G BOTTLE', 'USA', 'OF-0071', ARRAY['bottle','12x227g']::text[]),
  ('generic-artificial-vinegar', 'Artificial Vinegar', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Condiments', 'Artificial vinegar, ideal for pickling, dressings, and enhancing flavors in cooking. Available in a 4.5L can.

Key specs: Artificial, 4.5L pack, Can

Pack: 4.5L CAN', 'Imported', 'OF-0072', ARRAY['can','4.5l']::text[]),
  ('generic-cranberry-sauce', 'CRANBERRY SAUCE', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Condiments', 'Tart and sweet cranberry sauce, a traditional accompaniment to roasted poultry. Made from fresh or frozen cranberries, sugar, and water.

Key specs: Tart, sweet, traditional, accompanies poultry

Pack: 6X200ML TIN', 'Imported', 'OF-0073', ARRAY['tin','6x200ml']::text[]),
  ('hp-hp-sauce', 'HP SAUCE', (SELECT id FROM public.brands WHERE slug = 'hp'), 'Condiments', 'The original brown sauce with a unique blend of fruits and spices. An iconic British condiment, perfect for adding flavor to any meal.

Key specs: Fruity, spicy, tangy, versatile condiment

Pack: 12X225ML BOTTLE', 'UK', 'OF-0074', ARRAY['bottle','12x225ml']::text[]),
  ('l-and-p-worcestershire-sauce-original', 'WORCESTERSHIRE SAUCE ORIGINAL', (SELECT id FROM public.brands WHERE slug = 'l-and-p'), 'Condiments', 'Orignal Worcestershire sauce with a distinct savory and umami flavor. Ideal for marinades, sauces, and as a table condiment.

Key specs: Savory, umami flavor, versatile condiment

Pack: 12X290ML BOTTLE', 'UK', 'OF-0075', ARRAY['bottle','12x290ml']::text[]),
  ('remia-dijon-mustard', 'Dijon Mustard', (SELECT id FROM public.brands WHERE slug = 'remia'), 'Condiments', 'This is classic Dijon mustard from Remia, perfect for adding a zesty kick to your meals. Its smooth texture and sharp flavor are ideal for dressings, marinades, and sandwiches.

Key specs: Dijon, zesty, smooth, sharp flavor

Pack: 6X850GR BOTTLE', 'Netherlands', 'OF-0076', ARRAY['bottle','6x850gr']::text[]),
  ('royal-arm-mayonnaise', 'Mayonnaise', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Condiments', 'This is creamy mayonnaise from Royal Arm, perfect for sandwiches, salads, and dips. Its rich and tangy flavor enhances a variety of dishes.

Key specs: creamy, tangy, versatile

Pack: 4X1 GAL GALLON', 'UAE', 'OF-0077', ARRAY['gallon','4x1 gal']::text[]),
  ('royal-arm-mint-sauce', 'MINT SAUCE', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Condiments', 'Refreshing mint sauce, perfect as an accompaniment to roasted lamb or other meats. Offers a cool and zesty flavor.

Key specs: Refreshing, zesty, accompanies meats

Pack: 12X150ML BOTTLE', 'UAE', 'OF-0078', ARRAY['bottle','12x150ml']::text[]),
  ('royal-arm-worcestershire-sauce', 'WORCESTERSHIRE SAUCE', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Condiments', 'A classic Worcestershire sauce offering a blend of savory, sweet, and tangy notes. Great for enhancing the flavor of various dishes.

Key specs: Savory, sweet, tangy, versatile condiment

Pack: 24X250GM BOTTLE', 'UAE', 'OF-0079', ARRAY['bottle','24x250gm']::text[]),
  ('kd-olive-oil-extra-virgin', 'OLIVE OIL - EXTRA VIRGIN', (SELECT id FROM public.brands WHERE slug = 'kd'), 'Cooking Oils', 'Premium extra virgin olive oil, cold-pressed from fresh olives. Features a rich, fruity flavor and is perfect for dressings, dipping, and finishing dishes.

Key specs: Fruity flavor, cold-pressed, ideal for dressings

Pack: 12X1LTR BOTTLE', 'Spain', 'OF-0080', ARRAY['bottle','12x1ltr']::text[]),
  ('royal-arm-olive-oil-pomace', 'OLIVE OIL POMACE', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Cooking Oils', 'Refined olive oil with a blend of virgin olive oils. Suitable for high-heat cooking, frying, and general culinary applications.

Key specs: High smoke point, mild flavor, versatile

Pack: 12X1LTR BOTTLE', 'UAE', 'OF-0081', ARRAY['bottle','12x1ltr']::text[]),
  ('royal-arm-sesame-oil-blended', 'SESAME OIL BLENDED', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Cooking Oils', 'Aromatic blended sesame oil, offering a distinctive nutty flavor. Best used as a finishing oil or in marinades for Asian-inspired dishes.

Key specs: Nutty flavor, aromatic, finishing oil

Pack: 12X625ML BOTTLE', 'UAE', 'OF-0082', ARRAY['bottle','12x625ml']::text[]),
  ('shams-sunflower-oil', 'SUNFLOWER OIL', (SELECT id FROM public.brands WHERE slug = 'shams'), 'Cooking Oils', 'Light and healthy oil extracted from sunflower seeds. Ideal for frying, baking, and salad dressings due to its neutral flavor and high smoke point.

Key specs: Light, neutral flavor, high smoke point, versatile

Pack: 6x1.5ltr BOTTLE', 'UAE', 'OF-0083', ARRAY['bottle','6x1.5ltr']::text[]),
  ('super-chef-corn-oil', 'CORN OIL', (SELECT id FROM public.brands WHERE slug = 'super-chef'), 'Cooking Oils', 'Versatile cooking oil extracted from corn kernels. Suitable for deep frying, sautéing, and baking due to its mild flavor and high smoke point.

Key specs: Mild flavor, high smoke point, versatile cooking

Pack: 4X5LTR BOTTLE', 'UAE', 'OF-0084', ARRAY['bottle','4x5ltr']::text[]),
  ('generic-polenta', 'Polenta', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Corn Products', 'Fine Italian polenta, perfect for creamy side dishes or baking. Versatile cornmeal for a variety of culinary uses.

Key specs: 1KG pack, KG unit

Pack: 1KG KG', 'Imported', 'OF-0085', ARRAY['kg','1kg']::text[]),
  ('generic-almond-milk', 'Almond Milk', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Dairy Alternatives', 'Creamy and dairy-free almond milk, perfect for beverages and recipes. A versatile plant-based milk substitute.

Key specs: 6x1LTR pack, LTR unit

Pack: 6x1LTR LTR', 'Imported', 'OF-0086', ARRAY['ltr','6x1ltr']::text[]),
  ('generic-paper-cup-12-oz-white-hd', 'Paper Cup 12 oz White HD', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Disposable Cups', 'Heavy-duty white 12 oz paper cups, designed for various beverages. Each pack contains 50 cups.

Key specs: Capacity: 12 oz, Material: Paper, Color: White, Type: Heavy Duty, Quantity: 50 per pack

Pack: 1X500 PKT', 'Imported', 'OF-0087', ARRAY['pkt','1x500']::text[]),
  ('generic-paper-cup-6-oz-print', 'Paper Cup 6 oz Print', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Disposable Cups', 'Printed 6 oz paper cups, great for serving hot or cold beverages. This pack includes 50 cups.

Key specs: Capacity: 6 oz, Material: Paper, Quantity: 50 per pack

Pack: 1X1000 PKT', 'Imported', 'OF-0088', ARRAY['pkt','1x1000']::text[]),
  ('generic-paper-cup-8-oz-white', 'Paper Cup 8 oz White', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Disposable Cups', 'White 8 oz paper cups, perfect for coffee, tea, or other drinks. Comes in a pack of 50 cups.

Key specs: Capacity: 8 oz, Material: Paper, Color: White, Quantity: 50 per pack

Pack: 1X1000 PKT', 'Imported', 'OF-0089', ARRAY['pkt','1x1000']::text[]),
  ('generic-latex-gloves-medium-white', 'Latex Gloves Medium White', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Disposable Gloves', 'Medium-sized white latex gloves, suitable for various general-purpose tasks. This pack contains 100 gloves.

Key specs: Material: Latex, Color: White, Size: Medium, Quantity: 100 per pack

Pack: 10X100 PKT', 'Imported', 'OF-0090', ARRAY['pkt','10x100']::text[]),
  ('generic-poly-gloves', 'Poly Gloves', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Disposable Gloves', 'General-purpose clear poly gloves, suitable for light-duty tasks. Each pack contains 100 gloves.

Key specs: Material: Polyethylene, Quantity: 100 per pack

Pack: 100X100 PKT', 'Imported', 'OF-0091', ARRAY['pkt','100x100']::text[]),
  ('generic-vinyl-gloves-medium-black', 'Vinyl Gloves Medium Black', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Disposable Gloves', 'Medium-sized black vinyl gloves, perfect for versatile applications. Contains 100 gloves per pack.

Key specs: Material: Vinyl, Color: Black, Size: Medium, Quantity: 100 per pack

Pack: 10X100 PKT', 'Imported', 'OF-0092', ARRAY['pkt','10x100']::text[]),
  ('generic-vinyl-gloves-medium-blue', 'Vinyl Gloves Medium Blue', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Disposable Gloves', 'Medium-sized blue vinyl gloves, ideal for general use. Each pack includes 100 gloves.

Key specs: Material: Vinyl, Color: Blue, Size: Medium, Quantity: 100 per pack

Pack: 10X100 PKT', 'Imported', 'OF-0093', ARRAY['pkt','10x100']::text[]),
  ('generic-mop-cap-blue-double-disposable', 'Mop Cap Blue (Double) Disposable', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Disposable Headwear', 'Disposable double blue mop caps, suitable for hygiene-sensitive environments. Each pack contains 100 caps.

Key specs: Color: Blue, Type: Double, Material: Disposable, Quantity: 100 per pack

Pack: 10X100 PKT', 'Imported', 'OF-0094', ARRAY['pkt','10x100']::text[]),
  ('royal-arm-sundried-tomatoes', 'SUNDRIED TOMATOES', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Dried Fruits & Vegetables', 'Flavorful sundried tomatoes in a 2900g pack, great for salads, pasta dishes, and appetizers.

Key specs: Sundried, 2900g pack

Pack: 2X2900GM PKT', 'UAE', 'OF-0095', ARRAY['pkt','2x2900gm']::text[]),
  ('blue-diamond-almond-nibs', 'Almond Nibs', (SELECT id FROM public.brands WHERE slug = 'blue-diamond'), 'Dry Nuts/Seeds/Dry Fruits', 'Finely chopped almond nibs, perfect for baking, toppings, or as a snack.

Key specs: 1X11.34KGS pack size, KG unit

Pack: 1X11.34KGS KG', 'USA', 'OF-0096', ARRAY['kg','1x11.34kgs']::text[]),
  ('generic-almond-powder', 'Almond Powder', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Dry Nuts/Seeds/Dry Fruits', 'Finely ground almond powder, ideal for baking, thickening sauces, or adding flavor to dishes.

Key specs: 1X11.34KGS pack size, KG unit

Pack: 1X11.34KGS KG', 'Imported', 'OF-0097', ARRAY['kg','1x11.34kgs']::text[]),
  ('generic-almond-slice', 'Almond Slice', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Dry Nuts/Seeds/Dry Fruits', 'Thinly sliced almonds, perfect for garnishing, baking, or adding a delicate crunch to your meals.

Key specs: 1X11.34KGS pack size, KG unit

Pack: 1X11.34KGS KG', 'Imported', 'OF-0098', ARRAY['kg','1x11.34kgs']::text[]),
  ('generic-dried-apricots', 'Dried Apricots', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Dry Nuts/Seeds/Dry Fruits', 'Sweet and chewy dried apricots, a healthy snack or an addition to your baking.

Key specs: 1X10KG pack size, KG unit

Pack: 1X10KG KG', 'Imported', 'OF-0099', ARRAY['kg','1x10kg']::text[]),
  ('generic-pumpkin-seed-kernels', 'Pumpkin Seed Kernels', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Dry Nuts/Seeds/Dry Fruits', 'Nutrient-rich pumpkin seed kernels, great for snacking, salads, or baking.

Key specs: 1X20KGS pack size, KG unit

Pack: 1X20KGS KG', 'Imported', 'OF-0100', ARRAY['kg','1x20kgs']::text[]),
  ('generic-sultanas', 'Sultanas', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Dry Nuts/Seeds/Dry Fruits', 'Sweet and juicy sultanas, perfect for baking, snacking, or adding to cereals.

Key specs: 1X10KG pack size, KG unit

Pack: 1X10KG KG', 'Imported', 'OF-0101', ARRAY['kg','1x10kg']::text[]),
  ('generic-sunflower-seed-kernels', 'Sunflower Seed Kernels', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Dry Nuts/Seeds/Dry Fruits', 'Wholesome sunflower seed kernels, ideal for snacking, salads, or as a crunchy topping.

Key specs: 1X25KGS pack size, KG unit

Pack: 1X25KGS KG', 'Imported', 'OF-0102', ARRAY['kg','1x25kgs']::text[]),
  ('generic-walnut-halves', 'Walnut Halves', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Dry Nuts/Seeds/Dry Fruits', 'Premium walnut halves, perfect for snacking, baking, or adding to salads and desserts.

Key specs: 1X10KG pack size, KG unit

Pack: 1X10KG KG', 'Imported', 'OF-0103', ARRAY['kg','1x10kg']::text[]),
  ('generic-whole-almond-nut', 'Whole Almond Nut', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Dry Nuts/Seeds/Dry Fruits', 'Whole almond nuts, great for snacking, baking, or incorporating into various recipes.

Key specs: 1X11.34KGS pack size, KG unit

Pack: 1X11.34KGS KG', 'Imported', 'OF-0104', ARRAY['kg','1x11.34kgs']::text[]),
  ('generic-vegetable-oil', 'Vegetable Oil', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Edible Oils', 'A versatile cooking oil suitable for a variety of culinary applications.

Key specs: 20 LTR pack size, CAN unit

Pack: 20LTR CAN', 'Imported', 'OF-0105', ARRAY['can','20ltr']::text[]),
  ('generic-aluminium-container-with-lid-1200ml', 'Aluminium Container with Lid 1200ml', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Food Containers', '1200ml aluminium container with a lid, perfect for larger food portions. Comes in a pack of 400 units.

Key specs: Material: Aluminium, Capacity: 1200ml, Feature: Comes with lid, Quantity: 400 per pack

Pack: 1X400 PKT', 'Imported', 'OF-0106', ARRAY['pkt','1x400']::text[]),
  ('generic-aluminium-container-with-lid-750ml', 'Aluminium Container with Lid 750ml', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Food Containers', '750ml aluminium container with a lid, ideal for food storage or takeaways. This pack contains 1000 units.

Key specs: Material: Aluminium, Capacity: 750ml, Feature: Comes with lid, Quantity: 1000 per pack

Pack: 1X1000 PKT', 'Imported', 'OF-0107', ARRAY['pkt','1x1000']::text[]),
  ('generic-blueberry', 'Blueberry', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Frozen Berry', 'Frozen blueberries, packed with antioxidants and perfect for smoothies, baking, or desserts. Retains freshness and flavor.

Key specs: Frozen, antioxidant-rich, versatile

Pack: PER KG KG', 'Imported', 'OF-0108', ARRAY['kg','per kg']::text[]),
  ('generic-raspberry', 'Raspberry', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Frozen Berry', 'Frozen raspberries, offering a sweet and tart flavor for desserts, jams, or smoothies. A convenient way to enjoy berries year-round.

Key specs: Frozen, sweet and tart, versatile

Pack: PER KG KG', 'Imported', 'OF-0109', ARRAY['kg','per kg']::text[]),
  ('bon-vegato-frozen-french-fries-6mm', 'Frozen French Fries 6MM', (SELECT id FROM public.brands WHERE slug = 'bon-vegato'), 'Frozen French Fries', 'These are delicious 6mm frozen french fries, perfect for a quick snack or side dish. Made by Bon Vegato, they are easy to prepare and always a crowd-pleaser.

Key specs: 6mm cut, frozen

Pack: 4X2.5KGS KG', 'Belgium', 'OF-0110', ARRAY['kg','4x2.5kgs']::text[]),
  ('bon-vegato-frozen-french-fries-9mm-straight-cut', 'Frozen French Fries 9MM Straight Cut', (SELECT id FROM public.brands WHERE slug = 'bon-vegato'), 'Frozen French Fries', 'These are delicious 9mm straight cut frozen french fries, perfect for a quick snack or side dish. Made by Bon Vegato, they are easy to prepare and always a crowd-pleleaser.

Key specs: 9mm cut, straight cut, frozen

Pack: 4X2.5KGS KG', 'Belgium', 'OF-0111', ARRAY['kg','4x2.5kgs']::text[]),
  ('hungritos-frozen-french-fries-9mm', 'Frozen French Fries 9MM', (SELECT id FROM public.brands WHERE slug = 'hungritos'), 'Frozen French Fries', 'These are delicious 9mm frozen french fries, perfect for a quick snack or side dish. Made by Hungritos, they are easy to prepare and always a crowd-pleaser.

Key specs: 9mm cut, frozen

Pack: 6X2KG PKT', 'Belgium', 'OF-0112', ARRAY['pkt','6x2kg']::text[]),
  ('hungritos-frozen-french-fries-crispy-and-crunchy-7mm', 'Frozen French Fries Crispy & Crunchy 7MM', (SELECT id FROM public.brands WHERE slug = 'hungritos'), 'Frozen French Fries', 'These are delicious 7mm crispy and crunchy frozen french fries, perfect for a quick snack or side dish. Made by Hungritos, they are easy to prepare and always a crowd-pleaser.

Key specs: 7mm cut, crispy, crunchy, frozen

Pack: 12X1KG PKT', 'Belgium', 'OF-0113', ARRAY['pkt','12x1kg']::text[]),
  ('hungritos-frozen-french-fries-shoestring-6mm', 'Frozen French Fries Shoestring 6MM', (SELECT id FROM public.brands WHERE slug = 'hungritos'), 'Frozen French Fries', 'These are delicious 6mm shoestring frozen french fries, perfect for a quick snack or side dish. Made by Hungritos, they are easy to prepare and always a crowd-pleaser.

Key specs: 6mm cut, shoestring, frozen

Pack: 4X2.5KGS KG', 'Belgium', 'OF-0114', ARRAY['kg','4x2.5kgs']::text[]),
  ('hungritos-frozen-french-fries-shoestring-7mm', 'Frozen French Fries Shoestring 7MM', (SELECT id FROM public.brands WHERE slug = 'hungritos'), 'Frozen French Fries', 'These are delicious 7mm shoestring frozen french fries, perfect for a quick snack or side dish. Made by Hungritos, they are easy to prepare and always a crowd-pleaser.

Key specs: 7mm cut, shoestring, frozen

Pack: 6X2KG PKT', 'Belgium', 'OF-0115', ARRAY['pkt','6x2kg']::text[]),
  ('hungritos-frozen-french-fries-shoestring-coated-7mm', 'Frozen French Fries Shoestring Coated 7MM', (SELECT id FROM public.brands WHERE slug = 'hungritos'), 'Frozen French Fries', 'These are delicious 7mm shoestring coated frozen french fries, perfect for a quick snack or side dish. Made by Hungritos, they are easy to prepare and always a crowd-pleaser.

Key specs: 7mm cut, shoestring, coated, frozen

Pack: 6X2KG PKT', 'Belgium', 'OF-0116', ARRAY['pkt','6x2kg']::text[]),
  ('hungritos-frozen-french-fries-steak-house-coated-11mm', 'Frozen French Fries Steak House Coated 11MM', (SELECT id FROM public.brands WHERE slug = 'hungritos'), 'Frozen French Fries', 'These are delicious 11mm steak house coated frozen french fries, perfect for a quick snack or side dish. Made by Hungritos, they are easy to prepare and always a crowd-pleaser.

Key specs: 11mm cut, steak house, coated, frozen

Pack: 6X2KG PKT', 'Belgium', 'OF-0117', ARRAY['pkt','6x2kg']::text[]),
  ('hungritos-frozen-hash-brown-potato', 'Frozen Hash Brown Potato', (SELECT id FROM public.brands WHERE slug = 'hungritos'), 'Frozen Potatoes', 'These are delicious frozen hash brown potatoes, perfect for breakfast or a side dish. Made by Hungritos, they are easy to prepare and always a crowd-pleaser.

Key specs: hash brown, frozen, potato

Pack: 8X1.5KG PKT', 'Belgium', 'OF-0118', ARRAY['pkt','8x1.5kg']::text[]),
  ('hungritos-frozen-potato-wedges', 'Frozen Potato Wedges', (SELECT id FROM public.brands WHERE slug = 'hungritos'), 'Frozen Potatoes', 'These are delicious frozen potato wedges, perfect for a quick snack or side dish. Made by Hungritos, they are easy to prepare and always a crowd-pleaser.

Key specs: wedges, frozen, potato

Pack: 5X2.5KG PKT', 'Belgium', 'OF-0119', ARRAY['pkt','5x2.5kg']::text[]),
  ('generic-gluten-free-muffin-mix', 'Gluten Free Muffin Mix', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Gluten-Free Baking Mixes', 'Convenient gluten-free muffin mix for quick and easy baking. Produces moist and flavorful muffins without gluten.

Key specs: 12.5KG pack, Bag unit

Pack: 12.5KG BAG', 'Imported', 'OF-0120', ARRAY['bag','12.5kg']::text[]),
  ('generic-gluten-free-bread-flour-mix', 'Gluten Free Bread Flour/Mix', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Gluten-Free Flours', 'A versatile gluten-free flour mix for baking delicious bread. Creates light and airy gluten-free loaves with good texture.

Key specs: 12.5KG pack, Bag unit

Pack: 12.5KG BAG', 'Imported', 'OF-0121', ARRAY['bag','12.5kg']::text[]),
  ('generic-chinese-five-spice-powder', 'Chinese Five Spice Powder', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Herbs & Spices', 'Aromatic Chinese five-spice powder, a blend of five key spices, perfect for Asian cuisine and marinades. Comes in a 1kg pack.

Key specs: Five spice blend, Powder, 1kg pack

Pack: 1KG KG', 'Imported', 'OF-0122', ARRAY['kg','1kg']::text[]),
  ('generic-chopped-rosemary', 'Chopped Rosemary', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Herbs & Spices', 'Fragrant chopped rosemary, ideal for seasoning meats, vegetables, and roasted dishes. Supplied in a 1kg pack.

Key specs: Chopped, 1kg pack

Pack: 1KG KG', 'Imported', 'OF-0123', ARRAY['kg','1kg']::text[]),
  ('generic-shredded-oregano-leaves', 'Shredded Oregano Leaves', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Herbs & Spices', 'Dried and shredded oregano leaves, offering a pungent, aromatic flavor for various savory dishes. Packaged in a 1kg bag.

Key specs: Shredded, Leaves, 1kg pack

Pack: 1KG KG', 'Imported', 'OF-0124', ARRAY['kg','1kg']::text[]),
  ('generic-shredded-thyme-leaves', 'Shredded Thyme Leaves', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Herbs & Spices', 'Dried and shredded thyme leaves, providing an earthy and slightly minty flavor to enhance your cooking. Comes in a 1kg pack.

Key specs: Shredded, Leaves, 1kg pack

Pack: 1KG KG', 'Imported', 'OF-0125', ARRAY['kg','1kg']::text[]),
  ('generic-sweet-paprika-powder', 'Sweet Paprika Powder', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Herbs & Spices', 'This sweet paprika powder adds a mild, flavorful, and vibrant red color to dishes. It is packaged in a 1kg bag.

Key specs: Sweet, Powder, 1kg pack

Pack: 1KG KG', 'Imported', 'OF-0126', ARRAY['kg','1kg']::text[]),
  ('generic-whole-bay-leaves', 'Whole Bay Leaves', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Herbs & Spices', 'Whole bay leaves, used to infuse stews, soups, and sauces with a distinctive aromatic flavor. Packaged in a 1kg bag.

Key specs: Whole, Leaves, 1kg pack

Pack: 1KG KG', 'Imported', 'OF-0127', ARRAY['kg','1kg']::text[]),
  ('royal-arm-honey-1kg', 'Honey 1KG', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Honey', 'This is 1kg of pure honey from Royal Arm, perfect for sweetening your drinks, snacks, or favorite recipes. Its rich flavor and natural sweetness make it a versatile pantry staple.

Key specs: 1kg, natural, pure

Pack: 6X1KG BOTTLE', 'UAE', 'OF-0128', ARRAY['bottle','6x1kg']::text[]),
  ('royal-arm-honey-500g', 'Honey 500G', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Honey', 'This is 500g of pure honey from Royal Arm, perfect for sweetening your drinks, snacks, or favorite recipes. Its rich flavor and natural sweetness make it a versatile pantry staple.

Key specs: 500g, natural, pure

Pack: 12x500g BOTTLE', 'UAE', 'OF-0129', ARRAY['bottle','12x500g']::text[]),
  ('sriracha-original-sauce', 'ORIGINAL SAUCE', (SELECT id FROM public.brands WHERE slug = 'sriracha'), 'Hot Sauce', 'Popular hot sauce made from sun-ripened chilies, garlic, and vinegar. Adds a spicy, tangy, and slightly sweet kick to various dishes.

Key specs: Spicy, tangy, sweet, versatile

Pack: 12X500ML BOTTLE', 'USA', 'OF-0130', ARRAY['bottle','12x500ml']::text[]),
  ('tabasco-hot-pepper-sauce', 'HOT PEPPER SAUCE', (SELECT id FROM public.brands WHERE slug = 'tabasco'), 'Hot Sauce', 'A well-known hot pepper sauce made from aged red peppers, vinegar, and salt. Adds a fiery kick to any dish.

Key specs: Classic hot sauce, aged red peppers, versatile

Pack: 72X60ML BOTTLE', 'USA', 'OF-0131', ARRAY['bottle','72x60ml']::text[]),
  ('dedicato-gnocchi-pasta', 'Gnocchi Pasta', (SELECT id FROM public.brands WHERE slug = 'dedicato'), 'Italian Pasta', 'Dedicato Gnocchi are soft, delicate potato dumplings that pair wonderfully with a variety of sauces.

Key specs: 24x500g pack size

Pack: 24X500GM PKT', 'Imported', 'OF-0132', ARRAY['pkt','24x500gm']::text[]),
  ('dedicato-nidi-spinaci-pasta', 'Nidi Spinaci Pasta', (SELECT id FROM public.brands WHERE slug = 'dedicato'), 'Italian Pasta', 'Dedicato Nidi Spinaci Pasta are spinach-infused pasta nests that offer a delicate flavor and texture.

Key specs: 24x500g pack size

Pack: 24X500GM PKT', 'Imported', 'OF-0133', ARRAY['pkt','24x500gm']::text[]),
  ('dedicato-pappardelle-semola-pasta', 'Pappardelle Semola Pasta', (SELECT id FROM public.brands WHERE slug = 'dedicato'), 'Italian Pasta', 'Dedicato Pappardelle Semola Pasta are wide, flat egg noodles, ideal for rich and hearty sauces.

Key specs: 24x500g pack size

Pack: 24X500GM PKT', 'Imported', 'OF-0134', ARRAY['pkt','24x500gm']::text[]),
  ('dedicato-penne-birigate-pasta', 'Penne Birigate Pasta', (SELECT id FROM public.brands WHERE slug = 'dedicato'), 'Italian Pasta', 'Dedicato Penne Birigate Pasta features ridged, tube-shaped noodles that are excellent for holding sauces.

Key specs: 12x1kg pack size

Pack: 12 X 1KG PKT', 'Imported', 'OF-0135', ARRAY['pkt','12 x 1kg']::text[]),
  ('dedicato-spaghetti-vermicelli', 'Spaghetti Vermicelli', (SELECT id FROM public.brands WHERE slug = 'dedicato'), 'Italian Pasta', 'Dedicato Spaghetti Vermicelli, a long, thin pasta, is a versatile staple for many Italian recipes.

Key specs: 12x1kg pack size

Pack: 12 X 1KG PKT', 'Italy', 'OF-0136', ARRAY['pkt','12 x 1kg']::text[]),
  ('donna-chiara-farfalloni-pasta', 'Farfalloni Pasta', (SELECT id FROM public.brands WHERE slug = 'donna-chiara'), 'Italian Pasta', 'Donna Chiara Farfalloni Pasta, a larger version of bow-tie pasta, adds a playful touch to any dish.

Key specs: 24x500g pack size

Pack: 24X500GM PKT', 'Imported', 'OF-0137', ARRAY['pkt','24x500gm']::text[]),
  ('donna-chiara-fusilli-pasta', 'Fusilli Pasta', (SELECT id FROM public.brands WHERE slug = 'donna-chiara'), 'Italian Pasta', 'Donna Chiara Fusilli Pasta, a type of helix or corkscrew-shaped pasta, is perfect for capturing sauces.

Key specs: 24x500g pack size

Pack: 24X500GM PKT', 'Imported', 'OF-0138', ARRAY['pkt','24x500gm']::text[]),
  ('donna-chiara-linguine', 'Linguine', (SELECT id FROM public.brands WHERE slug = 'donna-chiara'), 'Italian Pasta', 'Classic Italian linguine pasta, perfect with seafood or pesto sauces. Long, flat strands that hold sauce beautifully.

Key specs: 24x500GM pack, PKT unit

Pack: 24X500GM PKT', 'Imported', 'OF-0139', ARRAY['pkt','24x500gm']::text[]),
  ('donna-chiara-mezzi-gomiti-elbow-macaroni', 'Mezzi Gomiti (Elbow Macaroni)', (SELECT id FROM public.brands WHERE slug = 'donna-chiara'), 'Italian Pasta', 'Traditional Italian mezzi gomiti, also known as elbow macaroni. Small, curved tube-shaped pasta, ideal for macaroni and cheese or soups.

Key specs: 24x500GM pack, PKT unit

Pack: 24X500GM PKT', 'Imported', 'OF-0140', ARRAY['pkt','24x500gm']::text[]),
  ('donna-chiara-penne', 'Penne', (SELECT id FROM public.brands WHERE slug = 'donna-chiara'), 'Italian Pasta', 'Versatile Italian penne pasta, great for various sauces and casseroles. Short, cylindrical pasta with angled ends, perfect for capturing sauces.

Key specs: 24x500GM pack, PKT unit

Pack: 24X500GM PKT', 'Imported', 'OF-0141', ARRAY['pkt','24x500gm']::text[]),
  ('donna-chiara-spaghetti', 'Spaghetti', (SELECT id FROM public.brands WHERE slug = 'donna-chiara'), 'Italian Pasta', 'Traditional Italian spaghetti pasta, a staple for many dishes. Long, thin, cylindrical pasta, ideal with tomato and meat sauces.

Key specs: 24x500GM pack, PKT unit

Pack: 24X500GM PKT', 'Imported', 'OF-0142', ARRAY['pkt','24x500gm']::text[]),
  ('generic-cannelloni-pasta', 'Cannelloni Pasta', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Italian Pasta', 'Cannelloni pasta tubes are designed for stuffing with your favorite fillings and baking.

Key specs: 24x250g pack size

Pack: 24 X 250GM PKT', 'Imported', 'OF-0143', ARRAY['pkt','24 x 250gm']::text[]),
  ('generic-gluten-free-pasta', 'Gluten-Free Pasta', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Italian Pasta', 'This gluten-free pasta offers a delicious alternative for those with dietary restrictions without compromising on taste or texture.

Key specs: Gluten-free, 9x400g pack size

Pack: 9X400GM PKT', 'Imported', 'OF-0144', ARRAY['pkt','9x400gm']::text[]),
  ('generic-lasagna-semola-pasta', 'Lasagna Semola Pasta', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Italian Pasta', 'Classic Lasagna Semola Pasta sheets, perfect for baking hearty and delicious lasagna dishes.

Key specs: 24x500g pack size

Pack: 24X500GM PKT', 'Imported', 'OF-0145', ARRAY['pkt','24x500gm']::text[]),
  ('generic-spirali-fantasia-pasta', 'Spirali Fantasia Pasta', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Italian Pasta', 'Spirali Fantasia Pasta offers a fun, spiral shape that’s great for pasta salads or catching chunky sauces.

Key specs: 24x500g pack size

Pack: 24X500GM PKT', 'Imported', 'OF-0146', ARRAY['pkt','24x500gm']::text[]),
  ('generic-garishoga-pink-ginger-pickle', 'Garishoga Pink Ginger Pickle', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Japanese Condiment', 'Garishoga, a vibrant pink pickled ginger, is a classic accompaniment to sushi and other Japanese dishes, offering a refreshing and zesty palate cleanse.

Key specs: Pink pickled ginger, 10x1kg pack size

Pack: 10X1KG PKT', 'Imported', 'OF-0147', ARRAY['pkt','10x1kg']::text[]),
  ('generic-japanese-mayonnaise', 'Japanese Mayonnaise', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Japanese Condiment', 'This Japanese Mayonnaise offers a rich, creamy, and slightly sweet flavor, distinctive from Western mayonnaise, making it perfect for dressings, dips, and sandwiches.

Key specs: 450ml bottle, 20-pack

Pack: 20X450ML BOTTLE', 'Imported', 'OF-0148', ARRAY['bottle','20x450ml']::text[]),
  ('kikkoman-soy-sauce', 'Soy Sauce', (SELECT id FROM public.brands WHERE slug = 'kikkoman'), 'Japanese Condiment', 'Kikkoman Soy Sauce is a classic, versatile condiment essential for Japanese cuisine, perfect for marinades, dipping, and seasoning.

Key specs: 1 liter bottle, 12-pack

Pack: 12X1LTR BOTTLE', 'Japan', 'OF-0149', ARRAY['bottle','12x1ltr']::text[]),
  ('ko-wasabi-powder', 'Wasabi Powder', (SELECT id FROM public.brands WHERE slug = 'ko'), 'Japanese Condiment', 'Ko Wasabi Powder allows you to prepare fresh Japanese horseradish paste, delivering a pungent and spicy kick.

Key specs: 10x1kg pack size

Pack: 10X1KG PKT', 'Imported', 'OF-0150', ARRAY['pkt','10x1kg']::text[]),
  ('generic-panko-japanese-bread-crumbs', 'Panko Japanese Bread Crumbs', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Japanese Cooking Ingredient', 'Panko are light, crispy Japanese bread crumbs, ideal for achieving a superior crunch in fried foods such as tonkatsu or tempura.

Key specs: 10x1kg pack size

Pack: 10X1KG PKT', 'Imported', 'OF-0151', ARRAY['pkt','10x1kg']::text[]),
  ('ko-tempura-batter-mix', 'Tempura Batter Mix', (SELECT id FROM public.brands WHERE slug = 'ko'), 'Japanese Cooking Ingredient', 'Ko Tempura Batter Mix helps you create perfectly light and crispy tempura, coating vegetables and seafood with ease.

Key specs: 20x700g pack size

Pack: 20X700G PKT', 'Imported', 'OF-0152', ARRAY['pkt','20x700g']::text[]),
  ('generic-golden-curry-mild', 'Golden Curry Mild', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Japanese Curry', 'Mild Japanese curry roux blocks, easy to prepare and perfect for a comforting meal. Features a rich, aromatic flavor with a hint of sweetness.

Key specs: 220g, mild spice, roux blocks

Pack: 60X220 PKT', 'Imported', 'OF-0153', ARRAY['pkt','60x220']::text[]),
  ('generic-white-miso-paste', 'White Miso Paste', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Japanese Miso', 'Versatile white miso paste, fermented from soybeans and rice. Adds a savory umami flavor to soups, marinades, and dressings.

Key specs: 1kg, white miso, savory

Pack: 50X1KG KG', 'Imported', 'OF-0154', ARRAY['kg','50x1kg']::text[]),
  ('generic-udon-noodles', 'Udon Noodles', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Japanese Noodles', 'Udon noodles are thick, chewy wheat flour noodles, fundamental to many Japanese soups and stir-fries.

Key specs: 40x300g pack size

Pack: 40X300G PKT', 'Imported', 'OF-0155', ARRAY['pkt','40x300g']::text[]),
  ('zao-soba-noodles', 'Soba Noodles', (SELECT id FROM public.brands WHERE slug = 'zao'), 'Japanese Noodles', 'Zao Soba Noodles are thin, flavorful buckwheat noodles, commonly served chilled with a dipping sauce or hot in broths.

Key specs: Buckwheat noodles, 40x300g pack size

Pack: 40X300G PKT', 'Imported', 'OF-0156', ARRAY['pkt','40x300g']::text[]),
  ('generic-mirin', 'Mirin', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Japanese Rice Wine', 'Sweet Japanese rice wine, essential for authentic Japanese cuisine. Adds a subtle sweetness and glaze to dishes.

Key specs: 600g, sweet, cooking rice wine

Pack: 12X 800ML BOTTLE', 'Imported', 'OF-0157', ARRAY['bottle','12x 800ml']::text[]),
  ('generic-dashi-kombu', 'Dashi Kombu', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Japanese Seaweed', 'High-quality dried kelp used to make dashi, a fundamental Japanese soup stock. Imparts a rich umami flavor to various dishes.

Key specs: 1kg, dried kelp, dashi stock ingredient

Pack: 1X1KG KG', 'Imported', 'OF-0158', ARRAY['kg','1x1kg']::text[]),
  ('generic-sushi-nori', 'Sushi Nori', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Japanese Seaweed', 'Premium quality roasted seaweed, perfect for making sushi rolls and other Japanese dishes. Each pack contains 100 sheets of crispy, flavorful nori.

Key specs: 100 sheets, roasted, sushi-grade

Pack: 10X100''S PKT', 'Imported', 'OF-0159', ARRAY['pkt','10x100''s']::text[]),
  ('generic-japanese-black-vinegar', 'Japanese Black Vinegar', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Japanese Vinegar', 'Traditional Japanese black vinegar, known for its rich, mellow flavor and health benefits. Ideal for dressings, marinades, and dipping sauces.

Key specs: 500ml, rich flavor, versatile

Pack: 12X500ML BOTTLE', 'Imported', 'OF-0160', ARRAY['bottle','12x500ml']::text[]),
  ('mizkan-japanese-rice-vinegar', 'Japanese Rice Vinegar', (SELECT id FROM public.brands WHERE slug = 'mizkan'), 'Japanese Vinegar', 'Authentic Japanese rice vinegar from Mizkan, perfect for sushi rice, salad dressings, and pickling. Offers a mild, slightly sweet, and tangy flavor.

Key specs: 900ml, mild, versatile

Pack: 12X900ML BOTTLE', 'Italy', 'OF-0161', ARRAY['bottle','12x900ml']::text[]),
  ('generic-lamb-rack-frenched-cap-off', 'Lamb Rack Frenched Cap Off', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Lamb Cuts', 'Frenched cap-off lamb rack from Australian lamb, sold per kilogram, ideal for roasting. A premium cut known for its delicate flavor.

Key specs: Type: Rack, Preparation: Frenched, Cap Off, Meat: Lamb, Origin: Australian, Unit: Per KG

Pack: PER KG KG', 'Imported', 'OF-0162', ARRAY['kg','per kg']::text[]),
  ('virgina-tahini-paste', 'TAHINI PASTE', (SELECT id FROM public.brands WHERE slug = 'virgina'), 'Mediterranean Sauces', 'Smooth, creamy tahini paste made from roasted sesame seeds. Essential for hummus, dressings, and various Mediterranean dishes.

Key specs: Creamy, nutty flavor, versatile

Pack: 12X400ML BOTTLE', 'Lebanon', 'OF-0163', ARRAY['bottle','12x400ml']::text[]),
  ('generic-10-inch-tortillas', '10 Inch Tortillas', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Mexican Tortillas', 'Soft and pliable 10-inch tortillas, perfect for burritos, quesadillas, and wraps. Made with high-quality ingredients for an authentic taste.

Key specs: 10 inch, 6 count, soft

Pack: 20X6PCS PKT', 'Imported', 'OF-0164', ARRAY['pkt','20x6pcs']::text[]),
  ('generic-6-inch-tortillas', '6 Inch Tortillas', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Mexican Tortillas', 'Convenient 6-inch tortillas, ideal for tacos, fajitas, and smaller wraps. Soft texture and delicious flavor for your favorite Mexican dishes.

Key specs: 6 inch, 8 count, soft

Pack: 20X8PCS PKT', 'Imported', 'OF-0165', ARRAY['pkt','20x8pcs']::text[]),
  ('bio-pennoni-rigati-organic-pasta', 'Pennoni Rigati Organic Pasta', (SELECT id FROM public.brands WHERE slug = 'bio'), 'Organic Italian Pasta', 'Pennoni Rigati Bio are organic, large ridged pasta tubes, excellent for robust sauces.

Key specs: Organic, 24x500g pack size

Pack: 24X500GM PKT', 'Imported', 'OF-0166', ARRAY['pkt','24x500gm']::text[]),
  ('super-chef-gherkins', 'GHERKINS', (SELECT id FROM public.brands WHERE slug = 'super-chef'), 'Pickles', 'Tangy and crunchy gherkins, preserved in vinegar. A delightful accompaniment to sandwiches, burgers, or as a snack.

Key specs: Tangy, crunchy, preserved cucumbers

Pack: 12X946ML BOTTLE', 'UAE', 'OF-0167', ARRAY['bottle','12x946ml']::text[]),
  ('acroyali-apple-pie-filling-50', 'APPLE PIE FILLING 50%', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Pie Filling', 'Classic apple pie filling with 50% fruit content, in a 3.17kg tin, making it easy to bake a perfect apple pie.

Key specs: Apple, 50% fruit, 3.17kg tin

Pack: 4X3.17KG TIN', 'Imported', 'OF-0168', ARRAY['tin','4x3.17kg']::text[]),
  ('acroyali-blueberry-pie-filling-50', 'BLUEBERRY PIE FILLING 50%', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Pie Filling', 'Ready-to-use blueberry pie filling with 50% fruit content, in a 3.17kg tin, perfect for delicious pies and tarts.

Key specs: Blueberry, 50% fruit, 3.17kg tin

Pack: 4X3.17KG TIN', 'Imported', 'OF-0169', ARRAY['tin','4x3.17kg']::text[]),
  ('acroyali-strawberry-pie-filling-50', 'STRAWBERRY PIE FILLING 50%', (SELECT id FROM public.brands WHERE slug = 'acroyali'), 'Pie Filling', 'Sweet strawberry pie filling with 50% fruit content, in a 3.17kg tin, ideal for baking delectable strawberry pies.

Key specs: Strawberry, 50% fruit, 3.17kg tin

Pack: 4X3.17KG TIN', 'Imported', 'OF-0170', ARRAY['tin','4x3.17kg']::text[]),
  ('generic-whole-duck-frozen', 'Whole Duck Frozen', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Poultry', 'Whole frozen duck, ideal for roasting to achieve crispy skin and succulent meat. A rich and flavorful poultry option.

Key specs: Whole bird, crispy skin, rich flavor

Pack: PER KG KG', 'Imported', 'OF-0171', ARRAY['kg','per kg']::text[]),
  ('generic-beef-pepperoni', 'Beef Pepperoni', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Processed Meats', 'Delicious beef pepperoni, supplied in a 4 kg packet, perfect for pizzas, sandwiches, or snacks. Savory and spiced to perfection.

Key specs: Type: Pepperoni, Meat: Beef, Packaging: 4 KG Packet

Pack: 4 KG PACKET KG', 'Imported', 'OF-0172', ARRAY['kg','4 kg packet']::text[]),
  ('azizaa-basmati-rice-20kg', 'Basmati Rice 20KG', (SELECT id FROM public.brands WHERE slug = 'azizaa'), 'Rice', 'This is 20kg Basmati rice, perfect for a variety of dishes. Made by Azizaa, it is of high quality and great for everyday meals or special occasions.

Key specs: Basmati, 20kg

Pack: 20KG KG', 'India', 'OF-0173', ARRAY['kg','20kg']::text[]),
  ('azizaa-basmati-rice-5kg', 'Basmati Rice 5KG', (SELECT id FROM public.brands WHERE slug = 'azizaa'), 'Rice', 'This is 5kg Basmati rice, perfect for a variety of dishes. Made by Azizaa, it is of high quality and great for everyday meals or special occasions.

Key specs: Basmati, 5kg

Pack: 8X5KG KG', 'India', 'OF-0174', ARRAY['kg','8x5kg']::text[]),
  ('azizaa-extra-long-grain-basmati-rice-gold', 'Extra Long Grain Basmati Rice Gold', (SELECT id FROM public.brands WHERE slug = 'azizaa'), 'Rice', 'This is extra long grain Basmati rice Gold, perfect for a variety of dishes. Made by Azizaa, it is of high quality and great for everyday meals or special occasions.

Key specs: extra long grain, Basmati, Gold

Pack: 4X5KG KG', 'India', 'OF-0175', ARRAY['kg','4x5kg']::text[]),
  ('azizaa-extra-long-grain-basmati-rice-platinum-1121', 'Extra Long Grain Basmati Rice Platinum 1121', (SELECT id FROM public.brands WHERE slug = 'azizaa'), 'Rice', 'This is extra long grain Basmati rice Platinum 1121, perfect for a variety of dishes. Made by Azizaa, it is of high quality and great for everyday meals or special occasions.

Key specs: extra long grain, Basmati, Platinum 1121

Pack: 4X5KG KG', 'India', 'OF-0176', ARRAY['kg','4x5kg']::text[]),
  ('grawings-arborio-rice', 'Arborio Rice', (SELECT id FROM public.brands WHERE slug = 'grawings'), 'Rice', 'This is Arborio rice, perfect for making creamy risottos. Made by Grawings, this high-quality rice delivers a rich and authentic Italian taste.

Key specs: Arborio, risotto

Pack: 20X1KG PKT', 'Italy', 'OF-0177', ARRAY['pkt','20x1kg']::text[]),
  ('mara-couscous-rice', 'Couscous Rice', (SELECT id FROM public.brands WHERE slug = 'mara'), 'Rice', 'This is Couscous rice, a versatile grain perfect as a side dish or in salads. Made by Mara, it cooks quickly and offers a light, fluffy texture.

Key specs: couscous, quick cooking

Pack: 20X500G PKT', 'Morocco', 'OF-0178', ARRAY['pkt','20x500g']::text[]),
  ('generic-dark-soy-sauce', 'Dark Soy Sauce', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sauces & Condiments', 'A darker, richer soy sauce, often used for coloring and adding depth of flavor to dishes. Supplied in a 4x4.5kg can pack.

Key specs: Dark, 4x4.5kg pack, Can

Pack: 4X4.5KG CAN', 'Imported', 'OF-0179', ARRAY['can','4x4.5kg']::text[]),
  ('generic-economy-tomato-sauce', 'Economy Tomato Sauce', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sauces & Condiments', 'An economical choice for tomato sauce, ideal for bulk usage and cost-effective food preparation. Supplied in a 4x4.5kg can pack.

Key specs: Economy, 4x4.5kg pack, Can

Pack: 4X4.5KG CAN', 'Imported', 'OF-0180', ARRAY['can','4x4.5kg']::text[]),
  ('generic-oyster-sauce', 'Oyster Sauce', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sauces & Condiments', 'A savory oyster sauce, perfect for adding a rich umami flavor to stir-fries and Asian dishes. Comes in a 4x4.5kg can pack.

Key specs: Oyster flavored, 4x4.5kg pack, Can

Pack: 4X4.5KG CAN', 'Imported', 'OF-0181', ARRAY['can','4x4.5kg']::text[]),
  ('generic-premium-tomato-sauce', 'Premium Tomato Sauce', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sauces & Condiments', 'A high-quality, rich tomato sauce perfect for various culinary applications. Available in a 4x4.5kg can pack.

Key specs: Premium, 4x4.5kg pack, Can

Pack: 4X4.5KG CAN', 'Imported', 'OF-0182', ARRAY['can','4x4.5kg']::text[]),
  ('generic-soy-sauce', 'Soy Sauce', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sauces & Condiments', 'Classic soy sauce, a versatile condiment for seasoning, dipping, and marinades in various cuisines. Available in a 4x4.5kg can pack.

Key specs: 4x4.5kg pack, Can

Pack: 4X4.5KG CAN', 'Imported', 'OF-0183', ARRAY['can','4x4.5kg']::text[]),
  ('generic-standard-tomato-sauce', 'Standard Tomato Sauce', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sauces & Condiments', 'A reliable standard tomato sauce suitable for everyday cooking needs. Comes in a 4x4.5kg can pack.

Key specs: Standard, 4x4.5kg pack, Can

Pack: 4X4.5KG CAN', 'Imported', 'OF-0184', ARRAY['can','4x4.5kg']::text[]),
  ('generic-tomato-sauce-sachet', 'Tomato Sauce Sachet', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sauces & Condiments', 'Convenient single-serving sachets of tomato sauce, perfect for on-the-go or portion control. Each sachet is 15g.

Key specs: Sachet, 15g pack

Pack: 15GR PKT', 'Imported', 'OF-0185', ARRAY['pkt','15gr']::text[]),
  ('generic-crab-stick', 'Crab Stick', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sea Food', 'Convenient crab sticks, great for salads, sushi, or as a snack. Made from surimi with a delicate crab flavor.

Key specs: Surimi-based, versatile, easy to use

Pack: 500 GM TUB', 'Imported', 'OF-0186', ARRAY['tub','500 gm']::text[]),
  ('generic-pangasius-fish-fillet', 'Pangasius Fish Fillet', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sea Food', 'Mild-flavored Pangasius fish fillets, versatile for various cooking methods. A good source of protein and easy to prepare.

Key specs: Fillet, mild flavor, versatile

Pack: PER KG KG', 'Imported', 'OF-0187', ARRAY['kg','per kg']::text[]),
  ('generic-scallops', 'Scallops', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sea Food', 'Tender and sweet scallops, perfect for searing, grilling, or adding to pasta dishes. A gourmet seafood option.

Key specs: Tender, sweet, gourmet

Pack: PER KG KG', 'Imported', 'OF-0188', ARRAY['kg','per kg']::text[]),
  ('generic-smoked-salmon', 'Smoked Salmon', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sea Food', 'Delicious smoked salmon, perfect for appetizers, salads, or sandwiches. Offers a delicate smoky flavor and tender texture.

Key specs: Smoked, delicate flavor, versatile

Pack: PER KG KG', 'Imported', 'OF-0189', ARRAY['kg','per kg']::text[]),
  ('generic-squid-tube', 'Squid Tube', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sea Food', 'Cleaned squid tubes, ready for stuffing, frying, or grilling. Offers a delicate, slightly sweet flavor and firm texture.

Key specs: Cleaned, versatile, delicate flavor

Pack: PER KG KG', 'Imported', 'OF-0190', ARRAY['kg','per kg']::text[]),
  ('generic-whole-salmon-norway', 'Whole Salmon Norway', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sea Food', 'Whole Norwegian salmon, known for its rich flavor and flaky texture. Ideal for baking, grilling, or poaching.

Key specs: Whole fish, rich flavor, flaky texture

Pack: PER KG KG', 'Imported', 'OF-0191', ARRAY['kg','per kg']::text[]),
  ('generic-liquid-glucose-tubs', 'Liquid Glucose Tubs', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Sweeteners', 'Versatile liquid glucose in convenient tubs for confectionery and baking. Prevents sugar crystallization and adds elasticity.

Key specs: 6KG Tin, Tub unit

Pack: 6KG TIN TUB', 'Imported', 'OF-0192', ARRAY['tub','6kg tin']::text[]),
  ('generic-corn-flour', 'Corn Flour', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Thickeners', 'Pure corn flour for thickening sauces, gravies, and desserts. A versatile gluten-free thickener for various recipes.

Key specs: 1KG pack, KG unit

Pack: 1KG KG', 'Imported', 'OF-0193', ARRAY['kg','1kg']::text[]),
  ('hershey-s-chocolate-topping-syrup', 'Chocolate Topping Syrup', (SELECT id FROM public.brands WHERE slug = 'hershey-s'), 'Topping', 'Classic chocolate flavored syrup, ideal for sundaes, desserts, and beverages.

Key specs: 24X680G pack size, BOTTLE unit

Pack: 24X680G BOTTLE', 'USA', 'OF-0194', ARRAY['bottle','24x680g']::text[]),
  ('hershey-s-strawberry-topping-syrup', 'Strawberry Topping Syrup', (SELECT id FROM public.brands WHERE slug = 'hershey-s'), 'Topping', 'Delicious strawberry flavored syrup, perfect for ice cream, desserts, and milkshakes.

Key specs: 12X623G pack size, BOTTLE unit

Pack: 12X623G BOTTLE', 'USA', 'OF-0195', ARRAY['bottle','12x623g']::text[]),
  ('royal-arm-apple-cider-vinegar', 'Apple Cider Vinegar', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Vinegar', 'A popular vinegar made from fermented apples, known for its distinct flavor and health benefits.

Key specs: 24X473ML pack size, BOTTLE unit

Pack: 24X473ML BOTTLE', 'UAE', 'OF-0196', ARRAY['bottle','24x473ml']::text[]),
  ('royal-arm-balsamic-vinegar', 'Balsamic Vinegar', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Vinegar', 'A rich and tangy balsamic vinegar, perfect for enhancing the flavor of various dishes.

Key specs: 12X250ML pack size, BOTTLE unit

Pack: 12X250ML BOTTLE', 'UAE', 'OF-0197', ARRAY['bottle','12x250ml']::text[]),
  ('royal-arm-white-grape-vinegar', 'White Grape Vinegar', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Vinegar', 'A delicate and fruity vinegar made from white grapes, perfect for salads and dressings.

Key specs: 12X500ML pack size, BOTTLE unit

Pack: 12X500ML BOTTLR', 'UAE', 'OF-0198', ARRAY['bottlr','12x500ml']::text[]),
  ('royal-arm-white-vinegar', 'White Vinegar', (SELECT id FROM public.brands WHERE slug = 'royal-arm'), 'Vinegar', 'A staple in every kitchen, this white vinegar is ideal for cooking, pickling, and cleaning.

Key specs: 12X946ML pack size, BOTTLE unit

Pack: 12X946ML BOTTLE', 'UAE', 'OF-0199', ARRAY['bottle','12x946ml']::text[]),
  ('generic-rice-paper-22cm', 'Rice Paper 22CM', (SELECT id FROM public.brands WHERE slug = 'generic'), 'Wraps and Edible Paper', 'Thin and delicate rice paper sheets, ideal for spring rolls and edible decorations. Becomes pliable when moistened.

Key specs: 36x375GM pack, PKT unit, 22cm diameter

Pack: 36X375GM PKT', 'Imported', 'OF-0200', ARRAY['pkt','36x375gm']::text[]);

COMMIT;
