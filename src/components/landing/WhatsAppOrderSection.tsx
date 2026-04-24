import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { MessageCircle, Check, CheckCheck, Sparkles } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";
import SplitText from "@/components/motion/SplitText";
import { waLink, ENQUIRE_MSG } from "@/components/premium/premiumConstants";

/**
 * "How to order via WhatsApp" — creative animated landing section.
 *
 * A life-size iPhone-style phone frame anchored on the right, with a scripted
 * WhatsApp conversation that plays out as the section enters view: typing
 * indicator → message bubble → reply. Left column carries the 4-step concierge
 * narrative (adapted from the old premium page's ConciergeSteps), each step
 * tied to the chat beat on the right. A magnetic WhatsApp CTA at the end.
 */

type Beat =
  | { kind: "typing"; from: "them"; delay: number }
  | { kind: "msg"; from: "you" | "them"; text: string; delay: number };

// Conversation script — beats play out sequentially once the phone is in view.
const script: Beat[] = [
  { kind: "msg", from: "you", text: "Hi Olive Foods — I'm looking for a whole Australian wagyu striploin for the weekend.", delay: 0.2 },
  { kind: "typing", from: "them", delay: 1.8 },
  { kind: "msg", from: "them", text: "Hello! We have MB7+ Rangers Valley in stock — 4.2kg average. Happy to share pricing and photos.", delay: 3.4 },
  { kind: "msg", from: "you", text: "Perfect. Can you deliver to Colombo 5 tomorrow?", delay: 5.2 },
  { kind: "typing", from: "them", delay: 6.0 },
  { kind: "msg", from: "them", text: "Yes — cold-chain van leaves at 10am. You'll have it by noon. Shall I reserve it? 🧊", delay: 7.6 },
];

const steps = [
  { num: "01", title: "Say what you need.", body: "Open WhatsApp, tell our concierge team what you're after — a specific cut, a cheese board, or a recommendation for the occasion." },
  { num: "02", title: "We curate for you.", body: "Instead of scrolling a static catalogue, receive a tailored list with current pricing, provenance, and availability." },
  { num: "03", title: "Confirm and pay.", body: "Approve your selection in-chat. Secure payment link, or pay on delivery — whichever you prefer." },
  { num: "04", title: "Cold-chain to your door.", body: "Hand-picked from our bonded warehouse, temperature-controlled, delivered island-wide by our own logistics fleet." },
];

const TypingDots = () => (
  <div className="inline-flex items-center gap-1 px-3 py-2.5 rounded-2xl rounded-bl-sm bg-white text-forest-deep">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="block w-1.5 h-1.5 rounded-full bg-forest-mid/60"
        animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
      />
    ))}
  </div>
);

