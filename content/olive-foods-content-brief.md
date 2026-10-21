# Olive Foods — website content brief

**Website:** https://www.olivefoods.lk · **Company:** Olive Foods (Pvt) Ltd, Colombo, Sri Lanka · **Prepared:** 2026-10-20

This document holds every piece of written content on the Olive Foods website that is still a **draft** or **incomplete**: brand profiles, category introductions, product descriptions and buying guides, plus the open questions that block them. It is meant to be handed to an editor or an AI assistant to **verify, correct and complete**, then returned so the changes can be imported into the site automatically.

## Instructions for the editor (read first)

You are editing content for a B2B food importer and distributor. Its customers are hotels, restaurants, cafés, caterers, supermarkets and retailers in Sri Lanka. Search engines and AI assistants will quote this text, so accuracy matters more than flair.

### Rules
1. **Facts must be verifiable.** Only add or keep a fact (a company name, country, year, ingredient, certification) if a reliable public source confirms it: the maker's own website, an official registry, reputable trade press, or Wikipedia with citations. Add the URL to that item's `sources`. If you cannot confirm something, write `UNKNOWN` — never guess.
2. **Neutral wording.** Olive Foods "imports and distributes" a brand in Sri Lanka. Never write "official", "exclusive", "authorised", "sole" or "leading" distributor/importer, and don't imply Olive Foods makes a product it imports.
3. **No prices, statistics, awards, health or nutrition claims, or superlatives** ("best", "No. 1", "finest") unless sourced.
4. **Never change anything marked LOCKED**: `id`, slugs, product names, SKUs, links, and the company facts in section 1.
5. **Style:** British English, plain and specific, short sentences, active voice, no filler. Write for a chef or purchasing manager.
   - Brand profile (`about`): 70–140 words, two short paragraphs — (1) who makes the brand, where, what it is known for; (2) what Olive Foods supplies of it and who uses it in Sri Lanka.
   - Category intro: 50–90 words — what is in the category, who buys it, one practical buying, storage or usage note.
   - Product description: 25–60 words, one or two sentences specific to *that* product (what it is, typical uses, who uses it). Don't repeat the product name more than once.
   - Guides: keep the structure; tighten, correct and improve. Keep every claim about Olive Foods to the facts in section 1.
6. **Questions only Olive Foods can answer** (their own stock, packs, prices, sourcing): set the answer to `ASK CLIENT`.
7. **Sri Lanka context** is welcome where accurate (local ingredients, climate and storage, hotel and tourism trade), but don't invent local facts.

### How to return your work
- This brief is long. **Work one section at a time** (2 → 3 → 4 → 5 → 6) and, for each, **return only the YAML blocks you changed** — each one complete, in its own code block, with its `id` unchanged. Edits are merged back by `id`, so order and untouched blocks don't matter.
- For section 2, return the `questions` block with the `answer` and `sources` you could fill.
- In every block you return, set `status` to one of: `edited` · `verified` (checked, no change needed) · `needs-client` (blocked on a client answer).
- Add a `sources` list for every new or changed fact, and a short `notes` line if you changed something important (e.g. "maker corrected: X, not Y").
- Keep the YAML valid: two-space indentation, `|` for multi-line text, quotes around values containing `:`.

## 1. Company facts (LOCKED — the only claims allowed about Olive Foods)

- **What we do:** Import, bonded warehousing and island-wide distribution of imported food and consumer brands
- **Who we supply:** Hotels, restaurants, cafés, caterers, supermarkets and retailers across Sri Lanka
- **Experience:** 30+ years of trade in the food industry
- **Sourcing:** Products sourced from 30+ countries
- **Coverage:** Island-wide delivery to all 25 districts of Sri Lanka
- **Cold chain:** Frozen lines stored and delivered under cold chain at −18 °C
- **Address:** 292 Sea Street, Colombo 11, Sri Lanka 01100
- **Hours:** Monday–Friday 8:30 AM–5:30 PM, Saturday 8:30 AM–1:00 PM, closed Sundays and public holidays
- **Contact:** +94 11 207 1717 · info@olivefoods.lk

- **Ordering:** by quote — contact form on the website, phone or WhatsApp (+94 11 207 1717), email info@olivefoods.lk; replies usually within one business day.
- **Range:** 175 products in 24 categories from 17 brands plus Olive Foods' own range (brand "Olive Foods", slug `generic`).

## 2. Open questions

Answer each one on the `answer:` line, with a source or `ASK CLIENT`.

```yaml
questions:
  - id: Q01
    ref: brand/albertos
    question: Who makes the Albertos wraps you import, and in which country? A UAE retailer sells them as "Señor Pepe's Alberto's Tortilla Wraps" made in the UAE, but we could not confirm the maker, so the profile does not name one.
    answer: ""
    sources: []
  - id: Q02
    ref: brand/azizaa
    question: Who packs Azizaa? We found no public record of the brand owner, so the profile names only the country (India, from your current data).
    answer: ""
    sources: []
  - id: Q03
    ref: brand/daily-dairy
    question: Your catalogue lists "Failini Grated Parmesan" and "Kolios Feta" under Daily Dairy. Kolios is a separate Greek feta brand. If Daily Dairy supplies them, this wording is fine; if not, they may belong under their own brand names.
    answer: ""
    sources: []
  - id: Q04
    ref: brand/dedicato
    question: "Dedicato \"Gnocchi\": is it Granoro's dried durum-wheat pasta shape called gnocchi, or potato gnocchi? The current product description calls it potato dumplings. If it is the dried pasta shape, that description needs correcting (a corrected version is in the product section)."
    answer: ""
    sources: []
  - id: Q05
    ref: brand/donna-chiara
    question: Who makes Donna Chiara, and in which country? We found no public record of the maker, so the profile is short. One line from the pack (maker, country, wheat) would let us complete it.
    answer: ""
    sources: []
  - id: Q06
    ref: brand/mae-ploy
    question: The current brand description says Mae Ploy was "established in 1993". Sources disagree on the year, so we left it out — we suggest removing it from the admin description too.
    answer: ""
    sources: []
  - id: Q07
    ref: brand/mae-ploy
    question: Please confirm the maker on the pack reads Theppadungporn Coconut Co., Ltd.
    answer: ""
    sources: []
  - id: Q08
    ref: brand/mahachai
    question: Who makes the Mahachai noodles? We found no public record of the maker. The current admin description is just "Thai Brand".
    answer: ""
    sources: []
  - id: Q09
    ref: brand/mavees
    question: The brand is spelt "Mavee's" on the maker's site; your catalogue uses "Mavees". Both are kept as names Google will connect. We did not add the misspelling "Marvees" as an official name — Google already corrects that search to Mavees, and listing misspellings in structured data can look like keyword stuffing.
    answer: ""
    sources: []
  - id: Q10
    ref: brand/generic
    question: Optional. This is the brand page for your own range (/brands/generic).
    answer: ""
    sources: []
  - id: Q11
    ref: product/lamb-leg---bone-in
    question: Its web address has a triple hyphen (/products/lamb-leg---bone-in). Changing the slug to lamb-leg-bone-in tidies it; the old address redirects automatically.
    answer: ""
    sources: []
  - id: Q12
    ref: product/pasta
    question: This product's web address is /products/pasta. Changing its slug in the admin to donna-chiara-mezzi-gomiti-elbow-macaroni gives it a descriptive address; the site redirects the old one automatically.
    answer: ""
    sources: []
  - id: Q13
    ref: product/silver-sweetened-whipping-cream
    question: What sets Silver apart from Smooth (sweetness, stability, pack, price tier)? One line each would let the two pages say something different.
    answer: ""
    sources: []
  - id: Q14
    ref: product/smooth-sweetened-whipping-cream
    question: See Silver above.
    answer: ""
    sources: []
  - id: Q15
    ref: product/dedicato-gnocchi
    question: Use this ONLY if the product is Granoro's dried pasta shape. If it really is potato gnocchi, keep the current description.
    answer: ""
    sources: []
  - id: Q16
    ref: product/acroyali-apple-pie-filling-50
    question: We read 50% / 70% as the fruit content (your current 70% copy says "high fruit content"). Please confirm.
    answer: ""
    sources: []
  - id: Q17
    ref: product/acroyali-apple-pie-filling-50
    question: "\"Lightly spiced\": please confirm (cinnamon?) or we drop it."
    answer: ""
    sources: []
  - id: Q18
    ref: brands/*
    question: 17 of 18 brands have no country of origin and none has a founding year in the site's admin. Fill `origin` and `established` for each brand in section 3 where you can verify them.
    answer: ""
    sources: []
  - id: Q19
    ref: origins-map
    question: "The homepage 'Global Origins' map lists these brands, which aren't in the catalogue: Remia, Snorre Foods (Netherlands); Mizkan (Italy); Falcon, Super Chef (UAE); Fletcher (China). Are they real, current suppliers, and in those countries? (Likely ASK CLIENT.)"
    answer: ""
    sources: []
  - id: Q20
    ref: brand/bon-vegato
    question: Bon Vegato has no products listed, so its page is hidden. Is it still supplied? If yes, which products?
    answer: ""
    sources: []
```

## 3. Brands (18)

Each brand has a page at https://www.olivefoods.lk/brands/<slug>. The **current description** is the short text in the site's admin (shown on brand cards). The **about** field is the long profile under the page heading — draft text you should verify and improve. `origin` and `established` are admin fields, mostly empty today.

### Acroyali

- Page: https://www.olivefoods.lk/brands/acroyali · Products on the site (23): Apple Pie Filling 50%, Apple Pie Filling 70%, Baked Beans, Blueberry Pie Filling 50%, Blueberry Pie Filling 70%, Dark Sweet Pitted Cherry, Fruit Cocktail, Glace Cherries Red, Lychees, Peach Halves, Pear Halves In Syrup, Raspberry Pie Filling 50%, Raspberry Pie Filling 70%, Red Cherry Pie Filling 50%, Red Cherry Pie Filling 70%, Red Kidney Beans, Straw Mushroom, Strawberry Pie Filling 50%, Strawberry Pie Filling 70%, Sweet Corn Cream Style, Sweet Corn Kernel, Whole Mushroom, Young Corn
- Current description (admin): "We are committed to producing and delivering a diverse range of premium canned foods that cater to the evolving tastes, lifestyles, and needs of our customers."

```yaml
id: brand/acroyali
name: Acroyali (LOCKED)
status: draft
origin: China
established: ""
maker: ""
website: ""
aliases: []
short_description: We are committed to producing and delivering a diverse range of premium canned foods that cater to the evolving tastes, lifestyles, and needs of our customers.
about: |-
  Acroyali is a canned-food brand of Acroyali Holdings (Qingdao) Co., Ltd., a manufacturer in Qingdao, China, that makes canned fruit, fruit pie fillings and toppings, and canned vegetables and pulses for export.

  Olive Foods imports Acroyali into Sri Lanka and supplies its range to hotels, restaurants, bakeries and retailers: fruit pie fillings in apple, blueberry, raspberry, red cherry and strawberry, each in a 50% and a 70% version; canned fruit such as peach and pear halves, lychees, fruit cocktail and pitted dark sweet cherries; glacé cherries for baking; and canned sweet corn, young corn, straw and whole mushrooms, baked beans and red kidney beans.
sources:
  - https://www.gulfood.com/exhibitors/acroyali-holdings-qingdao-coltd
notes: ""
```

### Albertos

- Page: https://www.olivefoods.lk/brands/albertos · Products on the site (2): Albertos Flour Tortilla Wraps 10" 6'S, Albertos Tortilla Wraps 6" 8'S
- Current description (admin): "lberto's Tortilla Wraps are a brand of, often, frozen or packaged flour tortillas known for being soft and easy to roll, commonly available in sizes like 10-inch and 6-inch. The product, often associated with, or manufactured by, "Senor Pepe" or similar Middle East-based food companies, is frequently used for wraps and in food service."

```yaml
id: brand/albertos
name: Albertos (LOCKED)
status: draft
origin: ""
established: ""
maker: ""
website: ""
aliases:
  - Alberto's
short_description: lberto's Tortilla Wraps are a brand of, often, frozen or packaged flour tortillas known for being soft and easy to roll, commonly available in sizes like 10-inch and 6-inch. The product, often associated with, or manufactured by, "Senor Pepe" or similar Middle East-based food companies, is frequently used for wraps and in food service.
about: |-
  Albertos (also written Alberto's) is a range of soft flour tortilla wraps. Olive Foods supplies two sizes: 10-inch wraps in packs of 6, for burritos, large wraps and quesadillas, and 6-inch wraps in packs of 8, for street-style tacos, fajitas and smaller bites.

  Olive Foods imports Albertos tortillas into Sri Lanka for restaurants, cafés, hotels and caterers that serve Mexican and wrap menus, alongside Tabasco pepper sauce and other world-food ingredients.
sources:
  - https://gcc.luluhypermarket.com/en-ae/senor-pepe-s-alberto-s-tortilla-wraps-plain-10-3-x-6-pcs/p/2248789/
notes: Who makes the Albertos wraps you import, and in which country? A UAE retailer sells them as "Señor Pepe's Alberto's Tortilla Wraps" made in the UAE, but we could not confirm the maker, so the profile does not name one.
```

### Azizaa

- Page: https://www.olivefoods.lk/brands/azizaa · Products on the site (4): Basmati Rice 20Kg, Basmati Rice 5Kg, Extra Long Grain Basmati Rice Gold, Extra Long Grain Basmati Rice Platinum 1121
- Current description (admin): "Azizaa Basmati Rice is a variant of Basmati Rice, grown in the foot of The Himalayas, is success story of Modern Science in delivering the long slender translucent grain, which elongates on cooking without increase in its breadth."

```yaml
id: brand/azizaa
name: Azizaa (LOCKED)
status: draft
origin: India
established: ""
maker: ""
website: ""
aliases: []
short_description: Azizaa Basmati Rice is a variant of Basmati Rice, grown in the foot of The Himalayas, is success story of Modern Science in delivering the long slender translucent grain, which elongates on cooking without increase in its breadth.
about: |-
  Azizaa is a basmati rice brand from India. Basmati is a long-grain aromatic rice of the Indian subcontinent, known for slender grains that lengthen as they cook and stay separate and fluffy.

  Olive Foods supplies four Azizaa lines in Sri Lanka: Basmati Rice in 5 kg and 20 kg bags, Extra Long Grain Basmati Rice Gold, and Extra Long Grain Basmati Rice Platinum 1121, made from the 1121 variety known for its extra-long grains. Hotels, restaurants and caterers buy it for biryani, pilaf, fried rice and buffet service.
sources: []
notes: Who packs Azizaa? We found no public record of the brand owner, so the profile names only the country (India, from your current data).
```

### Bon Vegato

- Page: https://www.olivefoods.lk/brands/bon-vegato · Products on the site (0): none — page hidden until products are added
- Current description (admin): "Bon Vegato French Fries are a brand of frozen potato products produced in India, known for providing consistent quality in 6x6mm (shoestring) and 9x9mm cuts, ideal for foodservice and restaurants. They are part of the premium, locally produced frozen potato line designed for high performance in kitchens."

```yaml
id: brand/bon-vegato
name: Bon Vegato (LOCKED)
status: needs-client
origin: ""
established: ""
maker: ""
website: ""
aliases: []
short_description: Bon Vegato French Fries are a brand of frozen potato products produced in India, known for providing consistent quality in 6x6mm (shoestring) and 9x9mm cuts, ideal for foodservice and restaurants. They are part of the premium, locally produced frozen potato line designed for high performance in kitchens.
about: ""
sources: []
notes: ""
```

### Daily Dairy

- Page: https://www.olivefoods.lk/brands/daily-dairy · Products on the site (14): Cheddar Cheese Coloured 50%, Cheddar Cheese White 50%, Comte Cheese, Edam Cheese 40%, Emmental Cheese 45%, Failini Grated Parmesan Cheese, Goat Cheese Young 50%, Gouda Cheese 48%, Grana Padano Cheese Wheel, Kolios Feta Cheese, Pecorino Romano Cheese, Snow White Danish Blue Cheese, Snow White Danish Blue Cheese Wheel 50%, V.S.O.C Black Label Aged Gouda 48%
- Current description (admin): "We supply a complete range of the best Dutch, European, and special flavoured cheeses in more than 80 countries."

```yaml
id: brand/daily-dairy
name: Daily Dairy (LOCKED)
status: draft
origin: Netherlands
established: ""
maker: ""
website: ""
aliases: []
short_description: We supply a complete range of the best Dutch, European, and special flavoured cheeses in more than 80 countries.
about: |-
  Daily Dairy is the brand of Daily Dairy Holland, a cheese and dairy exporter in the Netherlands. Its range runs from classic Dutch cheeses such as Gouda and Edam to cheeses from other European traditions, and it has its own premium aged-cheese label, V.S.O.C.

  Olive Foods imports Daily Dairy cheese into Sri Lanka for hotels, restaurants, cafés and retailers: Gouda, Edam, white and coloured Cheddar, Emmental, Comté, Grana Padano, Pecorino Romano, young goat cheese, Danish blue and V.S.O.C Black Label aged Gouda, with grated Parmesan and Greek feta in the same range.
sources:
  - https://www.gulfood.com/exhibitors/daily-dairy-holland
  - https://www.tridge.com/sellers/daily-dairy-holland
notes: Your catalogue lists "Failini Grated Parmesan" and "Kolios Feta" under Daily Dairy. Kolios is a separate Greek feta brand. If Daily Dairy supplies them, this wording is fine; if not, they may belong under their own brand names.
```

### Damaco

- Page: https://www.olivefoods.lk/brands/damaco · Products on the site (5): Frozen Broccoli, Frozen Brussels Sprouts, Frozen Cauliflower, Frozen Green Peas, Mixed Veg 3 Way
- Current description (admin): "Damaco Group is specialized in the production & export for the food & feed industry. We offer meat, potato products, vegetables, convenience & fish."

```yaml
id: brand/damaco
name: Damaco (LOCKED)
status: draft
origin: Belgium
established: ""
maker: ""
website: ""
aliases: []
short_description: Damaco Group is specialized in the production & export for the food & feed industry. We offer meat, potato products, vegetables, convenience & fish.
about: |-
  Damaco is a frozen-food brand of the Damaco Group in Belgium, which produces frozen potato products, vegetables and convenience foods for food service and retail.

  Olive Foods imports Damaco frozen vegetables into Sri Lanka and keeps them under cold chain at −18 °C from its Colombo warehouse to the customer: broccoli and cauliflower florets, Brussels sprouts, green peas and a three-way mix of peas, carrots and corn. Hotels, restaurants and caterers use them for stir-fries, fried rice, soups and side dishes, with the same quality all year.
sources:
  - https://www.freshfromflanders.com/en/supplier/kipco-damaco-member-of-damaco-group
notes: ""
```

### Dedicato

- Page: https://www.olivefoods.lk/brands/dedicato · Products on the site (6): Cannelloni, Gnocchi, Pappardelle Sem, Spaghetti Vermicelli - Kg, Spirali Fantasia, Tagliatelle Spinaci - 80 - 500 Gr
- Current description (admin): "100% Puglia line, “Dedicated to our land”, which also includes the Whole Wheat, Egg, Specialties, and Premium Specialties lines."

```yaml
id: brand/dedicato
name: Dedicato (LOCKED)
status: draft
origin: Italy
established: ""
maker: ""
website: https://granoro.it/en/granoro-product-lines-dedicato/
aliases: []
short_description: 100% Puglia line, “Dedicated to our land”, which also includes the Whole Wheat, Egg, Specialties, and Premium Specialties lines.
about: |-
  Dedicato is the 100% Puglia pasta line of Granoro, the Pastificio Attilio Mastromauro in Corato, southern Italy. It is made from durum wheat grown, milled and turned into pasta within Puglia, through a traced supply chain of local farms and mills that Granoro set up in 2012.

  Olive Foods imports Dedicato pasta into Sri Lanka for restaurants, hotels and retailers, including cannelloni for baking, pappardelle, spinach tagliatelle, spaghetti vermicelli, multicoloured spirali fantasia and gnocchi.
sources:
  - https://granoro.it/en/granoro-product-lines-dedicato/
  - https://granoro.it/en/the-granoro-lines/granoro-dedicato-wholemeal-pasta/
notes: "Dedicato \"Gnocchi\": is it Granoro's dried durum-wheat pasta shape called gnocchi, or potato gnocchi? The current product description calls it potato dumplings. If it is the dried pasta shape, that description needs correcting (a corrected version is in the product section)."
```

### Dira

- Page: https://www.olivefoods.lk/brands/dira · Products on the site (11): Frozen Blackcurrant, Frozen Blueberry, Frozen Coconut Puree, Frozen Cranberry, Frozen Lemon Puree, Frozen Mango Puree, Frozen Passion Fruit Puree, Frozen Raspberry, Frozen Raspberry Puree, Frozen Red Currant, Frozen Strawberry Puree
- Current description (admin): "We offer a broad range of IQF fruit, purees, coulis, smoothie fruit and bakery specialties under our DIRA-brand or private label."

```yaml
id: brand/dira
name: Dira (LOCKED)
status: draft
origin: Belgium
established: ""
maker: ""
website: ""
aliases: []
short_description: We offer a broad range of IQF fruit, purees, coulis, smoothie fruit and bakery specialties under our DIRA-brand or private label.
about: |-
  DIRA is the frozen-fruit brand of Dirafrost, a company founded in 1988 in Limburg, Belgium's fruit-growing region, and part of the Austrian AGRANA group since 2004. Dirafrost makes IQF (individually quick frozen) fruit, fruit purees, coulis and smoothie fruit.

  Olive Foods imports DIRA into Sri Lanka and delivers it frozen under cold chain: purees in mango, passion fruit, strawberry, raspberry, lemon and coconut, and whole frozen blueberries, raspberries, cranberries, blackcurrants and red currants. Pastry kitchens, bars, cafés and hotels use them for mousses, sorbets, cocktails, smoothies, sauces and baking.
sources:
  - https://nutrada.com/suppliers/dirafrost
  - https://www.food.be/sites/food/files/companies/0012000000RYY69AAH/01257000000VEN0AAO/DirafrostCompanyFolder.pdf
notes: ""
```

### Donna Chiara

- Page: https://www.olivefoods.lk/brands/donna-chiara · Products on the site (6): Farfalloni, Fusilli, Linguine, Mezzi Gomiti Elbow Macaroni, Penne, Spaghetti
- Current description (admin): "Donna Chiara's Capellini, often referred to as angel hair pasta, boasts a tender and delicate texture that dances on the palate"

```yaml
id: brand/donna-chiara
name: Donna Chiara (LOCKED)
status: draft
origin: ""
established: ""
maker: ""
website: ""
aliases: []
short_description: Donna Chiara's Capellini, often referred to as angel hair pasta, boasts a tender and delicate texture that dances on the palate
about: |-
  Donna Chiara is a range of dried pasta in classic Italian shapes.

  Olive Foods supplies six Donna Chiara shapes in Sri Lanka: spaghetti and linguine for long-pasta dishes, penne and fusilli for thick and chunky sauces and baked pasta, farfalloni (large bow-ties) for salads and bakes, and mezzi gomiti elbow macaroni for macaroni and cheese. Restaurants, hotels, cafés and retailers buy it for everyday pasta service.
sources: []
notes: Who makes Donna Chiara, and in which country? We found no public record of the maker, so the profile is short. One line from the pack (maker, country, wheat) would let us complete it.
```

### Hungritos

- Page: https://www.olivefoods.lk/brands/hungritos · Products on the site (4): Frozen French Fries 9Mm, Frozen French Fries Shoes Strings Coated 7Mm, Frozen Hash Brown Potato, Frozen Potato Wedges
- Current description (admin): "Hungritos is a premium ready-to-cook brand bringing to your table finger food which have been loved across generations."

```yaml
id: brand/hungritos
name: Hungritos (LOCKED)
status: draft
origin: India
established: ""
maker: ""
website: https://hungritos.com/
aliases: []
short_description: Hungritos is a premium ready-to-cook brand bringing to your table finger food which have been loved across generations.
about: |-
  Hungritos is a frozen ready-to-cook brand of Iscon Balaji Foods, an Indian potato processor based in Ahmedabad, Gujarat, which sources its potatoes from contract farmers and makes French fries and potato specialities for food service and export.

  Olive Foods imports Hungritos frozen potato products into Sri Lanka and stores and delivers them at −18 °C: 9 mm French fries, coated 7 mm shoestring fries, potato wedges and hash browns. Restaurants, quick-service outlets, hotels and caterers use them for burgers, sides, starters and breakfast service.
sources:
  - https://hungritos.com/
  - https://www.potatopro.com/brands/hungritos
notes: ""
```

