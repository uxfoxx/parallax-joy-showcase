import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LogoStrip from "@/components/landing/LogoStrip";
import ScrollFloatingElement from "@/components/landing/ScrollFloatingElement";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import OurProductsSection from "@/components/landing/OurProductsSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import CategoriesSection from "@/components/landing/CategoriesSection";
import StatsSection from "@/components/landing/StatsSection";
import DarkStatsBanner from "@/components/landing/DarkStatsBanner";
import TeamSection from "@/components/landing/TeamSection";
import LocationsSection from "@/components/landing/LocationsSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";
import SectionTransition from "@/components/landing/SectionTransition";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  return (
    <div className="smooth-scroll overflow-x-hidden">
      <ImmersiveBackground />
      <ScrollFloatingElement />
      <Navbar />
      <FloatingWhatsApp />

      <div data-navbar-theme="dark">
        <HeroSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="light">
        <LogoStrip />
      </div>
      <SectionTransition />
      <div data-navbar-theme="light">
        <FeaturedProducts />
      </div>
      <div data-navbar-theme="light">
        <WhyChooseUs />
      </div>
      <SectionTransition />
      <div data-navbar-theme="light">
        <CategoriesSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="dark">
        <StatsSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="light">
        <DarkStatsBanner />
      </div>
      <SectionTransition />
      <div data-navbar-theme="dark">
        <TeamSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="light">
        <LocationsSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="dark">
        <FAQSection />
      </div>
      <div data-navbar-theme="dark">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
