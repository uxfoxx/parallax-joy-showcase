import { describe, it, expect } from "vitest";
import { buildVCard } from "./vcard";
import type { BusinessProfile } from "./api";

const profile: BusinessProfile = {
  id: "1",
  slug: "jane-perera",
  name: "Jane Perera",
  title: "Regional Sales Manager",
  company: "Olive Foods",
  phone: "+94 77 123 4567",
  phone_secondary: "+94 11 207 1717",
  whatsapp: "+94 77 123 4567",
  email: "jane@olivefoods.lk",
  bio: "Frozen & dairy; HoReCa specialist",
  photo_url: "https://example.com/jane.jpg",
  active: true,
  display_order: 0,
  created_at: "",
  updated_at: "",
};

describe("buildVCard", () => {
  it("produces a valid vCard with the key fields", () => {
    const v = buildVCard(profile);
    expect(v.startsWith("BEGIN:VCARD")).toBe(true);
    expect(v.trimEnd().endsWith("END:VCARD")).toBe(true);
    expect(v).toContain("VERSION:3.0");
    expect(v).toContain("FN:Jane Perera");
    expect(v).toContain("ORG:Olive Foods");
    expect(v).toContain("TITLE:Regional Sales Manager");
    expect(v).toContain("TEL;TYPE=CELL:+94 77 123 4567");
    expect(v).toContain("TEL;TYPE=WORK:+94 11 207 1717");
    expect(v).toContain("EMAIL;TYPE=INTERNET:jane@olivefoods.lk");
    expect(v).toContain("PHOTO;VALUE=URI:https://example.com/jane.jpg");
  });

  it("omits empty fields and uses CRLF line endings", () => {
    const v = buildVCard({ ...profile, title: null, email: null, photo_url: null });
    expect(v).not.toContain("TITLE:");
    expect(v).not.toContain("EMAIL");
    expect(v).not.toContain("PHOTO");
    expect(v).toContain("\r\n");
  });
});
