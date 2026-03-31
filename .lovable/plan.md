

# Add Contact Page, Link "Contact Us" Buttons, Add Inquiry CTAs to Product & Brand Detail Pages

## Overview
Create a new `/contact` page with a contact form and company details. Wire all "Contact Us" buttons (navbar, mobile menu, footer) to link there. Add "Inquire about this product/brand" buttons on detail pages that link to the contact page with pre-filled context.

## Changes

### 1. Create Contact Page — `src/pages/ContactPage.tsx`
- Uses `PageLayout` for consistent immersive dark background
- Hero section with transparent overlay (matching other inner pages)
- Two-column layout: left = contact form, right = contact details
- Form fields: Name, Email, Phone (optional), Subject dropdown (General Inquiry / Product Inquiry / Brand Inquiry / Partnership), Message
- Contact details panel: email (`info@olivefoods.lk`), phone (`+94 11 207 1717`), WhatsApp link, office address
- Accept `?subject=...&product=...&brand=...` query params to pre-fill subject and message when coming from product/brand pages
- Form submits via `supabase.functions.invoke` or stores to a `contact_submissions` table
- Toast on success/error
- Style: semi-transparent cards (`bg-background/90 backdrop-blur-sm`), matching existing page aesthetics

### 2. Create `contact_submissions` table (database migration)
- Columns: `id` (uuid), `name` (text), `email` (text), `phone` (text nullable), `subject` (text), `message` (text), `created_at` (timestamptz)
- RLS: public INSERT (anyone can submit), admin-only SELECT/DELETE

### 3. Update Navbar — `src/components/landing/Navbar.tsx`
- Wrap "Contact Us" `Button` (line 118-126) in a `Link to="/contact"`
- Wrap mobile "Contact Us" button (line 168-170) in a `Link to="/contact"`

### 4. Update Footer — `src/components/landing/Footer.tsx`
- Add "Contact" to Quick Links list

### 5. Add Route — `src/App.tsx`
- Import `ContactPage`, add `<Route path="/contact" element={<ContactPage />} />`

### 6. Add Inquiry Button to Product Detail — `src/pages/ProductDetailPage.tsx`
- Below the "Back to all products" link (line 90-92), add an "Inquire About This Product" button
- Links to `/contact?subject=Product+Inquiry&product={product.name}`
- Styled as a prominent CTA matching the brand (forest green / accent)

### 7. Add Inquiry Button to Brand Detail — `src/pages/BrandDetailPage.tsx`
- In the hero section after brand meta info (line 48), add "Inquire About This Brand" button
- Links to `/contact?subject=Brand+Inquiry&brand={brand.name}`

## Files

| File | Change |
|------|--------|
| `src/pages/ContactPage.tsx` | New — full contact page with form + details |
| `src/App.tsx` | Add `/contact` route |
| `src/components/landing/Navbar.tsx` | Link "Contact Us" buttons to `/contact` |
| `src/components/landing/Footer.tsx` | Add "Contact" to quick links |
| `src/pages/ProductDetailPage.tsx` | Add "Inquire About This Product" CTA |
| `src/pages/BrandDetailPage.tsx` | Add "Inquire About This Brand" CTA |
| Database migration | Create `contact_submissions` table with RLS |

