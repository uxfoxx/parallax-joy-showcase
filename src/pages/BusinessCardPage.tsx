import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, Download, Building2 } from "lucide-react";
import { useBusinessProfile } from "@/lib/api";
import { downloadVCard } from "@/lib/vcard";
import { cdnImg } from "@/lib/img";
import Seo from "@/components/Seo";
import oliveMark from "@/assets/olive-mark.svg";

const digits = (s: string) => s.replace(/[^0-9]/g, "");

const Shell = ({ children }: { children: React.ReactNode }) => (
  <main className="relative min-h-screen w-full flex items-center justify-center p-5 overflow-hidden bg-forest-deep">
    {/* Backdrop */}
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, hsl(140 50% 19% / 0.55), transparent 60%), linear-gradient(180deg, hsl(150 40% 6%), hsl(150 40% 9%))",
      }}
    />
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.35] pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle, hsl(75 38% 45% / 0.10) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }}
    />
    <div className="relative z-10 w-full max-w-sm">{children}</div>
  </main>
);

const BusinessCardPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: profile, isLoading } = useBusinessProfile(slug || "");

  // No loading indicator — show the branded backdrop silently until the
  // profile resolves, then render the card (or the not-found state).
  if (isLoading) return <Shell>{null}</Shell>;

  if (!profile || !profile.active) {
    return (
      <Shell>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <h1 className="font-display text-2xl font-bold text-white">Card not found</h1>
          <p className="mt-2 font-body text-sm text-white/55">This profile link is invalid or no longer active.</p>
          <Link to="/" className="mt-5 inline-block font-body text-sm text-accent hover:underline">Go to olivefoods.lk →</Link>
        </div>
      </Shell>
    );
  }

  const initials = profile.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const actions = [
    profile.phone && { label: "Call", href: `tel:${profile.phone}`, Icon: Phone },
    profile.whatsapp && { label: "WhatsApp", href: `https://wa.me/${digits(profile.whatsapp)}`, Icon: MessageCircle, external: true },
    profile.email && { label: "Email", href: `mailto:${profile.email}`, Icon: Mail },
  ].filter(Boolean) as { label: string; href: string; Icon: typeof Phone; external?: boolean }[];

  return (
    <Shell>
      <Seo
        title={`${profile.name} — ${profile.company}`}
        description={`${profile.name}${profile.title ? `, ${profile.title}` : ""} at ${profile.company}. Save the contact.`}
        path={`/profile/${profile.slug}`}
        noindex
      />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Header band */}
        <div className="relative h-24 bg-gradient-to-br from-forest-mid/60 to-accent/30">
          <img src={oliveMark} alt="Olive Foods" className="absolute top-4 left-5 h-7 w-auto" />
        </div>

        <div className="px-6 pb-7 -mt-12">
          {/* Photo */}
          <div className="mx-auto h-24 w-24 rounded-full border-4 border-forest-deep bg-forest-mid overflow-hidden shadow-lg flex items-center justify-center">
            {profile.photo_url ? (
              <img src={cdnImg(profile.photo_url, 320)} alt={profile.name} decoding="async" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-2xl font-bold text-white">{initials}</span>
            )}
          </div>

          <div className="mt-4 text-center">
            <h1 className="font-display text-2xl font-bold text-white leading-tight">{profile.name}</h1>
            <p className="mt-1 font-body text-sm text-accent">
              {profile.title ? `${profile.title} · ` : ""}{profile.company}
            </p>
            {profile.bio && (
              <p className="mt-3 font-body text-sm text-white/55 leading-relaxed">{profile.bio}</p>
            )}
          </div>

          {/* Quick actions */}
          {actions.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {actions.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 text-white/80 hover:text-white hover:border-accent/40 hover:bg-accent/10 transition-colors"
                >
                  <Icon className="w-5 h-5 text-accent" />
                  <span className="font-body text-[11px]">{label}</span>
                </a>
              ))}
            </div>
          )}

          {/* Detail rows */}
          <div className="mt-5 space-y-1.5">
            {profile.phone_secondary && (
              <a href={`tel:${profile.phone_secondary}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/70 hover:bg-white/[0.05] transition-colors">
                <Building2 className="w-4 h-4 text-accent shrink-0" />
                <span className="font-body text-sm">{profile.phone_secondary}</span>
                <span className="ml-auto font-body text-[11px] text-white/40">Office</span>
              </a>
            )}
          </div>

          {/* Save Contact */}
          <button
            onClick={() => downloadVCard(profile)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 font-body text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-lg hover:bg-accent/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Save Contact
          </button>
          <p className="mt-3 text-center font-body text-[11px] text-white/35">Adds {profile.name} to your phone's contacts.</p>
        </div>
      </motion.div>
    </Shell>
  );
};

export default BusinessCardPage;
