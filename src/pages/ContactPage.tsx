import { useState, useEffect } from "react";
import Seo, { SITE_URL } from "@/components/Seo";
import { track } from "@/lib/analytics";
import { openingHoursSchema } from "@/lib/site";
import { LANES, whatsappHref, whatsappMessage, type Lane } from "@/lib/contact";
import ContactLanes from "@/components/ContactLanes";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { MapPin, Send, Clock, CheckCircle2, Loader2, Building2, User } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";
import PageHero from "@/components/PageHero";
import ScrollFloatingElement from "@/components/landing/ScrollFloatingElement";
import SectionTransition from "@/components/landing/SectionTransition";
import LocationsSection from "@/components/landing/LocationsSection";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

/** Subjects per lane (see LANES in lib/contact). Stored as "Bulk · <subject>"
 *  or "Personal · <subject>", so the admin enquiries list shows at a glance
 *  which line it's for. */
const SUBJECTS: Record<Lane, string[]> = {
  business: ["Request a Quote", "Sourcing Request", "Product Inquiry", "Brand Inquiry", "Distribution", "Partnership"],
  general: ["General Inquiry", "Personal Purchase", "Supplier Enquiry", "Careers", "Other"],
};
const subjects = [...SUBJECTS.business, ...SUBJECTS.general];

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Olive Foods",
  url: `${SITE_URL}/contact`,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  mainEntity: {
    "@id": `${SITE_URL}/#organization`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        name: "Bulk enquiries",
        telephone: "+94-77-330-0700",
        areaServed: "LK",
        availableLanguage: ["en", "si", "ta"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        name: "Personal enquiries",
        telephone: "+94-11-207-1717",
        email: "info@olivefoods.lk",
        areaServed: "LK",
        hoursAvailable: openingHoursSchema,
      },
    ],
  },
};

// Phone, WhatsApp and email live in <ContactLanes>; this is what's left.
const contactInfo = [
  { icon: MapPin, label: "Office", value: "292 Sea Street, Colombo 11, Colombo, Sri Lanka 01100", href: "https://www.google.com/maps/dir/?api=1&destination=292+Sea+Street%2C+Colombo+11%2C+Sri+Lanka" },
];

