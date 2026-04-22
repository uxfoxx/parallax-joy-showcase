import { MessageCircle } from "lucide-react";

const DEFAULT_MSG = encodeURIComponent(
  "Hi Olive Foods, I'd like to ask about your products and services."
);

const FloatingWhatsApp = () => {
  return (
    <a
      href={`https://wa.me/94112071717?text=${DEFAULT_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-4 sm:right-6 z-[9999] group print:hidden"
    >
      <div className="relative">
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        {/* Button */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-transform duration-300 group-hover:scale-110">
          <MessageCircle className="w-6 h-6 text-white fill-white" />
        </div>
      </div>
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat with us
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
