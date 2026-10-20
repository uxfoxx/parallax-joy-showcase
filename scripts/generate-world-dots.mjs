// Dev-only generator for the Global Origins map (StatsSection). Writes
// src/data/worldDots.ts — committed; NOT run at build time.
//
//   node scripts/generate-world-dots.mjs
//
// A uniform dot-matrix world in the Natural Earth projection, framed from
// Brazil to Australia so every origin sits at its real position. Dots are
// stored as horizontal RUNS ("M x y H x2") and drawn with
// stroke-dasharray="0 <spacing>" + round caps, so the whole land layer is ONE
// SVG path (thousands of dots, a few KB) instead of thousands of <circle>s.
// Also emits per-country dot runs (so the selected country can light up), the
// projected sourcing cities + Colombo hub, great-circle distances to Colombo,
// and a graticule.
//
// Deps are devDependencies: d3-geo, topojson-client, world-atlas.
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { geoNaturalEarth1, geoPath, geoContains, geoDistance, geoGraticule } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const topo = (file, obj) => {
  const t = require(`world-atlas/${file}`);
  return feature(t, t.objects[obj]);
};
const land = topo("land-110m.json", "land");
const countries50 = topo("countries-50m.json", "countries").features;

// Sourcing cities — keep in step with ORIGINS in StatsSection.tsx.
const ORIGINS = {
  netherlands: { iso: "528", city: [4.9, 52.37] }, // Amsterdam
  belgium: { iso: "056", city: [4.35, 50.85] }, // Brussels
  italy: { iso: "380", city: [12.5, 41.9] }, // Rome
  uae: { iso: "784", city: [55.27, 25.2] }, // Dubai
  india: { iso: "356", city: [77.21, 28.61] }, // New Delhi
  china: { iso: "156", city: [116.4, 39.9] }, // Beijing
  thailand: { iso: "764", city: [100.5, 13.75] }, // Bangkok
  singapore: { iso: "702", city: [103.82, 1.35] }, // Singapore
  australia: { iso: "036", city: [151.21, -33.87] }, // Sydney
  brazil: { iso: "076", city: [-46.63, -23.55] }, // São Paulo
};
const COLOMBO = [79.86, 6.93];
const SRI_LANKA_ISO = "144";

// Frame: São Paulo to Sydney, Amsterdam to the Southern Ocean.
const W = 1000;
const FRAME = { type: "MultiPoint", coordinates: [[-82, -46], [-82, 64], [168, 64], [168, -46], [43, 66], [43, -46], [-82, 10], [168, 10]] };
const projection = geoNaturalEarth1().rotate([-43, 0]).fitWidth(W, FRAME);
const [[, y0], [, y1]] = geoPath(projection).bounds(FRAME);
projection.translate([projection.translate()[0], projection.translate()[1] - y0 + 8]);
const H = Math.ceil(y1 - y0 + 16);

const S = 5.5; // dot spacing (viewBox units)
const r1 = (n) => +n.toFixed(1);

// Sample the grid. Alternate rows are offset by half a step (hex packing).
const rows = []; // [{ y, xs: [{x, lonlat}] }]
for (let j = 0, y = S; y < H - S / 2; j++, y += S) {
  const off = j % 2 ? S / 2 : 0;
  const xs = [];
  for (let x = S / 2 + off; x < W - S / 2; x += S) {
    const ll = projection.invert([x, y]);
    if (!ll || !Number.isFinite(ll[0])) continue;
    if (geoContains(land, ll)) xs.push({ x: r1(x), ll });
  }
  rows.push({ y: r1(y), xs });
}

