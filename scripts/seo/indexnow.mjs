/**
 * Notify IndexNow search engines of the URLs added, changed or removed in this
 * deploy, so they recrawl them now rather than on their own schedule. IndexNow
 * reaches Bing — which powers ChatGPT search and Microsoft Copilot — plus
 * Yandex, Seznam and Naver. Google does not use IndexNow; it relies on the
 * sitemap's lastmod.
 *
 * The URL list comes from build-sitemap.mjs (.seo-cache/indexnow.json). The key
 * is the public/<32 hex>.txt file (the key file IndexNow fetches to verify the
 * site); it must be live before submitting, so deploy.sh runs this after the
 * release is up.
 *
 *   node scripts/seo/indexnow.mjs            submit
 *   node scripts/seo/indexnow.mjs --dry-run  show what would be sent
 *   INDEXNOW=0 ./scripts/deploy.sh           deploy without notifying
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT, SITE, INDEXNOW_FILE } from "./config.mjs";

const DRY = process.argv.includes("--dry-run");
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 10000; // protocol maximum per request

if (process.env.INDEXNOW === "0") {
  console.log("[indexnow] skipped (INDEXNOW=0)");
  process.exit(0);
}
if (!existsSync(INDEXNOW_FILE)) {
  console.log("[indexnow] nothing queued — run the build first");
  process.exit(0);
}

const keyFile = readdirSync(resolve(ROOT, "public")).find(
  (f) => /^[0-9a-f]{32}\.txt$/.test(f) && readFileSync(resolve(ROOT, "public", f), "utf8").trim() === f.slice(0, 32),
);
if (!keyFile) {
  console.warn("[indexnow] no key file in public/ — skipping");
  process.exit(0);
}
const key = keyFile.slice(0, 32);
const keyLocation = `${SITE}/${keyFile}`;
const { urls } = JSON.parse(readFileSync(INDEXNOW_FILE, "utf8"));
if (!urls?.length) {
  console.log("[indexnow] no new, changed or removed URLs — nothing to send");
  process.exit(0);
}

if (DRY) {
  console.log(`[indexnow] would send ${urls.length} URLs with key ${keyLocation}:`);
  for (const u of urls.slice(0, 20)) console.log(`  ${u}`);
  if (urls.length > 20) console.log(`  … and ${urls.length - 20} more`);
  process.exit(0);
}

// The engines verify ownership by fetching the key file — make sure it's live.
try {
  const res = await fetch(keyLocation, { signal: AbortSignal.timeout(10000) });
  const body = (await res.text()).trim();
  if (!res.ok || body !== key) {
    console.warn(`[indexnow] key file not live at ${keyLocation} (HTTP ${res.status}) — skipping`);
    process.exit(0);
  }
} catch (e) {
  console.warn(`[indexnow] could not reach ${keyLocation}: ${e.message} — skipping`);
  process.exit(0);
}

const host = new URL(SITE).host;
let failed = false;
for (let i = 0; i < urls.length; i += BATCH) {
  const urlList = urls.slice(i, i + BATCH);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
      signal: AbortSignal.timeout(30000),
    });
    // 200 = accepted, 202 = accepted while the key is being verified (first use).
    const ok = res.status === 200 || res.status === 202;
    console.log(`[indexnow] ${ok ? "✓" : "✗"} ${urlList.length} URLs → HTTP ${res.status}${ok ? "" : ` ${(await res.text()).slice(0, 200)}`}`);
    if (!ok) failed = true;
  } catch (e) {
    console.warn(`[indexnow] request failed: ${e.message}`);
    failed = true;
  }
}
process.exitCode = failed ? 1 : 0;