### Mae Ploy

- Page: https://www.olivefoods.lk/brands/mae-ploy · Products on the site (3): Green Curry Paste, Red Curry Paste, Tom Yum Paste
- Current description (admin): "Mae Ploy is a popular, authentic Thai brand established in 1993, renowned for its high-quality curry pastes, sauces, and coconut milk. Famous for bold flavors, their products (especially pastes) are widely considered a staple for authentic Thai cooking and contain no preservatives."

```yaml
id: brand/mae-ploy
name: Mae Ploy (LOCKED)
status: draft
origin: Thailand
established: ""
maker: ""
website: ""
aliases:
  - Maeploy
short_description: Mae Ploy is a popular, authentic Thai brand established in 1993, renowned for its high-quality curry pastes, sauces, and coconut milk. Famous for bold flavors, their products (especially pastes) are widely considered a staple for authentic Thai cooking and contain no preservatives.
about: |-
  Mae Ploy is a Thai brand of curry pastes and sauces made in Thailand by Theppadungporn Coconut Co., Ltd., the company that also makes Chaokoh coconut milk.

  Olive Foods imports Mae Ploy into Sri Lanka and supplies green curry paste, red curry paste and tom yum paste to restaurants, hotels and caterers cooking Thai food. A Thai curry starts by frying the paste in coconut cream before adding coconut milk, meat or vegetables, fish sauce and palm sugar; tom yum paste is the base of the hot and sour soup of the same name.
sources:
  - https://www.souschef.co.uk/products/mae-ploy-tom-yum-paste-1kg
notes: The current brand description says Mae Ploy was "established in 1993". Sources disagree on the year, so we left it out — we suggest removing it from the admin description too. Please confirm the maker on the pack reads Theppadungporn Coconut Co., Ltd.
```

### Mahachai

- Page: https://www.olivefoods.lk/brands/mahachai · Products on the site (1): Pad Thai Noodles (Rice Stick)
- Current description (admin): "Thai Brand"

```yaml
id: brand/mahachai
name: Mahachai (LOCKED)
status: draft
origin: Thailand
established: ""
maker: ""
website: ""
aliases: []
short_description: Thai Brand
about: |-
  Mahachai is a Thai brand of dried rice noodles. Olive Foods supplies its Pad Thai Noodles, a flat rice stick made for pad thai, Thailand's best-known stir-fried noodle dish, and also used in noodle soups and other stir-fries.

  The noodles are soaked in warm water until pliable, then stir-fried briefly with the sauce so they finish cooking in the pan. Olive Foods supplies them to restaurants, hotels and caterers in Sri Lanka alongside Mae Ploy curry pastes, Tiparos fish sauce and Wai Wai rice vermicelli.
sources: []
notes: Who makes the Mahachai noodles? We found no public record of the maker. The current admin description is just "Thai Brand".
```

### Mavees

- Page: https://www.olivefoods.lk/brands/mavees · Products on the site (3): Premium Cooking Cream, Silver Sweetened Whipping Cream, Smooth Sweetened Whipping Cream
- Current description (admin): _empty_

```yaml
id: brand/mavees
name: Mavees (LOCKED)
status: draft
origin: India
established: ""
maker: ""
website: https://www.maveefoods.com/
aliases:
  - Mavee's
  - Mavee
short_description: ""
about: |-
  Mavee's is a brand of Mavee Foods, a family business in Hyderabad, India, that makes bakery and food-service ingredients, including whip toppings and cooking cream.

  Olive Foods supplies three Mavee's creams in Sri Lanka: Premium Cooking Cream for sauces, soups, pasta and gravies, and two sweetened whipping creams, Smooth and Silver, for cake decoration, piping, fillings and desserts. Bakeries, pastry kitchens, cafés and hotels use them every day.
sources:
  - https://www.maveefoods.com/
notes: The brand is spelt "Mavee's" on the maker's site; your catalogue uses "Mavees". Both are kept as names Google will connect. We did not add the misspelling "Marvees" as an official name — Google already corrects that search to Mavees, and listing misspellings in structured data can look like keyword stuffing.
```

### Olive Foods own range

- Page: https://www.olivefoods.lk/brands/generic · Products on the site (73): Almond Milk, Almond Nut Whole, Almond Paste, Almond Powder, Almond Slice, Aluminium Container With Lid 1200Ml, Aluminium Container With Lid 750Ml, Baking Paper, Basil Shredded, Bay Leaves Whole, Beef Pepperoni, Beef Short Rib, Beef Striploin, Beef Tenderloin, Beef Topside, Black (Dark) Soy Sauce Orange Label, Cake Cup White 9 Cm, Cake Cups White 11.5Cm, Capers, Cheese Slice 128'S, Cheese Slice 90'S, Chicken Stock Powder, Cocoa Butter, Cocoa Powder, Corn Flour , Dark Soya Sauce, Dried Apricots, Frozen Duck Breast, Gluten Free Bread Flour/Mix, Instant Dry Yeast, Japanese Black Vinegar, Japanese Mayonnaise, Lamb Leg - Bone In, Lamb Leg Boneless, Lamb Rack Frenched Cap Off, Lamb SQ Cut Shoulder Slices, Lasagna Semola, Latex Gloves Medium White 100'S, Mirin 600G, Mutton Cube, Mutton Leg Bone In, Mutton Leg Boneless, Oregano Leaves Shredded, Oyster Sauce, Panko Bread Crumbs White, Paper Cup 12 Oz White Hd 50'S, Paper Cup 6 Oz Print 50'S, Paper Cup 8 Oz White 50'S, Pecan Nuts, Pine Nuts, Poly Gloves 100'S, Praline Cream, Pumpkin Seed Kernels, Quinoa Black, Quinoa White, Rice Paper 22Cm, Rosemary Chopped, Soba Zao Noodles, Sriracha Original Sauce, Sultanas, Sumac Powder, Sunflower Oil, Sunflower Seed Kernels, Tempura Ko, Thyme Leaves Shredded, Tomato Sauce Economy, Tomato Sauce Premium, Tomato Sauce Standard, Vinyl Gloves Medium Black 100'S, Vinyl Gloves Medium Blue 100'S, Walnut Halves, Wasabi Ko Powder, Yakinori Sushi 50'S
- Current description (admin): "Olive Foods Brands"

```yaml
id: brand/generic
name: Olive Foods (LOCKED)
status: draft
origin: ""
established: ""
maker: ""
website: ""
aliases: []
short_description: Olive Foods Brands
about: |-
  The Olive Foods own range is the everyday kitchen staples Olive Foods supplies under its own name: nuts, seeds and dried fruit, frozen beef, lamb, mutton and duck, dried herbs and spices, Japanese ingredients, sauces and stock powder, pastry and baking ingredients, flour, cooking oils, and packaging such as foil containers, paper cups, cake cups and food-handling gloves.

  It comes with the same service as the brands Olive Foods imports: trade pricing by quote, warehousing in Colombo, cold chain for frozen lines and delivery across Sri Lanka.
sources: []
notes: Optional. This is the brand page for your own range (/brands/generic).
```

### Royal Arm

- Page: https://www.olivefoods.lk/brands/royal-arm · Products on the site (17): Apple Cider Vinegar, Balsamic Vinegar, Black Olives Pitted, Black Olives Whole, Black Olives Whole Tins, Hoi Sin Sauce, Honey, Honey 1Kg, Light Soya Sauce, Mayonnaise, Mint Sauce, Mushroom Sliced, Olive Oil Pomace PET, Royal Arm Extra Virgin Olive Oil 1 Gal, Sesame Oil Blended, Sweet Soya Sauce, White Vinegar
- Current description (admin): "Founded in 2019 and headquartered in Dubai, Royal Techno Foodstuff Trading LLC has established itself as a prominent and trusted name in the food trading sector across the United Arab Emirates and beyond. With a reputation built on excellence, integrity, and reliability, we have rapidly expanded our footprint in local and international markets."

```yaml
id: brand/royal-arm
name: Royal Arm (LOCKED)
status: draft
origin: United Arab Emirates
established: ""
maker: ""
website: https://royaltechnofood.com/
aliases: []
short_description: Founded in 2019 and headquartered in Dubai, Royal Techno Foodstuff Trading LLC has established itself as a prominent and trusted name in the food trading sector across the United Arab Emirates and beyond. With a reputation built on excellence, integrity, and reliability, we have rapidly expanded our footprint in local and international markets.
about: |-
  Royal Arm is the own brand of Royal Techno Foodstuff Trading LLC, a food trading company in Dubai, United Arab Emirates, established in 2019. The Royal Arm range covers canned goods, olive and edible oils, honey, vinegars, sauces and condiments.

  Olive Foods imports Royal Arm into Sri Lanka and supplies pitted and whole black olives, sliced mushrooms, extra virgin olive oil, olive pomace oil and blended sesame oil, honey, apple cider, balsamic and white vinegar, and sauces including light and sweet soy, hoisin, mint sauce and mayonnaise, to hotels, restaurants, caterers and retailers.
sources:
  - https://royaltechnofood.com/
  - https://www.gulfood.com/exhibitors/royal-techno-foodstuff-trading-llc
notes: ""
```

### Tabasco

- Page: https://www.olivefoods.lk/brands/tabasco · Products on the site (1): Hot Pepper Sauce 60Ml
- Current description (admin): "Tabasco sauce is a famous American brand of hot sauce created in 1868 by Edmund McIlhenny on Avery Island, Louisiana. Made from tabasco peppers, vinegar, and salt, the mash is aged in oak barrels for up to three years. It is known for its versatile, sharp heat and is sold in over 195 countries."

```yaml
id: brand/tabasco
name: Tabasco (LOCKED)
status: draft
origin: United States
established: ""
maker: ""
website: https://www.tabasco.com/
aliases: []
short_description: Tabasco sauce is a famous American brand of hot sauce created in 1868 by Edmund McIlhenny on Avery Island, Louisiana. Made from tabasco peppers, vinegar, and salt, the mash is aged in oak barrels for up to three years. It is known for its versatile, sharp heat and is sold in over 195 countries.
about: |-
  Tabasco is the pepper sauce made by McIlhenny Company on Avery Island, Louisiana, USA, where Edmund McIlhenny first made it in 1868. The original red sauce is made from tabasco peppers, vinegar and salt, and the company is still run by the McIlhenny family.

  Olive Foods supplies Tabasco Original Red Pepper Sauce in 60 ml bottles to restaurants, bars, cafés and hotels in Sri Lanka, where a few drops go on eggs, pizza, oysters and seafood, into Bloody Marys and into marinades.
sources:
  - https://en.wikipedia.org/wiki/Tabasco_sauce
  - https://www.tabasco.com/
notes: ""
```

### Tiparos

- Page: https://www.olivefoods.lk/brands/tiparos · Products on the site (1): Fish Sauce
- Current description (admin): "Tiparos is a Thai fish sauce condiment brand under the Tang Sang Hah Company, established in Chonburi Province in 1919."

```yaml
id: brand/tiparos
name: Tiparos (LOCKED)
status: draft
origin: Thailand
established: ""
maker: ""
website: https://www.tiparos.com/
aliases: []
short_description: Tiparos is a Thai fish sauce condiment brand under the Tang Sang Hah Company, established in Chonburi Province in 1919.
about: |-
  Tiparos is a Thai fish sauce made by Tang Sang Hah Co., Ltd., a company founded in 1919 in Chonburi province on Thailand's Gulf coast that has been making fish sauce for more than a century.

  Fish sauce (nam pla) is made by fermenting fish with salt and is the main seasoning of Thai cooking. Olive Foods supplies Tiparos fish sauce to restaurants, hotels and caterers in Sri Lanka for Thai curries, stir-fries, soups such as tom yum, salads and dipping sauces.
sources:
  - https://en.wikipedia.org/wiki/Tiparos
  - https://www.tiparos.com/
notes: ""
```

### Wai Wai

- Page: https://www.olivefoods.lk/brands/wai-wai · Products on the site (1): Rice Vermicelli
- Current description (admin): "WaiWai Rice Vermicelli Noodles are crafted with premium rice flour to deliver a soft, smooth texture that stays firm, even after cooking."

```yaml
id: brand/wai-wai
name: Wai Wai (LOCKED)
status: draft
origin: Thailand
established: ""
maker: ""
website: ""
aliases:
  - WaiWai
short_description: WaiWai Rice Vermicelli Noodles are crafted with premium rice flour to deliver a soft, smooth texture that stays firm, even after cooking.
about: |-
  Wai Wai is a Thai noodle brand of Thai Preserved Food Factory Co., Ltd., which has made Wai Wai noodles in Thailand since 1972. Its rice vermicelli is made mainly from rice flour and is ready after a short soak in hot water.

  Olive Foods supplies Wai Wai rice vermicelli to restaurants, hotels and caterers in Sri Lanka for stir-fries, noodle soups, fresh spring rolls and noodle salads.
sources:
  - https://en.wikipedia.org/wiki/Wai_Wai_(food_brand)
  - https://trademark.justia.com/owners/thai-preserved-food-factory-co-ltd-4635524
notes: ""
```

## 4. Category introductions (24)

Each category has a page at https://www.olivefoods.lk/categories/<slug>. Today every category page opens with the same template sentence; `intro` replaces it.

### Canned Vegetables & Dried Fruits

- Page: https://www.olivefoods.lk/categories/canned-vegetables-and-dried-fruits · 18 products · Brands: Acroyali, Royal Arm, Olive Foods
- Products: Baked Beans, Black Olives Pitted, Black Olives Whole, Black Olives Whole Tins, Capers, Dark Sweet Pitted Cherry, Fruit Cocktail, Glace Cherries Red, Lychees, Mushroom Sliced, Peach Halves, Pear Halves In Syrup, Red Kidney Beans, Straw Mushroom, Sweet Corn Cream Style, Sweet Corn Kernel, Whole Mushroom, Young Corn

```yaml
id: category/canned-vegetables-and-dried-fruits
name: Canned Vegetables & Dried Fruits (LOCKED)
status: draft
intro: Canned fruit and vegetables keep for months at room temperature and give kitchens the same quality all year, whatever the season. This range covers Acroyali canned fruit (peach and pear halves, lychees, fruit cocktail, dark sweet cherries and glacé cherries) and canned vegetables and pulses (sweet corn, cream-style corn, young corn, straw and whole mushrooms, baked beans and red kidney beans), with Royal Arm black olives and sliced mushrooms and capers. Hotels, restaurants and bakeries use them for buffets, pizza, salads, desserts and baking.
sources: []
notes: ""
```

### Chocolate & Pastry

- Page: https://www.olivefoods.lk/categories/chocolate-and-pastry · 10 products · Brands: Olive Foods, Mavees
- Products: Almond Milk, Almond Paste, Cocoa Butter, Cocoa Powder, Instant Dry Yeast, Praline Cream, Premium Cooking Cream, Rice Paper 22Cm, Silver Sweetened Whipping Cream, Smooth Sweetened Whipping Cream

```yaml
id: category/chocolate-and-pastry
name: Chocolate & Pastry (LOCKED)
status: draft
intro: "Ingredients for bakeries, cafés and pastry kitchens: cocoa powder and cocoa butter for chocolate work, almond paste and praline cream for fillings, instant dry yeast for bread and pizza dough, almond milk, rice paper, and Mavee's cooking cream and sweetened whipping creams for sauces, cake decoration and desserts."
sources: []
notes: ""
```

### Dry Nuts, Seeds & Dried Fruits

- Page: https://www.olivefoods.lk/categories/dry-nuts-seeds-and-dried-fruits · 12 products · Brands: Olive Foods
- Products: Almond Nut Whole, Almond Powder, Almond Slice, Dried Apricots, Pecan Nuts, Pine Nuts, Pumpkin Seed Kernels, Quinoa Black, Quinoa White, Sultanas, Sunflower Seed Kernels, Walnut Halves

```yaml
id: category/dry-nuts-seeds-and-dried-fruits
name: Dry Nuts, Seeds & Dried Fruits (LOCKED)
status: draft
intro: "Nuts, seeds, grains and dried fruit for baking, desserts, salads and breakfast menus: whole, sliced and ground almonds, walnut halves, pecans, pine nuts, pumpkin and sunflower seed kernels, white and black quinoa, dried apricots and sultanas. Nuts are rich in oil, so they keep their flavour best stored airtight in a cool, dry place away from light."
sources: []
notes: ""
```

### Edible Oils

- Page: https://www.olivefoods.lk/categories/edible-oils · 4 products · Brands: Royal Arm, Olive Foods
- Products: Olive Oil Pomace PET, Royal Arm Extra Virgin Olive Oil 1 Gal, Sesame Oil Blended, Sunflower Oil

```yaml
id: category/edible-oils
name: Edible Oils (LOCKED)
status: draft
intro: "Cooking and finishing oils for professional kitchens: Royal Arm extra virgin olive oil for dressings, dips and finishing, olive pomace oil for frying and high-heat cooking, blended sesame oil for Asian dishes and marinades, and sunflower oil as an everyday frying and cooking oil."
sources: []
notes: ""
```

### Flour

- Page: https://www.olivefoods.lk/categories/flour · 2 products · Brands: Olive Foods
- Products: Corn Flour , Gluten Free Bread Flour/Mix

```yaml
id: category/flour
name: Flour (LOCKED)
status: draft
intro: "Specialty flours for kitchens and bakeries: fine corn flour for thickening sauces and soups and for crisp coatings, and a gluten-free bread flour mix for breads, rolls and bases on gluten-free menus. Tempura flour and panko breadcrumbs are in Japanese Products."
sources: []
notes: ""
```

### Frozen French Fries

- Page: https://www.olivefoods.lk/categories/frozen-french-fries · 2 products · Brands: Hungritos
- Products: Frozen French Fries 9Mm, Frozen French Fries Shoes Strings Coated 7Mm

```yaml
id: category/frozen-french-fries
name: Frozen French Fries (LOCKED)
status: draft
intro: "Frozen French fries from Hungritos, stored and delivered under cold chain at −18 °C: a 9 mm straight cut for everyday sides, and coated 7 mm shoestring fries with a crunchy finish for burgers and fried-seafood baskets. Cook them straight from frozen; fries that thaw before frying soak up oil and turn limp."
sources: []
notes: ""
```

### Frozen Fruit Puree

- Page: https://www.olivefoods.lk/categories/frozen-fruit-puree · 6 products · Brands: Dira
- Products: Frozen Coconut Puree, Frozen Lemon Puree, Frozen Mango Puree, Frozen Passion Fruit Puree, Frozen Raspberry Puree, Frozen Strawberry Puree

```yaml
id: category/frozen-fruit-puree
name: Frozen Fruit Puree (LOCKED)
status: draft
intro: "DIRA fruit purees from Belgium, kept frozen at −18 °C: mango, passion fruit, strawberry, raspberry, lemon and coconut. Purees give bars, cafés and pastry kitchens the same flavour and colour all year for cocktails, smoothies, mousses, sorbets, sauces and glazes, without peeling, pitting or straining fruit. Thaw in the refrigerator and use within the time on the pack."
sources: []
notes: ""
```

### Frozen Meat

- Page: https://www.olivefoods.lk/categories/frozen-meat · 12 products · Brands: Olive Foods
- Products: Beef Pepperoni, Beef Short Rib, Beef Striploin, Beef Tenderloin, Beef Topside, Lamb Leg - Bone In, Lamb Leg Boneless, Lamb Rack Frenched Cap Off, Lamb SQ Cut Shoulder Slices, Mutton Cube, Mutton Leg Bone In, Mutton Leg Boneless

```yaml
id: category/frozen-meat
name: Frozen Meat (LOCKED)
status: draft
intro: "Frozen beef, lamb and mutton for hotels, restaurants and caterers: beef striploin, tenderloin, topside and short rib, beef pepperoni, lamb leg on the bone and boneless, frenched lamb rack and lamb shoulder slices, and mutton leg and cubes. Every cut is stored and delivered at −18 °C. Thaw meat slowly in the refrigerator, never at room temperature, and cook it once thawed."
sources: []
notes: ""
```

### Frozen Potato Products

- Page: https://www.olivefoods.lk/categories/frozen-potato-products · 2 products · Brands: Hungritos
- Products: Frozen Hash Brown Potato, Frozen Potato Wedges

```yaml
id: category/frozen-potato-products
name: Frozen Potato Products (LOCKED)
status: draft
intro: "Hungritos frozen potato products beyond fries: hash browns for breakfast service and thick-cut potato wedges for sides and starters, with the fries listed under Frozen French Fries. Kept at −18 °C and cooked from frozen, by deep-frying or in the oven."
sources: []
notes: ""
```

### Frozen Vegetables & Fruits

- Page: https://www.olivefoods.lk/categories/frozen-vegetables-and-fruits · 10 products · Brands: Dira, Damaco
- Products: Frozen Blackcurrant, Frozen Blueberry, Frozen Broccoli, Frozen Brussels Sprouts, Frozen Cauliflower, Frozen Cranberry, Frozen Green Peas, Frozen Raspberry, Frozen Red Currant, Mixed Veg 3 Way

```yaml
id: category/frozen-vegetables-and-fruits
name: Frozen Vegetables & Fruits (LOCKED)
status: draft
intro: Frozen vegetables from Damaco (broccoli, cauliflower, Brussels sprouts, green peas and a peas, carrot and corn mix) and frozen berries from DIRA (blueberries, raspberries, cranberries, blackcurrants and red currants). Frozen lines let kitchens serve vegetables and fruit that are out of season or not grown in Sri Lanka, with no trimming waste. Delivered at −18 °C.
sources: []
notes: ""
```

### Herbs & Spices

- Page: https://www.olivefoods.lk/categories/herbs-and-spices · 6 products · Brands: Olive Foods
- Products: Basil Shredded, Bay Leaves Whole, Oregano Leaves Shredded, Rosemary Chopped, Sumac Powder, Thyme Leaves Shredded

```yaml
id: category/herbs-and-spices
name: Herbs & Spices (LOCKED)
status: draft
intro: "Dried herbs and spices for kitchens: shredded basil, oregano and thyme, chopped rosemary, whole bay leaves and sumac powder, the Mediterranean and Middle Eastern seasonings behind pizza and pasta sauces, roasts, grills and salads. Dried herbs give their best flavour when added early in cooking, and keep longest sealed, cool and away from light."
sources: []
notes: ""
```

### Honey

- Page: https://www.olivefoods.lk/categories/honey · 2 products · Brands: Royal Arm
- Products: Honey, Honey 1Kg

```yaml
id: category/honey
name: Honey (LOCKED)
status: draft
intro: Royal Arm honey, including a 1 kg pack, for breakfast buffets, baking, dressings, marinades and glazes, and for sweetening drinks. Honey keeps at room temperature; if it crystallises, warm it gently in a water bath and it turns liquid again.
sources: []
notes: ""
```

### Imported Cheese

- Page: https://www.olivefoods.lk/categories/imported-cheese · 16 products · Brands: Daily Dairy, Olive Foods
- Products: Cheddar Cheese Coloured 50%, Cheddar Cheese White 50%, Cheese Slice 128'S, Cheese Slice 90'S, Comte Cheese, Edam Cheese 40%, Emmental Cheese 45%, Failini Grated Parmesan Cheese, Goat Cheese Young 50%, Gouda Cheese 48%, Grana Padano Cheese Wheel, Kolios Feta Cheese, Pecorino Romano Cheese, Snow White Danish Blue Cheese, Snow White Danish Blue Cheese Wheel 50%, V.S.O.C Black Label Aged Gouda 48%

```yaml
id: category/imported-cheese
name: Imported Cheese (LOCKED)
status: draft
intro: "European cheeses for hotels, restaurants and retailers, most from Daily Dairy of the Netherlands: Gouda, Edam, white and coloured Cheddar, Emmental, Comté, Grana Padano, Pecorino Romano, young goat cheese, Danish blue, V.S.O.C Black Label aged Gouda, grated Parmesan and feta, plus processed cheese slices for burgers and sandwiches. Keep cheese refrigerated and wrapped, and cut hard cheeses to order so the cut faces don't dry out."
sources: []
notes: ""
```

### Italian Pasta

