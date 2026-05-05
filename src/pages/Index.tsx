import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LogoStrip from "@/components/landing/LogoStrip";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import OurProductsSection from "@/components/landing/OurProductsSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import CategoriesSection from "@/components/landing/CategoriesSection";
import WhatsAppOrderSection from "@/components/landing/WhatsAppOrderSection";
import StatsSection from "@/components/landing/StatsSection";
import TeamSection from "@/components/landing/TeamSection";
import MeetTheTeam from "@/components/landing/MeetTheTeam";
import LocationsSection from "@/components/landing/LocationsSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";
import SectionTransition from "@/components/landing/SectionTransition";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgressRing from "@/components/motion/ScrollProgressRing";

const Index = () => {
  return (
    <div className="smooth-scroll overflow-x-hidden">
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
        <WhatsAppOrderSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="light">
        <StatsSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="dark">
        <TeamSection />
      </div>
      {/* <SectionTransition />
      <div data-navbar-theme="light">
        <MeetTheTeam />
      </div> */}
      <SectionTransition />
      <div data-navbar-theme="dark">
        <LocationsSection />
      </div>
      <SectionTransition />
      <div data-navbar-theme="light">
        <FAQSection />
      </div>
      <div data-navbar-theme="dark">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
