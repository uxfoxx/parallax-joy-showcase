import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FoilSeal from "@/components/FoilSeal";

/**
 * The seal that closes "The Olive Standard".
 *
 * The manifesto above it is a claim; this is the receipt. It's set the way a
 * seal closes a charter — pressed over a hairline rule at the foot of the
 * statement — rather than as a separate trust-badge section, so the claim and
 * its proof read as one object. The certification detail lives on /about.
 */
const StandardSeal = () => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-15%" }}
    transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="mt-14 flex flex-col items-center"
  >
    {/* The seal, pressed over the rule that closes the statement */}
    <div className="relative flex w-full max-w-sm items-center justify-center">
      <span
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/35 to-transparent"
      />
      <FoilSeal coinClassName="w-24 h-24 sm:w-28 sm:h-28" glowClassName="w-44 h-44" />
    </div>

    <p className="mt-5 font-body text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
      GMP certified · Codex Alimentarius CXC 1-1969
    </p>

    <Link
      to="/about#certificate"
      /* py-3 keeps the tap target at ~44px; the text is only ~20px tall. */
      className="group mt-0.5 inline-flex items-center gap-1.5 px-2 py-3 font-body text-[13px] font-semibold text-accent transition-colors hover:text-accent/80"
    >
      See the certification
      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  </motion.div>
);

export default StandardSeal;