- Page: https://www.olivefoods.lk/categories/italian-pasta · 13 products · Brands: Dedicato, Donna Chiara, Olive Foods
- Products: Cannelloni, Farfalloni, Fusilli, Gnocchi, Lasagna Semola, Linguine, Mezzi Gomiti Elbow Macaroni, Pappardelle Sem, Penne, Spaghetti, Spaghetti Vermicelli - Kg, Spirali Fantasia, Tagliatelle Spinaci - 80 - 500 Gr

```yaml
id: category/italian-pasta
name: Italian Pasta (LOCKED)
status: draft
intro: "Dried Italian pasta for restaurants, hotels and retailers from Dedicato, Granoro's 100% Puglia line, and Donna Chiara: spaghetti, linguine, penne, fusilli, farfalloni, elbow macaroni, pappardelle, spinach tagliatelle, spaghetti vermicelli, spirali fantasia, cannelloni and gnocchi, plus semolina lasagna sheets. Match the shape to the sauce: long strands for oil-based and light tomato sauces, tubes and twists for thick and chunky ones, wide ribbons for rich ragù."
sources: []
notes: ""
```

### Japanese Products

- Page: https://www.olivefoods.lk/categories/japanese-products · 8 products · Brands: Olive Foods
- Products: Japanese Black Vinegar, Japanese Mayonnaise, Mirin 600G, Panko Bread Crumbs White, Soba Zao Noodles, Tempura Ko, Wasabi Ko Powder, Yakinori Sushi 50'S

```yaml
id: category/japanese-products
name: Japanese Products (LOCKED)
status: draft
intro: "Japanese pantry ingredients for sushi bars, Asian restaurants and hotels: yakinori seaweed sheets for sushi, panko breadcrumbs, tempura flour, wasabi powder, mirin, Japanese mayonnaise, black vinegar and soba noodles."
sources: []
notes: ""
```

### Local Sauces

- Page: https://www.olivefoods.lk/categories/local-sauces · 6 products · Brands: Olive Foods
- Products: Chicken Stock Powder, Dark Soya Sauce, Oyster Sauce, Tomato Sauce Economy, Tomato Sauce Premium, Tomato Sauce Standard

```yaml
id: category/local-sauces
name: Local Sauces (LOCKED)
status: draft
intro: "Everyday sauces and seasonings for Sri Lankan kitchens and caterers: tomato sauce in economy, standard and premium grades, dark soy sauce, oyster sauce and chicken stock powder, for curries, stir-fries, fried rice, gravies and soups."
sources: []
notes: ""
```

### Mexican

- Page: https://www.olivefoods.lk/categories/mexican · 2 products · Brands: Albertos
- Products: Albertos Flour Tortilla Wraps 10" 6'S, Albertos Tortilla Wraps 6" 8'S

```yaml
id: category/mexican
name: Mexican (LOCKED)
status: draft
intro: Albertos flour tortillas in 10-inch (6 per pack) and 6-inch (8 per pack) sizes for burritos, wraps, quesadillas, tacos and fajitas. Warm tortillas briefly on a dry pan or griddle before filling so they stay soft and fold without cracking. For heat at the table, pair them with Tabasco pepper sauce from Seasonings & Sauce.
sources: []
notes: ""
```

### Packing Material

- Page: https://www.olivefoods.lk/categories/packing-material · 12 products · Brands: Olive Foods
- Products: Aluminium Container With Lid 1200Ml, Aluminium Container With Lid 750Ml, Baking Paper, Cake Cup White 9 Cm, Cake Cups White 11.5Cm, Latex Gloves Medium White 100'S, Paper Cup 12 Oz White Hd 50'S, Paper Cup 6 Oz Print 50'S, Paper Cup 8 Oz White 50'S, Poly Gloves 100'S, Vinyl Gloves Medium Black 100'S, Vinyl Gloves Medium Blue 100'S

```yaml
id: category/packing-material
name: Packing Material (LOCKED)
status: draft
intro: "Food-service packaging and disposables: aluminium containers with lids in 750 ml and 1,200 ml for takeaway and catering, paper cups in 6, 8 and 12 oz, white cake cups, baking paper, and latex, vinyl and polyethylene gloves for food handling."
sources: []
notes: ""
```

### Pie Filling & Topping

- Page: https://www.olivefoods.lk/categories/pie-filling-and-topping · 13 products · Brands: Acroyali, Mavees
- Products: Apple Pie Filling 50%, Apple Pie Filling 70%, Blueberry Pie Filling 50%, Blueberry Pie Filling 70%, Premium Cooking Cream, Raspberry Pie Filling 50%, Raspberry Pie Filling 70%, Red Cherry Pie Filling 50%, Red Cherry Pie Filling 70%, Silver Sweetened Whipping Cream, Smooth Sweetened Whipping Cream, Strawberry Pie Filling 50%, Strawberry Pie Filling 70%

```yaml
id: category/pie-filling-and-topping
name: Pie Filling & Topping (LOCKED)
status: draft
intro: Ready-to-use Acroyali fruit pie fillings in apple, blueberry, raspberry, red cherry and strawberry, each in a 50% and a 70% version, and Mavee's sweetened whipping creams. Fillings go straight into pies, tarts, turnovers, cheesecakes and Danish pastries, and save kitchens peeling, cooking and thickening fruit in-house.
sources: []
notes: ""
```

### Poultry

- Page: https://www.olivefoods.lk/categories/poultry · 1 products · Brands: Olive Foods
- Products: Frozen Duck Breast

```yaml
id: category/poultry
name: Poultry (LOCKED)
status: draft
intro: Frozen duck breast, boneless with the skin on, for restaurants and hotels. Score the skin and start it skin-side down in a cold pan to render the fat slowly, then finish in a hot oven. Stored and delivered frozen at −18 °C; thaw in the refrigerator before cooking.
sources: []
notes: ""
```

### Rice

- Page: https://www.olivefoods.lk/categories/rice · 4 products · Brands: Azizaa
- Products: Basmati Rice 20Kg, Basmati Rice 5Kg, Extra Long Grain Basmati Rice Gold, Extra Long Grain Basmati Rice Platinum 1121

```yaml
id: category/rice
name: Rice (LOCKED)
status: draft
intro: Azizaa basmati rice from India in 5 kg and 20 kg bags, and Extra Long Grain Gold and Platinum 1121 for biryani and pilaf. Basmati cooks into long, separate, fragrant grains; rinsing until the water runs clear and a short soak before cooking help the grains lengthen without breaking.
sources: []
notes: ""
```

### Seasonings & Sauce

- Page: https://www.olivefoods.lk/categories/seasonings-and-sauce · 9 products · Brands: Olive Foods, Tiparos, Royal Arm, Tabasco
- Products: Black (Dark) Soy Sauce Orange Label, Fish Sauce, Hoi Sin Sauce, Hot Pepper Sauce 60Ml, Light Soya Sauce, Mayonnaise, Mint Sauce, Sriracha Original Sauce, Sweet Soya Sauce

```yaml
id: category/seasonings-and-sauce
name: Seasonings & Sauce (LOCKED)
status: draft
intro: "Sauces and condiments from around the world: Tabasco pepper sauce, Royal Arm light and sweet soy sauce, hoisin sauce, mint sauce and mayonnaise, sriracha, dark soy sauce and Tiparos fish sauce, for marinades, glazes, stir-fries, dips and the table."
sources: []
notes: ""
```

### Thai Products

- Page: https://www.olivefoods.lk/categories/thai-products · 7 products · Brands: Olive Foods, Tiparos, Mae Ploy, Mahachai, Wai Wai
- Products: Black (Dark) Soy Sauce Orange Label, Fish Sauce, Green Curry Paste, Pad Thai Noodles (Rice Stick), Red Curry Paste, Rice Vermicelli, Tom Yum Paste

```yaml
id: category/thai-products
name: Thai Products (LOCKED)
status: draft
intro: "Ingredients for Thai cooking: Mae Ploy green curry, red curry and tom yum pastes, Tiparos fish sauce, dark soy sauce, Mahachai pad thai rice noodles and Wai Wai rice vermicelli. With fresh herbs and coconut milk, they cover green and red curries, tom yum soup, pad thai and noodle salads."
sources: []
notes: ""
```

### Vinegar

- Page: https://www.olivefoods.lk/categories/vinegar · 3 products · Brands: Royal Arm
- Products: Apple Cider Vinegar, Balsamic Vinegar, White Vinegar

```yaml
id: category/vinegar
name: Vinegar (LOCKED)
status: draft
intro: "Royal Arm vinegars: apple cider vinegar for dressings and pickles, balsamic vinegar for glazes, salads and reductions, and distilled white vinegar for pickling, marinades and balancing rich sauces."
sources: []
notes: ""
```

## 5. Product descriptions (175)

Each product has a page at https://www.olivefoods.lk/products/<slug>. Part A has proposed rewrites (missing, placeholder, or near-identical size/percentage versions that need telling apart). Part B is every other product with its current description: improve the ones that are vague, generic or wrong (set `status: edited`), and leave good ones alone. Percentages in cheese names (e.g. "Gouda 48%") are fat in dry matter; in pie fillings (50% / 70%) they are believed to be fruit content — see the open questions.

### Part A — drafted rewrites (27)

#### Aluminium Container With Lid 1200Ml

- Page: https://www.olivefoods.lk/products/generic-aluminium-container-with-lid-1200ml · Category: Packing Material · SKU OLV0208 · Pack: 1200 ml
- Current description: "Large capacity aluminium tray featuring a secure lid for bulk food storage, catering service, and takeaway meals."

```yaml
id: product/generic-aluminium-container-with-lid-1200ml
name: Aluminium Container With Lid 1200Ml (LOCKED)
status: draft
why: 750 ml and 1,200 ml pages are 67% identical
description: "1,200 ml aluminium container with a lid for family-size takeaway orders, sharing portions and catering: larger servings of rice, biryani, pasta bakes and curries. Also available in 750 ml for single meals."
sources: []
notes: ""
```

#### Aluminium Container With Lid 750Ml

- Page: https://www.olivefoods.lk/products/generic-aluminium-container-with-lid-750ml · Category: Packing Material · SKU OLV0075 · Pack: 750 ml
- Current description: "Rectangular foil tray with a matching lid, used for reheating, storing, and transporting hot prepared food items."

```yaml
id: product/generic-aluminium-container-with-lid-750ml
name: Aluminium Container With Lid 750Ml (LOCKED)
status: draft
why: 750 ml and 1,200 ml pages are 67% identical
description: "750 ml rectangular aluminium container with a lid, sized for a single takeaway meal: a rice and curry portion, a pasta bake or an individual dessert. Also available in 1,200 ml for sharing portions."
sources: []
notes: ""
```

#### Apple Pie Filling 50% — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-apple-pie-filling-50 · Category: Pie Filling & Topping · SKU OLV0144
- Current description: "Classic apple fruit filling used for stuffing pies, crumbles, and turnovers, providing a consistent texture and flavor for professional baking."

```yaml
id: product/acroyali-apple-pie-filling-50
name: Apple Pie Filling 50% (LOCKED)
status: draft
why: 50% and 70% pages are 71% identical
description: "Acroyali apple pie filling, the 50% version: apple pieces in a smooth, lightly spiced glaze, ready for pies, crumbles, turnovers and Danish pastries in everyday baking. For more and larger fruit pieces, choose the 70% version."
sources: []
notes: "We read 50% / 70% as the fruit content (your current 70% copy says \"high fruit content\"). Please confirm. \"Lightly spiced\": please confirm (cinnamon?) or we drop it."
```

#### Apple Pie Filling 70% — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-apple-pie-filling-70 · Category: Pie Filling & Topping · SKU OLV0314
- Current description: "High-concentration apple fruit filling featuring tender fruit pieces, ideal for premium lattice pies, strudels, and high-quality confectionery products."

```yaml
id: product/acroyali-apple-pie-filling-70
name: Apple Pie Filling 70% (LOCKED)
status: draft
why: 50% and 70% pages are 71% identical
description: "Acroyali apple pie filling, the 70% version: more apple and less glaze, for lattice pies, strudel and tarts where the fruit is the feature. The 50% version suits everyday pies and crumbles."
sources: []
notes: ""
```

#### Basmati Rice 20Kg — Azizaa

- Page: https://www.olivefoods.lk/products/azizaa-basmati-rice-20kg · Category: Rice · SKU OLV0122 · Pack: 20 kg
- Current description: "Versatile aromatic long-grain rice suitable for high-volume catering, providing a light and fluffy consistency for various ethnic cuisines."

```yaml
id: product/azizaa-basmati-rice-20kg
name: Basmati Rice 20Kg (LOCKED)
status: draft
why: 5 kg and 20 kg pages are 68% identical
description: "Azizaa basmati rice in a 20 kg bag for hotels, caterers and high-volume kitchens: the same long, fragrant grain as the 5 kg pack, in a size made for buffets, banquets and daily biryani service."
sources: []
notes: ""
```

#### Basmati Rice 5Kg — Azizaa

- Page: https://www.olivefoods.lk/products/azizaa-basmati-rice-5kg · Category: Rice · SKU OLV0123 · Pack: 5 kg
- Current description: "Fragrant long-grain rice known for its delicate aroma, commonly used as a base for curries and traditional Middle Eastern dishes."

```yaml
id: product/azizaa-basmati-rice-5kg
name: Basmati Rice 5Kg (LOCKED)
status: draft
why: 5 kg and 20 kg pages are 68% identical
description: Azizaa basmati rice in a 5 kg bag, a handy size for restaurants, cafés, smaller kitchens and retail shelves. Long, fragrant grains that cook separate and fluffy for biryani, pilaf, fried rice and curries. Also available in a 20 kg bag.
sources: []
notes: ""
```

#### Blueberry Pie Filling 50% — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-blueberry-pie-filling-50 · Category: Pie Filling & Topping · SKU OLV0142
- Current description: "Thick blueberry fruit filling perfect for layering in pies, topping cheesecakes, or filling versatile breakfast pastries and dessert tarts."

```yaml
id: product/acroyali-blueberry-pie-filling-50
name: Blueberry Pie Filling 50% (LOCKED)
status: draft
why: 50% and 70% pages are 71% identical
description: "Acroyali blueberry pie filling, the 50% version: blueberries in a thick, glossy glaze for pies, cheesecake toppings, muffins and breakfast pastries. The 70% version carries more whole berries."
sources: []
notes: ""
```

#### Blueberry Pie Filling 70% — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-blueberry-pie-filling-70 · Category: Pie Filling & Topping · SKU OLV0312
- Current description: "Premium high-fruit blueberry filling containing whole berries, excellent for gourmet pies, muffins, and high-end dessert garnishes and plate presentations."

```yaml
id: product/acroyali-blueberry-pie-filling-70
name: Blueberry Pie Filling 70% (LOCKED)
status: draft
why: 50% and 70% pages are 71% identical
description: "Acroyali blueberry pie filling, the 70% version: packed with whole berries for premium pies, cheesecakes and plated desserts where the fruit shows. The 50% version suits everyday baking."
sources: []
notes: ""
```

#### Cheese Slice 128'S

- Page: https://www.olivefoods.lk/products/generic-cheese-slice-128s · Category: Imported Cheese · SKU OLV0228 · Pack: 128 per pack
- Current description: "Conveniently pre-sliced processed cheese designed for high-volume foodservice applications like breakfast sandwiches and fast-food style burgers."

```yaml
id: product/generic-cheese-slice-128s
name: Cheese Slice 128'S (LOCKED)
status: draft
why: 128-slice and 90-slice pages are 64% identical
description: "Processed cheese slices in a 128-slice pack for high-volume kitchens: quick-service burger lines, breakfast sandwiches, toasties and room service. Each slice melts evenly in seconds. A 90-slice pack is also available."
sources: []
notes: ""
```

#### Cheese Slice 90'S

- Page: https://www.olivefoods.lk/products/generic-cheese-slice-90s · Category: Imported Cheese · SKU OLV0271 · Pack: 90 per pack
- Current description: "Individual processed cheese slices with a smooth texture, ideal for quick melting in professional kitchens and cafeteria service."

```yaml
id: product/generic-cheese-slice-90s
name: Cheese Slice 90'S (LOCKED)
status: draft
why: 128-slice and 90-slice pages are 64% identical
description: "Processed cheese slices in a 90-slice pack, a practical size for cafés, sandwich counters and smaller kitchens: burgers, melts, wraps and breakfast plates. For busier kitchens there is a 128-slice pack."
sources: []
notes: ""
```

#### Gnocchi — Dedicato

- Page: https://www.olivefoods.lk/products/dedicato-gnocchi · Category: Italian Pasta · SKU OLV0256
- Current description: "Soft Italian dumplings typically made from potatoes and flour, suited for tossing in brown butter, sage, or light tomato-based sauces."

```yaml
id: product/dedicato-gnocchi
name: Gnocchi (LOCKED)
status: draft
why: Possibly wrong (see Dedicato brand note)
description: Dedicato gnocchi is a dried durum-wheat pasta shaped like small ridged dumplings, from Granoro's 100% Puglia line. The ridges and hollow hold tomato, meat and cream sauces, and it bakes well.
sources: []
notes: Use this ONLY if the product is Granoro's dried pasta shape. If it really is potato gnocchi, keep the current description.
```

#### Lamb Leg - Bone In

- Page: https://www.olivefoods.lk/products/lamb-leg---bone-in · Category: Frozen Meat
- Current description: _empty_

```yaml
id: product/lamb-leg---bone-in
name: Lamb Leg - Bone In (LOCKED)
status: draft
why: No description
description: Whole frozen lamb leg on the bone, for roasting whole, slow-braising or cutting into curry pieces. Cooking on the bone keeps the meat moist and gives a richer gravy, so it suits carvery stations, Sunday roasts and festive menus.
sources: []
notes: Its web address has a triple hyphen (/products/lamb-leg---bone-in). Changing the slug to lamb-leg-bone-in tidies it; the old address redirects automatically.
```

#### Lamb Leg Boneless

- Page: https://www.olivefoods.lk/products/lamb-leg-boneless · Category: Frozen Meat
- Current description: _empty_

```yaml
id: product/lamb-leg-boneless
name: Lamb Leg Boneless (LOCKED)
status: draft
why: No description
description: Frozen boneless lamb leg, ready to roll and tie for an even roast, butterfly for the grill, or dice for curries and kebabs. With the bone already out, there is little trim and every portion carves cleanly.
sources: []
notes: ""
```

#### Lamb SQ Cut Shoulder Slices

- Page: https://www.olivefoods.lk/products/lamb-sq-cut-shoulder-slices · Category: Frozen Meat
- Current description: _empty_

```yaml
id: product/lamb-sq-cut-shoulder-slices
name: Lamb SQ Cut Shoulder Slices (LOCKED)
status: draft
why: No description
description: Square-cut lamb shoulder sliced into chops. Shoulder carries more marbling than leg, so these slices stay juicy on the grill or barbecue and turn tender when braised or cooked in a curry.
sources: []
notes: ""
```

#### Mezzi Gomiti Elbow Macaroni — Donna Chiara

- Page: https://www.olivefoods.lk/products/pasta · Category: Italian Pasta
- Current description: _empty_

```yaml
id: product/pasta
name: Mezzi Gomiti Elbow Macaroni (LOCKED)
status: draft
why: No description
description: "Mezzi gomiti, or half elbows, are short curved pasta tubes: the classic shape for macaroni and cheese, baked pasta and cold pasta salads. The hollow centre fills with cheese and cream sauces."
sources: []
notes: This product's web address is /products/pasta. Changing its slug in the admin to donna-chiara-mezzi-gomiti-elbow-macaroni gives it a descriptive address; the site redirects the old one automatically.
```

#### Mutton Cube

- Page: https://www.olivefoods.lk/products/mutton-cube · Category: Frozen Meat
- Current description: _empty_

```yaml
id: product/mutton-cube
name: Mutton Cube (LOCKED)
status: draft
why: No description
description: Frozen diced mutton, cut into cubes ready for curries, stews, biryani and kebabs. Mutton has a deeper flavour than lamb and rewards long, slow cooking.
sources: []
notes: ""
```

#### Mutton Leg Bone In

- Page: https://www.olivefoods.lk/products/mutton-leg-bone-in · Category: Frozen Meat
- Current description: _empty_

```yaml
id: product/mutton-leg-bone-in
name: Mutton Leg Bone In (LOCKED)
status: draft
why: No description
description: Frozen mutton leg on the bone for slow roasting, braising and curries. The bone adds flavour to the gravy and keeps the meat moist through long cooking, which suits biryani and celebration menus.
sources: []
notes: ""
```

#### Mutton Leg Boneless

- Page: https://www.olivefoods.lk/products/mutton-leg-boneless · Category: Frozen Meat
- Current description: _empty_

```yaml
id: product/mutton-leg-boneless
name: Mutton Leg Boneless (LOCKED)
status: draft
why: No description
description: Frozen boneless mutton leg for dicing into curries and biryani, mincing, or rolling and slow-roasting. Lean leg meat with the bone removed, so portioning is quick and waste is low.
sources: []
notes: ""
```

#### Premium Cooking Cream — Mavees

- Page: https://www.olivefoods.lk/products/premium-cooking-cream · Category: Chocolate & Pastry, Pie Filling & Topping
- Current description: _empty_

```yaml
id: product/premium-cooking-cream
name: Premium Cooking Cream (LOCKED)
status: draft
why: No description
description: "Mavee's Premium Cooking Cream for savoury cooking: creamy pasta sauces, soups, curries, gravies and gratins. Made for hot dishes, it adds body and a rich finish to sauces in hotel, restaurant and café kitchens."
sources: []
notes: ""
```

#### Raspberry Pie Filling 50% — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-raspberry-pie-filling-50 · Category: Pie Filling & Topping · SKU OLV0145
- Current description: "Rich raspberry fruit filling suitable for jam tarts, cake layers, or as a flavorful swirl in various baked goods and desserts."

```yaml
id: product/acroyali-raspberry-pie-filling-50
name: Raspberry Pie Filling 50% (LOCKED)
status: draft
why: 50% and 70% pages are 70% identical
description: "Acroyali raspberry pie filling, the 50% version: a bright, tangy filling for jam tarts, sponge layers, swirls through batters and Danish pastries. The 70% version has more fruit."
sources: []
notes: ""
```

#### Raspberry Pie Filling 70% — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-raspberry-pie-filling-70 · Category: Pie Filling & Topping · SKU OLV0313
- Current description: "Vibrant raspberry filling with concentrated fruit content, used for premium pastry injections, cake fillings, or garnishing sophisticated dessert platters."

```yaml
id: product/acroyali-raspberry-pie-filling-70
name: Raspberry Pie Filling 70% (LOCKED)
status: draft
why: 50% and 70% pages are 70% identical
description: "Acroyali raspberry pie filling, the 70% version: a fruit-heavy filling with intense raspberry flavour for injecting into pastries, filling layer cakes and finishing plated desserts. The 50% version suits everyday baking."
sources: []
notes: ""
```

#### Red Cherry Pie Filling 50% — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-red-cherry-pie-filling-50 · Category: Pie Filling & Topping · SKU OLV0141
- Current description: "Tart red cherry fruit filling ideal for classic pies, black forest cakes, or as a decadent topping for waffles and crepes."

```yaml
id: product/acroyali-red-cherry-pie-filling-50
name: Red Cherry Pie Filling 50% (LOCKED)
status: draft
why: 50% and 70% pages are 70% identical
description: "Acroyali red cherry pie filling, the 50% version: tart cherries in a deep red glaze for classic cherry pies, black forest cakes, waffles and crêpes. The 70% version holds more cherries."
sources: []
notes: ""
```

#### Red Cherry Pie Filling 70% — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-red-cherry-pie-filling-70 · Category: Pie Filling & Topping · SKU OLV0311
- Current description: "Extra-rich red cherry filling with a high fruit ratio, perfect for gourmet tarts, cheesecakes, and specialty dessert fillings or toppings."

```yaml
id: product/acroyali-red-cherry-pie-filling-70
name: Red Cherry Pie Filling 70% (LOCKED)
status: draft
why: 50% and 70% pages are 70% identical
description: "Acroyali red cherry pie filling, the 70% version: a high-fruit cherry filling for lattice pies, cheesecake toppings and black forest cakes where whole cherries are the point. The 50% version suits everyday baking."
sources: []
notes: ""
```

#### Silver Sweetened Whipping Cream — Mavees

