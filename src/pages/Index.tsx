import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LogoStrip from "@/components/landing/LogoStrip";
import ScrollFloatingElement from "@/components/landing/ScrollFloatingElement";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
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
      <div data-navbar-theme="dark">
        <FeaturedProducts />
      </div>
      <SectionTransition />
      <div data-navbar-theme="light">
        <WhyChooseUs />
      </div>
      <SectionTransition colorFrom="hsl(140 50% 14% / 0.2)" colorTo="hsl(150 40% 8% / 0.3)" flip />
      <div data-navbar-theme="light">
        <CategoriesSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="light">
        <StatsSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="dark">
        <DarkStatsBanner />
      </div>
      <SectionTransition />
      <div data-navbar-theme="dark">
        <TeamSection />
      </div>
      <SectionTransition colorFrom="hsl(140 50% 14% / 0.2)" colorTo="hsl(150 40% 8% / 0.3)" flip />
      <div data-navbar-theme="light">
        <LocationsSection />
      </div>
      <SectionTransition colorFrom="hsl(150 40% 8% / 0.3)" colorTo="hsl(140 50% 12% / 0.3)" />
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
