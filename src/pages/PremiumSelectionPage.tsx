import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SelectionHero from "@/components/premium/SelectionHero";
import ProvenanceTicker from "@/components/premium/ProvenanceTicker";
import BentoShowcase from "@/components/premium/BentoShowcase";
import SeasonalRail from "@/components/premium/SeasonalRail";
import WhatsAppCTA from "@/components/premium/WhatsAppCTA";
import { usePremiumProducts } from "@/lib/api";

const PremiumSelectionPage = () => {
  const { data: products = [], isLoading } = usePremiumProducts();

  return (
    <div className="smooth-scroll overflow-x-hidden bg-black">
      <Navbar />
      <FloatingWhatsApp />

      <div data-navbar-theme="dark">
        <SelectionHero />
      </div>
      <div data-navbar-theme="dark">
        <ProvenanceTicker />
      </div>
      <div data-navbar-theme="dark">
        <BentoShowcase products={isLoading ? [] : products} />
      </div>
      <div data-navbar-theme="dark">
        <SeasonalRail products={products} />
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

export default PremiumSelectionPage;
