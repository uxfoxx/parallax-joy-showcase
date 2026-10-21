import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import EnquiryBar from "@/components/EnquiryBar";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";
import ScrollFloatingElement from "@/components/landing/ScrollFloatingElement";
import SectionTransition from "@/components/landing/SectionTransition";
import type { EnquiryTarget } from "@/lib/contact";

interface PageLayoutProps {
  children: React.ReactNode;
  /** When set, shows the mobile sticky enquiry bar for this product/category. */
  enquiry?: EnquiryTarget;
}

const PageLayout = ({ children, enquiry }: PageLayoutProps) => {
  return (
    <div className="min-h-screen smooth-scroll overflow-x-clip">
      <ImmersiveBackground />
      <ScrollFloatingElement />
      <Navbar />
      <FloatingWhatsApp hideOnMobile={!!enquiry} />
      <main className="relative z-10 ">{children}</main>
      <SectionTransition />
      <div data-navbar-theme="dark">
        <Footer />
        {/* Room for the fixed enquiry bar so it never covers the footer's end. */}
        {enquiry && <div aria-hidden className="md:hidden h-[calc(4.25rem+env(safe-area-inset-bottom))]" />}
      </div>
      {enquiry && <EnquiryBar target={enquiry} />}
    </div>
  );
};

export default PageLayout;
