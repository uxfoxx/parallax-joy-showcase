import { useEffect, useId, useRef, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Globe2, Snowflake, Truck, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import SplitText from "@/components/motion/SplitText";
import MagneticButton from "@/components/motion/MagneticButton";
import CursorSpotlight from "@/components/motion/CursorSpotlight";
import { cn } from "@/lib/utils";
import { SRI_LANKA_CITIES, SRI_LANKA_PATH } from "@/data/sriLankaMap";

/**
 * WhyChooseUs — "Your complete import and distribution partner".
 *
 * A capability deck: four panels, one open at a time. On desktop the open
 * panel widens to show a live scene of that capability (routes converging on
 * Colombo, the bonded racks, the −18 °C trace, deliveries across the island)
 * while the others fold down to a vertical label; the deck steps through them
 * on its own while it's on screen, pausing on hover or focus and stopping for
 * good once the visitor picks one. On phones it's an accordion.
 *
 * The Olive Standard (BrandManifesto) tells the same journey as a scroll-drawn
 * chain; this is the hands-on version, so it's built to be clicked.
 *
 * Facts only from src/data/company.json — 30+ years, 30+ source countries,
 * bonded warehousing, −18 °C cold chain, all 25 districts — and the office,
 * bonded warehouse and cold store sharing one Colombo address.
 */

type SceneProps = { on: boolean; reduced: boolean };

type Capability = {
  key: string;
  icon: ComponentType<{ className?: string }>;
  /** Short label: the folded panel and the accordion row. */
  label: string;
  tag: string;
  headline: string;
  text: string;
  stat: { value: string; unit: string };
  link: { label: string; to: string };
  Scene: ComponentType<SceneProps>;
};

const ease = [0.22, 1, 0.36, 1] as const;
const STEP_MS = 7000;
const GOLD = "hsl(var(--gold-light))";
const ACCENT = "hsl(var(--accent))";

/* ─── Scene 01 — routes from a turning globe into Colombo ─────────────── */

const ORIGINS = [
  [92, 98], [128, 70], [184, 84], [76, 158], [118, 206], [196, 146], [160, 230],
] as const;
const HUB = [398, 168] as const;
/** A meridian's width through half a turn (|cos| repeats every 180°), so a
 *  looping keyframe list reads as the globe turning. */
const spin = (phase: number) => Array.from({ length: 13 }, (_, k) => 112 * Math.abs(Math.cos(((k * 15 + phase) * Math.PI) / 180)));
const arc = ([x, y]: readonly [number, number]) => `M ${x} ${y} Q ${(x + HUB[0]) / 2} ${Math.min(y, HUB[1]) - 92} ${HUB[0]} ${HUB[1]}`;

function ImportScene({ on, reduced }: SceneProps) {
  const live = on && !reduced;
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {/* globe: outline, parallels, meridians that turn */}
      <g fill="none" stroke="white" strokeOpacity="0.1">
        <circle cx="148" cy="150" r="112" strokeOpacity="0.16" />
        {[-70, -35, 0, 35, 70].map((dy) => (
          <ellipse key={dy} cx="148" cy={150 + dy} rx={Math.sqrt(112 ** 2 - dy ** 2)} ry="7" />
        ))}
        {[0, 45, 90, 135].map((phase) => {
          const rx = spin(phase);
          return (
            <motion.ellipse
              key={phase}
              cx="148"
              cy="150"
              ry="112"
              initial={false}
              animate={live ? { rx } : { rx: rx[0] }}
              transition={live ? { duration: 9, repeat: Infinity, ease: "linear" } : { duration: 0 }}
            />
          );
        })}
      </g>
      {/* routes in */}
      {ORIGINS.map((o, i) => (
        <g key={i}>
          <motion.path
            d={arc(o)}
            fill="none"
            stroke={GOLD}
            strokeWidth="1.2"
            strokeOpacity="0.55"
            initial={false}
            animate={{ pathLength: on || reduced ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 1.1, delay: on && !reduced ? 0.25 + i * 0.08 : 0, ease }}
          />
          <circle cx={o[0]} cy={o[1]} r="3.2" fill={GOLD} />
          {live && (
            <circle r="2.6" fill="white">
              <animateMotion dur="2.8s" repeatCount="indefinite" begin={`${1 + i * 0.37}s`} path={arc(o)} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
            </circle>
          )}
        </g>
      ))}
      {/* Colombo */}
      {live && (
        <motion.circle cx={HUB[0]} cy={HUB[1]} r="10" fill="none" stroke={GOLD} strokeWidth="1.2" animate={{ r: [10, 30], opacity: [0.7, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }} />
      )}
      <circle cx={HUB[0]} cy={HUB[1]} r="8" fill={GOLD} />
      <circle cx={HUB[0]} cy={HUB[1]} r="3" fill="hsl(150 40% 6%)" />
      <text x={HUB[0]} y={HUB[1] + 28} textAnchor="middle" fill="white" fillOpacity="0.75" fontSize="12" fontWeight="600" fontFamily="Sora Variable, Sora, sans-serif">
        Colombo
      </text>
    </svg>
  );
}

/* ─── Scene 02 — the bonded racks, scanned and sealed ─────────────────── */

const SHELVES = [92, 170, 248];
const BAYS = [56, 168, 280, 392];
const BOXES = SHELVES.flatMap((y, r) =>
  BAYS.slice(0, 3).flatMap((x, c) =>
    [0, 1, 2].map((k) => {
      const h = [30, 40, 24, 36, 28, 44, 32, 22, 38][(r * 3 + c + k * 2) % 9];
      return { x: x + 8 + k * 34, y: y - h, w: 30, h, gold: (r + c + k) % 4 === 0, i: r * 9 + c * 3 + k };
    }),
  ),
);

function BondedScene({ on, reduced }: SceneProps) {
  const live = on && !reduced;
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <linearGradient id="wcu-beam" x1="0" x2="1">
          <stop offset="0" stopColor={GOLD} stopOpacity="0" />
          <stop offset="0.5" stopColor={GOLD} stopOpacity="0.32" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* rack frame */}
      <g stroke="white" strokeOpacity="0.16" strokeWidth="1.5">
        {SHELVES.map((y) => (
          <line key={y} x1="48" x2="384" y1={y} y2={y} />
        ))}
        {BAYS.map((x) => (
          <line key={x} x1={x - 8} x2={x - 8} y1="30" y2="262" />
        ))}
      </g>
      {/* stock */}
      {BOXES.map((b) => (
        <motion.rect
          key={b.i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="3"
          fill={b.gold ? "hsl(75 40% 55% / 0.35)" : "rgba(255,255,255,0.07)"}
          stroke={b.gold ? GOLD : "rgba(255,255,255,0.22)"}
          strokeOpacity={b.gold ? 0.8 : 1}
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          initial={false}
          animate={{ scaleY: on || reduced ? 1 : 0, opacity: on || reduced ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.45, delay: on && !reduced ? 0.2 + b.i * 0.025 : 0, ease }}
        />
      ))}
      {/* scanner sweep */}
      {live && (
        <motion.rect y="30" width="60" height="232" fill="url(#wcu-beam)" initial={{ x: 30 }} animate={{ x: [30, 342] }} transition={{ duration: 3.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1 }} />
      )}
      {/* the bond seal */}
      <g transform="translate(432 66)">
        <motion.circle
          r="34"
          fill="none"
          stroke={GOLD}
          strokeOpacity="0.7"
          strokeDasharray="3 5"
          animate={live ? { rotate: 360 } : undefined}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
        <circle r="25" fill="hsl(150 40% 8%)" stroke={GOLD} strokeOpacity="0.35" />
        <rect x="-8" y="-6" width="16" height="12" rx="2" fill={GOLD} />
        <path d="M -5 -6 v -4 a 5 5 0 0 1 10 0 v 4" fill="none" stroke={GOLD} strokeWidth="2" />
        <text y="20" textAnchor="middle" fill={GOLD} fontSize="6.5" fontWeight="700" letterSpacing="1.4" fontFamily="Sora Variable, Sora, sans-serif">
          IN BOND
        </text>
      </g>
    </svg>
  );
}