- Page: https://www.olivefoods.lk/products/silver-sweetened-whipping-cream · Category: Pie Filling & Topping, Chocolate & Pastry
- Current description: _empty_

```yaml
id: product/silver-sweetened-whipping-cream
name: Silver Sweetened Whipping Cream (LOCKED)
status: draft
why: No description
description: Mavee's Silver Sweetened Whipping Cream, a ready-sweetened cream that whips up for cake decoration, piping, fillings and desserts in bakeries, pastry kitchens and cafés.
sources: []
notes: What sets Silver apart from Smooth (sweetness, stability, pack, price tier)? One line each would let the two pages say something different.
```

#### Smooth Sweetened Whipping Cream — Mavees

- Page: https://www.olivefoods.lk/products/smooth-sweetened-whipping-cream · Category: Pie Filling & Topping, Chocolate & Pastry
- Current description: "Mavees Smooth Sweetened Whipping Cream"

```yaml
id: product/smooth-sweetened-whipping-cream
name: Smooth Sweetened Whipping Cream (LOCKED)
status: draft
why: Description only repeats the product name
description: Mavee's Smooth Sweetened Whipping Cream, a ready-sweetened cream that whips to a smooth, creamy finish for frosting cakes, filling pastries and topping desserts and drinks.
sources: []
notes: See Silver above.
```

#### Strawberry Pie Filling 50% — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-strawberry-pie-filling-50 · Category: Pie Filling & Topping · SKU OLV0143
- Current description: "Sweet strawberry fruit filling designed for use in traditional pies, sponges, or as a vibrant topping for various dessert applications."

```yaml
id: product/acroyali-strawberry-pie-filling-50
name: Strawberry Pie Filling 50% (LOCKED)
status: draft
why: 50% and 70% pages are 69% identical
description: "Acroyali strawberry pie filling, the 50% version: sweet strawberry filling for pies, sponge cakes, tarts and dessert toppings in everyday baking. The 70% version has more fruit and stronger flavour."
sources: []
notes: ""
```

#### Strawberry Pie Filling 70% — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-strawberry-pie-filling-70 · Category: Pie Filling & Topping · SKU OLV0310
- Current description: "Robust strawberry filling with a high fruit content, perfect for artisanal tarts, pastries, and premium bakery products requiring intense fruit flavor."

```yaml
id: product/acroyali-strawberry-pie-filling-70
name: Strawberry Pie Filling 70% (LOCKED)
status: draft
why: 50% and 70% pages are 69% identical
description: "Acroyali strawberry pie filling, the 70% version: a fruit-rich strawberry filling for artisan tarts, cheesecakes and premium pastries that need a strong strawberry flavour. The 50% version suits everyday baking."
sources: []
notes: ""
```

### Part B — all other products (148)

##### Canned Vegetables & Dried Fruits

#### Baked Beans — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-baked-beans · Category: Canned Vegetables & Dried Fruits · SKU OLV0133
- Current description: "Tender navy beans simmered in a savory tomato sauce, typically served as a breakfast side or a quick warm meal."

```yaml
id: product/acroyali-baked-beans
name: Baked Beans (LOCKED)
status: current
description: Tender navy beans simmered in a savory tomato sauce, typically served as a breakfast side or a quick warm meal.
sources: []
notes: ""
```

#### Black Olives Pitted — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-black-olives-pitted · Category: Canned Vegetables & Dried Fruits · SKU OLV0192
- Current description: "Pitted black olives featuring a rich, salty flavor for use in Mediterranean cooking, pizza toppings, salads, and vegetable stews."

```yaml
id: product/royal-arm-black-olives-pitted
name: Black Olives Pitted (LOCKED)
status: current
description: Pitted black olives featuring a rich, salty flavor for use in Mediterranean cooking, pizza toppings, salads, and vegetable stews.
sources: []
notes: ""
```

#### Black Olives Whole — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-black-olives-whole · Category: Canned Vegetables & Dried Fruits · SKU OLV0066
- Current description: "Whole black olives preserved in brine, suitable for Mediterranean salads, appetizer platters, or as a flavorful garnish for various savory dishes."

```yaml
id: product/royal-arm-black-olives-whole
name: Black Olives Whole (LOCKED)
status: current
description: Whole black olives preserved in brine, suitable for Mediterranean salads, appetizer platters, or as a flavorful garnish for various savory dishes.
sources: []
notes: ""
```

#### Black Olives Whole Tins — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-black-olives-whole-tins · Category: Canned Vegetables & Dried Fruits · SKU OLV0069
- Current description: "Canned whole black olives designed for bulk catering, perfect for garnishing platters or adding to authentic Mediterranean recipes."

```yaml
id: product/royal-arm-black-olives-whole-tins
name: Black Olives Whole Tins (LOCKED)
status: current
description: Canned whole black olives designed for bulk catering, perfect for garnishing platters or adding to authentic Mediterranean recipes.
sources: []
notes: ""
```

#### Capers

- Page: https://www.olivefoods.lk/products/generic-capers · Category: Canned Vegetables & Dried Fruits · SKU OLV0182
- Current description: "Brine-cured flower buds providing a salty, pungent flavor to pasta sauces, seafood dishes, salads, and classic Mediterranean garnishes."

```yaml
id: product/generic-capers
name: Capers (LOCKED)
status: current
description: Brine-cured flower buds providing a salty, pungent flavor to pasta sauces, seafood dishes, salads, and classic Mediterranean garnishes.
sources: []
notes: ""
```

#### Dark Sweet Pitted Cherry — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-dark-sweet-pitted-cherry · Category: Canned Vegetables & Dried Fruits · SKU OLV0152
- Current description: "Pitted dark sweet cherries in juice, ideal for filling pies, black forest cakes, or as a topping for yogurt and oats."

```yaml
id: product/acroyali-dark-sweet-pitted-cherry
name: Dark Sweet Pitted Cherry (LOCKED)
status: current
description: Pitted dark sweet cherries in juice, ideal for filling pies, black forest cakes, or as a topping for yogurt and oats.
sources: []
notes: ""
```

#### Fruit Cocktail — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-fruit-cocktail · Category: Canned Vegetables & Dried Fruits · SKU OLV0138
- Current description: "A mix of cubed tropical and temperate fruits in light syrup, ideal for desserts, fruit salads, or yogurt toppings."

```yaml
id: product/acroyali-fruit-cocktail
name: Fruit Cocktail (LOCKED)
status: current
description: A mix of cubed tropical and temperate fruits in light syrup, ideal for desserts, fruit salads, or yogurt toppings.
sources: []
notes: ""
```

#### Glace Cherries Red — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-glace-cherries-red · Category: Canned Vegetables & Dried Fruits · SKU OLV0315
- Current description: "Syrup-preserved glacé red cherries, commonly used as a decorative ingredient in fruitcakes, cookies, and traditional holiday baking."

```yaml
id: product/acroyali-glace-cherries-red
name: Glace Cherries Red (LOCKED)
status: current
description: Syrup-preserved glacé red cherries, commonly used as a decorative ingredient in fruitcakes, cookies, and traditional holiday baking.
sources: []
notes: ""
```

#### Lychees — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-lychees · Category: Canned Vegetables & Dried Fruits · SKU OLV0150
- Current description: "Sweet, peeled, and pitted lychees in heavy syrup, commonly served as a chilled dessert or used in tropical fruit cocktails."

```yaml
id: product/acroyali-lychees
name: Lychees (LOCKED)
status: current
description: Sweet, peeled, and pitted lychees in heavy syrup, commonly served as a chilled dessert or used in tropical fruit cocktails.
sources: []
notes: ""
```

#### Mushroom Sliced — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-mushroom-sliced · Category: Canned Vegetables & Dried Fruits · SKU OLV0164
- Current description: "Uniformly sliced white button mushrooms preserved in brine, suitable for pizza toppings, pasta sauces, and creamy vegetable stews."

```yaml
id: product/royal-arm-mushroom-sliced
name: Mushroom Sliced (LOCKED)
status: current
description: Uniformly sliced white button mushrooms preserved in brine, suitable for pizza toppings, pasta sauces, and creamy vegetable stews.
sources: []
notes: ""
```

#### Peach Halves — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-peach-halves · Category: Canned Vegetables & Dried Fruits · SKU OLV0136
- Current description: "Peeled yellow peach halves preserved in syrup, suitable for baking into cobblers, garnishing desserts, or serving with cream."

```yaml
id: product/acroyali-peach-halves
name: Peach Halves (LOCKED)
status: current
description: Peeled yellow peach halves preserved in syrup, suitable for baking into cobblers, garnishing desserts, or serving with cream.
sources: []
notes: ""
```

#### Pear Halves In Syrup — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-pear-halves-in-syrup · Category: Canned Vegetables & Dried Fruits · SKU OLV0137
- Current description: "Soft pear halves canned in sweet syrup, perfect for poaching, inclusion in fruit tarts, or as a simple dessert component."

```yaml
id: product/acroyali-pear-halves-in-syrup
name: Pear Halves In Syrup (LOCKED)
status: current
description: Soft pear halves canned in sweet syrup, perfect for poaching, inclusion in fruit tarts, or as a simple dessert component.
sources: []
notes: ""
```

#### Red Kidney Beans — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-red-kidney-beans · Category: Canned Vegetables & Dried Fruits · SKU OLV0153
- Current description: "Soft canned red kidney beans, widely utilized in hearty chili, cold bean salads, and traditional Mexican-style rice dishes."

```yaml
id: product/acroyali-red-kidney-beans
name: Red Kidney Beans (LOCKED)
status: current
description: Soft canned red kidney beans, widely utilized in hearty chili, cold bean salads, and traditional Mexican-style rice dishes.
sources: []
notes: ""
```

#### Straw Mushroom — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-straw-mushroom · Category: Canned Vegetables & Dried Fruits · SKU OLV0151
- Current description: "Canned straw mushrooms with a silky texture, commonly used in stir-fries, oriental soups, and savory vegetable clay pot dishes."

```yaml
id: product/acroyali-straw-mushroom
name: Straw Mushroom (LOCKED)
status: current
description: Canned straw mushrooms with a silky texture, commonly used in stir-fries, oriental soups, and savory vegetable clay pot dishes.
sources: []
notes: ""
```

#### Sweet Corn Cream Style — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-sweet-corn-cream-style · Category: Canned Vegetables & Dried Fruits · SKU OLV0124
- Current description: "Sweet corn kernels prepared in a thick, creamy sauce, used for making soups, side dishes, and various savory baked recipes."

```yaml
id: product/acroyali-sweet-corn-cream-style
name: Sweet Corn Cream Style (LOCKED)
status: current
description: Sweet corn kernels prepared in a thick, creamy sauce, used for making soups, side dishes, and various savory baked recipes.
sources: []
notes: ""
```

#### Sweet Corn Kernel — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-sweet-corn-kernel · Category: Canned Vegetables & Dried Fruits · SKU OLV0129
- Current description: "Whole golden sweet corn kernels packed in brine, suitable for salads, soups, side dishes, and various Tex-Mex culinary preparations."

```yaml
id: product/acroyali-sweet-corn-kernel
name: Sweet Corn Kernel (LOCKED)
status: current
description: Whole golden sweet corn kernels packed in brine, suitable for salads, soups, side dishes, and various Tex-Mex culinary preparations.
sources: []
notes: ""
```

#### Whole Mushroom — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-whole-mushroom · Category: Canned Vegetables & Dried Fruits · SKU OLV0116
- Current description: "Whole preserved mushrooms suitable for use in sauces, stews, stir-fries, and as a topping for various continental meat dishes."

```yaml
id: product/acroyali-whole-mushroom
name: Whole Mushroom (LOCKED)
status: current
description: Whole preserved mushrooms suitable for use in sauces, stews, stir-fries, and as a topping for various continental meat dishes.
sources: []
notes: ""
```

#### Young Corn — Acroyali

- Page: https://www.olivefoods.lk/products/acroyali-young-corn · Category: Canned Vegetables & Dried Fruits · SKU OLV0125
- Current description: "Tender young corn spears frequently utilized in Asian stir-fry dishes, vegetable salads, and as a decorative garnish for savory platters."

```yaml
id: product/acroyali-young-corn
name: Young Corn (LOCKED)
status: current
description: Tender young corn spears frequently utilized in Asian stir-fry dishes, vegetable salads, and as a decorative garnish for savory platters.
sources: []
notes: ""
```

##### Chocolate & Pastry

#### Almond Milk

- Page: https://www.olivefoods.lk/products/generic-almond-milk · Category: Chocolate & Pastry · SKU OLV0052
- Current description: "Plant-based dairy alternative made from almonds, suitable for vegan baking, coffee beverages, smoothies, or as a substitute in creamy recipes."

```yaml
id: product/generic-almond-milk
name: Almond Milk (LOCKED)
status: current
description: Plant-based dairy alternative made from almonds, suitable for vegan baking, coffee beverages, smoothies, or as a substitute in creamy recipes.
sources: []
notes: ""
```

#### Almond Paste

- Page: https://www.olivefoods.lk/products/generic-almond-paste · Category: Chocolate & Pastry · SKU OLV0170
- Current description: "Smooth blend of ground almonds and sugar, used for filling pastries, flavoring cakes, or as a base for making almond-flavored creams."

```yaml
id: product/generic-almond-paste
name: Almond Paste (LOCKED)
status: current
description: Smooth blend of ground almonds and sugar, used for filling pastries, flavoring cakes, or as a base for making almond-flavored creams.
sources: []
notes: ""
```

#### Cocoa Butter

- Page: https://www.olivefoods.lk/products/generic-cocoa-butter · Category: Chocolate & Pastry · SKU OLV0173
- Current description: "Edible vegetable fat extracted from cocoa beans, used for thinning chocolate, making pralines, and providing a smooth texture to high-end desserts."

```yaml
id: product/generic-cocoa-butter
name: Cocoa Butter (LOCKED)
status: current
description: Edible vegetable fat extracted from cocoa beans, used for thinning chocolate, making pralines, and providing a smooth texture to high-end desserts.
sources: []
notes: ""
```

#### Cocoa Powder

- Page: https://www.olivefoods.lk/products/generic-cocoa-powder · Category: Chocolate & Pastry · SKU OLV0191
- Current description: "Fine unsweetened cocoa powder used for flavoring cakes, dusting desserts, or creating rich chocolate sauces for various pastry applications."

```yaml
id: product/generic-cocoa-powder
name: Cocoa Powder (LOCKED)
status: current
description: Fine unsweetened cocoa powder used for flavoring cakes, dusting desserts, or creating rich chocolate sauces for various pastry applications.
sources: []
notes: ""
```

#### Instant Dry Yeast

- Page: https://www.olivefoods.lk/products/generic-instant-dry-yeast · Category: Chocolate & Pastry · SKU OLV0050
- Current description: "Fine granulated leavening agent used for fermenting doughs in bread making, pizza crusts, and various sweet or savory yeast-raised pastries."

```yaml
id: product/generic-instant-dry-yeast
name: Instant Dry Yeast (LOCKED)
status: current
description: Fine granulated leavening agent used for fermenting doughs in bread making, pizza crusts, and various sweet or savory yeast-raised pastries.
sources: []
notes: ""
```

#### Praline Cream

- Page: https://www.olivefoods.lk/products/generic-praline-cream · Category: Chocolate & Pastry · SKU OLV0172
- Current description: "Rich and creamy nut-based spread utilized as a decadent filling for chocolates, pastries, cakes, and various gourmet dessert applications."

```yaml
id: product/generic-praline-cream
name: Praline Cream (LOCKED)
status: current
description: Rich and creamy nut-based spread utilized as a decadent filling for chocolates, pastries, cakes, and various gourmet dessert applications.
sources: []
notes: ""
```

#### Rice Paper 22Cm

- Page: https://www.olivefoods.lk/products/generic-rice-paper-22cm · Category: Chocolate & Pastry · SKU OLV0163 · Pack: 22 cm
- Current description: "Translucent edible sheets made from rice, primarily used for wrapping fresh spring rolls or creating decorative elements in pastry displays."

```yaml
id: product/generic-rice-paper-22cm
name: Rice Paper 22Cm (LOCKED)
status: current
description: Translucent edible sheets made from rice, primarily used for wrapping fresh spring rolls or creating decorative elements in pastry displays.
sources: []
notes: ""
```

##### Dry Nuts, Seeds & Dried Fruits

#### Almond Nut Whole

- Page: https://www.olivefoods.lk/products/generic-almond-nut-whole · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0114
- Current description: "Whole raw almonds suitable for snacking, baking, or grinding into pastes for various confectionery and savory applications."

```yaml
id: product/generic-almond-nut-whole
name: Almond Nut Whole (LOCKED)
status: current
description: Whole raw almonds suitable for snacking, baking, or grinding into pastes for various confectionery and savory applications.
sources: []
notes: ""
```

#### Almond Powder

- Page: https://www.olivefoods.lk/products/generic-almond-powder · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0078
- Current description: "Finely ground blanched almonds used as a flour substitute in gluten-free baking or as a thickener for sauces."

```yaml
id: product/generic-almond-powder
name: Almond Powder (LOCKED)
status: current
description: Finely ground blanched almonds used as a flour substitute in gluten-free baking or as a thickener for sauces.
sources: []
notes: ""
```

#### Almond Slice

- Page: https://www.olivefoods.lk/products/generic-almond-slice · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0039
- Current description: "Thinly sliced almond flakes ideal for garnishing baked goods, breakfast cereals, and providing texture to salads."

```yaml
id: product/generic-almond-slice
name: Almond Slice (LOCKED)
status: current
description: Thinly sliced almond flakes ideal for garnishing baked goods, breakfast cereals, and providing texture to salads.
sources: []
notes: ""
```

#### Dried Apricots

- Page: https://www.olivefoods.lk/products/generic-dried-apricots · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0040
- Current description: "Naturally sweet dried apricots used in baking, fruit compotes, or served as a nutritious addition to cheese platters."

```yaml
id: product/generic-dried-apricots
name: Dried Apricots (LOCKED)
status: current
description: Naturally sweet dried apricots used in baking, fruit compotes, or served as a nutritious addition to cheese platters.
sources: []
notes: ""
```

#### Pecan Nuts

- Page: https://www.olivefoods.lk/products/generic-pecan-nuts · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0291
- Current description: "Buttery and crisp tree nuts frequently used in classic pies, dessert toppings, salads, or as a crunchy addition to savory poultry dishes."

```yaml
id: product/generic-pecan-nuts
name: Pecan Nuts (LOCKED)
status: current
description: Buttery and crisp tree nuts frequently used in classic pies, dessert toppings, salads, or as a crunchy addition to savory poultry dishes.
sources: []
notes: ""
```

#### Pine Nuts

- Page: https://www.olivefoods.lk/products/generic-pine-nuts · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0292
- Current description: "Small ivory seeds with a delicate buttery flavor, essential for making pesto, garnishing salads, or enhancing Mediterranean and Middle Eastern dishes."

```yaml
id: product/generic-pine-nuts
name: Pine Nuts (LOCKED)
status: current
description: Small ivory seeds with a delicate buttery flavor, essential for making pesto, garnishing salads, or enhancing Mediterranean and Middle Eastern dishes.
sources: []
notes: ""
```

#### Pumpkin Seed Kernels

- Page: https://www.olivefoods.lk/products/generic-pumpkin-seed-kernels · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0041
- Current description: "Shelled pumpkin seeds with a nutty flavor, perfect for roasting, baking, or garnishing soups and healthy salads."

```yaml
id: product/generic-pumpkin-seed-kernels
name: Pumpkin Seed Kernels (LOCKED)
status: current
description: Shelled pumpkin seeds with a nutty flavor, perfect for roasting, baking, or garnishing soups and healthy salads.
sources: []
notes: ""
```

#### Quinoa Black

- Page: https://www.olivefoods.lk/products/generic-quinoa-black · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0281
- Current description: "Nutritious dark seeds with a firm texture and earthy flavor, perfect for adding visual contrast to salads, bowls, and hearty side dishes."

```yaml
id: product/generic-quinoa-black
name: Quinoa Black (LOCKED)
status: current
description: Nutritious dark seeds with a firm texture and earthy flavor, perfect for adding visual contrast to salads, bowls, and hearty side dishes.
sources: []
notes: ""
```

#### Quinoa White

- Page: https://www.olivefoods.lk/products/generic-quinoa-white · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0265
- Current description: "Small gluten-free grains with a mild flavor, used as a protein-rich base for salads, side dishes, or as a rice substitute."

```yaml
id: product/generic-quinoa-white
name: Quinoa White (LOCKED)
status: current
description: Small gluten-free grains with a mild flavor, used as a protein-rich base for salads, side dishes, or as a rice substitute.
sources: []
notes: ""
```

#### Sultanas

- Page: https://www.olivefoods.lk/products/generic-sultanas · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0042
- Current description: "Sweet dried seedless grapes commonly used in baking, breakfast cereals, salads, or as a versatile ingredient for savory Mediterranean dishes."

```yaml
id: product/generic-sultanas
name: Sultanas (LOCKED)
status: current
description: Sweet dried seedless grapes commonly used in baking, breakfast cereals, salads, or as a versatile ingredient for savory Mediterranean dishes.
sources: []
notes: ""
```

#### Sunflower Seed Kernels

- Page: https://www.olivefoods.lk/products/generic-sunflower-seed-kernels · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0043
- Current description: "Mildly nutty hulled seeds ideal for adding crunch to salads, baked goods, granolas, or used as a nutritious topping for yogurt."

```yaml
id: product/generic-sunflower-seed-kernels
name: Sunflower Seed Kernels (LOCKED)
status: current
description: Mildly nutty hulled seeds ideal for adding crunch to salads, baked goods, granolas, or used as a nutritious topping for yogurt.
sources: []
notes: ""
```

#### Walnut Halves

- Page: https://www.olivefoods.lk/products/generic-walnut-halves · Category: Dry Nuts, Seeds & Dried Fruits · SKU OLV0044
- Current description: "Rich, earthy nut halves suitable for baking into cakes, tossing in salads, or incorporating into gourmet cheese platters and savory stuffings."

```yaml
id: product/generic-walnut-halves
name: Walnut Halves (LOCKED)
status: current
description: Rich, earthy nut halves suitable for baking into cakes, tossing in salads, or incorporating into gourmet cheese platters and savory stuffings.
sources: []
notes: ""
```

##### Edible Oils

#### Olive Oil Pomace PET — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-olive-oil-pomace-pet · Category: Edible Oils · SKU OLV0027
- Current description: "Extracted olive pomace oil designed for commercial frying and cooking where a mild flavor profile is required."

```yaml
id: product/royal-arm-olive-oil-pomace-pet
name: Olive Oil Pomace PET (LOCKED)
status: current
description: Extracted olive pomace oil designed for commercial frying and cooking where a mild flavor profile is required.
sources: []
notes: ""
```

#### Royal Arm Extra Virgin Olive Oil 1 Gal — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-royal-arm-extra-virgin-olive-oil-1-gal · Category: Edible Oils · SKU OLV0285 · Pack: 1 gal
- Current description: "High-quality extra virgin olive oil ideal for dressing salads, dipping bread, and enhancing the flavor of Mediterranean dishes."

```yaml
id: product/royal-arm-royal-arm-extra-virgin-olive-oil-1-gal
name: Royal Arm Extra Virgin Olive Oil 1 Gal (LOCKED)
status: current
description: High-quality extra virgin olive oil ideal for dressing salads, dipping bread, and enhancing the flavor of Mediterranean dishes.
sources: []
notes: ""
```

#### Sesame Oil Blended — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-sesame-oil-blended · Category: Edible Oils · SKU OLV0029
- Current description: "Aromatic blended sesame oil used as a flavor enhancer in stir-fries, marinades, and traditional Asian dipping sauces."

```yaml
id: product/royal-arm-sesame-oil-blended
name: Sesame Oil Blended (LOCKED)
status: current
description: Aromatic blended sesame oil used as a flavor enhancer in stir-fries, marinades, and traditional Asian dipping sauces.
sources: []
notes: ""
```

#### Sunflower Oil

- Page: https://www.olivefoods.lk/products/generic-sunflower-oil · Category: Edible Oils · SKU OLV0290
- Current description: "Multipurpose plant-based oil extracted from sunflower seeds, commonly used for everyday frying and various culinary preparations."

```yaml
id: product/generic-sunflower-oil
name: Sunflower Oil (LOCKED)
status: current
description: Multipurpose plant-based oil extracted from sunflower seeds, commonly used for everyday frying and various culinary preparations.
sources: []
notes: ""
```

