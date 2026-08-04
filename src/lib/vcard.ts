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
  triggerVCardDownload(buildVCard(p), `${p.slug || "contact"}.vcf`);
};

const COMPANY = {
  name: "Olive Foods (Pvt) Ltd",
  phone: "+94 11 207 1717",
  email: "info@olivefoods.lk",
  // ADR: ;;street;city;region;postal;country  (commas/semicolons escaped)
  adr: ";;292 Sea Street\\, Colombo 11;Colombo;;01100;Sri Lanka",
  url: "https://www.olivefoods.lk",
};

/** Build a VCARD 3.0 for the Olive Foods company contact. `phone` overrides the
 *  default number, and an optional `phone2` adds a second number — both set in
 *  the admin panel — so the one saved contact carries both. */
export const buildCompanyVCard = (phone?: string | null, phone2?: string | null): string => {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(COMPANY.name)};;;`,
    `FN:${esc(COMPANY.name)}`,
    `ORG:${esc(COMPANY.name)}`,
    `TEL;TYPE=WORK,VOICE:${(phone && phone.trim()) || COMPANY.phone}`,
  ];
  if (phone2 && phone2.trim()) lines.push(`TEL;TYPE=CELL,VOICE:${phone2.trim()}`);
  lines.push(
    `EMAIL;TYPE=INTERNET:${COMPANY.email}`,
    `ADR;TYPE=WORK:${COMPANY.adr}`,
    `URL:${COMPANY.url}`,
    "END:VCARD",
  );
  return lines.join("\r\n");
};

/** Download the Olive Foods company contact as a .vcf. iOS Safari and Android
 *  Chrome both open the "Add to Contacts" screen for a downloaded .vcf. */
export const downloadCompanyVCard = (phone?: string | null, phone2?: string | null): void => {
  triggerVCardDownload(buildCompanyVCard(phone, phone2), "olive-foods.vcf");
};

/** Shared blob-download trigger for a .vcf string. */
const triggerVCardDownload = (vcard: string, filename: string): void => {
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
