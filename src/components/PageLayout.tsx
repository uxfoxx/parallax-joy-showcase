import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";
import ScrollFloatingElement from "@/components/landing/ScrollFloatingElement";
import SectionTransition from "@/components/landing/SectionTransition";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen smooth-scroll overflow-x-hidden">
      <ImmersiveBackground />
      <ScrollFloatingElement />
      <Navbar />
      <FloatingWhatsApp />
      <main className="relative z-10 pt-24">{children}</main>
      <SectionTransition />
      <div data-navbar-theme="dark">
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