const ContactPage = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  // Which team this is for; business is the default (most enquiries are).
  const [lane, setLane] = useState<Lane>("business");
  const [business, setBusiness] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  // Prefill from links like /contact?subject=Request+a+Quote&product=…&sku=…
  // (product pages), &brand=… (brand pages) or &category=… (category pages).
  const qProduct = searchParams.get("product") || "";
  const qSku = searchParams.get("sku") || "";
  const qBrand = searchParams.get("brand") || "";
  const qCategory = searchParams.get("category") || "";
  const qSector = searchParams.get("sector") || "";
  const regarding = qProduct || qBrand || qCategory || (qSector ? `Supply for ${qSector.toLowerCase()}` : "");

  useEffect(() => {
    const subject = searchParams.get("subject") || "";
    setForm((f) => {
      const next = { ...f };
      if (subjects.includes(subject)) {
        next.subject = subject;
        setLane(SUBJECTS.general.includes(subject) ? "general" : "business");
      }
      if (qProduct)
        next.message =
          subject === "Request a Quote"
            ? `Please send trade pricing and availability for: ${qProduct}${qSku ? ` (SKU ${qSku})` : ""}.\nEstimated quantity: `
            : `I'd like to inquire about: ${qProduct}`;
      else if (qBrand) next.message = `I'd like to inquire about the brand: ${qBrand}`;
      else if (qCategory) next.message = `I'm looking to source ${qCategory} products: `;
      else if (qSector) next.message = `We're looking for a regular food supplier (${qSector}).\nProducts and approximate volumes we need: `;
      return next;
    });
  }, [searchParams, qProduct, qSku, qBrand, qCategory, qSector]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    const laneTag = lane === "business" ? "Bulk" : "Personal";
    const { error } = await supabase.from("contact_submissions").insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      subject: `${laneTag} · ${result.data.subject}`,
      message: lane === "business" && business.trim() ? `Business: ${business.trim()}\n\n${result.data.message}` : result.data.message,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } else {
      track("generate_lead", { form_subject: `${laneTag} · ${result.data.subject}`, lane, item: regarding || undefined });
      toast({ title: "Message Sent", description: "We'll get back to you shortly!" });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setBusiness("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
    }
  };

  const lightInputClasses = "flex h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:border-accent/30 transition-colors font-body";

  return (
    <div className="smooth-scroll overflow-x-clip">
      <Seo
        title="Contact Olive Foods: Food Supply for Hotels, Restaurants & Retail"
        description="Hotel, restaurant, supermarket, or sourcing a hard-to-find product in Sri Lanka? Talk to Olive Foods: email info@olivefoods.lk or message us on WhatsApp. We respond within one business day."
        path="/contact"
        schema={contactPageSchema}
      />
      <ImmersiveBackground />
      <ScrollFloatingElement />
      <Navbar />
      <FloatingWhatsApp />

      <main>
      <PageHero
        eyebrow="Olive Foods / Contact"
        title={<>Get in <span className="text-gradient-gold italic">touch.</span></>}
        subtitle="Hotel, restaurant, supermarket, or sourcing a hard-to-find product? Drop us a line. We treat first conversations like first relationships."
      />

      <SectionTransition />

      {/* Form + Details — Light */}
      <div data-navbar-theme="light">
        <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
          <div className="absolute w-[400px] h-[400px] -top-20 -left-20 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="absolute w-[300px] h-[300px] bottom-20 right-10 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-20">
              {/* Form */}
              <motion.form
                data-clarity-mask="true"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-8 rounded-lg border border-border bg-card shadow-lg space-y-6 overflow-hidden"
              >
                {/* Success overlay */}
                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 z-20 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-xl"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                        className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-8 h-8 text-accent" />
                      </motion.div>
                      <h3 className="font-display text-xl font-bold text-foreground">Message Sent!</h3>
                      <p className="font-body text-sm text-muted-foreground">We'll get back to you shortly.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-medium border border-accent/20 mb-4 tracking-widest uppercase">
                    Send a Message
                  </span>
                  <h2 className="font-display text-2xl font-bold text-foreground tracking-tight">
                    {form.subject === "Request a Quote" ? "Request a Quote" : form.subject === "Sourcing Request" ? "Request Sourcing" : "How Can We Help?"}
                  </h2>
                  {regarding && (
                    <p className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5 font-body text-sm text-foreground">
                      <span className="text-muted-foreground">Regarding</span>
                      <span className="font-semibold">{regarding}</span>
                      {qSku && <span className="text-xs text-muted-foreground">SKU {qSku}</span>}
                    </p>
                  )}
                </div>

                {/* What's this about? Picks the team (and the subjects shown). */}
                <fieldset>
                  <legend className="mb-2 font-body text-sm font-semibold text-foreground">What's this about?</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        { key: "business", icon: Building2, title: "Bulk enquiry", note: "Hotels, restaurants, cafés, caterers, shops, bulk buyers" },
                        { key: "general", icon: User, title: "Personal enquiry", note: "Personal purchases and all other questions" },
                      ] as const
                    ).map(({ key, icon: Icon, title, note }) => {
                      const on = lane === key;
                      return (
                        <label
                          key={key}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${on ? "border-accent bg-accent/[0.06] ring-1 ring-accent" : "border-border hover:border-foreground/30"}`}
                        >
                          <input
                            type="radio"
                            name="lane"
                            value={key}
                            checked={on}
                            onChange={() => {
                              setLane(key);
                              if (form.subject && !SUBJECTS[key].includes(form.subject)) setForm((f) => ({ ...f, subject: "" }));
                            }}
                            className="sr-only"
                          />
                          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${on ? "text-accent" : "text-muted-foreground"}`} />
                          <span>
                            <span className="block font-body text-sm font-semibold text-foreground">{title}</span>
                            <span className="block font-body text-xs text-muted-foreground">{note}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-2 font-body text-xs text-muted-foreground">
                    {lane === "business" ? (
                      <>
                        {LANES.business.heading}, WhatsApp or call{" "}
                        <a href={whatsappHref(whatsappMessage())} target="_blank" rel="noopener noreferrer" data-track="contact_business_whatsapp" data-track-item="contact_form" className="font-semibold text-accent hover:underline">
                          {LANES.business.display}
                        </a>
                      </>
                    ) : (
                      <>
                        {LANES.general.heading}, call{" "}
                        <a href={LANES.general.tel} data-track="contact_general_call" data-track-item="contact_form" className="font-semibold text-accent hover:underline">
                          {LANES.general.display}
                        </a>
                      </>
                    )}
                  </p>
                </fieldset>

                {lane === "business" && (
                  <div className="relative">
                    <input
                      className={`${lightInputClasses} peer pt-5 pb-1`}
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      placeholder=" "
                      id="contact-business"
                      autoComplete="organization"
                    />
                    <label
                      htmlFor="contact-business"
                      className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]"
                    >
                      Business name (optional)
                    </label>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="relative">
                    <input
                      className={`${lightInputClasses} peer pt-5 pb-1`}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder=" "
                      id="contact-name"
                    />
                    <label
                      htmlFor="contact-name"
                      className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]"
                    >
                      Name *
                    </label>
                    {errors.name && <p className="text-destructive text-xs font-body mt-1">{errors.name}</p>}
                  </div>
                  {/* Email */}
                  <div className="relative">
                    <input
                      className={`${lightInputClasses} peer pt-5 pb-1`}
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder=" "
                      id="contact-email"
                    />
                    <label
                      htmlFor="contact-email"
                      className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]"
                    >
                      Email *
                    </label>
                    {errors.email && <p className="text-destructive text-xs font-body mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone — invisible label mirrors Subject's so both inputs top-align */}
                  <div className="space-y-2">
                    <Label className="font-body text-sm text-muted-foreground invisible select-none" aria-hidden>
                      Phone
                    </Label>
                    <div className="relative">
                      <input
                        className={`${lightInputClasses} peer pt-5 pb-1`}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder=" "
                        id="contact-phone"
                      />
                      <label
                        htmlFor="contact-phone"
                        className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]"
                      >
                        Phone (optional)
                      </label>
                    </div>
                  </div>
                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject" className="font-body text-sm text-muted-foreground">Subject *</Label>
                    <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                      <SelectTrigger id="contact-subject" aria-label="Subject" className="h-11 rounded-lg border-border bg-background text-foreground font-body">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS[lane].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-destructive text-xs font-body">{errors.subject}</p>}
                  </div>
                </div>

                {/* Message */}
                <div className="relative">
                  <textarea
                    className={`${lightInputClasses} min-h-[130px] resize-none peer pt-6 pb-2`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder=" "
                    id="contact-message"
                  />
                  <label
                    htmlFor="contact-message"
                    className="absolute left-4 top-4 font-body text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]"
                  >
                    Message *
                  </label>
                  {errors.message && <p className="text-destructive text-xs font-body mt-1">{errors.message}</p>}
                </div>

                <div className="flex flex-col items-start gap-2">
                  <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-md px-8 h-12 text-base gap-2 shine-sweep">
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                  <p className="font-body text-xs text-muted-foreground">
                    We respond within one business day.
                  </p>
                </div>
              </motion.form>

              {/* Contact Details */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-medium border border-accent/20 mb-4 tracking-widest uppercase">
                    Reach Out
                  </span>
                  <h2 className="font-display text-2xl font-bold text-foreground tracking-tight mb-2">Contact Details</h2>
                  <p className="font-body text-muted-foreground text-sm">Bulk enquiries and personal enquiries each have their own number.</p>
                </div>

                <ContactLanes layout="rows" tone="light" source="contact_page" />

                <div className="space-y-4">
                  {contactInfo.map((ci) => (
                    <motion.div key={ci.label} whileHover={{ y: -4, transition: { duration: 0.3 } }} className="flex items-start gap-4 p-5 rounded-lg border border-border bg-card hover:border-accent/30 transition-all duration-500 hover:shadow-lg">
                      <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }} className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <ci.icon className="w-5 h-5 text-accent" />
                      </motion.div>
                      <div>
                        <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1">{ci.label}</p>
                        {ci.href ? (
                          <a href={ci.href} target={ci.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="font-body text-sm text-foreground hover:text-accent transition-colors">
                            {ci.value}
                          </a>
                        ) : (
                          <p className="font-body text-sm text-foreground">{ci.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div whileHover={{ y: -4, transition: { duration: 0.3 } }} className="p-6 rounded-lg border border-border bg-card hover:border-accent/30 transition-all duration-500 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">Business Hours</h3>
                  </div>
                  <div className="space-y-1.5 font-body text-sm text-muted-foreground ml-[52px]">
                    <p>Monday – Friday: 8:30 AM – 5:30 PM</p>
                    <p>Saturday: 8:30 AM – 1:00 PM</p>
                    <p>Sunday & Holidays: Closed</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <SectionTransition />

      {/* Map — Dark: the same map section as the homepage */}
      <div data-navbar-theme="dark">
        <LocationsSection />
      </div>
      </main>


      <div data-navbar-theme="dark">

        <Footer />

      </div>
    </div>
  );
};

export default ContactPage;
