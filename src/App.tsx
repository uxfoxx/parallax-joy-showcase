import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import BrandsPage from "./pages/BrandsPage.tsx";
import BrandDetailPage from "./pages/BrandDetailPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import CategoriesPage from "./pages/CategoriesPage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import ProfileLinkPage from "./pages/ProfileLinkPage.tsx";

import ContactPage from "./pages/ContactPage.tsx";

// The admin panel is lazy-loaded: it carries SheetJS (xlsx import/export), the
// TipTap rich-text editor, the image cropper and QR generation — none of which
// a public visitor needs. Keeping it out of the entry chunk is the biggest
// single page-speed win for the public site.
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands.tsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.tsx"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories.tsx"));
const AdminFeatured = lazy(() => import("./pages/admin/AdminFeatured.tsx"));
const AdminSubmissions = lazy(() => import("./pages/admin/AdminSubmissions.tsx"));
const AdminPartners = lazy(() => import("./pages/admin/AdminPartners.tsx"));
const AdminBusinessProfiles = lazy(() => import("./pages/admin/AdminBusinessProfiles.tsx"));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center font-body text-sm text-muted-foreground">Loading…</div>
);
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { ProductModalProvider } from "@/lib/productModal";
import ProductDetailModal from "@/components/ProductDetailModal";
import { trackPageView } from "@/lib/analytics";

/* Cache responses for 5 minutes so navigating between pages doesn't refetch
 * and flash empty/loading states (the visitor's "have to reload twice for
 * images to show" perception was actually React Query refetching on every
 * route mount). */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    // The admin panel has its own scroll container (AdminLayout's <main>);
    // resetting window scroll there fights with dialog open/close and makes
    // the page jump to the top on every edit. Only auto-scroll the public site.
    if (location.pathname.startsWith("/admin")) return;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    // The route swap waits for AnimatePresence's exit (~220ms) and helmet sets
    // the new <title> a frame after mount — wait so GA records the right title.
    const t = window.setTimeout(() => trackPageView(location.pathname + location.search), 500);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.search]);

  return (
    <>
      <ScrollProgressBar />
      <ProductDetailModal />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/brands/:slug" element={<BrandDetailPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              {/* SEO category landing pages — not linked from the main nav (see CategoryPage). */}
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:slug" element={<CategoryPage />} />
              <Route path="/profile/:slug" element={<ProfileLinkPage />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="brands" element={<AdminBrands />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="business-profiles" element={<AdminBusinessProfiles />} />
                <Route path="featured" element={<AdminFeatured />} />
                <Route path="submissions" element={<AdminSubmissions />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ProductModalProvider>
            <AppRoutes />
          </ProductModalProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
