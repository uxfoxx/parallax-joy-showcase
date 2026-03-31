import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from "lucide-react";
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
import ScrollFloatingElement from "@/components/landing/ScrollFloatingElement";
import SectionTransition from "@/components/landing/SectionTransition";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const subjects = ["General Inquiry", "Product Inquiry", "Brand Inquiry", "Partnership", "Distribution"];

const contactInfo = [
  { icon: Mail, label: "Email", value: "info@olivefoods.lk", href: "mailto:info@olivefoods.lk" },
  { icon: Phone, label: "Phone", value: "+94 11 207 1717", href: "tel:+94112071717" },
  { icon: MessageCircle, label: "WhatsApp", value: "+94 77 123 4567", href: "https://wa.me/94771234567" },
  { icon: MapPin, label: "Office", value: "Colombo, Sri Lanka", href: undefined },
];

const ContactPage = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  useEffect(() => {
    const subject = searchParams.get("subject") || "";
    const product = searchParams.get("product") || "";
    const brand = searchParams.get("brand") || "";
    if (subject) setForm((f) => ({ ...f, subject }));
    if (product) setForm((f) => ({ ...f, message: `I'd like to inquire about: ${product}` }));
    if (brand) setForm((f) => ({ ...f, message: `I'd like to inquire about the brand: ${brand}` }));
  }, [searchParams]);

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
    const { error } = await supabase.from("contact_submissions").insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      subject: result.data.subject,
      message: result.data.message,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Message Sent", description: "We'll get back to you shortly!" });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  const lightInputClasses = "flex h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:border-accent/30 transition-colors font-body";

  return (
    <div className="smooth-scroll overflow-x-hidden">
      <ImmersiveBackground />
      <ScrollFloatingElement />
      <Navbar />
      <FloatingWhatsApp />

      {/* Hero */}
      <div data-navbar-theme="dark">
        <section className="relative overflow-hidden py-32 lg:py-44">
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse at 50% 30%, hsl(140 50% 19% / 0.6) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, hsl(150 40% 14% / 0.4) 0%, transparent 50%),
              linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 8%))
            `,
          }} />
          <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ y: bgY }}>
            <div className="absolute w-[600px] h-[600px] -top-40 -left-40 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)" }} />
          </motion.div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase">
              Contact Us
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
              Get in Touch
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-body text-lg text-primary-foreground/50 max-w-xl mx-auto leading-relaxed">
              Have questions about our products, brands, or partnership opportunities? We'd love to hear from you.
            </motion.p>
          </div>
        </section>
      </div>

      <SectionTransition />

      {/* Form + Details — Light */}
      <div data-navbar-theme="light">
        <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
          <div className="absolute w-[400px] h-[400px] -top-20 -left-20 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="absolute w-[300px] h-[300px] bottom-20 right-10 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 rounded-lg border border-border bg-card shadow-lg space-y-6"
              >
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-medium border border-accent/20 mb-4 tracking-widest uppercase">
                    Send a Message
                  </span>
                  <h2 className="font-display text-2xl font-bold text-foreground tracking-tight">How Can We Help?</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-body text-sm text-muted-foreground">Name *</Label>
                    <input className={lightInputClasses} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                    {errors.name && <p className="text-destructive text-xs font-body">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body text-sm text-muted-foreground">Email *</Label>
                    <input className={lightInputClasses} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                    {errors.email && <p className="text-destructive text-xs font-body">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-body text-sm text-muted-foreground">Phone (optional)</Label>
                    <input className={lightInputClasses} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+94 XX XXX XXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body text-sm text-muted-foreground">Subject *</Label>
                    <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                      <SelectTrigger className="h-11 rounded-lg border-border bg-background text-foreground font-body">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-destructive text-xs font-body">{errors.subject}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-body text-sm text-muted-foreground">Message *</Label>
                  <textarea className={`${lightInputClasses} min-h-[130px] resize-none`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." />
                  {errors.message && <p className="text-destructive text-xs font-body">{errors.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="bg-accent text-white hover:bg-accent/90 font-body font-semibold rounded-xl px-8 h-12 text-base gap-2">
                  <Send className="w-4 h-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
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
                  <p className="font-body text-muted-foreground text-sm">Reach us through any of the channels below.</p>
                </div>

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

      <div data-navbar-theme="dark">
        <Footer />
      </div>
    </div>
  );
};

export default ContactPage;
