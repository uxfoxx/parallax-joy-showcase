

# Complete Admin Panel — Full CRUD with All Fields

## Current State
The admin panel already has Dashboard, Brands, Products, and Categories pages with basic CRUD. However several gaps exist:

1. **Missing `image_url` field** in both Product and Brand create/edit forms — the database supports it but the admin UI doesn't expose it
2. **No Contact Submissions page** — submissions go to the DB but admins can't view/delete them
3. **No dedicated Featured management** — featured toggle exists in product form but no filtered view
4. **Dashboard is minimal** — no recent activity or quick actions

## Changes

### 1. Add `image_url` to Product Form
**File**: `src/pages/admin/AdminProducts.tsx`
- Add `image_url` text input field to the create/edit dialog
- Include it in `emptyForm` and `openEdit` mapping
- Include in save payload
- Show thumbnail preview in the table row when image_url exists

### 2. Add `image_url` to Brand Form
**File**: `src/pages/admin/AdminBrands.tsx`
- Add `image_url` text input field to the create/edit dialog
- Include in form state and save payload
- Show thumbnail in table

### 3. Create Contact Submissions Admin Page
**File**: `src/pages/admin/AdminSubmissions.tsx` (new)
- Table listing all contact submissions (name, email, subject, date)
- Expandable row or dialog to view full message
- Delete individual submissions with confirmation
- Search/filter by name or subject
- Add API hook `useContactSubmissions` and `useDeleteSubmission` to `src/lib/api.ts`

### 4. Create Featured Products Admin Page
**File**: `src/pages/admin/AdminFeatured.tsx` (new)
- Filtered view showing only `featured: true` products
- Quick toggle to unfeatured a product
- Link to edit the full product
- Uses existing `useFeaturedProducts` hook

### 5. Enhance Dashboard
**File**: `src/pages/admin/AdminDashboard.tsx`
- Add contact submissions count stat card
- Add "Recent Submissions" list (last 5)
- Add quick-action buttons linking to each admin section

### 6. Update Sidebar & Routes
**File**: `src/components/admin/AdminSidebar.tsx`
- Add "Featured" and "Submissions" nav items with icons (Star, MessageSquare)

**File**: `src/App.tsx`
- Add routes: `/admin/featured`, `/admin/submissions`

### 7. Add API Hooks
**File**: `src/lib/api.ts`
- `useContactSubmissions()` — fetch all submissions ordered by created_at desc
- `useDeleteSubmission(id)` — delete a submission

## Files

| File | Change |
|------|--------|
| `src/pages/admin/AdminProducts.tsx` | Add `image_url` field + thumbnail in table |
| `src/pages/admin/AdminBrands.tsx` | Add `image_url` field + thumbnail in table |
| `src/pages/admin/AdminSubmissions.tsx` | New — view/delete contact submissions |
| `src/pages/admin/AdminFeatured.tsx` | New — filtered featured products view |
| `src/pages/admin/AdminDashboard.tsx` | Add submissions stat + recent list + quick actions |
| `src/components/admin/AdminSidebar.tsx` | Add Featured + Submissions nav items |
| `src/App.tsx` | Add two new admin routes |
| `src/lib/api.ts` | Add submission hooks |

