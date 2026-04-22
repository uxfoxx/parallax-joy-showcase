import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PremiumHero from "@/components/premium/PremiumHero";
import ProvenanceTicker from "@/components/premium/ProvenanceTicker";
import StoryPinned from "@/components/premium/StoryPinned";
import ConciergeSteps from "@/components/premium/ConciergeSteps";
import PremiumFAQ from "@/components/premium/PremiumFAQ";
import SelectionTeaser from "@/components/premium/SelectionTeaser";
import WhatsAppCTA from "@/components/premium/WhatsAppCTA";

const PremiumPage = () => {
  return (
    <div className="smooth-scroll overflow-x-hidden bg-black">
      <Navbar />
      <FloatingWhatsApp />

      <div data-navbar-theme="dark">
        <PremiumHero />
      </div>
      <div data-navbar-theme="dark">
        <ProvenanceTicker />
      </div>
      <div data-navbar-theme="dark">
        <StoryPinned />
      </div>
      <div data-navbar-theme="light">
        <ConciergeSteps />
      </div>
      <div data-navbar-theme="dark">
        <PremiumFAQ />
      </div>
      <div data-navbar-theme="dark">
        <SelectionTeaser />
      </div>
      <div data-navbar-theme="dark">
        <WhatsAppCTA />
      </div>
      <div data-navbar-theme="dark">
        <Footer />
      </div>
    </div>
  );
};

export default PremiumPage;