##### Flour

#### Corn Flour 

- Page: https://www.olivefoods.lk/products/generic-corn-flour-bulk · Category: Flour · SKU OLV0105
- Current description: "Finely milled corn flour used as a thickening agent for sauces, breading for frying, or as a base for tortillas."

```yaml
id: product/generic-corn-flour-bulk
name: Corn Flour  (LOCKED)
status: current
description: Finely milled corn flour used as a thickening agent for sauces, breading for frying, or as a base for tortillas.
sources: []
notes: ""
```

#### Gluten Free Bread Flour/Mix

- Page: https://www.olivefoods.lk/products/generic-gluten-free-bread-flour-mix · Category: Flour · SKU OLV0176
- Current description: "Specially formulated blend of gluten-free grains and starches used to bake bread, rolls, and various crusts for dietary restricted menus."

```yaml
id: product/generic-gluten-free-bread-flour-mix
name: Gluten Free Bread Flour/Mix (LOCKED)
status: current
description: Specially formulated blend of gluten-free grains and starches used to bake bread, rolls, and various crusts for dietary restricted menus.
sources: []
notes: ""
```

##### Frozen French Fries

#### Frozen French Fries 9Mm — Hungritos

- Page: https://www.olivefoods.lk/products/hungritos-frozen-french-fries-9mm · Category: Frozen French Fries · SKU OLV0202 · Pack: 9 mm
- Current description: "Golden potato fries with a consistent 9mm cut, providing a balanced texture for side dishes and casual dining appetizers."

```yaml
id: product/hungritos-frozen-french-fries-9mm
name: Frozen French Fries 9Mm (LOCKED)
status: current
description: Golden potato fries with a consistent 9mm cut, providing a balanced texture for side dishes and casual dining appetizers.
sources: []
notes: ""
```

#### Frozen French Fries Shoes Strings Coated 7Mm — Hungritos

- Page: https://www.olivefoods.lk/products/hungritos-frozen-french-fries-shoes-strings-coated-7mm · Category: Frozen French Fries · SKU OLV0200 · Pack: 7 mm
- Current description: "Extra-thin shoestring fries with a crunchy exterior coating, perfect for serving alongside gourmet burgers and fried seafood baskets."

```yaml
id: product/hungritos-frozen-french-fries-shoes-strings-coated-7mm
name: Frozen French Fries Shoes Strings Coated 7Mm (LOCKED)
status: current
description: Extra-thin shoestring fries with a crunchy exterior coating, perfect for serving alongside gourmet burgers and fried seafood baskets.
sources: []
notes: ""
```

##### Frozen Fruit Puree

#### Frozen Coconut Puree — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-coconut-puree · Category: Frozen Fruit Puree · SKU OLV0363
- Current description: "Creamy frozen coconut puree formulated for use in tropical beverages, curries, dairy-free desserts, and aromatic pastry applications."

```yaml
id: product/dira-frozen-coconut-puree
name: Frozen Coconut Puree (LOCKED)
status: current
description: Creamy frozen coconut puree formulated for use in tropical beverages, curries, dairy-free desserts, and aromatic pastry applications.
sources: []
notes: ""
```

#### Frozen Lemon Puree — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-lemon-puree · Category: Frozen Fruit Puree · SKU OLV0359
- Current description: "Zesty frozen lemon puree providing concentrated citrus flavor for tarts, sorbets, marinades, and enhancing various seafood or poultry dishes."

```yaml
id: product/dira-frozen-lemon-puree
name: Frozen Lemon Puree (LOCKED)
status: current
description: Zesty frozen lemon puree providing concentrated citrus flavor for tarts, sorbets, marinades, and enhancing various seafood or poultry dishes.
sources: []
notes: ""
```

#### Frozen Mango Puree — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-mango-puree · Category: Frozen Fruit Puree · SKU OLV0360
- Current description: "Tropical frozen mango puree perfect for blending into smoothies, ice creams, exotic sauces, and authentic Southeast Asian dessert recipes."

```yaml
id: product/dira-frozen-mango-puree
name: Frozen Mango Puree (LOCKED)
status: current
description: Tropical frozen mango puree perfect for blending into smoothies, ice creams, exotic sauces, and authentic Southeast Asian dessert recipes.
sources: []
notes: ""
```

#### Frozen Passion Fruit Puree — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-passion-fruit-puree · Category: Frozen Fruit Puree · SKU OLV0361
- Current description: "Tangy frozen passion fruit puree with intense aroma frequently used in cocktails, tropical glazes, mousses, and refreshing sorbets."

```yaml
id: product/dira-frozen-passion-fruit-puree
name: Frozen Passion Fruit Puree (LOCKED)
status: current
description: Tangy frozen passion fruit puree with intense aroma frequently used in cocktails, tropical glazes, mousses, and refreshing sorbets.
sources: []
notes: ""
```

#### Frozen Raspberry Puree — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-raspberry-puree · Category: Frozen Fruit Puree · SKU OLV0358
- Current description: "Seedless frozen raspberry puree ideal for flavoring vinaigrettes, dessert sauces, coulis, and high-quality pastry fillings or frozen treats."

```yaml
id: product/dira-frozen-raspberry-puree
name: Frozen Raspberry Puree (LOCKED)
status: current
description: Seedless frozen raspberry puree ideal for flavoring vinaigrettes, dessert sauces, coulis, and high-quality pastry fillings or frozen treats.
sources: []
notes: ""
```

#### Frozen Strawberry Puree — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-strawberry-puree · Category: Frozen Fruit Puree · SKU OLV0362
- Current description: "Smooth frozen strawberry puree used to create fruit mousses, sorbets, cocktails, and colorful drizzles for various pastry presentations."

```yaml
id: product/dira-frozen-strawberry-puree
name: Frozen Strawberry Puree (LOCKED)
status: current
description: Smooth frozen strawberry puree used to create fruit mousses, sorbets, cocktails, and colorful drizzles for various pastry presentations.
sources: []
notes: ""
```

##### Frozen Meat

#### Beef Pepperoni

- Page: https://www.olivefoods.lk/products/generic-beef-pepperoni · Category: Frozen Meat · SKU OLV0167
- Current description: "Cured and seasoned beef sausage slices typically used as a savory topping for pizzas and sandwich fillings."

```yaml
id: product/generic-beef-pepperoni
name: Beef Pepperoni (LOCKED)
status: current
description: Cured and seasoned beef sausage slices typically used as a savory topping for pizzas and sandwich fillings.
sources: []
notes: ""
```

#### Beef Short Rib

- Page: https://www.olivefoods.lk/products/generic-beef-short-rib · Category: Frozen Meat · SKU OLV0089
- Current description: "Flavorful beef cut with bones, best suited for slow braising or barbecue smoking to achieve tender results."

```yaml
id: product/generic-beef-short-rib
name: Beef Short Rib (LOCKED)
status: current
description: Flavorful beef cut with bones, best suited for slow braising or barbecue smoking to achieve tender results.
sources: []
notes: ""
```

#### Beef Striploin

- Page: https://www.olivefoods.lk/products/generic-beef-striploin · Category: Frozen Meat · SKU OLV0227
- Current description: "Premium beef cut from the short loin, commonly used for grilling or pan-searing as high-quality steaks."

```yaml
id: product/generic-beef-striploin
name: Beef Striploin (LOCKED)
status: current
description: Premium beef cut from the short loin, commonly used for grilling or pan-searing as high-quality steaks.
sources: []
notes: ""
```

#### Beef Tenderloin

- Page: https://www.olivefoods.lk/products/generic-beef-tenderloin · Category: Frozen Meat · SKU OLV0086
- Current description: "Lean and tender beef cut ideal for roasting whole or slicing into premium steaks for quick searing."

```yaml
id: product/generic-beef-tenderloin
name: Beef Tenderloin (LOCKED)
status: current
description: Lean and tender beef cut ideal for roasting whole or slicing into premium steaks for quick searing.
sources: []
notes: ""
```

#### Beef Topside

- Page: https://www.olivefoods.lk/products/generic-beef-topside · Category: Frozen Meat · SKU OLV0083
- Current description: "Lean beef cut from the hindquarter, primarily used for slow roasting, pot roasting, or slicing into thin steaks."

```yaml
id: product/generic-beef-topside
name: Beef Topside (LOCKED)
status: current
description: Lean beef cut from the hindquarter, primarily used for slow roasting, pot roasting, or slicing into thin steaks.
sources: []
notes: ""
```

#### Lamb Rack Frenched Cap Off

- Page: https://www.olivefoods.lk/products/generic-lamb-rack-frenched-cap-off · Category: Frozen Meat · SKU OLV0092
- Current description: "Trimmed lamb rib roast with exposed bones, ideal for elegant roasting or cutting into individual lamb cutlets."

```yaml
id: product/generic-lamb-rack-frenched-cap-off
name: Lamb Rack Frenched Cap Off (LOCKED)
status: current
description: Trimmed lamb rib roast with exposed bones, ideal for elegant roasting or cutting into individual lamb cutlets.
sources: []
notes: ""
```

##### Frozen Potato Products

#### Frozen Hash Brown Potato — Hungritos

- Page: https://www.olivefoods.lk/products/hungritos-frozen-hash-brown-potato · Category: Frozen Potato Products · SKU OLV0199
- Current description: "Pre-formed shredded potato patties, perfect for a traditional breakfast accompaniment or a crispy side dish for various meals."

```yaml
id: product/hungritos-frozen-hash-brown-potato
name: Frozen Hash Brown Potato (LOCKED)
status: current
description: Pre-formed shredded potato patties, perfect for a traditional breakfast accompaniment or a crispy side dish for various meals.
sources: []
notes: ""
```

#### Frozen Potato Wedges — Hungritos

- Page: https://www.olivefoods.lk/products/hungritos-frozen-potato-wedges · Category: Frozen Potato Products · SKU OLV0203
- Current description: "Thick-cut potato wedges with a fluffy interior, suitable for roasting or frying as a hearty side or appetizer."

```yaml
id: product/hungritos-frozen-potato-wedges
name: Frozen Potato Wedges (LOCKED)
status: current
description: Thick-cut potato wedges with a fluffy interior, suitable for roasting or frying as a hearty side or appetizer.
sources: []
notes: ""
```

##### Frozen Vegetables & Fruits

#### Frozen Blackcurrant — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-blackcurrant · Category: Frozen Vegetables & Fruits · SKU OLV0366
- Current description: "Deeply flavored frozen blackcurrants excellent for preparing rich syrups, jams, tarts, and enhancing the color of various dessert recipes."

```yaml
id: product/dira-frozen-blackcurrant
name: Frozen Blackcurrant (LOCKED)
status: current
description: Deeply flavored frozen blackcurrants excellent for preparing rich syrups, jams, tarts, and enhancing the color of various dessert recipes.
sources: []
notes: ""
```

#### Frozen Blueberry — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-blueberry · Category: Frozen Vegetables & Fruits · SKU OLV0368
- Current description: "Sweet frozen blueberries utilized for making breakfast muffins, pancakes, smoothies, and as a topping for yogurt or oatmeal bowls."

```yaml
id: product/dira-frozen-blueberry
name: Frozen Blueberry (LOCKED)
status: current
description: Sweet frozen blueberries utilized for making breakfast muffins, pancakes, smoothies, and as a topping for yogurt or oatmeal bowls.
sources: []
notes: ""
```

#### Frozen Broccoli — Damaco

- Page: https://www.olivefoods.lk/products/damaco-frozen-broccoli · Category: Frozen Vegetables & Fruits · SKU OLV0369
- Current description: "Flash-frozen green broccoli florets that maintain texture when used in stir-fries, pasta dishes, or as a nutritious steamed side."

```yaml
id: product/damaco-frozen-broccoli
name: Frozen Broccoli (LOCKED)
status: current
description: Flash-frozen green broccoli florets that maintain texture when used in stir-fries, pasta dishes, or as a nutritious steamed side.
sources: []
notes: ""
```

#### Frozen Brussels Sprouts — Damaco

- Page: https://www.olivefoods.lk/products/damaco-frozen-brussels-sprouts · Category: Frozen Vegetables & Fruits · SKU OLV0356
- Current description: "Whole frozen Brussels sprouts ideal for roasting with seasonings, sautéing with savory ingredients, or adding to hearty vegetable stews."

```yaml
id: product/damaco-frozen-brussels-sprouts
name: Frozen Brussels Sprouts (LOCKED)
status: current
description: Whole frozen Brussels sprouts ideal for roasting with seasonings, sautéing with savory ingredients, or adding to hearty vegetable stews.
sources: []
notes: ""
```

#### Frozen Cauliflower — Damaco

- Page: https://www.olivefoods.lk/products/damaco-frozen-cauliflower · Category: Frozen Vegetables & Fruits · SKU OLV0357
- Current description: "Individually quick-frozen cauliflower florets suitable for steaming, roasting, or blending into soups and low-carb side dishes."

```yaml
id: product/damaco-frozen-cauliflower
name: Frozen Cauliflower (LOCKED)
status: current
description: Individually quick-frozen cauliflower florets suitable for steaming, roasting, or blending into soups and low-carb side dishes.
sources: []
notes: ""
```

#### Frozen Cranberry — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-cranberry · Category: Frozen Vegetables & Fruits · SKU OLV0365
- Current description: "Firm frozen cranberries providing a sharp flavor for sauces, relishes, muffins, and adding a seasonal touch to savory meat dishes."

```yaml
id: product/dira-frozen-cranberry
name: Frozen Cranberry (LOCKED)
status: current
description: Firm frozen cranberries providing a sharp flavor for sauces, relishes, muffins, and adding a seasonal touch to savory meat dishes.
sources: []
notes: ""
```

#### Frozen Green Peas — Damaco

- Page: https://www.olivefoods.lk/products/damaco-frozen-green-peas · Category: Frozen Vegetables & Fruits · SKU OLV0354
- Current description: "Tender frozen sweet green peas harvested at peak ripeness for use in salads, soups, fried rice, and traditional side dishes."

```yaml
id: product/damaco-frozen-green-peas
name: Frozen Green Peas (LOCKED)
status: current
description: Tender frozen sweet green peas harvested at peak ripeness for use in salads, soups, fried rice, and traditional side dishes.
sources: []
notes: ""
```

#### Frozen Raspberry — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-raspberry · Category: Frozen Vegetables & Fruits · SKU OLV0367
- Current description: "Whole frozen raspberries prepared for use in smoothies, dessert toppings, baking batters, or cooked down into vibrant fruit preserves."

```yaml
id: product/dira-frozen-raspberry
name: Frozen Raspberry (LOCKED)
status: current
description: Whole frozen raspberries prepared for use in smoothies, dessert toppings, baking batters, or cooked down into vibrant fruit preserves.
sources: []
notes: ""
```

#### Frozen Red Currant — Dira

- Page: https://www.olivefoods.lk/products/dira-frozen-red-currant · Category: Frozen Vegetables & Fruits · SKU OLV0364
- Current description: "Tart frozen red currants perfect for making decorative garnishes, fruit sauces, jellies, and adding acidity to various baked goods."

```yaml
id: product/dira-frozen-red-currant
name: Frozen Red Currant (LOCKED)
status: current
description: Tart frozen red currants perfect for making decorative garnishes, fruit sauces, jellies, and adding acidity to various baked goods.
sources: []
notes: ""
```

#### Mixed Veg 3 Way — Damaco

- Page: https://www.olivefoods.lk/products/damaco-mixed-veg-3-way · Category: Frozen Vegetables & Fruits · SKU OLV0355
- Current description: "A versatile blend of frozen peas, carrots, and corn used for preparing quick stir-fries, aromatic rice pilafs, or vegetable soups."

```yaml
id: product/damaco-mixed-veg-3-way
name: Mixed Veg 3 Way (LOCKED)
status: current
description: A versatile blend of frozen peas, carrots, and corn used for preparing quick stir-fries, aromatic rice pilafs, or vegetable soups.
sources: []
notes: ""
```

##### Herbs & Spices

#### Basil Shredded

- Page: https://www.olivefoods.lk/products/generic-basil-shredded · Category: Herbs & Spices · SKU OLV0294
- Current description: "Dried shredded basil leaves perfect for seasoning pasta sauces, vinaigrettes, and Mediterranean-inspired soups or herb-crusted poultry and fish dishes."

```yaml
id: product/generic-basil-shredded
name: Basil Shredded (LOCKED)
status: current
description: Dried shredded basil leaves perfect for seasoning pasta sauces, vinaigrettes, and Mediterranean-inspired soups or herb-crusted poultry and fish dishes.
sources: []
notes: ""
```

#### Bay Leaves Whole

- Page: https://www.olivefoods.lk/products/generic-bay-leaves-whole · Category: Herbs & Spices · SKU OLV0119
- Current description: "Whole dried bay leaves used to infuse deep herbal flavor into slow-cooked stocks, stews, sauces, and braised vegetable or meat dishes."

```yaml
id: product/generic-bay-leaves-whole
name: Bay Leaves Whole (LOCKED)
status: current
description: Whole dried bay leaves used to infuse deep herbal flavor into slow-cooked stocks, stews, sauces, and braised vegetable or meat dishes.
sources: []
notes: ""
```

#### Oregano Leaves Shredded

- Page: https://www.olivefoods.lk/products/generic-oregano-leaves-shredded · Category: Herbs & Spices · SKU OLV0117
- Current description: "Dried shredded oregano leaves commonly used to season Mediterranean dishes, pizza sauces, grilled meats, and various Italian-style culinary preparations."

```yaml
id: product/generic-oregano-leaves-shredded
name: Oregano Leaves Shredded (LOCKED)
status: current
description: Dried shredded oregano leaves commonly used to season Mediterranean dishes, pizza sauces, grilled meats, and various Italian-style culinary preparations.
sources: []
notes: ""
```

#### Rosemary Chopped

- Page: https://www.olivefoods.lk/products/generic-rosemary-chopped · Category: Herbs & Spices · SKU OLV0121
- Current description: "Fragrant chopped rosemary needles ideal for seasoning roasted lamb, potatoes, and savory breads or infusing oils and herb-based butter blends."

```yaml
id: product/generic-rosemary-chopped
name: Rosemary Chopped (LOCKED)
status: current
description: Fragrant chopped rosemary needles ideal for seasoning roasted lamb, potatoes, and savory breads or infusing oils and herb-based butter blends.
sources: []
notes: ""
```

#### Sumac Powder

- Page: https://www.olivefoods.lk/products/generic-sumac-powder · Category: Herbs & Spices · SKU OLV0349
- Current description: "A tart, citrusy spice ground from dried berries, utilized to add a tangy finish to Mediterranean salads, grilled meats, and kebabs."

```yaml
id: product/generic-sumac-powder
name: Sumac Powder (LOCKED)
status: current
description: A tart, citrusy spice ground from dried berries, utilized to add a tangy finish to Mediterranean salads, grilled meats, and kebabs.
sources: []
notes: ""
```

#### Thyme Leaves Shredded

- Page: https://www.olivefoods.lk/products/generic-thyme-leaves-shredded · Category: Herbs & Spices · SKU OLV0118
- Current description: "Dried shredded thyme leaves providing an earthy aroma for soups, stews, roasted vegetables, and a variety of poultry and meat seasonings."

```yaml
id: product/generic-thyme-leaves-shredded
name: Thyme Leaves Shredded (LOCKED)
status: current
description: Dried shredded thyme leaves providing an earthy aroma for soups, stews, roasted vegetables, and a variety of poultry and meat seasonings.
sources: []
notes: ""
```

##### Honey

#### Honey — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-honey · Category: Honey · SKU OLV0007
- Current description: "Natural golden sweetener derived from floral nectar, ideal for drizzling over desserts or balancing flavors in savory sauces and glazes."

```yaml
id: product/royal-arm-honey
name: Honey (LOCKED)
status: current
description: Natural golden sweetener derived from floral nectar, ideal for drizzling over desserts or balancing flavors in savory sauces and glazes.
sources: []
notes: ""
```

#### Honey 1Kg — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-honey-1kg · Category: Honey · SKU OLV0006 · Pack: 1 kg
- Current description: "Pure liquid honey with a smooth consistency, used as a natural sweetener for beverages, baking, marinades, and breakfast items."

```yaml
id: product/royal-arm-honey-1kg
name: Honey 1Kg (LOCKED)
status: current
description: Pure liquid honey with a smooth consistency, used as a natural sweetener for beverages, baking, marinades, and breakfast items.
sources: []
notes: ""
```

##### Imported Cheese

#### Cheddar Cheese Coloured 50% — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-cheddar-cheese-coloured-50 · Category: Imported Cheese · SKU OLV0325
- Current description: "Vibrant orange-hued cow's milk cheese with a firm texture, commonly utilized for colorful burgers, macaroni and cheese, and wraps."

```yaml
id: product/daily-dairy-cheddar-cheese-coloured-50
name: Cheddar Cheese Coloured 50% (LOCKED)
status: current
description: Vibrant orange-hued cow's milk cheese with a firm texture, commonly utilized for colorful burgers, macaroni and cheese, and wraps.
sources: []
notes: ""
```

#### Cheddar Cheese White 50% — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-cheddar-cheese-white-50 · Category: Imported Cheese · SKU OLV0261
- Current description: "Firm and sharp white cheddar cheese, frequently used for shredding over soups, layering in sandwiches, or enhancing savory recipes."

```yaml
id: product/daily-dairy-cheddar-cheese-white-50
name: Cheddar Cheese White 50% (LOCKED)
status: current
description: Firm and sharp white cheddar cheese, frequently used for shredding over soups, layering in sandwiches, or enhancing savory recipes.
sources: []
notes: ""
```

#### Comte Cheese — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-comte-cheese · Category: Imported Cheese · SKU OLV0324
- Current description: "Semi-hard French cow's milk cheese with a nutty profile, suitable for fondue, gourmet sandwiches, and elegant cheese platters."

```yaml
id: product/daily-dairy-comte-cheese
name: Comte Cheese (LOCKED)
status: current
description: Semi-hard French cow's milk cheese with a nutty profile, suitable for fondue, gourmet sandwiches, and elegant cheese platters.
sources: []
notes: ""
```

#### Edam Cheese 40% — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-edam-cheese-40 · Category: Imported Cheese · SKU OLV0330
- Current description: "Supple and mild Dutch cheese with a lower fat content, typically used for snacking, cold cut platters, and baking."

```yaml
id: product/daily-dairy-edam-cheese-40
name: Edam Cheese 40% (LOCKED)
status: current
description: Supple and mild Dutch cheese with a lower fat content, typically used for snacking, cold cut platters, and baking.
sources: []
notes: ""
```

#### Emmental Cheese 45% — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-emmental-cheese-45 · Category: Imported Cheese · SKU OLV0327
- Current description: "Classic Swiss-style cheese featuring large holes and a mild taste, perfect for melting into sauces, sandwiches, and gratins."

```yaml
id: product/daily-dairy-emmental-cheese-45
name: Emmental Cheese 45% (LOCKED)
status: current
description: Classic Swiss-style cheese featuring large holes and a mild taste, perfect for melting into sauces, sandwiches, and gratins.
sources: []
notes: ""
```

#### Failini Grated Parmesan Cheese — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-failini-grated-parmesan-cheese · Category: Imported Cheese · SKU OLV0262
- Current description: "Finely grated dry ripened cheese used as a salty topping for pasta, pizzas, salads, and traditional Italian culinary preparations."

```yaml
id: product/daily-dairy-failini-grated-parmesan-cheese
name: Failini Grated Parmesan Cheese (LOCKED)
status: current
description: Finely grated dry ripened cheese used as a salty topping for pasta, pizzas, salads, and traditional Italian culinary preparations.
sources: []
notes: ""
```

#### Goat Cheese Young 50% — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-goat-cheese-young-50 · Category: Imported Cheese · SKU OLV0318
- Current description: "Mild and creamy young goat cheese, often crumbled over fresh salads or spread onto artisanal crackers and warm bread."

```yaml
id: product/daily-dairy-goat-cheese-young-50
name: Goat Cheese Young 50% (LOCKED)
status: current
description: Mild and creamy young goat cheese, often crumbled over fresh salads or spread onto artisanal crackers and warm bread.
sources: []
notes: ""
```

#### Gouda Cheese 48% — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-gouda-cheese-48 · Category: Imported Cheese · SKU OLV0329
- Current description: "Smooth and creamy Dutch-style cheese that melts exceptionally well, making it ideal for burgers, pasta dishes, and snacks."