/* ─── Scene 03 — a temperature trace that never leaves −18 °C ─────────── */

const STAGES = [
  { x: 50, label: "Cold store" },
  { x: 220, label: "In transit" },
  { x: 390, label: "Delivered" },
];
const FLAKES = Array.from({ length: 16 }, (_, i) => ({ x: (i * 67) % 470 + 6, r: 1 + (i % 3) * 0.6, d: 7 + (i % 5) * 1.6, delay: -(i * 0.9) }));

function ColdScene({ on, reduced }: SceneProps) {
  const live = on && !reduced;
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <linearGradient id="wcu-trace" gradientUnits="userSpaceOnUse" x1="50" x2="390" y1="0" y2="0">
          <stop offset="0" stopColor={ACCENT} />
          <stop offset="1" stopColor={GOLD} />
        </linearGradient>
      </defs>
      {/* frost */}
      {FLAKES.map((f, i) => (
        <motion.circle
          key={i}
          cx={f.x}
          r={f.r}
          fill="white"
          fillOpacity="0.35"
          initial={false}
          animate={live ? { cy: [-10, 310] } : { cy: 20 + ((i * 53) % 260) }}
          transition={live ? { duration: f.d, repeat: Infinity, ease: "linear", delay: f.delay } : { duration: 0 }}
        />
      ))}
      {/* the reading */}
      <text x="40" y="92" fill="white" fontSize="64" fontWeight="700" letterSpacing="-2" fontFamily="Sora Variable, Sora, sans-serif">
        −18
        <tspan fontSize="28" dx="6" dy="-26" fill={GOLD}>
          °C
        </tspan>
      </text>
      {/* reference lines */}
      <line x1="40" x2="410" y1="150" y2="150" stroke="white" strokeOpacity="0.12" strokeDasharray="4 6" />
      <text x="468" y="154" textAnchor="end" fill="white" fillOpacity="0.4" fontSize="11" fontFamily="Inter Variable, Inter, sans-serif">
        0 °C
      </text>
      <text x="468" y="218" textAnchor="end" fill={GOLD} fontSize="11" fontWeight="600" fontFamily="Inter Variable, Inter, sans-serif">
        −18 °C
      </text>
      {/* the trace, flat all the way */}
      <motion.path
        d="M 50 214 L 390 214"
        stroke="url(#wcu-trace)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={{ pathLength: on || reduced ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 1.4, delay: on && !reduced ? 0.3 : 0, ease }}
      />
      {live && (
        <motion.circle cy="214" r="6" fill="white" initial={{ cx: 50, opacity: 0 }} animate={{ cx: [50, 390], opacity: [0, 1, 1, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.6 }} style={{ filter: "drop-shadow(0 0 6px hsl(75 40% 60%))" }} />
      )}
      {STAGES.map((s, i) => (
        <g key={s.label}>
          <motion.circle
            cx={s.x}
            cy="214"
            r="7"
            fill="hsl(150 40% 7%)"
            stroke={GOLD}
            strokeWidth="2"
            initial={false}
            animate={{ scale: on || reduced ? 1 : 0 }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: on && !reduced ? 0.4 + i * 0.4 : 0 }}
          />
          <text x={s.x} y="244" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="11" fontFamily="Inter Variable, Inter, sans-serif">
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ─── Scene 04 — deliveries fanning out from Colombo, island-wide ─────── */

const MAP_T = { x: 92, y: -32, s: 1.55 };
const COLOMBO = SRI_LANKA_CITIES.find((c) => c.name === "Colombo")!;
const DESTS = SRI_LANKA_CITIES.filter((c) => c.name !== "Colombo");
const route = (c: { cx: number; cy: number }) => {
  const mx = (COLOMBO.cx + c.cx) / 2;
  const my = (COLOMBO.cy + c.cy) / 2;
  // bow each route a little to the left of its direction of travel
  const dx = c.cx - COLOMBO.cx;
  const dy = c.cy - COLOMBO.cy;
  return `M ${COLOMBO.cx} ${COLOMBO.cy} Q ${mx + dy * 0.22} ${my - dx * 0.22} ${c.cx} ${c.cy}`;
};

function IslandScene({ on, reduced }: SceneProps) {
  const live = on && !reduced;
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <pattern id="wcu-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="0.7" fill="white" fillOpacity="0.28" />
        </pattern>
        <clipPath id="wcu-island">
          <path d={SRI_LANKA_PATH} />
        </clipPath>
      </defs>
      <g transform={`translate(${MAP_T.x} ${MAP_T.y}) scale(${MAP_T.s})`}>
        <path d={SRI_LANKA_PATH} fill="rgba(255,255,255,0.04)" stroke="white" strokeOpacity="0.28" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <rect x="40" y="20" width="120" height="190" fill="url(#wcu-dots)" clipPath="url(#wcu-island)" />
        {DESTS.map((c, i) => (
          <g key={c.name}>
            <motion.path
              d={route(c)}
              fill="none"
              stroke={GOLD}
              strokeWidth="1.4"
              strokeOpacity="0.75"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ pathLength: on || reduced ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.9, delay: on && !reduced ? 0.3 + i * 0.12 : 0, ease }}
            />
            {live && (
              <circle r="1.9" fill="white">
                <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${1.2 + i * 0.3}s`} path={route(c)} />
              </circle>
            )}
            <motion.circle
              cx={c.cx}
              cy={c.cy}
              r="2.6"
              fill={GOLD}
              initial={false}
              animate={{ scale: on || reduced ? 1 : 0 }}
              style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 16, delay: on && !reduced ? 0.9 + i * 0.12 : 0 }}
            />
            <text x={c.cx + (c.cx > 85 ? 5 : -5)} y={c.cy + 2.5} textAnchor={c.cx > 85 ? "start" : "end"} fill="white" fillOpacity="0.6" fontSize="6.5" fontFamily="Inter Variable, Inter, sans-serif">
              {c.name}
            </text>
          </g>
        ))}
        {live && (
          <motion.circle cx={COLOMBO.cx} cy={COLOMBO.cy} r="5" fill="none" stroke={GOLD} strokeWidth="1" vectorEffect="non-scaling-stroke" animate={{ r: [5, 16], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
        )}
        <circle cx={COLOMBO.cx} cy={COLOMBO.cy} r="4.6" fill={GOLD} />
        <circle cx={COLOMBO.cx} cy={COLOMBO.cy} r="1.8" fill="hsl(150 40% 6%)" />
        <text x={COLOMBO.cx - 7} y={COLOMBO.cy + 2.5} textAnchor="end" fill="white" fontSize="7.5" fontWeight="600" fontFamily="Sora Variable, Sora, sans-serif">
          Colombo
        </text>
      </g>
    </svg>
  );
}

/* ─── The four capabilities ───────────────────────────────────────────── */

const CAPABILITIES: Capability[] = [
  {
    key: "sourcing",
    icon: Globe2,
    label: "Global sourcing",
    tag: "Sourcing · Import",
    headline: "Sourced from 30+ countries",
    text: "We buy from producers in more than thirty countries and import it ourselves, so one partner covers the whole journey from the producer to your kitchen or shelf.",
    stat: { value: "30+", unit: "source countries" },
    link: { label: "Browse our brands", to: "/brands" },
    Scene: ImportScene,
  },
  {
    key: "bonded",
    icon: Warehouse,
    label: "Bonded warehouse",
    tag: "Storage · Colombo",
    headline: "Held in our own bonded warehouse",
    text: "Imported stock is kept in our bonded warehouse in Colombo, under the same roof as our office and cold store, ready to go out when you order.",
    stat: { value: "Colombo 11", unit: "office, bond and cold store together" },
    link: { label: "About Olive Foods", to: "/about" },
    Scene: BondedScene,
  },
  {
    key: "cold-chain",
    icon: Snowflake,
    label: "−18 °C cold chain",
    tag: "Frozen · Cold chain",
    headline: "Kept frozen, store to door",
    text: "Frozen lines are stored and delivered under cold chain at −18 °C, from our cold store to your door.",
    stat: { value: "−18 °C", unit: "cold store to delivery" },
    link: { label: "See all categories", to: "/categories" },
    Scene: ColdScene,
  },
  {
    key: "island-wide",
    icon: Truck,
    label: "Island-wide delivery",
    tag: "Distribution",
    headline: "Delivered to all 25 districts",
    text: "Hotels, restaurants, cafés, caterers, supermarkets and retailers across Sri Lanka get island-wide delivery from our Colombo warehouse.",
    stat: { value: "25", unit: "districts covered" },
    link: { label: "Ask about delivery", to: "/contact" },
    Scene: IslandScene,
  },
];

/* ─── One panel of the deck ───────────────────────────────────────────── */

function Panel({
  cap,
  index,
  on,
  reduced,
  timer,
  onSelect,
  onTimerEnd,
}: {
  cap: Capability;
  index: number;
  on: boolean;
  reduced: boolean;
  /** "run" / "pause" the auto-advance bar, or null when it's off. */
  timer: "run" | "pause" | null;
  onSelect: () => void;
  onTimerEnd: () => void;
}) {
  const uid = useId();
  const btnId = `${uid}-btn`;
  const regionId = `${uid}-region`;
  const { icon: Icon, Scene } = cap;
  const num = String(index + 1).padStart(2, "0");

  return (
    <li
      className={cn(
        "relative overflow-hidden rounded-[22px] border transition-[flex-grow,border-color,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-w-0 lg:basis-0",
        on
          ? "border-gold-light/25 bg-[linear-gradient(160deg,hsl(150_38%_9%),hsl(150_40%_6%))] lg:grow-[3.3]"
          : "border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05] lg:grow",
      )}
    >
      {/* Auto-advance progress (desktop) */}
      {on && (
        <span aria-hidden className="absolute inset-x-0 top-0 z-20 hidden h-[2px] bg-white/[0.06] lg:block">
          <span
            key={timer ? "timed" : "static"}
            className="block h-full origin-left bg-gradient-to-r from-accent to-gold-light"
            style={timer ? { animation: `progress-bar ${STEP_MS}ms linear forwards`, animationPlayState: timer === "pause" ? "paused" : "running" } : undefined}
            onAnimationEnd={onTimerEnd}
          />
        </span>
      )}

      {/* Trigger: an accordion row on phones; the folded label on desktop */}
      <h3 className="lg:contents">
        <button
          id={btnId}
          type="button"
          aria-expanded={on}
          aria-controls={regionId}
          onClick={onSelect}
          className={cn(
            "group/trigger relative z-10 flex w-full items-center gap-4 p-4 text-left sm:p-5",
            "lg:absolute lg:inset-0 lg:flex-col lg:items-start lg:justify-between lg:gap-0 lg:p-6 lg:transition-opacity lg:duration-300",
            on ? "lg:pointer-events-none lg:opacity-0" : "lg:opacity-100 lg:delay-200",
          )}
        >
          <span className="flex shrink-0 items-center gap-3 lg:w-full lg:justify-between">
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-500",
                on ? "border-transparent bg-gold-light text-forest-deep" : "border-white/10 bg-white/[0.05] text-gold-light group-hover/trigger:border-gold-light/40",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="hidden font-display text-xs font-semibold tracking-[0.2em] text-white/40 lg:block">{num}</span>
          </span>
          <span className="min-w-0 flex-1 lg:flex lg:flex-1 lg:items-end">
            <span className="block font-display text-[17px] font-semibold leading-tight text-white lg:text-[26px] lg:font-bold lg:tracking-tight lg:text-white/85 lg:[transform:rotate(180deg)] lg:[writing-mode:vertical-rl] lg:group-hover/trigger:text-white">
              {cap.label}
            </span>
            <span className="mt-0.5 block font-body text-[13px] text-white/50 lg:hidden">
              {cap.stat.value} · {cap.stat.unit}
            </span>
          </span>
          <ChevronDown className={cn("h-5 w-5 shrink-0 text-white/50 transition-transform duration-300 lg:hidden", on && "rotate-180 text-gold-light")} />
        </button>
      </h3>

      {/* The open panel: collapses by row height on phones, fades on desktop */}
      <div
        id={regionId}
        role="region"
        aria-labelledby={btnId}
        aria-hidden={!on}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:absolute lg:inset-y-0 lg:left-0 lg:block lg:w-[calc((min(100vw,80rem)_-_100px)_*_0.52)]",
          on ? "grid-rows-[1fr] opacity-100 lg:delay-200" : "grid-rows-[0fr] opacity-0 lg:duration-200",
        )}
      >
        <div className="min-h-0 overflow-hidden lg:flex lg:h-full lg:flex-col">
          {/* scene */}
          <div className="relative mx-4 h-52 overflow-hidden rounded-2xl border border-white/[0.06] bg-[radial-gradient(ellipse_at_50%_40%,hsl(146_40%_11%),hsl(150_40%_6%)_75%)] sm:mx-5 sm:h-64 lg:mx-0 lg:h-auto lg:flex-1 lg:rounded-none lg:border-0 lg:bg-[radial-gradient(ellipse_at_50%_45%,hsl(146_40%_12%/0.9),transparent_70%)]">
            <div className="absolute inset-0 p-3 lg:p-6 lg:pb-0">
              <Scene on={on} reduced={reduced} />
            </div>
            <span aria-hidden className="pointer-events-none absolute left-6 top-6 hidden font-display text-xs font-semibold tracking-[0.2em] text-white/40 lg:block">
              {num} / 04
            </span>
          </div>

          {/* copy */}
          <div className="px-4 pb-5 pt-4 sm:px-5 lg:px-8 lg:pb-8 lg:pt-2">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">{cap.tag}</p>
            <p aria-hidden className="mt-2 hidden font-display text-[28px] font-bold leading-[1.1] tracking-tight text-white lg:block xl:text-[32px]">
              {cap.headline}
            </p>
            <p className="mt-2 max-w-[34rem] font-body text-[15px] leading-relaxed text-white/60">{cap.text}</p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 lg:mt-5 lg:border-t lg:border-white/[0.08] lg:pt-4">
              <p className="hidden items-baseline gap-2 lg:flex">
                <span className="font-display text-3xl font-bold tracking-tight text-gradient-gold-dark">{cap.stat.value}</span>
                <span className="font-body text-[13px] text-white/50">{cap.stat.unit}</span>
              </p>
              <Link
                to={cap.link.to}
                tabIndex={on ? undefined : -1}
                className="group/link inline-flex items-center gap-1.5 py-1 font-body text-sm font-semibold text-gold-light transition-colors hover:text-white"
              >
                {cap.link.label}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────── */

const WhyChooseUs = () => {
  const reduced = !!useReducedMotion();
  const deckRef = useRef<HTMLUListElement>(null);
  const deckInView = useInView(deckRef, { amount: 0.45 });
  const [active, setActive] = useState(0);
  // Auto-advance runs on desktop only, until the visitor picks a panel.
  const [auto, setAuto] = useState(true);
  const [held, setHeld] = useState(false);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Desktop always shows one panel open.
  useEffect(() => {
    if (wide && active < 0) setActive(0);
  }, [wide, active]);

  const timer: "run" | "pause" | null = !auto || reduced || !wide ? null : held || !deckInView ? "pause" : "run";

  const select = (i: number) => {
    setAuto(false);
    // Phones: tapping the open row closes it; desktop always keeps one open.
    setActive((cur) => (cur === i && !wide ? -1 : i));
  };

  return (
    <section
      id="about"
      aria-labelledby="why-choose-us-title"
      className="relative overflow-hidden py-section-base lg:py-section-base-lg"
      style={{ background: "radial-gradient(ellipse 90% 60% at 50% 0%, hsl(150 42% 9%), hsl(150 40% 5%) 65%)" }}
    >
      {/* Blueprint grid, faded at the edges, and two slow glows. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[8%] top-[8%] h-[38vw] w-[38vw] rounded-full opacity-[0.16] blur-[120px] animate-orb"
        style={{ background: "radial-gradient(circle, hsl(140 55% 22%), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] bottom-[-8%] h-[34vw] w-[34vw] rounded-full opacity-[0.1] blur-[120px] animate-orb"
        style={{ background: "radial-gradient(circle, hsl(75 40% 45%), transparent 70%)", animationDelay: "8s" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="relative mb-12 lg:mb-14">
          <div>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7, ease }}
            >
              <Eyebrow variant="pill" tone="white" className="mb-7">
                Why Choose Olive Foods
              </Eyebrow>
            </motion.div>
            <h2 id="why-choose-us-title" className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[60px]">
              <SplitText text="Your complete import and" by="word" stagger={0.05} as="span" className="block" />
              <SplitText
                text="distribution partner."
                by="word"
                stagger={0.05}
                delay={0.25}
                as="span"
                className="block text-gradient-gold-dark"
                tokenClassName="text-gradient-gold-dark"
              />
            </h2>
          </div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="mt-7 max-w-xl xl:absolute xl:bottom-1 xl:right-0 xl:mt-0 xl:w-[420px]"
          >
            <p className="font-body text-base leading-relaxed text-white/60 sm:text-lg">
              Thirty-plus years in the food trade. Sourcing, import, bonded storage, cold chain and island-wide delivery, handled by one team from
              one Colombo address.
            </p>
            <p className="mt-4 hidden font-body text-xs font-medium uppercase tracking-[0.2em] text-white/35 lg:block">Pick a capability, or watch them in turn</p>
          </motion.div>
        </div>

        {/* ── The deck ── */}
        <motion.ul
          ref={deckRef}
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease }}
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
          }}
          className="flex flex-col gap-3 lg:h-[560px] lg:flex-row"
        >
          {CAPABILITIES.map((cap, i) => (
            <Panel
              key={cap.key}
              cap={cap}
              index={i}
              on={active === i}
              reduced={reduced}
              timer={active === i ? timer : null}
              onSelect={() => select(i)}
              onTimerEnd={() => setActive((cur) => (cur + 1) % CAPABILITIES.length)}
            />
          ))}
        </motion.ul>

        {/* ── Close ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease }}
          className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:p-7 lg:mt-12"
        >
          <div>
            <p className="font-display text-xl font-bold text-white sm:text-2xl">Ready to partner with Olive Foods?</p>
            <p className="mt-1 font-body text-sm text-white/55">Tell us what your kitchen or shelves need. We reply within one business day.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton>
              <Button asChild variant="brand" size="pill" className="group font-body">
                <Link to="/contact">
                  Get in touch
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild variant="heroOutline" size="pill" className="font-body">
                <Link to="/products">Browse products</Link>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      <CursorSpotlight color="hsl(75 40% 60% / 0.1)" size={560} blendMode="screen" />
    </section>
  );
};

export default WhyChooseUs;
