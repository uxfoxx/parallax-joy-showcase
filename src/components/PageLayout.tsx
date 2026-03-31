import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background smooth-scroll">
      <Navbar />
      <FloatingWhatsApp />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
