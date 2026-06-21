import { motion } from "framer-motion";
import { pathDrawTransition } from "@/lib/motion";

const SectionTransition = () => {
  return (
    <div className="relative w-full py-1">
      <div
        className="h-[2px] w-full animate-gradient-sweep"
        style={{
          background: "linear-gradient(90deg, #0F241A, #5C7928, #879D48, #5C7928, #0F241A)",
          backgroundSize: "200% auto",
        }}
      />
      {/* Scroll-drawn gold hairline overlay (motion.dev "line draw") */}
      <svg
        aria-hidden
        viewBox="0 0 1200 2"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[2px] pointer-events-none"
      >
        <motion.line
          x1="0"
          y1="1"
          x2="1200"
          y2="1"
          stroke="hsl(75 42% 55% / 0.55)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={pathDrawTransition}
        />
      </svg>

      {/* Centred ornamental flourish — diamond + tapered flanks */}
      <motion.svg
        aria-hidden
        viewBox="0 0 80 20"
        className="absolute left-1/2 top-1/2 h-4 w-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0, scale: 0.4 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <g fill="hsl(var(--accent))">
          {/* Tapered flanks */}
          <path d="M30 9.3 L6 10 L30 10.7 Z" fillOpacity="0.7" />
          <path d="M50 9.3 L74 10 L50 10.7 Z" fillOpacity="0.7" />
          {/* Centre diamond + leaf tips */}
          <path d="M40 3 L44.5 10 L40 17 L35.5 10 Z" />
          <circle cx="40" cy="10" r="1.6" fill="hsl(var(--background))" />
        </g>
        <g fill="none" stroke="hsl(var(--accent))" strokeWidth="0.9" strokeLinecap="round">
          <circle cx="6" cy="10" r="1.4" />
          <circle cx="74" cy="10" r="1.4" />
        </g>
      </motion.svg>
    </div>
  );
};

export default SectionTransition;
