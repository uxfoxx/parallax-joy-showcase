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
    <div className="smooth-scroll relative" style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}>
      <ImmersiveBackground />
      <CustomCursor />
      <ScrollFloatingElement />
      <div className="relative z-10" style={{ transformStyle: "preserve-3d" }}>
        <Navbar />
        <HeroSection />
        <SectionTransition colorFrom="hsl(140 50% 19% / 0.2)" colorTo="hsl(80 50% 31% / 0.1)" />
        <LogoStrip />
        <SectionTransition colorFrom="hsl(80 50% 31% / 0.15)" colorTo="hsl(75 38% 45% / 0.1)" flip />
        <FeaturedProducts />
        <SectionTransition colorFrom="hsl(140 50% 19% / 0.25)" colorTo="hsl(150 40% 14% / 0.15)" />
        <WhyChooseUs />
        <SectionTransition colorFrom="hsl(75 38% 45% / 0.15)" colorTo="hsl(80 50% 31% / 0.1)" flip />
        <CategoriesSection />
        <SectionTransition colorFrom="hsl(140 50% 19% / 0.2)" colorTo="hsl(150 40% 10% / 0.15)" />
        <StatsSection />
        <DarkStatsBanner />
        <SectionTransition colorFrom="hsl(80 50% 31% / 0.2)" colorTo="hsl(140 50% 19% / 0.1)" flip />
        <TeamSection />
        <SectionTransition colorFrom="hsl(140 50% 19% / 0.2)" colorTo="hsl(75 38% 45% / 0.1)" />
        <LocationsSection />
        <SectionTransition colorFrom="hsl(75 38% 45% / 0.15)" colorTo="hsl(140 50% 19% / 0.1)" flip />
        <FAQSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
