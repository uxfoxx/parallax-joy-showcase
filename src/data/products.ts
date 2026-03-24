export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string;
  origin: string;
  established: number;
  productCount: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brandSlug: string;
  brandName: string;
  category: string;
  description: string;
  featured: boolean;
  tags: string[];
  origin: string;
  sku: string;
}

export const categories = [
  "Grains & Cereals",
  "Beverages",
  "Dairy",
  "Processed Foods",
  "Spices & Seasonings",
  "Seafood",
];

export const brands: Brand[] = [
  { id: "1", slug: "golden-harvest", name: "Golden Harvest", description: "Premium grains and cereals sourced from the finest farms across Southeast Asia. Known for consistent quality and sustainable farming practices.", origin: "Thailand", established: 1998, productCount: 4 },
  { id: "2", slug: "pacific-seas", name: "Pacific Seas", description: "Wild-caught and sustainably farmed seafood from the pristine waters of the Pacific Ocean. Certified for quality and freshness.", origin: "New Zealand", established: 2005, productCount: 3 },
  { id: "3", slug: "alpine-fresh", name: "Alpine Fresh", description: "European dairy excellence — artisan cheeses, butter, and cream from Alpine pastures with centuries-old traditions.", origin: "Switzerland", established: 1985, productCount: 4 },
  { id: "4", slug: "sahara-spice", name: "Sahara Spice", description: "Exotic spices and seasonings handpicked from markets across North Africa and the Middle East. Bold flavors, pure ingredients.", origin: "Morocco", established: 2010, productCount: 3 },
  { id: "5", slug: "eastern-delight", name: "Eastern Delight", description: "Traditional Asian processed foods and ready-to-use ingredients crafted with authentic recipes and modern food safety standards.", origin: "Japan", established: 2002, productCount: 4 },
  { id: "6", slug: "nordic-naturals", name: "Nordic Naturals", description: "Clean-label beverages and health-focused products from Scandinavia. Organic, minimally processed, and naturally delicious.", origin: "Sweden", established: 2012, productCount: 3 },
];

