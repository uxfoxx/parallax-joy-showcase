import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { z } from "zod";
import PageLayout from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const subjects = [
  "General Inquiry",
  "Product Inquiry",
  "Brand Inquiry",
  "Partnership",
  "Distribution",
];

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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-body text-primary-foreground/60 text-lg max-w-xl mx-auto"
          >
            Have questions about our products, brands, or partnership opportunities? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6 bg-muted/30 rounded-2xl p-8 border border-border/50"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Send a Message</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-body text-sm text-muted-foreground">Name *</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  {errors.name && <p className="text-destructive text-xs font-body">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body text-sm text-muted-foreground">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                  {errors.email && <p className="text-destructive text-xs font-body">{errors.email}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-body text-sm text-muted-foreground">Phone (optional)</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+94 XX XXX XXXX" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm text-muted-foreground">Subject *</Label>
                  <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                    <SelectTrigger>
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
                <Label htmlFor="message" className="font-body text-sm text-muted-foreground">Message *</Label>
                <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." />
                {errors.message && <p className="text-destructive text-xs font-body">{errors.message}</p>}
              </div>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto rounded-xl px-8 h-11 font-body font-semibold gap-2">
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>

            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Contact Details</h2>
                <p className="font-body text-muted-foreground text-sm">Reach us through any of the channels below.</p>
              </div>

              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="font-body text-sm text-foreground hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-body text-sm text-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="font-display text-lg font-bold text-foreground mb-2">Business Hours</h3>
                <div className="space-y-1 font-body text-sm text-muted-foreground">
                  <p>Monday – Friday: 8:30 AM – 5:30 PM</p>
                  <p>Saturday: 8:30 AM – 1:00 PM</p>
                  <p>Sunday & Holidays: Closed</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ContactPage;
