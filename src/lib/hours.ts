import { useEffect, useState } from "react";

/**
 * Opening hours in Colombo time (src/data/company.json) and the live
 * "open now" status shown on the map section and in the footer.
 * Day 0 = Monday.
 */
export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const HOURS: { label: string; days: number[]; open?: number; close?: number }[] = [
  { label: "Mon – Fri", days: [0, 1, 2, 3, 4], open: 8.5, close: 17.5 },
  { label: "Saturday", days: [5], open: 8.5, close: 13 },
  { label: "Sunday", days: [6] },
];

export const fmtHour = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${hh < 12 ? "AM" : "PM"}`;
};

/** Current day (0 = Monday) and decimal hour in Asia/Colombo (UTC+5:30). */
export function colomboNow() {
  const lk = new Date(Date.now() + 5.5 * 3_600_000);
  return { day: (lk.getUTCDay() + 6) % 7, hour: lk.getUTCHours() + lk.getUTCMinutes() / 60 };
}

export function openStatus(day: number, hour: number) {
  const today = HOURS.find((h) => h.days.includes(day));
  if (today?.open != null && today.close != null) {
    if (hour >= today.open && hour < today.close) {
      const left = today.close - hour;
      return { open: true, label: left < 1 ? `Closes in ${Math.round(left * 60)} min` : `Open · closes ${fmtHour(today.close)}` };
    }
    if (hour < today.open) return { open: false, label: `Opens ${fmtHour(today.open)} today` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const h = HOURS.find((x) => x.days.includes(d));
    if (h?.open != null) return { open: false, label: `Opens ${fmtHour(h.open)} ${i === 1 ? "tomorrow" : DAY_NAMES[d]}` };
  }
  return { open: false, label: "Closed" };
}

/** Colombo day/hour, refreshed every minute. */
export function useColomboNow() {
  const [now, setNow] = useState(colomboNow);
  useEffect(() => {
    const id = window.setInterval(() => setNow(colomboNow()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