```yaml
id: product/daily-dairy-gouda-cheese-48
name: Gouda Cheese 48% (LOCKED)
status: current
description: Smooth and creamy Dutch-style cheese that melts exceptionally well, making it ideal for burgers, pasta dishes, and snacks.
sources: []
notes: ""
```

#### Grana Padano Cheese Wheel — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-grana-padano-cheese-wheel · Category: Imported Cheese · SKU OLV0260
- Current description: "Hard Italian cheese with a granular texture, traditionally grated over pasta, risotto, and salads to provide a savory depth."

```yaml
id: product/daily-dairy-grana-padano-cheese-wheel
name: Grana Padano Cheese Wheel (LOCKED)
status: current
description: Hard Italian cheese with a granular texture, traditionally grated over pasta, risotto, and salads to provide a savory depth.
sources: []
notes: ""
```

#### Kolios Feta Cheese — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-kolios-feta-cheese · Category: Imported Cheese · SKU OLV0319
- Current description: "Creamy and tangy authentic Greek-style cheese perfect for crumbling over Mediterranean salads, pastries, or incorporating into savory appetizers."

```yaml
id: product/daily-dairy-kolios-feta-cheese
name: Kolios Feta Cheese (LOCKED)
status: current
description: Creamy and tangy authentic Greek-style cheese perfect for crumbling over Mediterranean salads, pastries, or incorporating into savory appetizers.
sources: []
notes: ""
```

#### Pecorino Romano Cheese — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-pecorino-romano-cheese · Category: Imported Cheese · SKU OLV0328
- Current description: "Salty and sharp sheep's milk cheese from Italy, primarily used for grating into traditional pasta dishes like carbonara and cacio e pepe."

```yaml
id: product/daily-dairy-pecorino-romano-cheese
name: Pecorino Romano Cheese (LOCKED)
status: current
description: Salty and sharp sheep's milk cheese from Italy, primarily used for grating into traditional pasta dishes like carbonara and cacio e pepe.
sources: []
notes: ""
```

#### Snow White Danish Blue Cheese — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-snow-white-danish-blue-cheese · Category: Imported Cheese · SKU OLV0326
- Current description: "Sharp and creamy Danish blue cheese featuring characteristic veins, ideal for salad dressings, burger toppings, or gourmet cheese platters."

```yaml
id: product/daily-dairy-snow-white-danish-blue-cheese
name: Snow White Danish Blue Cheese (LOCKED)
status: current
description: Sharp and creamy Danish blue cheese featuring characteristic veins, ideal for salad dressings, burger toppings, or gourmet cheese platters.
sources: []
notes: ""
```

#### Snow White Danish Blue Cheese Wheel 50% — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-snow-white-danish-blue-cheese-wheel-50 · Category: Imported Cheese · SKU OLV0321
- Current description: "Creamy Danish blue cheese with visible marbling, providing a sharp tang for salads, steak toppings, and bold dessert pairings."

```yaml
id: product/daily-dairy-snow-white-danish-blue-cheese-wheel-50
name: Snow White Danish Blue Cheese Wheel 50% (LOCKED)
status: current
description: Creamy Danish blue cheese with visible marbling, providing a sharp tang for salads, steak toppings, and bold dessert pairings.
sources: []
notes: ""
```

#### V.S.O.C Black Label Aged Gouda 48% — Daily Dairy

- Page: https://www.olivefoods.lk/products/daily-dairy-v-s-o-c-black-label-aged-gouda-48 · Category: Imported Cheese · SKU OLV0322
- Current description: "Extra-aged Dutch cheese featuring crunchy protein crystals, perfect for premium cheese boards or pairing with various nuts and fruits."

```yaml
id: product/daily-dairy-v-s-o-c-black-label-aged-gouda-48
name: V.S.O.C Black Label Aged Gouda 48% (LOCKED)
status: current
description: Extra-aged Dutch cheese featuring crunchy protein crystals, perfect for premium cheese boards or pairing with various nuts and fruits.
sources: []
notes: ""
```

##### Italian Pasta

#### Cannelloni — Dedicato

- Page: https://www.olivefoods.lk/products/dedicato-cannelloni · Category: Italian Pasta · SKU OLV0254
- Current description: "Large cylindrical pasta tubes designed for stuffing with meat or cheese fillings and baking under a blanket of rich tomato sauce."

```yaml
id: product/dedicato-cannelloni
name: Cannelloni (LOCKED)
status: current
description: Large cylindrical pasta tubes designed for stuffing with meat or cheese fillings and baking under a blanket of rich tomato sauce.
sources: []
notes: ""
```

#### Farfalloni — Donna Chiara

- Page: https://www.olivefoods.lk/products/donna-chiara-farfalloni · Category: Italian Pasta · SKU OLV0248
- Current description: "Large bow-tie shaped pasta suited for chunky sauces, cold pasta salads, or baked dishes requiring a visually appealing pasta shape."

```yaml
id: product/donna-chiara-farfalloni
name: Farfalloni (LOCKED)
status: current
description: Large bow-tie shaped pasta suited for chunky sauces, cold pasta salads, or baked dishes requiring a visually appealing pasta shape.
sources: []
notes: ""
```

#### Fusilli — Donna Chiara

- Page: https://www.olivefoods.lk/products/donna-chiara-fusilli · Category: Italian Pasta · SKU OLV0247
- Current description: "Corkscrew-shaped pasta with twisted grooves that excel at capturing small ingredients and thick sauces in every single bite."

```yaml
id: product/donna-chiara-fusilli
name: Fusilli (LOCKED)
status: current
description: Corkscrew-shaped pasta with twisted grooves that excel at capturing small ingredients and thick sauces in every single bite.
sources: []
notes: ""
```

#### Lasagna Semola

- Page: https://www.olivefoods.lk/products/generic-lasagna-semola · Category: Italian Pasta · SKU OLV0253
- Current description: "Traditional flat pasta sheets made from durum wheat semolina, used for layering with sauces and cheese in baked lasagna dishes."

```yaml
id: product/generic-lasagna-semola
name: Lasagna Semola (LOCKED)
status: current
description: Traditional flat pasta sheets made from durum wheat semolina, used for layering with sauces and cheese in baked lasagna dishes.
sources: []
notes: ""
```

#### Linguine — Donna Chiara

- Page: https://www.olivefoods.lk/products/donna-chiara-linguine · Category: Italian Pasta · SKU OLV0243
- Current description: "Long, flat ribbons of pasta similar to fettuccine, traditionally paired with seafood sauces, pesto, or light oil-based herb dressings."

```yaml
id: product/donna-chiara-linguine
name: Linguine (LOCKED)
status: current
description: Long, flat ribbons of pasta similar to fettuccine, traditionally paired with seafood sauces, pesto, or light oil-based herb dressings.
sources: []
notes: ""
```

#### Pappardelle Sem — Dedicato

- Page: https://www.olivefoods.lk/products/dedicato-pappardelle-sem · Category: Italian Pasta · SKU OLV0252
- Current description: "Wide, broad ribbons of egg pasta traditionally served with heavy meat ragus, wild mushroom sauces, or other robust, hearty flavors."

```yaml
id: product/dedicato-pappardelle-sem
name: Pappardelle Sem (LOCKED)
status: current
description: Wide, broad ribbons of egg pasta traditionally served with heavy meat ragus, wild mushroom sauces, or other robust, hearty flavors.
sources: []
notes: ""
```

#### Penne — Donna Chiara

- Page: https://www.olivefoods.lk/products/donna-chiara-penne · Category: Italian Pasta · SKU OLV0245
- Current description: "Short cylinder-shaped pasta with slanted ends and ridges, designed to hold thick vegetable, meat, or cream-based sauces effectively."

```yaml
id: product/donna-chiara-penne
name: Penne (LOCKED)
status: current
description: Short cylinder-shaped pasta with slanted ends and ridges, designed to hold thick vegetable, meat, or cream-based sauces effectively.
sources: []
notes: ""
```

#### Spaghetti — Donna Chiara

- Page: https://www.olivefoods.lk/products/donna-chiara-spaghetti · Category: Italian Pasta · SKU OLV0244
- Current description: "Classic long, thin cylindrical pasta versatile enough for simple tomato sauces, carbonara, or serving with meatballs in savory gravies."

```yaml
id: product/donna-chiara-spaghetti
name: Spaghetti (LOCKED)
status: current
description: Classic long, thin cylindrical pasta versatile enough for simple tomato sauces, carbonara, or serving with meatballs in savory gravies.
sources: []
notes: ""
```

#### Spaghetti Vermicelli - Kg — Dedicato

- Page: https://www.olivefoods.lk/products/dedicato-spaghetti-vermicelli-kg · Category: Italian Pasta · SKU OLV0249
- Current description: "Extremely thin long strands of pasta that cook quickly and are best served with light broths or delicate oil-based sauces."

```yaml
id: product/dedicato-spaghetti-vermicelli-kg
name: Spaghetti Vermicelli - Kg (LOCKED)
status: current
description: Extremely thin long strands of pasta that cook quickly and are best served with light broths or delicate oil-based sauces.
sources: []
notes: ""
```

#### Spirali Fantasia — Dedicato

- Page: https://www.olivefoods.lk/products/dedicato-spirali-fantasia · Category: Italian Pasta · SKU OLV0255
- Current description: "Multicolor corkscrew-shaped pasta that holds sauce well, perfect for vibrant pasta salads or serving with chunky vegetable and meat ragus."

```yaml
id: product/dedicato-spirali-fantasia
name: Spirali Fantasia (LOCKED)
status: current
description: Multicolor corkscrew-shaped pasta that holds sauce well, perfect for vibrant pasta salads or serving with chunky vegetable and meat ragus.
sources: []
notes: ""
```

#### Tagliatelle Spinaci - 80 - 500 Gr — Dedicato

- Page: https://www.olivefoods.lk/products/dedicato-tagliatelle-spinaci-80-500-gr · Category: Italian Pasta · SKU OLV0251 · Pack: 500 g
- Current description: "Long flat ribbons of pasta infused with spinach, offering a subtle vegetal flavor perfect for cream sauces or buttery toppings."

```yaml
id: product/dedicato-tagliatelle-spinaci-80-500-gr
name: Tagliatelle Spinaci - 80 - 500 Gr (LOCKED)
status: current
description: Long flat ribbons of pasta infused with spinach, offering a subtle vegetal flavor perfect for cream sauces or buttery toppings.
sources: []
notes: ""
```

##### Japanese Products

#### Japanese Black Vinegar

- Page: https://www.olivefoods.lk/products/generic-japanese-black-vinegar · Category: Japanese Products · SKU OLV0033
- Current description: "Mellow and earthy vinegar made from unpolished rice, used for adding depth to dressings, marinades, and slow-cooked braised meat recipes."

```yaml
id: product/generic-japanese-black-vinegar
name: Japanese Black Vinegar (LOCKED)
status: current
description: Mellow and earthy vinegar made from unpolished rice, used for adding depth to dressings, marinades, and slow-cooked braised meat recipes.
sources: []
notes: ""
```

#### Japanese Mayonnaise

- Page: https://www.olivefoods.lk/products/generic-japanese-mayonnaise · Category: Japanese Products · SKU OLV0061
- Current description: "Creamy and rich condiment made with rice vinegar, offering a tangy flavor profile for sushi rolls, salads, and various Japanese street foods."

```yaml
id: product/generic-japanese-mayonnaise
name: Japanese Mayonnaise (LOCKED)
status: current
description: Creamy and rich condiment made with rice vinegar, offering a tangy flavor profile for sushi rolls, salads, and various Japanese street foods.
sources: []
notes: ""
```

#### Mirin 600G

- Page: https://www.olivefoods.lk/products/generic-mirin-600g · Category: Japanese Products · SKU OLV0062 · Pack: 600 g
- Current description: "Sweet rice wine with a low alcohol content, used to add a mild sweetness and characteristic glaze to teriyaki and grilled dishes."

```yaml
id: product/generic-mirin-600g
name: Mirin 600G (LOCKED)
status: current
description: Sweet rice wine with a low alcohol content, used to add a mild sweetness and characteristic glaze to teriyaki and grilled dishes.
sources: []
notes: ""
```

#### Panko Bread Crumbs White

- Page: https://www.olivefoods.lk/products/generic-panko-bread-crumbs-white · Category: Japanese Products · SKU OLV0058
- Current description: "Light and airy bread crumbs with a flaky texture, used to create a crisp and golden coating for deep-fried meats and vegetables."

```yaml
id: product/generic-panko-bread-crumbs-white
name: Panko Bread Crumbs White (LOCKED)
status: current
description: Light and airy bread crumbs with a flaky texture, used to create a crisp and golden coating for deep-fried meats and vegetables.
sources: []
notes: ""
```

#### Soba Zao Noodles

- Page: https://www.olivefoods.lk/products/generic-soba-zao-noodles · Category: Japanese Products · SKU OLV0059
- Current description: "Thin noodles made from a blend of buckwheat and wheat flour, frequently served either chilled with dipping sauce or in hot soups."

```yaml
id: product/generic-soba-zao-noodles
name: Soba Zao Noodles (LOCKED)
status: current
description: Thin noodles made from a blend of buckwheat and wheat flour, frequently served either chilled with dipping sauce or in hot soups.
sources: []
notes: ""
```

#### Tempura Ko

- Page: https://www.olivefoods.lk/products/generic-tempura-ko · Category: Japanese Products · SKU OLV0060
- Current description: "Lightweight wheat flour blend formulated to produce a thin, crispy, and lacy batter when deep-frying various assorted seafood and seasonal vegetables."

```yaml
id: product/generic-tempura-ko
name: Tempura Ko (LOCKED)
status: current
description: Lightweight wheat flour blend formulated to produce a thin, crispy, and lacy batter when deep-frying various assorted seafood and seasonal vegetables.
sources: []
notes: ""
```

#### Wasabi Ko Powder

- Page: https://www.olivefoods.lk/products/generic-wasabi-ko-powder · Category: Japanese Products · SKU OLV0057
- Current description: "Dry horseradish-based powder that creates a pungent green paste when mixed with water, typically served alongside sushi, sashimi, or cold noodles."

```yaml
id: product/generic-wasabi-ko-powder
name: Wasabi Ko Powder (LOCKED)
status: current
description: Dry horseradish-based powder that creates a pungent green paste when mixed with water, typically served alongside sushi, sashimi, or cold noodles.
sources: []
notes: ""
```

#### Yakinori Sushi 50'S

- Page: https://www.olivefoods.lk/products/generic-yakinori-sushi-50s · Category: Japanese Products · SKU OLV0076 · Pack: 50 per pack
- Current description: "Dried and roasted seaweed sheets that are essential for wrapping sushi rolls, hand rolls, or garnishing various traditional Japanese rice bowls."

```yaml
id: product/generic-yakinori-sushi-50s
name: Yakinori Sushi 50'S (LOCKED)
status: current
description: Dried and roasted seaweed sheets that are essential for wrapping sushi rolls, hand rolls, or garnishing various traditional Japanese rice bowls.
sources: []
notes: ""
```

##### Local Sauces

#### Chicken Stock Powder

- Page: https://www.olivefoods.lk/products/generic-chicken-stock-powder · Category: Local Sauces · SKU OLV0155
- Current description: "Dehydrated savory seasoning used to create instant poultry broth or to add concentrated flavor to soups and stews."

```yaml
id: product/generic-chicken-stock-powder
name: Chicken Stock Powder (LOCKED)
status: current
description: Dehydrated savory seasoning used to create instant poultry broth or to add concentrated flavor to soups and stews.
sources: []
notes: ""
```

#### Dark Soya Sauce

- Page: https://www.olivefoods.lk/products/generic-dark-soya-sauce · Category: Local Sauces · SKU OLV0131
- Current description: "Thick, slightly sweet fermented sauce providing deep color and rich flavor to stews, noodles, and braised meats."

```yaml
id: product/generic-dark-soya-sauce
name: Dark Soya Sauce (LOCKED)
status: current
description: Thick, slightly sweet fermented sauce providing deep color and rich flavor to stews, noodles, and braised meats.
sources: []
notes: ""
```

#### Oyster Sauce

- Page: https://www.olivefoods.lk/products/generic-oyster-sauce · Category: Local Sauces · SKU OLV0127
- Current description: "Thick, savory condiment made from oyster extracts, commonly used to enhance stir-frys, marinades, and vegetable dishes."

```yaml
id: product/generic-oyster-sauce
name: Oyster Sauce (LOCKED)
status: current
description: Thick, savory condiment made from oyster extracts, commonly used to enhance stir-frys, marinades, and vegetable dishes.
sources: []
notes: ""
```

#### Tomato Sauce Economy

- Page: https://www.olivefoods.lk/products/generic-tomato-sauce-economy · Category: Local Sauces · SKU OLV0190
- Current description: "Multi-purpose economy tomato sauce ideal for bulk food preparation, providing an essential savory base for stews, soups, and simple pasta sauces."

```yaml
id: product/generic-tomato-sauce-economy
name: Tomato Sauce Economy (LOCKED)
status: current
description: Multi-purpose economy tomato sauce ideal for bulk food preparation, providing an essential savory base for stews, soups, and simple pasta sauces.
sources: []
notes: ""
```

#### Tomato Sauce Premium

- Page: https://www.olivefoods.lk/products/generic-tomato-sauce-premium · Category: Local Sauces · SKU OLV0126
- Current description: "Thick and rich premium tomato sauce suitable for high-quality pasta dishes, pizza bases, and gourmet dipping sauces or culinary reductions."

```yaml
id: product/generic-tomato-sauce-premium
name: Tomato Sauce Premium (LOCKED)
status: current
description: Thick and rich premium tomato sauce suitable for high-quality pasta dishes, pizza bases, and gourmet dipping sauces or culinary reductions.
sources: []
notes: ""
```

#### Tomato Sauce Standard

- Page: https://www.olivefoods.lk/products/generic-tomato-sauce-standard · Category: Local Sauces · SKU OLV0132
- Current description: "Versatile standard tomato sauce used as a reliable base for everyday cooking, stocks, and various savory Mediterranean-style meat and vegetable dishes."

```yaml
id: product/generic-tomato-sauce-standard
name: Tomato Sauce Standard (LOCKED)
status: current
description: Versatile standard tomato sauce used as a reliable base for everyday cooking, stocks, and various savory Mediterranean-style meat and vegetable dishes.
sources: []
notes: ""
```

##### Mexican

#### Albertos Flour Tortilla Wraps 10" 6'S — Albertos

- Page: https://www.olivefoods.lk/products/albertos-albertos-flour-tortilla-wraps-10-6s · Category: Mexican · SKU OLV0064 · Pack: 10 in · 6 per pack
- Current description: "Soft ten-inch flour tortillas ideal for wrapping large burritos, creating soft tacos, or making grilled quesadillas for Mexican-style dining."

```yaml
id: product/albertos-albertos-flour-tortilla-wraps-10-6s
name: Albertos Flour Tortilla Wraps 10" 6'S (LOCKED)
status: current
description: Soft ten-inch flour tortillas ideal for wrapping large burritos, creating soft tacos, or making grilled quesadillas for Mexican-style dining.
sources: []
notes: ""
```

#### Albertos Tortilla Wraps 6" 8'S — Albertos

- Page: https://www.olivefoods.lk/products/albertos-albertos-tortilla-wraps-6-8s · Category: Mexican · SKU OLV0065 · Pack: 6 in · 8 per pack
- Current description: "Small six-inch flour tortillas perfect for serving street-style tacos, fajitas, or individual snacks and appetizers in professional kitchens."

```yaml
id: product/albertos-albertos-tortilla-wraps-6-8s
name: Albertos Tortilla Wraps 6" 8'S (LOCKED)
status: current
description: Small six-inch flour tortillas perfect for serving street-style tacos, fajitas, or individual snacks and appetizers in professional kitchens.
sources: []
notes: ""
```

##### Packing Material

#### Baking Paper

- Page: https://www.olivefoods.lk/products/generic-baking-paper · Category: Packing Material · SKU OLV0157
- Current description: "Non-stick heat-resistant parchment paper used for lining baking trays to prevent sticking and ensure easy removal of goods."

```yaml
id: product/generic-baking-paper
name: Baking Paper (LOCKED)
status: current
description: Non-stick heat-resistant parchment paper used for lining baking trays to prevent sticking and ensure easy removal of goods.
sources: []
notes: ""
```

#### Cake Cup White 9 Cm

- Page: https://www.olivefoods.lk/products/generic-cake-cup-white-9-cm · Category: Packing Material · SKU OLV0180 · Pack: 9 cm
- Current description: "Small white paper liners designed to hold batter and provide a professional presentation for baked cupcakes or muffins."

```yaml
id: product/generic-cake-cup-white-9-cm
name: Cake Cup White 9 Cm (LOCKED)
status: current
description: Small white paper liners designed to hold batter and provide a professional presentation for baked cupcakes or muffins.
sources: []
notes: ""
```

#### Cake Cups White 11.5Cm

- Page: https://www.olivefoods.lk/products/generic-cake-cups-white-11-5cm · Category: Packing Material · SKU OLV0181 · Pack: 11.5 cm
- Current description: "Large white greaseproof paper liners used for lining baking tins and serving standard-sized cupcakes, muffins, or buns."

```yaml
id: product/generic-cake-cups-white-11-5cm
name: Cake Cups White 11.5Cm (LOCKED)
status: current
description: Large white greaseproof paper liners used for lining baking tins and serving standard-sized cupcakes, muffins, or buns.
sources: []
notes: ""
```

#### Latex Gloves Medium White 100'S

- Page: https://www.olivefoods.lk/products/generic-latex-gloves-medium-white-100s · Category: Packing Material · SKU OLV0070 · Pack: 100 per pack
- Current description: "Disposable white latex hand protection used to maintain hygiene standards during food preparation and general handling tasks."

```yaml
id: product/generic-latex-gloves-medium-white-100s
name: Latex Gloves Medium White 100'S (LOCKED)
status: current
description: Disposable white latex hand protection used to maintain hygiene standards during food preparation and general handling tasks.
sources: []
notes: ""
```

#### Paper Cup 12 Oz White Hd 50'S

- Page: https://www.olivefoods.lk/products/generic-paper-cup-12-oz-white-hd-50s · Category: Packing Material · SKU OLV0074 · Pack: 12 oz · 50 per pack
- Current description: "Heavy-duty white paper cups engineered for heat retention, ideal for serving large portions of coffee and tea."

```yaml
id: product/generic-paper-cup-12-oz-white-hd-50s
name: Paper Cup 12 Oz White Hd 50'S (LOCKED)
status: current
description: Heavy-duty white paper cups engineered for heat retention, ideal for serving large portions of coffee and tea.
sources: []
notes: ""
```

#### Paper Cup 6 Oz Print 50'S

- Page: https://www.olivefoods.lk/products/generic-paper-cup-6-oz-print-50s · Category: Packing Material · SKU OLV0072 · Pack: 6 oz · 50 per pack
- Current description: "Disposable printed paper cups suitable for serving small portions of hot or cold beverages in takeaway settings."

```yaml
id: product/generic-paper-cup-6-oz-print-50s
name: Paper Cup 6 Oz Print 50'S (LOCKED)
status: current
description: Disposable printed paper cups suitable for serving small portions of hot or cold beverages in takeaway settings.
sources: []
notes: ""
```

#### Paper Cup 8 Oz White 50'S

- Page: https://www.olivefoods.lk/products/generic-paper-cup-8-oz-white-50s · Category: Packing Material · SKU OLV0073 · Pack: 8 oz · 50 per pack
- Current description: "Single-wall white paper vessels designed for serving medium-sized hot drinks, water, or other beverages at events."

```yaml
id: product/generic-paper-cup-8-oz-white-50s
name: Paper Cup 8 Oz White 50'S (LOCKED)
status: current
description: Single-wall white paper vessels designed for serving medium-sized hot drinks, water, or other beverages at events.
sources: []
notes: ""
```

#### Poly Gloves 100'S

- Page: https://www.olivefoods.lk/products/generic-poly-gloves-100s · Category: Packing Material · SKU OLV0085 · Pack: 100 per pack
- Current description: "Lightweight transparent polyethylene gloves designed for short-term tasks and maintaining sanitary conditions in high-volume food service."

