import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes, matchPath, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { lazyPage } from "@/lib/lazy-page";
import { queryClient } from "@/lib/query-client";

/* Every public page is its own chunk, so a visitor downloads the page they
 * opened rather than the whole site. main.tsx preloads the current route's
 * chunk before the first render (see lazyPage), so a prerendered page never
 * flashes the Suspense fallback; the rest load as the visitor navigates. */
const Index = lazyPage(() => import("./pages/Index.tsx"));
const NotFound = lazyPage(() => import("./pages/NotFound.tsx"));
const AboutPage = lazyPage(() => import("./pages/AboutPage.tsx"));
const BrandsPage = lazyPage(() => import("./pages/BrandsPage.tsx"));
const BrandDetailPage = lazyPage(() => import("./pages/BrandDetailPage.tsx"));
const ProductsPage = lazyPage(() => import("./pages/ProductsPage.tsx"));
const ProductDetailPage = lazyPage(() => import("./pages/ProductDetailPage.tsx"));
const CategoriesPage = lazyPage(() => import("./pages/CategoriesPage.tsx"));
const CategoryPage = lazyPage(() => import("./pages/CategoryPage.tsx"));
const SectorPage = lazyPage(() => import("./pages/SectorPage.tsx"));
const SiteMapPage = lazyPage(() => import("./pages/SiteMapPage.tsx"));
const ImporterPage = lazyPage(() => import("./pages/ImporterPage.tsx"));
const BrandOwnersPage = lazyPage(() => import("./pages/BrandOwnersPage.tsx"));
const GuidesPage = lazyPage(() => import("./pages/GuidesPage.tsx"));
const GuidePage = lazyPage(() => import("./pages/GuidePage.tsx"));
const ProfileLinkPage = lazyPage(() => import("./pages/ProfileLinkPage.tsx"));
const ContactPage = lazyPage(() => import("./pages/ContactPage.tsx"));

/** Public routes, in match order (the admin's nested routes are below). */
const PUBLIC_ROUTES = [
  { path: "/", Page: Index },
  { path: "/about", Page: AboutPage },
  { path: "/contact", Page: ContactPage },
  { path: "/brands", Page: BrandsPage },
  { path: "/brands/:slug", Page: BrandDetailPage },
  { path: "/products", Page: ProductsPage },
  { path: "/products/:slug", Page: ProductDetailPage },
  // SEO category landing pages — not linked from the main nav (see CategoryPage).
  { path: "/categories", Page: CategoriesPage },
  { path: "/categories/:slug", Page: CategoryPage },
  // SEO buyer-sector landing pages ("hotel food supplier…") — same policy as categories.
  { path: "/supply/:slug", Page: SectorPage },
  { path: "/site-map", Page: SiteMapPage },
  { path: "/food-importer-distributor-sri-lanka", Page: ImporterPage },
  { path: "/exclusive-distributor-sri-lanka", Page: BrandOwnersPage },
  { path: "/guides", Page: GuidesPage },
  { path: "/guides/:slug", Page: GuidePage },
  { path: "/profile/:slug", Page: ProfileLinkPage },
];

/** Loads the chunk(s) for the page at `pathname` (main.tsx, before mounting). */
export function preloadRoute(pathname: string): Promise<void> {
  if (pathname.startsWith("/admin")) return Promise.resolve();
  const route = PUBLIC_ROUTES.find((r) => matchPath(r.path, pathname));
  return (route?.Page ?? NotFound).preload();
}

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
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics.tsx"));

/** True once the browser has gone idle after the first paint. */
function useIdle() {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const go = () => setIdle(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(go, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(go, 1500);
    return () => window.clearTimeout(t);
  }, []);
  return idle;
}

const Toasters = lazy(() => import("@/components/Toasters"));
const ProductDetailModal = lazy(() => import("@/components/ProductDetailModal"));

/** The toast hosts and the product quick-view stay out of the entry chunk and
 *  load once the page has settled: nothing opens them before the visitor has
 *  done something (a quick-view opened sooner loads it there and then). */
function DeferredUi() {
  const idle = useIdle();
  const { activeSlug } = useProductModal();
  return idle || activeSlug ? (
    <Suspense fallback={null}>
      <Toasters />
      <ProductDetailModal />
    </Suspense>
  ) : null;
}

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center font-body text-sm text-muted-foreground">Loading…</div>
);
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { ProductModalProvider, useProductModal } from "@/lib/productModal";
import { trackPageView } from "@/lib/analytics";
import AnalyticsConsent from "@/components/AnalyticsConsent";

/** Starts loading a page's chunk as soon as the visitor points at, touches or
 *  tabs to a link to it, so by the time the exit fade ends there is rarely
 *  anything left to wait for (no route fallback flash). */
function usePrefetchOnIntent() {
  useEffect(() => {
    const onIntent = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const url = new URL((a as HTMLAnchorElement).href, window.location.href);
      if (url.origin !== window.location.origin) return;
      preloadRoute(url.pathname).catch(() => {});
    };
    const opts = { passive: true, capture: true } as const;
    for (const type of ["pointerover", "touchstart", "focusin"]) document.addEventListener(type, onIntent, opts);
    return () => {
      for (const type of ["pointerover", "touchstart", "focusin"]) document.removeEventListener(type, onIntent, opts);
    };
  }, []);
}

const AppRoutes = () => {
  const location = useLocation();
  usePrefetchOnIntent();

  useEffect(() => {
    // The admin panel has its own scroll container (AdminLayout's <main>);
    // resetting window scroll there fights with dialog open/close and makes
    // the page jump to the top on every edit. Only auto-scroll the public site.
    if (location.pathname.startsWith("/admin")) return;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Deep links to a section (/about#certificate, /contact#find-us). The route
    // swap waits for the exit animation and some sections are lazy-loaded, so
    // start after the swap and wait for the target to exist; offset by the
    // fixed navbar.
    if (location.pathname.startsWith("/admin") || !location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    let tries = 0;
    let poll = 0;
    const start = window.setTimeout(() => {
      poll = window.setInterval(() => {
        const el = document.getElementById(id);
        if (!el && ++tries < 40) return;
        window.clearInterval(poll);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      }, 100);
    }, 350);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(poll);
    };
  }, [location.pathname, location.hash]);

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
      <DeferredUi />
      <AnalyticsConsent />
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
              {PUBLIC_ROUTES.map(({ path, Page }) => (
                <Route key={path} path={path} element={<Page />} />
              ))}

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
                <Route path="analytics" element={<AdminAnalytics />} />
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
      <BrowserRouter>
        <ProductModalProvider>
          <AppRoutes />
        </ProductModalProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
