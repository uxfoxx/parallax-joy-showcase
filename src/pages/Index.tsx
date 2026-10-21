import { lazy, Suspense } from "react";
import Seo from "@/components/Seo";
import { organizationSchema } from "@/lib/site";
import { useSuppliedCategories } from "@/hooks/useSuppliedCategories";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LogoStrip from "@/components/landing/LogoStrip";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import Footer from "@/components/landing/Footer";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

/* Below-the-fold sections — code-split so the initial bundle drops to
 * the hero + LogoStrip + Featured trio. Each chunk loads on demand as
 * the visitor scrolls; Suspense fallback is null because the sections
 * animate in via whileInView regardless. */
const OurProductsSection = lazy(() => import("@/components/landing/OurProductsSection"));
const WhyChooseUs = lazy(() => import("@/components/landing/WhyChooseUs"));
const CategoriesSection = lazy(() => import("@/components/landing/CategoriesSection"));
const BrandManifesto = lazy(() => import("@/components/landing/BrandManifesto"));
const StatsSection = lazy(() => import("@/components/landing/StatsSection"));
const TeamSection = lazy(() => import("@/components/landing/TeamSection"));
const OurPartnersHexagon = lazy(() => import("@/components/landing/OurPartnersHexagon"));
const LocationsSection = lazy(() => import("@/components/landing/LocationsSection"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));

const Index = () => {
  const suppliedCategories = useSuppliedCategories();
  return (
    <div className="smooth-scroll overflow-x-clip">
      {/* Organization + WebSite structured data is defined statically in
          index.html (site-wide, JS-free). This just sets the homepage's
          title / description / canonical. */}
      <Seo
        title="Olive Foods: Premium Food Importer & Distributor, Sri Lanka"
        description="Olive Foods imports and distributes premium food and consumer brands across Sri Lanka, supplying hotels, restaurants, supermarkets and retailers island-wide from Colombo."
        path="/"
        schema={organizationSchema(suppliedCategories.map((c) => c.name))}
      />
      <ImmersiveBackground />
      <Navbar />
      <FloatingWhatsApp />

      <main>
      {/* Light hero, dark navbar over it (data-navbar-bar, see Navbar). */}
      <div data-navbar-theme="light" data-navbar-bar="dark">
        <HeroSection />
      </div>
      <div data-navbar-theme="dark">
        <LogoStrip />
      </div>
      <div data-navbar-theme="light">
        <FeaturedProducts />
      </div>
      <Suspense fallback={null}>
        <div data-navbar-theme="light">
          <OurProductsSection />
        </div>
        <div data-navbar-theme="dark">
          <WhyChooseUs />
        </div>
        <div data-navbar-theme="light">
          <CategoriesSection />
        </div>
        <div data-navbar-theme="dark">
          <BrandManifesto />
        </div>
        <div data-navbar-theme="light">
          <StatsSection />
        </div>
        <div data-navbar-theme="dark">
          <TeamSection />
        </div>
        <div data-navbar-theme="light">
          <OurPartnersHexagon />
        </div>
        <div data-navbar-theme="dark">
          <LocationsSection />
        </div>
        <div data-navbar-theme="light">
          <FAQSection />
        </div>
      </Suspense>
      </main>
      <div data-navbar-theme="dark">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
