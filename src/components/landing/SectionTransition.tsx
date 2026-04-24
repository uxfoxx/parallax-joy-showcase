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
    </div>
  );
};

export default SectionTransition;
