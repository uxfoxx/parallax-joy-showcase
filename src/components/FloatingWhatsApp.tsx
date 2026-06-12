import { useLocation, useMatch } from "react-router-dom";
import { useProducts } from "@/lib/api";

/** Official WhatsApp glyph (phone-receiver inside a speech bubble). */
const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" aria-hidden className={className} fill="currentColor">
    <path d="M16.001 3.2C8.93 3.2 3.2 8.93 3.2 16c0 2.273.6 4.45 1.738 6.378L3.2 28.8l6.59-1.711A12.755 12.755 0 0 0 16 28.8c7.07 0 12.8-5.73 12.8-12.8S23.07 3.2 16.001 3.2zM16 26.27c-1.95 0-3.86-.522-5.532-1.51l-.397-.236-3.91 1.015 1.043-3.81-.258-.41A10.21 10.21 0 0 1 5.73 16c0-5.66 4.61-10.27 10.27-10.27S26.27 10.34 26.27 16c0 5.66-4.61 10.27-10.27 10.27zm5.626-7.69c-.308-.155-1.823-.9-2.106-1.003-.282-.103-.487-.155-.692.155-.205.31-.795 1.003-.974 1.21-.18.205-.36.232-.667.077-.308-.155-1.3-.479-2.476-1.527-.915-.817-1.532-1.825-1.713-2.135-.18-.31-.02-.477.135-.632.139-.139.308-.36.462-.54.155-.18.205-.31.308-.515.103-.205.052-.387-.026-.541-.077-.155-.692-1.668-.949-2.286-.25-.6-.504-.518-.692-.527-.18-.008-.387-.01-.594-.01-.205 0-.54.077-.821.387-.282.31-1.077 1.052-1.077 2.566 0 1.514 1.103 2.977 1.257 3.182.155.205 2.171 3.314 5.26 4.65.736.318 1.31.508 1.757.65.738.235 1.41.202 1.94.123.592-.088 1.823-.745 2.08-1.464.257-.72.257-1.336.18-1.464-.077-.13-.282-.205-.59-.36z"/>
  </svg>
);

const buildMessage = (productName?: string, url?: string) => {
  if (productName) {
    return `Hi Olive Foods, I'd like to inquire about ${productName}${url ? ` (${url})` : ""}.`;
  }
  return "Hi Olive Foods, I'd like to ask about your products and services.";
};

const FloatingWhatsApp = () => {
  const location = useLocation();
  const productMatch = useMatch("/products/:slug");
  const { data: products = [] } = useProducts();
  const matchedProduct = productMatch
    ? products.find((p) => p.slug === productMatch.params.slug)
    : undefined;

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}${location.search}`
      : undefined;
  const message = buildMessage(matchedProduct?.name, fullUrl);

  return (
    <a
      href={`https://wa.me/94112071717?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-4 sm:right-6 z-[9999] group print:hidden"
    >
      <div className="relative">
        {/* Pulse ring — throttled: ~2s burst every 12s instead of continuous */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-wa-pulse opacity-0" />
        {/* Button — official WhatsApp green with the WhatsApp glyph */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-transform duration-300 group-hover:scale-110">
          <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
      </div>
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {matchedProduct ? `Ask about ${matchedProduct.name}` : "Chat with us"}
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
