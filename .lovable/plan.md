

# Add Product Data from Excel to Database

## Overview
The uploaded Excel file contains ~200 products across 20+ categories with brands like Hungritos, Azizaa, Royal Arm, Donna Chiara, Acroyali, etc. Currently the DB has only 21 dummy products with 6 generic brands. This plan replaces/supplements with real Olive Foods product data.

## Step 1 — Add New Categories
Insert ~16 new categories to match the Excel structure:
Frozen French Fries, Rice, Honey, Seasonings & Sauces, Edible Oils, Vinegar, Dry Nuts & Seeds, Toppings, Chocolate & Pastry, Flour, Italian Pasta, Japanese Products, Mexican, Canned Vegetables & Fruits, Herbs & Spices, Meat, Poultry, Frozen Berry, Cheese, Packing Material

## Step 2 — Add New Brands
Insert ~15 real brands from the Excel:
Bon Vegato, Hungritos, Azizaa, Royal Arm, Grawings, Mara, Remia, Tabasco, Super Chef, Donna Chiara, Dedicato, Kikkoman, Acroyali, Hersheys, Colatta, American Gourmet, HP, ABC, Figaro, Shams, KD, Blue Diamond, Cadbury, Virgina, Wadi, Swiss Garden, Falcon

(Group smaller brands under umbrella brands where logical — aim for ~15 distinct brands)

## Step 3 — Insert Products
Insert all ~180 food products (excluding packing materials) with:
- Name, category, brand_id, slug (auto-generated), pack_size info in description
- Relevant Unsplash image URLs per category (e.g., french fries image for frozen fries, rice image for rice products, olive oil image for oils, etc.)
- SKU from pack size column
- Origin based on product type (e.g., "India" for Basmati, "Italy" for pasta, "Japan" for Japanese products, "Australia" for meat)

## Step 4 — Mark Featured Products
Set `featured = true` on ~8 representative products across categories (e.g., Basmati Rice, Beef Striploin, Extra Virgin Olive Oil, Saffron, Wild Salmon, Spaghetti)

## Technical Approach
- Use the Supabase insert tool for all data operations (INSERT statements)
- Batch inserts by category to stay organized
- Use Unsplash URLs for images (category-level images shared across similar products)
- No schema migrations needed — existing columns support all data

## Files
No code file changes needed — this is purely a data insertion task using the database insert tool.

