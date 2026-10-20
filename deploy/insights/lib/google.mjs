// Google APIs with a service-account key, using only Node's own crypto/fetch:
// the insights service has no npm dependencies, so nothing to install or patch
// on the shared VPS. The account is read-only (GA4 Viewer, Search Console
// Restricted) and holds no Google Cloud roles.
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
  "openid", // PageSpeed Insights: bills our project's quota instead of the shared keyless one
].join(" ");

let key = null;
let cached = { token: null, expires: 0 };

export function googleConfigured(file) {
  if (key) return true;
  try {
    key = JSON.parse(readFileSync(file, "utf8"));
    return Boolean(key.client_email && key.private_key);
  } catch {
    key = null;
    return false;
  }
}

const b64url = (v) => Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");

export async function accessToken() {
  if (cached.token && Date.now() < cached.expires - 60_000) return cached.token;
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url({ alg: "RS256", typ: "JWT" })}.${b64url({
    iss: key.client_email,
    scope: SCOPES,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Google sign-in failed: ${json.error_description || json.error || res.status}`);
  cached = { token: json.access_token, expires: Date.now() + json.expires_in * 1000 };
  return cached.token;
}

/** Authorised Google API call; throws with Google's own message on failure. */
export async function google(url, body, { method } = {}) {
  const res = await fetch(url, {
    method: method || (body ? "POST" : "GET"),
    headers: { authorization: `Bearer ${await accessToken()}`, ...(body ? { "content-type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error?.message || `HTTP ${res.status}`);
  return json;
}