```yaml
id: product/generic-poly-gloves-100s
name: Poly Gloves 100'S (LOCKED)
status: current
description: Lightweight transparent polyethylene gloves designed for short-term tasks and maintaining sanitary conditions in high-volume food service.
sources: []
notes: ""
```

#### Vinyl Gloves Medium Black 100'S

- Page: https://www.olivefoods.lk/products/generic-vinyl-gloves-medium-black-100s · Category: Packing Material · SKU OLV0004 · Pack: 100 per pack
- Current description: "Durable black vinyl gloves used for protective hand coverage during food prep, plating, or general sanitary maintenance."

```yaml
id: product/generic-vinyl-gloves-medium-black-100s
name: Vinyl Gloves Medium Black 100'S (LOCKED)
status: current
description: Durable black vinyl gloves used for protective hand coverage during food prep, plating, or general sanitary maintenance.
sources: []
notes: ""
```

#### Vinyl Gloves Medium Blue 100'S

- Page: https://www.olivefoods.lk/products/generic-vinyl-gloves-medium-blue-100s · Category: Packing Material · SKU OLV0003 · Pack: 100 per pack
- Current description: "Powder-free blue vinyl gloves providing a protective barrier for food service workers during light-duty assembly and cleaning."

```yaml
id: product/generic-vinyl-gloves-medium-blue-100s
name: Vinyl Gloves Medium Blue 100'S (LOCKED)
status: current
description: Powder-free blue vinyl gloves providing a protective barrier for food service workers during light-duty assembly and cleaning.
sources: []
notes: ""
```

##### Poultry

#### Frozen Duck Breast

- Page: https://www.olivefoods.lk/products/generic-frozen-duck-breast · Category: Poultry · SKU OLV0229
- Current description: "Boneless duck breast meat with attached skin, best suited for pan-searing, roasting, or slicing for upscale main courses."

```yaml
id: product/generic-frozen-duck-breast
name: Frozen Duck Breast (LOCKED)
status: current
description: Boneless duck breast meat with attached skin, best suited for pan-searing, roasting, or slicing for upscale main courses.
sources: []
notes: ""
```

##### Rice

#### Extra Long Grain Basmati Rice Gold — Azizaa

- Page: https://www.olivefoods.lk/products/azizaa-extra-long-grain-basmati-rice-gold · Category: Rice · SKU OLV0218
- Current description: "High-quality extra-long grain aromatic rice, perfect for pilafs and side dishes requiring distinct, light, and fluffy cooked grains."

```yaml
id: product/azizaa-extra-long-grain-basmati-rice-gold
name: Extra Long Grain Basmati Rice Gold (LOCKED)
status: current
description: High-quality extra-long grain aromatic rice, perfect for pilafs and side dishes requiring distinct, light, and fluffy cooked grains.
sources: []
notes: ""
```

#### Extra Long Grain Basmati Rice Platinum 1121 — Azizaa

- Page: https://www.olivefoods.lk/products/azizaa-extra-long-grain-basmati-rice-platinum-1121 · Category: Rice · SKU OLV0220
- Current description: "Premium aromatic extra-long grain rice, characterized by its slender shape and non-sticky texture, ideal for making gourmet biryani."

```yaml
id: product/azizaa-extra-long-grain-basmati-rice-platinum-1121
name: Extra Long Grain Basmati Rice Platinum 1121 (LOCKED)
status: current
description: Premium aromatic extra-long grain rice, characterized by its slender shape and non-sticky texture, ideal for making gourmet biryani.
sources: []
notes: ""
```

##### Seasonings & Sauce

#### Hoi Sin Sauce — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-hoi-sin-sauce · Category: Seasonings & Sauce · SKU OLV0016
- Current description: "Thick and fragrant sauce made from soybeans and spices, used as a glaze for roasted meats or a dipping sauce for appetizers."

```yaml
id: product/royal-arm-hoi-sin-sauce
name: Hoi Sin Sauce (LOCKED)
status: current
description: Thick and fragrant sauce made from soybeans and spices, used as a glaze for roasted meats or a dipping sauce for appetizers.
sources: []
notes: ""
```

#### Hot Pepper Sauce 60Ml — Tabasco

- Page: https://www.olivefoods.lk/products/tabasco-hot-pepper-sauce-60ml · Category: Seasonings & Sauce · SKU OLV0011 · Pack: 60 ml
- Current description: "Spicy and vinegar-based hot sauce used to add heat and zest to eggs, pizzas, cocktails, and a variety of spicy seafood dishes."

```yaml
id: product/tabasco-hot-pepper-sauce-60ml
name: Hot Pepper Sauce 60Ml (LOCKED)
status: current
description: Spicy and vinegar-based hot sauce used to add heat and zest to eggs, pizzas, cocktails, and a variety of spicy seafood dishes.
sources: []
notes: ""
```

#### Light Soya Sauce — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-light-soya-sauce · Category: Seasonings & Sauce · SKU OLV0014
- Current description: "Salt-forward liquid seasoning used for dipping, seasoning vegetables, and light marinades without significantly darkening the color of the final dish."

```yaml
id: product/royal-arm-light-soya-sauce
name: Light Soya Sauce (LOCKED)
status: current
description: Salt-forward liquid seasoning used for dipping, seasoning vegetables, and light marinades without significantly darkening the color of the final dish.
sources: []
notes: ""
```

#### Mayonnaise — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-mayonnaise · Category: Seasonings & Sauce · SKU OLV0008
- Current description: "Creamy emulsion of oil and egg yolk, serving as a versatile spread for sandwiches and a base for dressings or chilled dipping sauces."

```yaml
id: product/royal-arm-mayonnaise
name: Mayonnaise (LOCKED)
status: current
description: Creamy emulsion of oil and egg yolk, serving as a versatile spread for sandwiches and a base for dressings or chilled dipping sauces.
sources: []
notes: ""
```

#### Mint Sauce — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-mint-sauce · Category: Seasonings & Sauce · SKU OLV0013
- Current description: "Tangy herb-based sauce featuring chopped mint leaves, traditionally served as a classic accompaniment to roast lamb and grilled garden vegetables."

```yaml
id: product/royal-arm-mint-sauce
name: Mint Sauce (LOCKED)
status: current
description: Tangy herb-based sauce featuring chopped mint leaves, traditionally served as a classic accompaniment to roast lamb and grilled garden vegetables.
sources: []
notes: ""
```

#### Sriracha Original Sauce

- Page: https://www.olivefoods.lk/products/generic-sriracha-original-sauce · Category: Seasonings & Sauce · SKU OLV0165
- Current description: "Spicy chili sauce made from sun-ripened chilies and garlic, perfect for seasoning soups, noodles, and dipping sauces."

```yaml
id: product/generic-sriracha-original-sauce
name: Sriracha Original Sauce (LOCKED)
status: current
description: Spicy chili sauce made from sun-ripened chilies and garlic, perfect for seasoning soups, noodles, and dipping sauces.
sources: []
notes: ""
```

#### Sweet Soya Sauce — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-sweet-soya-sauce · Category: Seasonings & Sauce · SKU OLV0021
- Current description: "Thickened sugary soy sauce used for glazing barbecue meats or as a sweet dipping companion for steamed dumplings and crispy spring rolls."

```yaml
id: product/royal-arm-sweet-soya-sauce
name: Sweet Soya Sauce (LOCKED)
status: current
description: Thickened sugary soy sauce used for glazing barbecue meats or as a sweet dipping companion for steamed dumplings and crispy spring rolls.
sources: []
notes: ""
```

##### Thai Products

#### Black (Dark) Soy Sauce Orange Label

- Page: https://www.olivefoods.lk/products/generic-black-dark-soy-sauce-orange-label · Category: Thai Products, Seasonings & Sauce · SKU OLV0337
- Current description: "Thick and molasses-like condiment used for imparting a rich dark color and subtle sweetness to stir-fries and braised meat dishes."

```yaml
id: product/generic-black-dark-soy-sauce-orange-label
name: Black (Dark) Soy Sauce Orange Label (LOCKED)
status: current
description: Thick and molasses-like condiment used for imparting a rich dark color and subtle sweetness to stir-fries and braised meat dishes.
sources: []
notes: ""
```

#### Fish Sauce — Tiparos

- Page: https://www.olivefoods.lk/products/tiparos-fish-sauce · Category: Thai Products, Seasonings & Sauce · SKU OLV0340
- Current description: "Traditional fermented seasoning used to enhance saltiness and complexity in stir-fry dishes, soups, and authentic Thai salad dressings."

```yaml
id: product/tiparos-fish-sauce
name: Fish Sauce (LOCKED)
status: current
description: Traditional fermented seasoning used to enhance saltiness and complexity in stir-fry dishes, soups, and authentic Thai salad dressings.
sources: []
notes: ""
```

#### Green Curry Paste — Mae Ploy

- Page: https://www.olivefoods.lk/products/mae-ploy-green-curry-paste · Category: Thai Products · SKU OLV0307
- Current description: "Spicy paste made from green chilies and herbs, perfect for authentic green curries, coconut-based soups, and seasoning grilled meats."

```yaml
id: product/mae-ploy-green-curry-paste
name: Green Curry Paste (LOCKED)
status: current
description: Spicy paste made from green chilies and herbs, perfect for authentic green curries, coconut-based soups, and seasoning grilled meats.
sources: []
notes: ""
```

#### Pad Thai Noodles (Rice Stick) — Mahachai

- Page: https://www.olivefoods.lk/products/mahachai-pad-thai-noodles-rice-stick · Category: Thai Products · SKU OLV0338
- Current description: "Traditional dried rice noodles used as the essential base for Pad Thai, stir-fry dishes, soups, and refreshing cold noodle salads."

```yaml
id: product/mahachai-pad-thai-noodles-rice-stick
name: Pad Thai Noodles (Rice Stick) (LOCKED)
status: current
description: Traditional dried rice noodles used as the essential base for Pad Thai, stir-fry dishes, soups, and refreshing cold noodle salads.
sources: []
notes: ""
```

#### Red Curry Paste — Mae Ploy

- Page: https://www.olivefoods.lk/products/mae-ploy-red-curry-paste · Category: Thai Products · SKU OLV0306
- Current description: "Aromatic blend of red chilies and spices, used as a base for spicy Thai curries, stir-fries, and flavorful marinades."

```yaml
id: product/mae-ploy-red-curry-paste
name: Red Curry Paste (LOCKED)
status: current
description: Aromatic blend of red chilies and spices, used as a base for spicy Thai curries, stir-fries, and flavorful marinades.
sources: []
notes: ""
```

#### Rice Vermicelli — Wai Wai

- Page: https://www.olivefoods.lk/products/wai-wai-rice-vermicelli · Category: Thai Products · SKU OLV0331
- Current description: "Thin dried noodles made from rice flour, commonly used in stir-fries, noodle soups, and chilled spring roll fillings."

```yaml
id: product/wai-wai-rice-vermicelli
name: Rice Vermicelli (LOCKED)
status: current
description: Thin dried noodles made from rice flour, commonly used in stir-fries, noodle soups, and chilled spring roll fillings.
sources: []
notes: ""
```

#### Tom Yum Paste — Mae Ploy

- Page: https://www.olivefoods.lk/products/mae-ploy-tom-yum-paste · Category: Thai Products · SKU OLV0334
- Current description: "A savory and sour spice blend, essential for making authentic Tom Yum soup or adding a tangy kick to seafood dishes."

```yaml
id: product/mae-ploy-tom-yum-paste
name: Tom Yum Paste (LOCKED)
status: current
description: A savory and sour spice blend, essential for making authentic Tom Yum soup or adding a tangy kick to seafood dishes.
sources: []
notes: ""
```

##### Vinegar

#### Apple Cider Vinegar — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-apple-cider-vinegar · Category: Vinegar · SKU OLV0031
- Current description: "Fermented apple cider vinegar used for making tangy salad dressings, pickling liquids, and various culinary marinades."

```yaml
id: product/royal-arm-apple-cider-vinegar
name: Apple Cider Vinegar (LOCKED)
status: current
description: Fermented apple cider vinegar used for making tangy salad dressings, pickling liquids, and various culinary marinades.
sources: []
notes: ""
```

#### Balsamic Vinegar — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-balsamic-vinegar · Category: Vinegar · SKU OLV0036
- Current description: "Dark balsamic vinegar with a complex sweet-tart profile, suitable for glazing meats or dressing fresh Caprese salads."

```yaml
id: product/royal-arm-balsamic-vinegar
name: Balsamic Vinegar (LOCKED)
status: current
description: Dark balsamic vinegar with a complex sweet-tart profile, suitable for glazing meats or dressing fresh Caprese salads.
sources: []
notes: ""
```

#### White Vinegar — Royal Arm

- Page: https://www.olivefoods.lk/products/royal-arm-white-vinegar · Category: Vinegar · SKU OLV0032
- Current description: "Distilled white vinegar with a sharp flavor, essential for pickling, marinating meats, and balancing heavy sauces."

```yaml
id: product/royal-arm-white-vinegar
name: White Vinegar (LOCKED)
status: current
description: Distilled white vinegar with a sharp flavor, essential for pickling, marinating meats, and balancing heavy sauces.
sources: []
notes: ""
```

## 6. Buying guides (8, drafts — not yet published)

Practical articles for kitchen and purchasing teams, each linking to the brand, category and product pages it mentions (`links` is LOCKED — you may suggest changes in `notes`). Improve accuracy and usefulness; keep the structure (sections with `paragraphs`, `items` = bullet list, `steps` = numbered list, `table`). `summary` is the first paragraph search engines and AI assistants quote: it must answer the guide's question directly.

### Thai cooking ingredients in Sri Lanka: curry pastes, fish sauce and noodles

- Will be published at https://www.olivefoods.lk/guides/thai-cooking-ingredients-sri-lanka

```yaml
id: guide/thai-cooking-ingredients-sri-lanka
status: draft
slug: thai-cooking-ingredients-sri-lanka
title: "Thai cooking ingredients in Sri Lanka: curry pastes, fish sauce and noodles"
seoTitle: "Thai Cooking Ingredients in Sri Lanka: Pastes, Fish Sauce, Noodles"
description: "What a restaurant or hotel kitchen in Sri Lanka needs to cook Thai food: curry pastes, fish sauce, soy sauce and rice noodles, how each is used, and where to buy them wholesale."
summary: "To cook Thai food in Sri Lanka, a professional kitchen needs four imported building blocks: curry pastes, fish sauce, soy sauce and dried rice noodles. Olive Foods imports and distributes all four (Mae Ploy curry and tom yum pastes, Tiparos fish sauce, dark soy sauce, Mahachai pad thai noodles and Wai Wai rice vermicelli) and supplies them to hotels, restaurants and caterers island-wide. Most of the fresh ingredients, such as lemongrass, chillies, coriander, limes, tamarind and coconut milk, are easy to find locally."
sections:
  - heading: "Curry pastes: the base of every Thai curry"
    paragraphs:
      - A Thai curry paste is a ground blend of chillies, aromatics such as lemongrass, galangal, garlic and shallot, dried spices and, in most traditional recipes, shrimp paste. Making it by hand takes time and a mortar, so most restaurant kitchens, in Thailand and abroad, use a ready-made paste and spend their effort on the finish.
      - Green curry paste is made with fresh green chillies and herbs, and tastes bright and herbal. Red curry paste is made with dried red chillies, for a deeper, rounder heat that suits beef, duck, chicken and pumpkin. Tom yum paste carries the lemongrass, galangal, lime and chilli of the hot and sour soup, and also works in stir-fries and seafood marinades.
      - To cook a curry, fry the paste in a little thick coconut cream until it smells fragrant and the oil starts to separate, then add the rest of the coconut milk, the meat or vegetables, and season with fish sauce and palm sugar. Commercial pastes differ in strength, so start with less than you think and taste as you go.
    items:
      - "Most curry pastes contain shrimp paste: check the label when cooking for vegetarian guests or anyone with a shellfish allergy."
      - Once opened, keep paste sealed in the refrigerator and use a clean spoon each time.
  - heading: "Fish sauce: the salt of Thai cooking"
    paragraphs:
      - Fish sauce (nam pla) is made by fermenting fish, usually anchovies, with salt for many months, then drawing off the clear amber liquid. It seasons almost every savoury Thai dish, adding salt and a deep savoury flavour that disappears into the food rather than tasting fishy.
      - Use it in curries, stir-fries, soups, salad dressings and dipping sauces. A simple table sauce, prik nam pla, is fish sauce with sliced chillies and a squeeze of lime. Tiparos fish sauce has been made in Thailand by the Tang Sang Hah company since 1919. Keep the bottle closed and away from heat; it darkens slowly with age.
  - heading: "Soy sauces: colour and seasoning"
    paragraphs:
      - "Dark soy sauce is thicker and slightly sweet, and is used more for colour than salt: it gives pad see ew and braised dishes their deep brown finish. Light soy sauce seasons without darkening the dish. Olive Foods supplies a dark soy sauce for Thai and Chinese cooking alongside Royal Arm light and sweet soy sauce."
  - heading: "Rice noodles: pad thai and vermicelli"
    paragraphs:
      - Pad thai uses flat dried rice sticks. Soak them in warm water until they bend without snapping but are still firm, drain, then stir-fry them with the sauce so they finish cooking in the pan. Soaked too long, they turn mushy in the wok. The classic sauce is tamarind, fish sauce and palm sugar, and tamarind is easy to buy in Sri Lanka.
      - Rice vermicelli is much thinner. It needs only a short soak in hot water before it goes into stir-fries, noodle soups, fresh spring rolls and noodle salads. Mahachai pad thai noodles and Wai Wai rice vermicelli are both made from rice flour.
  - heading: What to buy locally
    paragraphs:
      - Lemongrass, chillies, garlic, shallots, coriander, limes, tamarind and coconut milk are all easy to source in Sri Lanka. Galangal and makrut lime leaves can be harder to find; Thai curry pastes usually already contain both, so a kitchen can manage without them fresh. Thai basil can be replaced with local sweet basil in a pinch.
faqs:
  - q: Where can a restaurant buy Thai curry paste in Sri Lanka?
    a: Olive Foods imports Mae Ploy green curry, red curry and tom yum pastes and supplies them to restaurants, hotels and caterers across Sri Lanka. Send a quote request with the products and quantities you need and the team replies with trade pricing and delivery details.
  - q: What is the difference between green and red Thai curry paste?
    a: Green curry paste is made with fresh green chillies and herbs and tastes bright and herbal. Red curry paste is made with dried red chillies and has a deeper, rounder heat. Both are cooked the same way, fried in coconut cream and simmered in coconut milk.
  - q: Is fish sauce the same as soy sauce?
    a: No. Fish sauce is made by fermenting fish with salt; soy sauce is made by fermenting soybeans, usually with wheat. Thai cooking uses fish sauce as its main salty seasoning and soy sauce mainly for colour and for Chinese-influenced dishes.
links_LOCKED:
  brands:
    - mae-ploy
    - tiparos
    - mahachai
    - wai-wai
  categories:
    - Thai Products
    - Seasonings & Sauce
  products:
    - mae-ploy-green-curry-paste
    - mae-ploy-red-curry-paste
    - mae-ploy-tom-yum-paste
    - tiparos-fish-sauce
    - mahachai-pad-thai-noodles-rice-stick
    - wai-wai-rice-vermicelli
    - generic-black-dark-soy-sauce-orange-label
  sectors:
    - restaurants
    - hotels
sources: []
notes: ""
```

### Buying frozen food for a hotel kitchen: a cold-chain checklist

- Will be published at https://www.olivefoods.lk/guides/frozen-food-cold-chain-checklist

```yaml
id: guide/frozen-food-cold-chain-checklist
status: draft
slug: frozen-food-cold-chain-checklist
title: "Buying frozen food for a hotel kitchen: a cold-chain checklist"
seoTitle: "Frozen Food for Hotels in Sri Lanka: A Cold-Chain Checklist"
description: "How hotel and restaurant kitchens in Sri Lanka keep frozen food safe and at its best: what −18 °C means, what to ask a supplier, what to check on delivery, and how to store and thaw."
summary: Frozen food keeps its safety and quality only if it stays at −18 °C or colder at every step, from the producer's freezer to your kitchen. For a hotel or restaurant that means choosing a supplier with a real cold chain, checking every frozen delivery before it goes into the freezer, storing at −18 °C, and thawing meat in the refrigerator. Olive Foods stores and delivers its frozen range (meat, poultry, fries, potato products, vegetables, fruit and purees) at −18 °C.
sections:
  - heading: Why −18 °C matters
    paragraphs:
      - "−18 °C is the temperature used around the world for storing frozen food. At that temperature, bacteria cannot grow and food keeps its quality for months. The danger is not one moment of warmth but repeated swings: each time frozen food partly thaws and refreezes, ice crystals grow larger and break the food's structure. Meat loses juice when it cooks, vegetables turn soft, fries go limp and packs develop freezer burn."
  - heading: "Before you order: questions for a supplier"
    items:
      - Where is frozen stock held, and at what temperature?
      - "How is it delivered: in refrigerated or freezer vehicles, and how long is it on the road to you?"
      - What shelf life is left on products when they arrive?
      - Can the supplier keep the same products in stock all year, so menus don't have to change?
      - Are pack sizes suited to your freezer space and how fast you use them?
      - Can they provide product specifications, ingredients and allergen information, and halal certificates where you need them?
  - heading: "On delivery: what to check"
    items:
      - Products are hard-frozen, at or close to −18 °C. Use a probe thermometer between packs, not inside them.
      - "No signs of thawing and refreezing: large ice crystals or frost inside bags, fries or vegetables frozen into clumps, frozen liquid pooled in a corner, or swollen or deformed cartons."
      - Packs are intact and labels and best-before dates are readable.
      - Frozen goods go straight into the freezer. Don't leave them on the loading bay while dry goods are checked.
  - heading: In your freezer
    items:
      - Keep freezers at −18 °C or colder and record the temperature at least twice a day.
      - "Don't overload them: cold air must circulate around the stock."
      - Rotate stock so the earliest best-before date is used first.
      - Keep raw meat and poultry below ready-to-eat and cooked foods.
      - Keep doors closed and plan deliveries so stock goes in quickly.
  - heading: Thawing and cooking
    paragraphs:
      - "Thaw meat, poultry and fruit purees slowly in the refrigerator, never at room temperature, and allow enough time: a large joint can take a day or more. Fries, hash browns, wedges and most vegetables are cooked straight from frozen. Meat that has been thawed in the refrigerator can be refrozen, though it loses some quality; meat thawed any other way should be cooked before it is frozen again."
faqs:
  - q: What temperature should frozen food be delivered at?
    a: Frozen food should arrive hard-frozen, at or close to −18 °C, with no signs of thawing. Olive Foods stores and delivers its frozen range at −18 °C.
  - q: Can you refreeze frozen meat after it has thawed?
    a: Meat thawed in the refrigerator can be refrozen, but it loses some quality. Meat thawed at room temperature or in water should be cooked before freezing again.
  - q: Which frozen foods should be cooked from frozen?
    a: Frozen fries, hash browns, potato wedges and most frozen vegetables are cooked straight from frozen. Thawing them first makes them soak up oil or turn soft.
links_LOCKED:
  brands:
    - hungritos
    - damaco
    - dira
  categories:
    - Frozen Meat
    - Poultry
    - Frozen French Fries
    - Frozen Potato Products
    - Frozen Vegetables & Fruits
    - Frozen Fruit Puree
  products: []
  sectors:
    - hotels
    - frozen-food
    - catering
sources: []
notes: ""
```

### Frozen fruit purees for cocktails, smoothies and pastry

- Will be published at https://www.olivefoods.lk/guides/frozen-fruit-purees

