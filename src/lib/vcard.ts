import type { BusinessProfile } from "@/lib/api";

/** Escape a value for a vCard text field (commas, semicolons, newlines). */
const esc = (v: string) =>
  v.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** Build a VCARD 3.0 string for a business profile. */
export const buildVCard = (p: BusinessProfile): string => {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  lines.push(`N:${esc(p.name)};;;`);
  lines.push(`FN:${esc(p.name)}`);
  if (p.company) lines.push(`ORG:${esc(p.company)}`);
  if (p.title) lines.push(`TITLE:${esc(p.title)}`);
  if (p.phone) lines.push(`TEL;TYPE=CELL:${p.phone}`);
  if (p.whatsapp) lines.push(`TEL;TYPE=CELL:${p.whatsapp}`);
  if (p.phone_secondary) lines.push(`TEL;TYPE=WORK:${p.phone_secondary}`);
  if (p.email) lines.push(`EMAIL;TYPE=INTERNET:${p.email}`);
  if (p.photo_url) lines.push(`PHOTO;VALUE=URI:${p.photo_url}`);
  if (p.bio) lines.push(`NOTE:${esc(p.bio)}`);
  if (typeof window !== "undefined") {
    lines.push(`URL:${window.location.origin}/card/${p.slug}`);
  }
  lines.push("END:VCARD");
  return lines.join("\r\n");
};

/** Trigger a browser download of the profile as a .vcf contact file. */
export const downloadVCard = (p: BusinessProfile): void => {
  const blob = new Blob([buildVCard(p)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${p.slug || "contact"}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
