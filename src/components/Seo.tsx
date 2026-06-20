import { Helmet } from "react-helmet-async";

const SITE = "https://www.olivefoods.lk";
const SITE_NAME = "Olive Foods";
const DEFAULT_IMAGE = `${SITE}/olive-foods-hero-logo.svg`;

type SeoProps = {
  /** Page title — the component appends " | Olive Foods" unless it already
   *  contains the brand. Keep the meaningful part ≤ ~55 chars. */
  title: string;
  description: string;
  /** Path (e.g. "/products") or absolute URL. Resolved against the canonical
   *  host. Defaults to the site root. */
  path?: string;
  /** OG/Twitter preview image (absolute URL). */
  image?: string;
  /** og:type — "website" (default) for listings, "article"/"product" etc. */
  type?: string;
  /** When true, tells crawlers not to index the page (admin, etc.). */
  noindex?: boolean;
  /** One or more JSON-LD schema objects rendered as <script type=ld+json>. */
  schema?: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Per-page <head> manager. Fixes the SPA problem where every route inherited
 * index.html's homepage title / description / canonical. Renders a unique
 * title, meta description, canonical link, Open Graph + Twitter cards, and
 * optional JSON-LD structured data.
 */
const Seo = ({ title, description, path = "/", image, type = "website", noindex, schema }: SeoProps) => {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = path.startsWith("http") ? path : `${SITE}${path}`;
  const img = image || DEFAULT_IMAGE;
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
};

export const SITE_URL = SITE;
export default Seo;
