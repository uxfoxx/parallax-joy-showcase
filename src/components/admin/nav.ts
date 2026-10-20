import {
  Activity,
  Box,
  ContactRound,
  Handshake,
  LayoutDashboard,
  Layers,
  MessageSquare,
  Star,
  Tag,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = { title: string; url: string; icon: LucideIcon; description: string };
export type AdminNavGroup = { label: string; items: AdminNavItem[] };

/** The admin's one navigation list: sidebar, top-bar breadcrumb and page titles all read it. */
export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard, description: "Catalogue, enquiries and the website at a glance." },
      { title: "Analytics", url: "/admin/analytics", icon: Activity, description: "Visitors, search, indexing, heatmaps and speed." },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { title: "Products", url: "/admin/products", icon: Box, description: "Everything in the catalogue, with images, categories and brands." },
      { title: "Brands", url: "/admin/brands", icon: Tag, description: "The brands Olive Foods imports and distributes." },
      { title: "Categories", url: "/admin/categories", icon: Layers, description: "Category pages and their images." },
      { title: "Product Showcase", url: "/admin/featured", icon: Star, description: "What the homepage features." },
    ],
  },
  {
    label: "Website",
    items: [
      { title: "Partner Logos", url: "/admin/partners", icon: Handshake, description: "Logos in the homepage “Our Brand Partners” marquee." },
      { title: "E-Business Profiles", url: "/admin/business-profiles", icon: ContactRound, description: "Staff digital business cards at /profile/<slug>." },
    ],
  },
  {
    label: "Inbox",
    items: [{ title: "Enquiries", url: "/admin/submissions", icon: MessageSquare, description: "Messages and quote requests from the contact form." }],
  },
];

export const ADMIN_NAV_ITEMS = ADMIN_NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })));

/** The nav entry for a path (exact for /admin, prefix for the rest). */
export const navItemFor = (path: string) =>
  ADMIN_NAV_ITEMS.find((i) => (i.url === "/admin" ? path === "/admin" || path === "/admin/" : path.startsWith(i.url)));
