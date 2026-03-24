

# Admin Panel with Supabase Backend for Products & Brands

## Overview
Move all product and brand data from the hardcoded `src/data/products.ts` file to Supabase database tables. Build an admin panel with full CRUD operations. Connect the landing page's Featured Products section to real data. Add "Home" link to the navbar.

## Database Schema

### Table: `brands`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| slug | text (unique) | URL-friendly name |
| name | text | |
| description | text | |
| origin | text | |
| established | integer | |
| created_at | timestamptz | default now() |

### Table: `products`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| slug | text (unique) | URL-friendly name |
| name | text | |
| brand_id | uuid (FK → brands) | |
| category | text | |
| description | text | |
| featured | boolean | default false |
| tags | text[] | array of strings |
| origin | text | |
| sku | text | |
| created_at | timestamptz | default now() |

### Table: `categories`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| name | text (unique) | |
| description | text | nullable |

### RLS Policies
- All tables: public SELECT for everyone (public website)
- INSERT/UPDATE/DELETE: restricted to authenticated admin users
- Admin role table using `user_roles` pattern from system instructions

### Seed Data
Insert all existing hardcoded brands, products, and categories via migration.

## Admin Panel

### Route: `/admin`
Protected route — requires authenticated user with `admin` role.

### Layout
Sidebar navigation (using shadcn Sidebar) with sections:
- Dashboard (overview counts)
- Brands (list, create, edit, delete)
- Products (list, create, edit, delete)
- Categories (list, create, edit, delete)

### Auth
- Simple login page at `/admin/login` using Supabase email/password auth
- After login, check `user_roles` table for admin role
- Redirect non-admins away

### CRUD Pages
Each entity (brands, products, categories) gets:
- **List view**: Table with search, edit/delete actions
- **Create/Edit**: Form dialog or page with all fields
- **Delete**: Confirmation dialog

## Frontend Data Layer

### New file: `src/lib/api.ts`
React Query hooks that fetch from Supabase instead of static data:
- `useBrands()`, `useBrand(slug)`
- `useProducts(filters?)`, `useProduct(slug)`, `useFeaturedProducts()`
- `useCategories()`

### Update public pages
- `ProductsPage.tsx` — use `useProducts()` hook
- `BrandsPage.tsx` — use `useBrands()` hook
- `BrandDetailPage.tsx` — use `useBrand(slug)` + `useProducts({ brandSlug })`
- `ProductDetailPage.tsx` — use `useProduct(slug)`
- `FeaturedPage.tsx` — use `useFeaturedProducts()`

### Landing page connections
- `FeaturedProducts.tsx` — replace hardcoded "Daily Multivitamin" cards with real featured products from Supabase
- `CategoriesSection.tsx` — pull categories from Supabase

## Navbar Update

Add "Home" as the first link pointing to `/`:
```
const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Brands", href: "/brands" },
  { label: "Products", href: "/products" },
  { label: "Featured", href: "/featured" },
];
```

## Files Summary

| Action | File |
|--------|------|
| Create | Supabase migration: `brands`, `products`, `categories`, `user_roles` tables + RLS + seed data |
| Create | `src/lib/api.ts` — React Query hooks for Supabase data |
| Create | `src/pages/admin/AdminLogin.tsx` — login page |
| Create | `src/pages/admin/AdminLayout.tsx` — sidebar layout |
| Create | `src/pages/admin/AdminDashboard.tsx` — overview |
| Create | `src/pages/admin/AdminBrands.tsx` — brands CRUD |
| Create | `src/pages/admin/AdminProducts.tsx` — products CRUD |
| Create | `src/pages/admin/AdminCategories.tsx` — categories CRUD |
| Create | `src/components/admin/AdminSidebar.tsx` — sidebar nav |
| Modify | `src/App.tsx` — add admin routes |
| Modify | `src/components/landing/Navbar.tsx` — add Home link |
| Modify | `src/components/landing/FeaturedProducts.tsx` — use real data |
| Modify | `src/components/landing/CategoriesSection.tsx` — use real data |
| Modify | `src/pages/ProductsPage.tsx` — use Supabase hooks |
| Modify | `src/pages/BrandsPage.tsx` — use Supabase hooks |
| Modify | `src/pages/BrandDetailPage.tsx` — use Supabase hooks |
| Modify | `src/pages/ProductDetailPage.tsx` — use Supabase hooks |
| Modify | `src/pages/FeaturedPage.tsx` — use Supabase hooks |
| Remove | `src/data/products.ts` — no longer needed (keep as fallback initially) |

## Technical Notes
- Supabase client setup via Lovable Cloud integration
- All admin mutations use `supabase.from().insert/update/delete`
- React Query for caching and refetching
- Brand-product relationship: products join brands via `brand_id` FK
- Product form includes brand dropdown populated from brands table