/** Runs of consecutive grid dots → "M x y H x2" (dash pattern draws the dots). */
function runs(pick) {
  let d = "";
  for (const { y, xs } of rows) {
    const sel = xs.filter((dot) => pick(dot, y));
    let start = null, prev = null;
    const flush = () => {
      if (start == null) return;
      // A lone dot gets a tiny length (zero-length subpaths aren't drawn
      // everywhere); a run ends 0.1 past its last dot so float error never
      // drops the final dash.
      d += prev === start ? `M${start} ${y}h0.1` : `M${start} ${y}H${r1(prev + 0.1)}`;
    };
    for (const { x } of sel) {
      if (prev != null && Math.abs(x - prev - S) < 0.01) prev = x;
      else { flush(); start = x; prev = x; }
    }
    flush();
  }
  return d;
}

const landD = runs(() => true);
const total = rows.reduce((n, r) => n + r.xs.length, 0);

const byIso = (iso) => countries50.find((c) => c.id === iso);
const countryRuns = {};
const counts = {};
for (const [key, { iso }] of Object.entries({ ...ORIGINS, srilanka: { iso: SRI_LANKA_ISO } })) {
  const f = byIso(iso);
  if (!f) { console.warn(`! ${key} not found`); continue; }
  let n = 0;
  countryRuns[key] = runs(({ ll }) => (geoContains(f, ll) ? (n++, true) : false));
  counts[key] = n;
}

// A sparse, seeded subset of land dots that twinkles (three phase groups).
let seed = 1337;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const sparkleSets = [new Set(), new Set(), new Set()];
for (const { y, xs } of rows) for (const { x } of xs) if (rand() < 0.045) sparkleSets[Math.floor(rand() * 3)].add(`${x},${y}`);
const sparkle = sparkleSets.map((set) => runs(({ x }, y) => set.has(`${x},${y}`)));

const pt = (ll) => projection(ll).map(r1);
const KM = 6371;
const origins = Object.fromEntries(
  Object.entries(ORIGINS).map(([k, { city }]) => {
    const [x, y] = pt(city);
    const km = Math.round((geoDistance(city, COLOMBO) * KM) / 10) * 10;
    return [k, { x, y, km }];
  }),
);
const hub = pt(COLOMBO);

const grat = geoPath(projection)(geoGraticule().step([30, 30]).extentMajor([[-180, -60], [180, 75]]).extentMinor([[-180, -60], [180, 75]])());
const round = (s) => s.replace(/-?\d+\.?\d*(e-?\d+)?/g, (n) => String(r1(+n)));

const out = `// AUTO-GENERATED by scripts/generate-world-dots.mjs — do not edit by hand.
// Dot-matrix world (Natural Earth projection) for the Global Origins map.
// Paths are runs of dots: draw with stroke-dasharray="0 ${S}" + round caps.

export const MAP_W = ${W};
export const MAP_H = ${H};
export const DOT_SPACING = ${S};

/** Every land dot (${total}). */
export const LAND_DOTS = "${landD}";

/** Dots inside each origin country (and Sri Lanka), for highlighting. */
export const COUNTRY_DOTS: Record<string, string> = {
${Object.entries(countryRuns).map(([k, d]) => `  ${k}: "${d}", // ${counts[k]} dots`).join("\n")}
};

/** Three phase groups of twinkling dots. */
export const SPARKLE_DOTS: [string, string, string] = [${sparkle.map((d) => `"${d}"`).join(", ")}];

/** Projected sourcing cities, with great-circle distance to Colombo (km). */
export const ORIGIN_POINTS: Record<string, { x: number; y: number; km: number }> = ${JSON.stringify(origins)};

/** Colombo, the hub every route ends at. */
export const HUB_POINT = { x: ${hub[0]}, y: ${hub[1]} };

/** 30° graticule, projected. */
export const GRATICULE = "${round(grat)}";
`;
writeFileSync("src/data/worldDots.ts", out);
console.log(`Wrote src/data/worldDots.ts — ${W}×${H}, ${total} land dots, ${(out.length / 1024).toFixed(1)} KB`);
console.log("country dots:", counts);
console.log("origins:", origins, "hub:", hub);