const Bubble = ({ from, children }: { from: "you" | "them"; children: React.ReactNode }) => {
  const isYou = from === "you";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isYou ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[78%] px-3.5 py-2 font-body text-[13px] leading-snug shadow-sm ${
          isYou
            ? "rounded-2xl rounded-br-sm bg-[#DCF8C6] text-forest-deep"
            : "rounded-2xl rounded-bl-sm bg-white text-forest-deep"
        }`}
      >
        {children}
        {isYou && (
          <span className="inline-flex items-center gap-0.5 ml-2 text-[10px] text-forest-deep/45 align-middle">
            <CheckCheck className="w-3 h-3 text-sky-500" />
          </span>
        )}
      </div>
    </motion.div>
  );
};

const PhoneMockup = () => {
  const phoneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(phoneRef, { once: true, margin: "-30% 0px -20% 0px" });
  const [tick, setTick] = useState(0);

  // Start the chat reel only once the phone enters view.
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const id = window.setInterval(() => setTick((Date.now() - start) / 1000), 100);
    return () => window.clearInterval(id);
  }, [inView]);

  // Active typing indicator: shown only while tick is within its 1.4s window before the next msg.
  const typingActive = script.find((b) => {
    if (b.kind !== "typing") return false;
    const nextMsg = script.find((m, i) => i > script.indexOf(b) && m.kind === "msg");
    return tick >= b.delay && (!nextMsg || tick < nextMsg.delay);
  });

  const shownBubbles = script
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => b.kind === "msg" && tick >= b.delay);

  return (
    <div ref={phoneRef} className="relative mx-auto w-full max-w-[340px] md:max-w-[360px]">
      {/* Glow */}
      <div
        className="absolute -inset-10 rounded-[60px] opacity-60 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle at center, hsl(150 60% 40% / 0.35), transparent 60%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
        className="relative rounded-[42px] p-3 bg-gradient-to-br from-[#1a1a1a] via-[#0c0c0c] to-[#1a1a1a] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10"
      >
        {/* Inner screen */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#0b141a] aspect-[9/19] flex flex-col">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-28 rounded-full bg-black z-30" />

          {/* WhatsApp header */}
          <div className="relative z-10 flex items-center gap-3 px-4 pt-9 pb-3 bg-[#075E54] text-white">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-forest-deep" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-body text-[13px] font-semibold truncate">Olive Foods · Concierge</div>
              <div className="font-body text-[10px] text-white/70 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                online · replies within the hour
              </div>
            </div>
          </div>

          {/* Chat area with WhatsApp-ish background */}
          <div
            className="relative flex-1 px-3 py-4 space-y-2 overflow-hidden"
            style={{
              backgroundColor: "#0b141a",
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "18px 18px, 40px 40px",
              backgroundPosition: "0 0, 9px 9px",
            }}
          >
            {shownBubbles.map(({ b, i }) => {
              if (b.kind !== "msg") return null;
              return (
                <Bubble key={i} from={b.from}>
                  {b.text}
                </Bubble>
              );
            })}
            {typingActive && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <TypingDots />
              </motion.div>
            )}
          </div>

          {/* Composer */}
          <div className="relative z-10 flex items-center gap-2 px-3 py-2.5 bg-[#0b141a] border-t border-white/5">
            <div className="flex-1 h-8 rounded-full bg-[#1f2c33] flex items-center px-4 font-body text-[11px] text-white/30">
              Message
            </div>
            <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating badges around phone */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, x: -24, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex absolute -left-6 top-[28%] items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-body text-[11px] shadow-lg"
      >
        <Check className="w-3 h-3 text-[#25D366]" />
        Replies within the hour
      </motion.div>
      <motion.div
        aria-hidden
        initial={{ opacity: 0, x: 24, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex absolute -right-8 top-[62%] items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-body text-[11px] shadow-lg"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        Island-wide · cold-chain
      </motion.div>
    </div>
  );
};

const WhatsAppOrderSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgOrbY = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "radial-gradient(ellipse at top left, hsl(150 40% 12%), hsl(150 40% 5%) 60%, hsl(150 45% 3%))",
      }}
    >
      {/* Green orb */}
      <motion.div
        aria-hidden
        style={{ y: bgOrbY, background: "radial-gradient(circle, hsl(142 70% 40% / 0.18), transparent 65%)" }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl"
      />
      {/* Gold speckle */}
      <div
        aria-hidden
        className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(42 80% 50% / 0.5), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-body text-[11px] font-medium text-white/70 tracking-[0.24em] uppercase">
              Order on WhatsApp · Open 7 days
            </span>
          </motion.div>
          <SplitText
            text="Order premium in four taps."
            by="word"
            as="h2"
            stagger={0.06}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-white italic max-w-4xl mx-auto"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-base md:text-lg text-white/55 leading-relaxed max-w-2xl mx-auto mt-6"
          >
            No checkout. No forms. Just a message to our concierge team — we'll handle the catalogue, pricing, and delivery personally.
          </motion.p>
        </div>

        {/* Main grid — steps on left, phone on right */}
        <div className="grid md:grid-cols-[1fr_auto] gap-14 md:gap-20 items-start md:items-center">
          {/* Steps */}
          <div className="relative">
            {/* Connecting vertical accent line behind steps */}
            <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent hidden sm:block" />

            <ul className="space-y-8 md:space-y-10">
              {steps.map((step, i) => (
                <motion.li
                  key={step.num}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex gap-5"
                >
                  <span className="relative z-10 shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center font-display font-bold text-white text-sm shadow-lg shadow-[#25D366]/20 ring-4 ring-forest-deep">
                    {step.num}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-1.5 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="font-body text-sm md:text-base text-white/55 leading-relaxed max-w-md">
                      {step.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12"
            >
              <MagneticButton>
                <a
                  href={waLink(ENQUIRE_MSG)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 h-14 px-8 rounded-full bg-[#25D366] text-white font-body font-semibold text-base shadow-2xl shadow-[#25D366]/30 border border-white/10 hover:bg-[#22c15e] transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start your order on WhatsApp
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </MagneticButton>
              <p className="font-body text-xs text-white/40 mt-3 ml-1">
                Tap to open WhatsApp · +94 11 207 1717
              </p>
            </motion.div>
          </div>

          {/* Phone mockup */}
          <div className="relative self-center">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppOrderSection;
