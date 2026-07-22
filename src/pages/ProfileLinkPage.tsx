import { useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, IdCard, BookOpen, ArrowLeft } from "lucide-react";
import { useBusinessProfile, useBrochureSettings } from "@/lib/api";
import Seo from "@/components/Seo";
import ProfileShell from "@/components/profile/ProfileShell";
import BusinessCardView from "@/components/profile/BusinessCardView";
import BrochureExperience from "@/components/profile/BrochureExperience";

type OptionKey = "website" | "card" | "brochure";

const OPTIONS: Record<OptionKey, { label: string; hint: string; Icon: typeof Globe }> = {
  website: { label: "Website", hint: "Visit our main site", Icon: Globe },
  card: { label: "E Business Profile", hint: "View the digital business card", Icon: IdCard },
  brochure: { label: "Brochure", hint: "Read the supplier's lookbook", Icon: BookOpen },
};

/**
 * Public entry point at /profile/:slug. Shows a chooser between Website /
 * E Business Profile / Brochure when a profile has more than one enabled —
 * skips straight to the single destination when only one is. The chooser
 * screen shows only the option buttons, nothing else.
 */
const ProfileLinkPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: profile, isLoading } = useBusinessProfile(slug || "");
  const { data: brochure } = useBrochureSettings();
  const [view, setView] = useState<"chooser" | "card" | "brochure">("chooser");

  const enabledOptions = useMemo<OptionKey[]>(() => {
    if (!profile) return [];
    const opts: OptionKey[] = [];
    if (profile.show_website) opts.push("website");
    if (profile.show_card) opts.push("card");
    // The brochure is rendered in code now — no PDF required. The uploaded
    // PDF, when present, is offered as a download inside the lookbook.
    if (profile.show_brochure) opts.push("brochure");
    return opts;
  }, [profile]);

  // No loading indicator — show the branded backdrop silently until the
  // profile resolves, then render the right screen.
  if (isLoading) return <ProfileShell>{null}</ProfileShell>;

  if (!profile || !profile.active) {
    return (
      <ProfileShell>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <h1 className="font-display text-2xl font-bold text-white">Card not found</h1>
          <p className="mt-2 font-body text-sm text-white/55">This profile link is invalid or no longer active.</p>
          <Link to="/" className="mt-5 inline-block font-body text-sm text-accent hover:underline">Go to olivefoods.lk →</Link>
        </div>
      </ProfileShell>
    );
  }

  const seo = (
    <Seo
      title={`${profile.name} — ${profile.company}`}
      description={`${profile.name}${profile.title ? `, ${profile.title}` : ""} at ${profile.company}.`}
      path={`/profile/${profile.slug}`}
      noindex
    />
  );

  // Fail-safe: nothing enabled (or brochure toggled on with no PDF yet and
  // nothing else) — always show something rather than a dead page.
  const options = enabledOptions.length > 0 ? enabledOptions : (["card"] as OptionKey[]);

  // Exactly one destination — skip the chooser entirely.
  if (options.length === 1) {
    const only = options[0];
    if (only === "website") return <Navigate to="/" replace />;
    if (only === "card") return (<>{seo}<ProfileShell>{<BusinessCardView profile={profile} />}</ProfileShell></>);
    return (
      <>
        {seo}
        <BrochureExperience pdfUrl={brochure?.pdf_url ?? null} onBack={null} />
      </>
    );
  }

  // Multiple destinations — chooser + sub-views, each with a Back option.
  if (view === "card") {
    return (<>{seo}<ProfileShell><BusinessCardView profile={profile} /><BackButton onClick={() => setView("chooser")} dark /></ProfileShell></>);
  }
  if (view === "brochure") {
    return (<>{seo}<BrochureExperience pdfUrl={brochure?.pdf_url ?? null} onBack={() => setView("chooser")} /></>);
  }

  return (
    <>
      {seo}
      <ProfileShell>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <p className="text-center font-body text-xs uppercase tracking-[0.18em] text-white/40 mb-2">
            Choose what you'd like to view
          </p>
          {options.map((key) => {
            const { label, hint, Icon } = OPTIONS[key];
            const content = (
              <>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15">
                  <Icon className="w-5 h-5 text-accent" />
                </span>
                <span>
                  <span className="block font-display text-base font-bold text-white">{label}</span>
                  <span className="block font-body text-sm text-white/55">{hint}</span>
                </span>
              </>
            );
            const className = "w-full flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left hover:border-accent/40 hover:bg-accent/10 transition-colors";
            return key === "website" ? (
              <Link key={key} to="/" className={className}>{content}</Link>
            ) : (
              <button key={key} type="button" onClick={() => setView(key)} className={className}>{content}</button>
            );
          })}
        </motion.div>
      </ProfileShell>
    </>
  );
};

const BackButton = ({ onClick, dark }: { onClick: () => void; dark?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    className={`mt-4 inline-flex items-center gap-1.5 font-body text-sm transition-colors ${
      dark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    <ArrowLeft className="w-4 h-4" /> Back to options
  </button>
);

export default ProfileLinkPage;
