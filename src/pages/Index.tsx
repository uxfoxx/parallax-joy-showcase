import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LogoStrip from "@/components/landing/LogoStrip";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import CategoriesSection from "@/components/landing/CategoriesSection";
import StatsSection from "@/components/landing/StatsSection";
import DarkStatsBanner from "@/components/landing/DarkStatsBanner";
import TeamSection from "@/components/landing/TeamSection";
import LocationsSection from "@/components/landing/LocationsSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="smooth-scroll">
      <Navbar />
      <HeroSection />
      <LogoStrip />
      <FeaturedProducts />
      <WhyChooseUs />
      <CategoriesSection />
      <StatsSection />
      <DarkStatsBanner />
      <TeamSection />
      <LocationsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
