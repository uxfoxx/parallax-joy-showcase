import { lazy, Suspense } from "react";
import Seo, { SITE_URL } from "@/components/Seo";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LogoStrip from "@/components/landing/LogoStrip";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import SectionTransition from "@/components/landing/SectionTransition";
import Footer from "@/components/landing/Footer";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgressRing from "@/components/motion/ScrollProgressRing";

/* Below-the-fold sections — code-split so the initial bundle drops to
 * the hero + LogoStrip + Featured trio. Each chunk loads on demand as
 * the visitor scrolls; Suspense fallback is null because the surrounding
 * SectionTransition divider already occupies the layout gap and
 * sections animate in via whileInView regardless. */
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
  return (
    <div className="smooth-scroll overflow-x-hidden">
      <Seo
        title="Olive Foods — Premium Food Importer & Distributor, Sri Lanka"
        description="Olive Foods is a premium food importer and distributor in Sri Lanka, supplying hotels, restaurants, cafés and supermarkets with globally sourced food brands — built on relationships, not transactions."
        path="/"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Olive Foods",
            url: SITE_URL,
            logo: `${SITE_URL}/olive-foods-hero-logo.svg`,
            description:
              "Premium food importer and distributor in Sri Lanka serving hotels, restaurants, cafés and supermarkets.",
            email: "info@olivefoods.lk",
            telephone: "+94112071717",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Colombo",
              addressCountry: "LK",
            },
            areaServed: "LK",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Olive Foods",
            url: SITE_URL,
          },
        ]}
      />
      <ImmersiveBackground />
      <Navbar />
      <FloatingWhatsApp />
     

      <div data-navbar-theme="dark">
        <HeroSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="dark">
        <LogoStrip />
      </div>
      <SectionTransition />
      <div data-navbar-theme="light">
        <FeaturedProducts />
      </div>
      <Suspense fallback={null}>
        <SectionTransition />
        <div data-navbar-theme="light">
          <OurProductsSection />
        </div>
        <SectionTransition />
        <div data-navbar-theme="dark">
          <WhyChooseUs />
        </div>
        <SectionTransition />
        <div data-navbar-theme="light">
          <CategoriesSection />
        </div>
        <SectionTransition />
        <div data-navbar-theme="dark">
          <BrandManifesto />
        </div>
        <SectionTransition />
        <div data-navbar-theme="light">
          <StatsSection />
        </div>
        <SectionTransition />
        <div data-navbar-theme="dark">
          <TeamSection />
        </div>
        <SectionTransition />
        <div data-navbar-theme="light">
          <OurPartnersHexagon />
        </div>
        <SectionTransition />
        <div data-navbar-theme="dark">
          <LocationsSection />
        </div>
        <SectionTransition />
        <div data-navbar-theme="light">
          <FAQSection />
        </div>
      </Suspense>
      <div data-navbar-theme="dark">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