export const products: Product[] = [
  // Golden Harvest
  { id: "1", slug: "premium-jasmine-rice", name: "Premium Jasmine Rice", brandSlug: "golden-harvest", brandName: "Golden Harvest", category: "Grains & Cereals", description: "Fragrant long-grain jasmine rice, aged for optimal texture. Perfect for everyday cooking and specialty dishes.", featured: true, tags: ["organic", "gluten-free"], origin: "Thailand", sku: "GH-JR-001" },
  { id: "2", slug: "organic-quinoa", name: "Organic Quinoa", brandSlug: "golden-harvest", brandName: "Golden Harvest", category: "Grains & Cereals", description: "Protein-rich tri-color quinoa sourced from certified organic farms.", featured: false, tags: ["organic", "high-protein"], origin: "Peru", sku: "GH-OQ-002" },
  { id: "3", slug: "basmati-gold", name: "Basmati Gold", brandSlug: "golden-harvest", brandName: "Golden Harvest", category: "Grains & Cereals", description: "Extra-long grain basmati rice, aged 2 years for exceptional aroma and fluffy texture.", featured: true, tags: ["premium", "aged"], origin: "India", sku: "GH-BG-003" },
  { id: "4", slug: "steel-cut-oats", name: "Steel Cut Oats", brandSlug: "golden-harvest", brandName: "Golden Harvest", category: "Grains & Cereals", description: "Hearty steel-cut oats for a nutritious breakfast. Minimally processed for maximum nutrition.", featured: false, tags: ["whole-grain", "fiber-rich"], origin: "Australia", sku: "GH-SO-004" },

  // Pacific Seas
  { id: "5", slug: "wild-salmon-fillet", name: "Wild Salmon Fillet", brandSlug: "pacific-seas", brandName: "Pacific Seas", category: "Seafood", description: "Flash-frozen wild-caught Alaskan salmon fillets. Rich in omega-3 fatty acids.", featured: true, tags: ["wild-caught", "omega-3"], origin: "Alaska", sku: "PS-SF-001" },
  { id: "6", slug: "king-prawns", name: "King Prawns", brandSlug: "pacific-seas", brandName: "Pacific Seas", category: "Seafood", description: "Jumbo king prawns, sustainably farmed and individually quick-frozen for freshness.", featured: false, tags: ["sustainable", "IQF"], origin: "New Zealand", sku: "PS-KP-002" },
  { id: "7", slug: "blue-fin-tuna-steaks", name: "Blue Fin Tuna Steaks", brandSlug: "pacific-seas", brandName: "Pacific Seas", category: "Seafood", description: "Sashimi-grade tuna steaks, perfect for fine dining and premium cuisine.", featured: true, tags: ["sashimi-grade", "premium"], origin: "Japan", sku: "PS-BT-003" },

  // Alpine Fresh
  { id: "8", slug: "gruyere-reserve", name: "Gruyère Reserve", brandSlug: "alpine-fresh", brandName: "Alpine Fresh", category: "Dairy", description: "18-month aged Gruyère cheese with a complex, nutty flavor profile. AOC certified.", featured: true, tags: ["aged", "AOC-certified"], origin: "Switzerland", sku: "AF-GR-001" },
  { id: "9", slug: "alpine-butter", name: "Alpine Butter", brandSlug: "alpine-fresh", brandName: "Alpine Fresh", category: "Dairy", description: "Slow-churned European-style butter with 82% butterfat content. Rich and creamy.", featured: false, tags: ["european-style", "premium"], origin: "France", sku: "AF-AB-002" },
  { id: "10", slug: "organic-cream", name: "Organic Heavy Cream", brandSlug: "alpine-fresh", brandName: "Alpine Fresh", category: "Dairy", description: "Fresh organic heavy cream from grass-fed Alpine cows. 40% fat content.", featured: false, tags: ["organic", "grass-fed"], origin: "Austria", sku: "AF-OC-003" },
  { id: "11", slug: "aged-parmesan", name: "Aged Parmesan", brandSlug: "alpine-fresh", brandName: "Alpine Fresh", category: "Dairy", description: "24-month aged Parmigiano-Reggiano with a rich, crystalline texture. DOP certified.", featured: true, tags: ["DOP", "aged-24m"], origin: "Italy", sku: "AF-AP-004" },

  // Sahara Spice
  { id: "12", slug: "saffron-threads", name: "Saffron Threads", brandSlug: "sahara-spice", brandName: "Sahara Spice", category: "Spices & Seasonings", description: "Hand-harvested Grade-1 saffron threads. Intense color, aroma, and flavor.", featured: true, tags: ["grade-1", "hand-harvested"], origin: "Iran", sku: "SS-ST-001" },
  { id: "13", slug: "ras-el-hanout", name: "Ras el Hanout Blend", brandSlug: "sahara-spice", brandName: "Sahara Spice", category: "Spices & Seasonings", description: "Traditional 27-spice North African blend. Warming, complex, and aromatic.", featured: false, tags: ["blend", "traditional"], origin: "Morocco", sku: "SS-RH-002" },
  { id: "14", slug: "smoked-paprika", name: "Smoked Paprika", brandSlug: "sahara-spice", brandName: "Sahara Spice", category: "Spices & Seasonings", description: "Oak-smoked sweet paprika with a deep, smoky aroma. Perfect for stews and marinades.", featured: false, tags: ["smoked", "sweet"], origin: "Spain", sku: "SS-SP-003" },

  // Eastern Delight
  { id: "15", slug: "miso-paste-white", name: "White Miso Paste", brandSlug: "eastern-delight", brandName: "Eastern Delight", category: "Processed Foods", description: "Traditionally fermented white miso paste. Mild, sweet, and versatile for soups and glazes.", featured: false, tags: ["fermented", "traditional"], origin: "Japan", sku: "ED-WM-001" },
  { id: "16", slug: "sriracha-reserve", name: "Sriracha Reserve", brandSlug: "eastern-delight", brandName: "Eastern Delight", category: "Processed Foods", description: "Small-batch aged sriracha with fresh red jalapeños. Bold heat, balanced sweetness.", featured: true, tags: ["small-batch", "aged"], origin: "Thailand", sku: "ED-SR-002" },
  { id: "17", slug: "coconut-cream", name: "Organic Coconut Cream", brandSlug: "eastern-delight", brandName: "Eastern Delight", category: "Processed Foods", description: "Cold-pressed organic coconut cream. No additives, preservatives, or emulsifiers.", featured: false, tags: ["organic", "cold-pressed"], origin: "Sri Lanka", sku: "ED-CC-003" },
  { id: "18", slug: "ponzu-sauce", name: "Yuzu Ponzu Sauce", brandSlug: "eastern-delight", brandName: "Eastern Delight", category: "Processed Foods", description: "Citrus-infused soy sauce made with fresh yuzu juice. Light and refreshing.", featured: true, tags: ["yuzu", "citrus"], origin: "Japan", sku: "ED-YP-004" },

  // Nordic Naturals
  { id: "19", slug: "oat-milk-barista", name: "Oat Milk Barista Edition", brandSlug: "nordic-naturals", brandName: "Nordic Naturals", category: "Beverages", description: "Barista-grade oat milk that froths beautifully. No added sugars, fortified with calcium.", featured: true, tags: ["barista", "no-sugar"], origin: "Sweden", sku: "NN-OM-001" },
  { id: "20", slug: "lingonberry-juice", name: "Lingonberry Juice", brandSlug: "nordic-naturals", brandName: "Nordic Naturals", category: "Beverages", description: "100% pure wild lingonberry juice. Rich in antioxidants and vitamin C.", featured: false, tags: ["wild-harvested", "antioxidant"], origin: "Finland", sku: "NN-LJ-002" },
  { id: "21", slug: "sparkling-elderflower", name: "Sparkling Elderflower", brandSlug: "nordic-naturals", brandName: "Nordic Naturals", category: "Beverages", description: "Naturally carbonated elderflower drink with a delicate floral sweetness.", featured: false, tags: ["sparkling", "floral"], origin: "Denmark", sku: "NN-SE-003" },
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return products.filter((p) => p.brandSlug === brandSlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function searchProducts(query: string, filters?: { category?: string; brand?: string }): Product[] {
  let results = products;
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (filters?.category) {
    results = results.filter((p) => p.category === filters.category);
  }
  if (filters?.brand) {
    results = results.filter((p) => p.brandSlug === filters.brand);
  }
  return results;
}