```yaml
id: guide/frozen-fruit-purees
status: draft
slug: frozen-fruit-purees
title: Frozen fruit purees for cocktails, smoothies and pastry
seoTitle: "Frozen Fruit Purees in Sri Lanka: For Bars, Cafés and Pastry"
description: "How bars, cafés and pastry kitchens in Sri Lanka use frozen fruit purees: why they beat fresh fruit for consistency, which flavour suits what, and how to thaw and store them."
summary: Frozen fruit puree is fruit that has been washed, pulped, strained and frozen, so it tastes and looks the same in every batch and in every season. Bars use it for cocktails and mocktails, cafés for smoothies and shakes, and pastry kitchens for mousses, sorbets, glazes and fillings. Olive Foods imports DIRA purees from Belgium (mango, passion fruit, strawberry, raspberry, lemon and coconut) and delivers them frozen at −18 °C.
sections:
  - heading: Why kitchens and bars use purees
    items:
      - The same flavour, sweetness and colour every time, so a drink or dessert tastes the same in March and in October.
      - Fruits that are out of season, or not widely grown in Sri Lanka, such as raspberries and strawberries, are available all year.
      - No peeling, pitting, blending or straining seeds, and no wasted fruit.
      - Easy to measure, so recipes and drink specs stay consistent between staff.
  - heading: "Bars: cocktails and mocktails"
    paragraphs:
      - "Passion fruit, strawberry and mango are the bar workhorses: daiquiris, margaritas, martinis, mojitos, coolers and alcohol-free spritzers. A typical starting point is 20–30 ml of puree per drink, adjusted with sugar syrup and citrus to taste. Coconut puree makes a fresher piña colada than canned cream of coconut."
  - heading: "Cafés: smoothies and shakes"
    paragraphs:
      - Blend puree with yoghurt or milk and ice for smoothies and shakes, or combine it with whole frozen berries for texture. Mango and passion fruit together make a popular tropical smoothie; strawberry and raspberry go into milkshakes and frappés.
  - heading: "Pastry: mousses, glazes, sorbets and fillings"
    paragraphs:
      - Pastry chefs use purees for fruit mousses (puree folded with whipped cream and set with gelatine), sorbets (puree with sugar syrup), mirror glazes, coulis, curds, cake soaks and the centres of macarons and chocolates. Because the fruit content is consistent, a recipe that works once works every time.
  - heading: Which flavour for what
    table:
      head:
        - Puree
        - Good for
      rows:
        - - Mango
          - Smoothies, lassi, mousses, cheesecakes, sorbet
        - - Passion fruit
          - Cocktails, glazes, curds, tarts, macarons
        - - Strawberry
          - Daiquiris, milkshakes, mousses, coulis
        - - Raspberry
          - Coulis, sorbet, macaron and chocolate fillings, vinaigrettes
        - - Lemon
          - Tarts, curds, sorbets, marinades
        - - Coconut
          - Piña coladas, dairy-free desserts, curries
  - heading: Thawing, storing and using
    items:
      - Keep purees frozen at −18 °C until needed.
      - Thaw overnight in the refrigerator, not at room temperature.
      - Once thawed, keep the puree chilled and use it within the time on the pack; don't refreeze it.
      - Stir or shake before use, as solids can settle.
faqs:
  - q: Where can I buy frozen fruit puree in Sri Lanka?
    a: Olive Foods imports DIRA frozen fruit purees from Belgium in mango, passion fruit, strawberry, raspberry, lemon and coconut, and delivers them frozen to bars, cafés, hotels and pastry kitchens across Sri Lanka.
  - q: Is fruit puree the same as a flavoured syrup?
    a: No. Puree is the fruit itself, pulped and strained. A flavoured syrup is mostly sugar with flavouring and colour. Puree gives real fruit taste and body.
  - q: How should frozen fruit puree be thawed?
    a: Thaw it overnight in the refrigerator, keep it chilled once thawed, and use it within the time stated on the pack. Don't refreeze thawed puree.
links_LOCKED:
  brands:
    - dira
  categories:
    - Frozen Fruit Puree
    - Frozen Vegetables & Fruits
  products:
    - dira-frozen-mango-puree
    - dira-frozen-passion-fruit-puree
    - dira-frozen-strawberry-puree
    - dira-frozen-raspberry-puree
    - dira-frozen-lemon-puree
    - dira-frozen-coconut-puree
  sectors:
    - bakeries-and-cafes
    - hotels
    - frozen-food
sources: []
notes: ""
```

### Imported cheese for Sri Lankan kitchens: types, uses and storage

- Will be published at https://www.olivefoods.lk/guides/imported-cheese-guide

```yaml
id: guide/imported-cheese-guide
status: draft
slug: imported-cheese-guide
title: "Imported cheese for Sri Lankan kitchens: types, uses and storage"
seoTitle: "Imported Cheese in Sri Lanka: Types, Uses and Storage"
description: Which imported cheeses hotel, restaurant and café kitchens in Sri Lanka use, for melting, grating, crumbling and cheese boards, and how to store them so they keep.
summary: "Most hotel and restaurant menus in Sri Lanka are covered by four kinds of cheese: a melting cheese (Gouda, Cheddar, Emmental or processed slices), a grating cheese (Grana Padano, Parmesan or Pecorino Romano), a crumbling cheese (feta, young goat cheese or Danish blue) and a cheese for boards (aged Gouda or Comté). Olive Foods imports and distributes all of these, most from Daily Dairy in the Netherlands, and supplies hotels, restaurants, cafés and retailers island-wide."
sections:
  - heading: "Melting cheeses: burgers, sandwiches, pizza and bakes"
    paragraphs:
      - Gouda is a semi-hard Dutch cheese that melts smoothly, which makes it a good all-rounder for toasties, burgers, pasta bakes and pizza. Edam is milder and firmer, good for slicing and snacking. Cheddar, white or coloured (usually with annatto, a natural colouring), brings a sharper flavour to burgers, wraps and macaroni cheese. Emmental, the Swiss-style cheese with holes, melts into sauces, gratins and fondue. Processed cheese slices melt fastest and most evenly, which is why quick-service burger lines use them.
  - heading: "Grating cheeses: pasta, risotto and salads"
    paragraphs:
      - "Grana Padano is a protected Italian cheese made from cow's milk and aged for at least nine months. It is the everyday grating cheese of Italian kitchens. Pecorino Romano is made from sheep's milk and is saltier and sharper: it is the traditional cheese for carbonara and cacio e pepe. Ready-grated Parmesan saves time on busy lines; for the best flavour, grate wedges to order."
  - heading: "Crumbling cheeses: salads, pastries and toppings"
    paragraphs:
      - Feta is a brined Greek cheese for salads, pastries and baked dishes; keep it in its brine so it stays moist. Young goat cheese is mild and creamy, for salads, tarts and spreading on bread. Danish blue is sharp and creamy, for dressings, steak and burger toppings and cheese boards.
  - heading: Cheeses for boards
    paragraphs:
      - "For a cheese board, pair a hard cheese with a soft one and a blue. Comté is a hard French cow's-milk cheese with a nutty flavour. V.S.O.C Black Label is an extra-aged Gouda with crunchy crystals that form during long ageing. Serve board cheeses at room temperature: take them out of the refrigerator 30 to 60 minutes before service."
  - heading: "Reading the label: what 48% means"
    paragraphs:
      - The percentage on Dutch-style cheeses, such as Gouda 48% or Edam 40%, is the fat content of the cheese's dry matter, not of the whole cheese. Because cheese also contains water, the share of fat in the cheese as you eat it is lower than the number on the label.
  - heading: Storing cheese
    items:
      - Keep cheese refrigerated, between 2 °C and 7 °C.
      - Wrap cut faces tightly so they don't dry out, and rewrap after each use.
      - Store blue cheese wrapped and apart from other cheeses.
      - Keep feta covered in its brine.
      - Freezing changes the texture of most cheeses, making them crumbly; keep it for cheese that will be cooked or grated.
faqs:
  - q: Where can hotels buy imported cheese in Sri Lanka?
    a: Olive Foods imports and distributes European cheeses (Gouda, Edam, Cheddar, Emmental, Comté, Grana Padano, Pecorino Romano, feta, goat cheese and Danish blue) and supplies hotels, restaurants, cafés and retailers across Sri Lanka.
  - q: What is the difference between Grana Padano and Parmigiano Reggiano?
    a: Both are hard Italian grating cheeses made from cow's milk. Parmigiano Reggiano comes from a smaller area under stricter rules and is aged for at least 12 months; Grana Padano is aged for at least nine months and is milder and less expensive.
  - q: Which cheese is best for burgers?
    a: Processed cheese slices melt fastest and most evenly, which suits quick-service lines. For more flavour, use Cheddar or Gouda; for a premium burger, a little Danish blue.
links_LOCKED:
  brands:
    - daily-dairy
  categories:
    - Imported Cheese
  products:
    - daily-dairy-gouda-cheese-48
    - daily-dairy-edam-cheese-40
    - daily-dairy-cheddar-cheese-white-50
    - daily-dairy-emmental-cheese-45
    - daily-dairy-grana-padano-cheese-wheel
    - daily-dairy-pecorino-romano-cheese
    - daily-dairy-kolios-feta-cheese
    - daily-dairy-snow-white-danish-blue-cheese
    - daily-dairy-comte-cheese
    - daily-dairy-v-s-o-c-black-label-aged-gouda-48
    - generic-cheese-slice-128s
  sectors:
    - hotels
    - restaurants
    - supermarkets-and-retail
sources: []
notes: ""
```

### Italian pasta for restaurants: shapes, sauces and cooking

- Will be published at https://www.olivefoods.lk/guides/italian-pasta-for-restaurants

```yaml
id: guide/italian-pasta-for-restaurants
status: draft
slug: italian-pasta-for-restaurants
title: "Italian pasta for restaurants: shapes, sauces and cooking"
seoTitle: "Italian Pasta for Restaurants in Sri Lanka: Shapes and Cooking"
description: "A practical guide for restaurant and hotel kitchens in Sri Lanka: which pasta shape goes with which sauce, how to cook dried pasta for service, and how much to allow per portion."
summary: "Dried durum-wheat pasta is the backbone of an Italian menu: it keeps for months, cooks in minutes and holds its bite. Choose the shape for the sauce (long strands for oil and light tomato sauces, ribbons for cream and ragù, tubes and twists for chunky sauces and bakes), allow 80–100 g of dried pasta for a main course, and cook it in plenty of well-salted water. Olive Foods imports Dedicato pasta from Granoro in Puglia and Donna Chiara pasta, plus semolina lasagna sheets, for restaurants and hotels across Sri Lanka."
sections:
  - heading: Match the shape to the sauce
    table:
      head:
        - Shape
        - Best with
        - In the range
      rows:
        - - Long and thin
          - Olive oil and garlic, light tomato, seafood, carbonara
          - Spaghetti, linguine, spaghetti vermicelli
        - - Ribbons
          - Butter and cream sauces, mushroom, rich meat ragù
          - Tagliatelle (spinach), pappardelle
        - - Tubes and twists
          - Chunky vegetable and meat sauces, bakes, salads
          - Penne, fusilli, spirali fantasia, elbow macaroni
        - - Bows
          - Pasta salads, light creamy sauces
          - Farfalloni
        - - For baking
          - Layered and filled baked dishes
          - Lasagna sheets, cannelloni
  - heading: Cooking dried pasta for service
    paragraphs:
      - "Italian cooks follow a simple rule: 1 litre of water and about 10 g of salt for every 100 g of pasta. Plenty of water keeps the temperature up when the pasta goes in and stops it sticking. Start tasting a minute or two before the time on the pack and drain when the pasta is al dente, tender with a slight bite in the centre."
      - "Busy kitchens par-cook: boil the pasta for about two minutes less than the pack time, drain, spread it out or toss it with a little oil to cool, and portion it. At service, drop a portion into boiling water for a minute, or finish it directly in the hot sauce. Keep a little of the cooking water: its starch helps sauces cling to the pasta."
  - heading: Portions and yield
    paragraphs:
      - Allow 80–100 g of dried pasta for a main course and 50–60 g for a starter or side. Dried pasta roughly doubles to two-and-a-half times its weight when cooked, so a 1 kg pack gives about 10 to 12 main-course portions.
  - heading: Why durum wheat
    paragraphs:
      - Italian dried pasta is made from durum wheat semolina, a hard, high-protein wheat whose gluten keeps pasta firm when cooked; Italian law requires it for dried pasta made in Italy. Dedicato is Granoro's 100% Puglia line, made from durum wheat grown and milled in Puglia through a traced supply chain.
  - heading: Storing
    paragraphs:
      - Keep dried pasta sealed in a cool, dry place, off the floor and away from strong smells. Stored this way it keeps until the best-before date on the pack.
faqs:
  - q: How much dried pasta should I allow per person?
    a: Allow 80–100 g of dried pasta for a main course and 50–60 g for a starter or side. Dried pasta roughly doubles to two-and-a-half times its weight when cooked.
  - q: Which pasta shapes are best for baked dishes?
    a: Tubes and twists such as penne, fusilli and elbow macaroni hold sauce and cheese in a bake; lasagna sheets and cannelloni are made for layered and filled baked dishes.
  - q: Where can restaurants buy Italian pasta wholesale in Sri Lanka?
    a: Olive Foods imports Dedicato and Donna Chiara pasta and semolina lasagna sheets and supplies restaurants, hotels, cafés and retailers across Sri Lanka. Send a quote request with the shapes and quantities you need.
links_LOCKED:
  brands:
    - dedicato
    - donna-chiara
  categories:
    - Italian Pasta
    - Imported Cheese
  products:
    - donna-chiara-spaghetti
    - donna-chiara-linguine
    - donna-chiara-penne
    - donna-chiara-fusilli
    - donna-chiara-farfalloni
    - pasta
    - dedicato-pappardelle-sem
    - dedicato-tagliatelle-spinaci-80-500-gr
    - dedicato-cannelloni
    - generic-lasagna-semola
  sectors:
    - restaurants
    - hotels
sources: []
notes: ""
```

### Frozen fries and potato products for hotels and quick-service kitchens

- Will be published at https://www.olivefoods.lk/guides/frozen-fries-potato-products

```yaml
id: guide/frozen-fries-potato-products
status: draft
slug: frozen-fries-potato-products
title: Frozen fries and potato products for hotels and quick-service kitchens
seoTitle: "Frozen French Fries in Sri Lanka: A Guide for Kitchens"
description: "How restaurant, hotel and quick-service kitchens in Sri Lanka choose and cook frozen fries, wedges and hash browns: cut sizes, coated fries, frying temperature and oil care."
summary: "Frozen fries are potatoes that have been cut, blanched, usually par-fried and frozen, so a kitchen only has to finish them: fry from frozen at around 175 °C until golden. The cut decides the result. Thin cuts are crisper and faster, thicker cuts fluffier inside, and coated fries hold their crunch longer for delivery and buffets. Olive Foods imports Hungritos 9 mm fries, coated 7 mm shoestring fries, potato wedges and hash browns, and delivers them at −18 °C."
sections:
  - heading: Choosing a cut
    table:
      head:
        - Product
        - Character
        - Use it for
      rows:
        - - 9 mm fries
          - Balanced crisp outside, soft inside
          - Everyday sides, kids' menus, room service
        - - 7 mm shoestring, coated
          - Thin, extra crunchy, made to stay crisp longer
          - Burgers, fried-seafood baskets, delivery
        - - Potato wedges
          - Thick, fluffy inside
          - Starters, sharing plates, pub-style menus
        - - Hash browns
          - Shredded potato patties
          - Breakfast buffets and plates
  - heading: Frying for the best result
    items:
      - Fry straight from frozen. Thawed fries soak up oil and turn limp.
      - Heat the oil to around 175 °C, or as the pack says, before the fries go in.
      - "Fill the basket no more than halfway: too many frozen fries at once drop the oil temperature and the fries steam instead of crisping."
      - Shake the basket once or twice, drain well and salt away from the fryer; salt falling into the oil breaks it down faster.
      - Serve straight away, or choose coated fries where they have to wait.
  - heading: Looking after the oil
    paragraphs:
      - Fry oil decides the taste of the fries. Skim crumbs during service, filter the oil daily, top it up with fresh oil, and change it when it turns dark, smokes at normal frying temperature, foams, or starts to smell. Fry fish and battered foods in a separate fryer if you can, so the fries don't pick up the flavour.
  - heading: Wedges and hash browns
    paragraphs:
      - "Both cook from frozen, in the fryer or in a hot oven. Oven-baking suits breakfast buffets and large batches: spread them in a single layer and turn them halfway through."
  - heading: Storage
    paragraphs:
      - Keep frozen potato products at −18 °C and close opened bags tightly. Fries that thaw and refreeze stick together in clumps and lose their texture, so move deliveries into the freezer straight away.
faqs:
  - q: What temperature should frozen fries be cooked at?
    a: Fry frozen fries at around 175 °C, or the temperature given on the pack, until golden. Don't overfill the basket, or the oil temperature drops and the fries go soggy.
  - q: Should frozen fries be thawed before frying?
    a: No. Fry them straight from frozen. Thawed fries absorb more oil and come out limp.
  - q: Where can a restaurant buy frozen fries in Sri Lanka?
    a: Olive Foods imports Hungritos frozen fries (9 mm and coated 7 mm shoestring), potato wedges and hash browns, and delivers them at −18 °C to restaurants, hotels and caterers across Sri Lanka.
links_LOCKED:
  brands:
    - hungritos
  categories:
    - Frozen French Fries
    - Frozen Potato Products
  products:
    - hungritos-frozen-french-fries-9mm
    - hungritos-frozen-french-fries-shoes-strings-coated-7mm
    - hungritos-frozen-potato-wedges
    - hungritos-frozen-hash-brown-potato
  sectors:
    - restaurants
    - hotels
    - frozen-food
sources: []
notes: ""
```

### Mexican ingredients in Sri Lanka: tortillas and hot sauce

- Will be published at https://www.olivefoods.lk/guides/mexican-ingredients-sri-lanka

```yaml
id: guide/mexican-ingredients-sri-lanka
status: draft
slug: mexican-ingredients-sri-lanka
title: "Mexican ingredients in Sri Lanka: tortillas and hot sauce"
seoTitle: "Mexican Ingredients in Sri Lanka: Tortillas, Hot Sauce and More"
description: "How restaurants and cafés in Sri Lanka build a Mexican menu: choosing tortilla sizes, warming and storing tortillas, and the imported and local ingredients for burritos, tacos and quesadillas."
summary: "A Mexican menu in Sri Lanka starts with flour tortillas: 10-inch for burritos, wraps and quesadillas, 6-inch for tacos and fajitas. Add beans, sweet corn and melting cheese, a hot sauce such as Tabasco, and local tomatoes, onions, coriander, chillies, limes and avocados, and you can cover most of the dishes guests expect. Olive Foods imports Albertos tortillas, Tabasco, red kidney beans, sweet corn and Cheddar and supplies them to restaurants, cafés and hotels island-wide."
sections:
  - heading: Choosing a tortilla size
    items:
      - "10-inch wraps (6 per pack): burritos, wraps, large quesadillas and breakfast burritos."
      - "6-inch wraps (8 per pack): street-style tacos, fajitas, kids' portions and canapés."
  - heading: Warming and storing tortillas
    paragraphs:
      - Tortillas fold without cracking only when warm. Heat each one on a dry pan or griddle for a few seconds a side until soft and lightly spotted, or steam a stack wrapped in a damp cloth. Keep warmed tortillas wrapped in a cloth or tortilla warmer during service.
      - Reseal opened packs tightly so the tortillas don't dry out, and follow the storage instructions on the pack.
  - heading: Building the menu
    paragraphs:
      - Red kidney beans make chilli and a quick refried-style filling; sweet corn goes into salsas and salads. For quesadillas and burritos, use a cheese that melts well, such as Cheddar or Gouda. Fresh salsa (pico de gallo) and guacamole are made with local tomatoes, onions, coriander, chillies, limes and avocados.
  - heading: Tabasco in the kitchen and at the bar
    paragraphs:
      - Tabasco Original Red is made from tabasco peppers, vinegar and salt, so it adds acidity as well as heat. A few drops lift salsas, marinades, eggs, pizza and seafood, and it is the classic seasoning in a Bloody Mary. Put bottles on tables for guests who like more heat.
faqs:
  - q: Where can I buy tortillas wholesale in Sri Lanka?
    a: Olive Foods imports Albertos flour tortillas in 10-inch (6 per pack) and 6-inch (8 per pack) sizes and supplies restaurants, cafés, hotels and caterers across Sri Lanka.
  - q: What size tortilla is used for burritos?
    a: Burritos need a large tortilla, 10 inches or more, so the filling can be wrapped and the ends folded in. Six-inch tortillas are the usual size for tacos.
  - q: How do you stop tortillas cracking?
    a: Warm them before filling, on a dry pan or griddle for a few seconds a side or steamed in a damp cloth, and keep them wrapped until use.
links_LOCKED:
  brands:
    - albertos
    - tabasco
  categories:
    - Mexican
    - Seasonings & Sauce
    - Imported Cheese
  products:
    - albertos-albertos-flour-tortilla-wraps-10-6s
    - albertos-albertos-tortilla-wraps-6-8s
    - tabasco-hot-pepper-sauce-60ml
    - acroyali-red-kidney-beans
    - acroyali-sweet-corn-kernel
    - daily-dairy-cheddar-cheese-coloured-50
  sectors:
    - restaurants
    - hotels
sources: []
notes: ""
```

### How hotels and restaurants buy imported food through an importer

- Will be published at https://www.olivefoods.lk/guides/buying-imported-food-through-an-importer

```yaml
id: guide/buying-imported-food-through-an-importer
status: draft
slug: buying-imported-food-through-an-importer
title: How hotels and restaurants buy imported food through an importer
seoTitle: How to Buy Imported Food for a Hotel or Restaurant in Sri Lanka
description: "How hotels, restaurants and cafés in Sri Lanka source imported food through an importer and distributor: what the importer does, what to ask a supplier, and how ordering works with Olive Foods."
summary: Most hotels, restaurants and cafés in Sri Lanka buy imported ingredients through a local importer and distributor rather than importing themselves. The importer buys from producers abroad, ships, clears customs, stores the stock (frozen lines at −18 °C) and delivers to kitchens in workable quantities. With Olive Foods, you send a quote request listing the products and quantities you need and get trade pricing and delivery details, usually within one business day, with delivery across Sri Lanka.
sections:
  - heading: What an importer and distributor does
    items:
      - Finds and vets producers abroad and buys from them in container loads.
      - Arranges shipping, customs clearance and the import paperwork.
      - Stores the stock in bonded and cold-chain warehousing until it is needed.
      - Breaks bulk shipments into case quantities a kitchen can use.
      - Delivers to kitchens and stores, and keeps the same products available all year.
  - heading: Importing yourself or buying from a distributor
    paragraphs:
      - Importing directly means buying in the producer's minimum quantities, often a full container, paying overseas suppliers in advance, and handling shipping, clearance and storage yourself. It only makes sense for very large and steady volumes of a few products. A distributor lets a kitchen buy many products by the case, from one supplier, with local delivery and local payment.
  - heading: What to ask before choosing a supplier
    items:
      - "Range: can one supplier cover most of your imported needs, by category and brand?"
      - "Consistency: will the same products be in stock all year, so your menu doesn't change?"
      - "Cold chain: how are frozen lines stored and delivered?"
      - "Delivery: which areas and days are covered, and how much notice is needed?"
      - "Product information: specifications, ingredients, allergens, shelf life, and halal certificates where you need them."
      - "Ordering: can you order by phone, WhatsApp or online, and how quickly do you get prices?"
      - "Pricing and payment: are trade prices quoted per order, and what payment terms are offered?"
  - heading: How ordering works with Olive Foods
    steps:
      - Choose your products by category, brand or the kind of business you run on olivefoods.lk.
      - Send a quote request with the products, quantities and delivery location, through the website, by phone or on WhatsApp.
      - Get trade pricing and delivery details, usually within one business day.
      - Confirm the order and receive delivery anywhere in Sri Lanka, with frozen lines kept at −18 °C.
  - heading: Planning orders
    paragraphs:
      - Order the items you use every week in steady volumes, so your supplier can plan stock for you. Tell them early about busy periods (the tourist season, festive menus, large events) so the extra stock is in the country when you need it.
faqs:
  - q: Does Olive Foods deliver outside Colombo?
    a: Yes. Olive Foods delivers island-wide, to all 25 districts of Sri Lanka, from its warehouse at 292 Sea Street, Colombo 11.
  - q: How quickly does Olive Foods reply to a quote request?
    a: Usually within one business day, with trade pricing and delivery details for the products and quantities you asked for.
  - q: What should a quote request include?
    a: The products (or brands and categories) you need, quantities and how often you order them, your delivery location, and how to reach you. The more detail, the more accurate the quote.
links_LOCKED:
  brands: []
  categories:
    - Frozen Meat
    - Imported Cheese
    - Italian Pasta
    - Thai Products
  products: []
  sectors:
    - hotels
    - restaurants
    - bakeries-and-cafes
    - supermarkets-and-retail
    - catering
    - frozen-food
sources: []
notes: ""
```

---

_End of brief. Return the full document with your edits._
