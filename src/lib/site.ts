/**
 * Company facts that appear in several places — footer, About page,
 * Organization structured data and llms.txt — kept in one place so they never
 * drift apart. Only facts the site already states publicly; add a founding
 * year here only when the company supplies it.
 */
import { SITE_URL } from "@/components/Seo";
import { categorySlug } from "@/lib/categories";
import company from "@/data/company.json";

/**
 * Official social / directory profiles. Each one is linked in the footer and
 * listed as `sameAs` in the Organization schema — that is how search engines
 * and AI assistants confirm the website and the profiles are the same company.
 * Leave empty until a profile actually exists (a dead link is worse than none).
 */
export const SOCIAL_PROFILES: { label: string; url: string }[] = [
  // { label: "LinkedIn", url: "https://www.linkedin.com/company/…" },
  // { label: "Facebook", url: "https://www.facebook.com/…" },
];

/** Mon–Fri 8:30–5:30, Sat 8:30–1:00, closed Sundays and holidays (Contact page). */
export const OPENING_HOURS = [
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "17:30" },
  { days: ["Saturday"], opens: "08:30", closes: "13:00" },
];

export const openingHoursSchema = OPENING_HOURS.map((h) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: h.days,
  opens: h.opens,
  closes: h.closes,
}));

/** "At a glance" facts — plain, quotable statements (already made elsewhere on
 *  the site). In src/data/company.json so llms.txt uses the exact same text. */
export const AT_A_GLANCE = company.atAGlance as [string, string][];

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/**
 * The data-driven half of the Organization entity (the static half — name,
 * address, hours, contact — is in index.html under the same @id, and search
 * engines merge the two). Lists what Olive Foods supplies as a catalogue of
 * its category pages, what it knows about, and its official profiles.
 * Deliberately no `brand` property: that would claim the brands as Olive
 * Foods' own; the importer↔brand link is carried by each product's Offer.
 */
export const organizationSchema = (categories: string[]) => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "WholesaleStore"],
  "@id": ORGANIZATION_ID,
  ...(categories.length
    ? {
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Imported food and consumer products supplied in Sri Lanka",
          itemListElement: categories.map((name) => ({
            "@type": "OfferCatalog",
            name,
            url: `${SITE_URL}/categories/${categorySlug(name)}`,
          })),
        },
      }
    : {}),
  knowsAbout: [
    "Food importing",
    "Food distribution",
    "Cold-chain logistics",
    "Food supply for hotels and restaurants",
    ...categories,
  ],
  ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES.map((s) => s.url) } : {}),
});
