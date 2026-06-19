import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import BrandsPage from "./pages/BrandsPage.tsx";
import BrandDetailPage from "./pages/BrandDetailPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";

import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminBrands from "./pages/admin/AdminBrands.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";
import AdminFeatured from "./pages/admin/AdminFeatured.tsx";
import AdminSubmissions from "./pages/admin/AdminSubmissions.tsx";
import AdminPartners from "./pages/admin/AdminPartners.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { ProductModalProvider } from "@/lib/productModal";
import ProductDetailModal from "@/components/ProductDetailModal";

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
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/brands/:slug" element={<BrandDetailPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="partners" element={<AdminPartners />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="featured" element={<AdminFeatured />} />
              <Route path="submissions" element={<AdminSubmissions />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

const App = () => (
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
);

export default App;
