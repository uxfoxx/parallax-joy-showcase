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
import CustomCursor from "@/components/landing/CustomCursor";

const Index = () => {
  return (
    <div className="smooth-scroll immersive-cursor" style={{ perspective: "1200px" }}>
      <ImmersiveBackground />
      <CustomCursor />
      <ScrollFloatingElement />
      <Navbar />

      {/* Hero pinned — content scrolls over it */}
      <div className="relative">
        <div className="sticky top-0 z-0 h-screen">
          <HeroSection />
        </div>
        <div className="relative z-[1]">
          <SectionTransition colorFrom="hsl(150 40% 8% / 0.4)" colorTo="hsl(140 50% 12% / 0.3)" />
          <LogoStrip />
          <SectionTransition colorFrom="hsl(140 50% 12% / 0.2)" colorTo="hsl(150 40% 10% / 0.4)" flip />
          <FeaturedProducts />
          <SectionTransition colorFrom="hsl(150 40% 10% / 0.3)" colorTo="hsl(140 50% 14% / 0.3)" />
          <WhyChooseUs />
          <SectionTransition colorFrom="hsl(140 50% 14% / 0.2)" colorTo="hsl(150 40% 8% / 0.3)" flip />
          <CategoriesSection />
          <SectionTransition colorFrom="hsl(150 40% 8% / 0.3)" colorTo="hsl(140 50% 12% / 0.4)" />
          <StatsSection />
          <SectionTransition colorFrom="hsl(140 50% 12% / 0.2)" colorTo="hsl(150 40% 10% / 0.3)" flip />

          <DarkStatsBanner />
          <SectionTransition colorFrom="hsl(150 40% 10% / 0.3)" colorTo="hsl(140 50% 14% / 0.2)" />
          <TeamSection />
          <SectionTransition colorFrom="hsl(140 50% 14% / 0.2)" colorTo="hsl(150 40% 8% / 0.3)" flip />
          <LocationsSection />
          <SectionTransition colorFrom="hsl(150 40% 8% / 0.3)" colorTo="hsl(140 50% 12% / 0.3)" />
          <FAQSection />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;
