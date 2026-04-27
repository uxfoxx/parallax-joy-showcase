#!/usr/bin/env node
/**
 * Supabase migration runner.
 *
 * Applies every file in `supabase/migrations/*.sql` (sorted by filename)
 * to the database pointed at by `SUPABASE_DB_URL` in `.env`. Idempotent:
 * tracks applied filenames in `public._migrations` and skips the rest.
 *
 * Usage:
 *   1. Paste the DB URL from Supabase Studio → Project Settings →
 *      Database → "Connection string" → URI (use the pooled "Transaction"
 *      connection) into `.env` as SUPABASE_DB_URL.
 *   2. `npm run db:migrate`.
 *
 * Each migration runs in its own transaction. On failure, the script
 * rolls back that file's transaction, logs the Postgres error, and
 * exits 1 — the database is never left half-migrated.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

loadEnv({ path: join(repoRoot, ".env") });

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error(
    "✗ SUPABASE_DB_URL is not set.\n" +
      "  Add it to .env. Get the value from Supabase Studio →\n" +
      "  Project Settings → Database → Connection string → URI\n" +
      "  (use the pooled 'Transaction' connection).",
  );
  process.exit(1);
}

const migrationsDir = join(repoRoot, "supabase", "migrations");
if (!existsSync(migrationsDir)) {
  console.error(`✗ Migrations directory not found: ${migrationsDir}`);
  process.exit(1);
}

const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.log("No migration files found — nothing to do.");
  process.exit(0);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
} catch (err) {
  console.error("✗ Could not connect to the database.");
  console.error(`  ${err.message}`);
  process.exit(1);
}

console.log(`Connected. Found ${files.length} migration file(s).\n`);

await client.query(`
  CREATE TABLE IF NOT EXISTS public._migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  );
`);

const { rows } = await client.query("SELECT name FROM public._migrations");
const applied = new Set(rows.map((r) => r.name));

let appliedCount = 0;
let skippedCount = 0;

for (const file of files) {
  if (applied.has(file)) {
    console.log(`✓ ${file}  (already applied)`);
    skippedCount++;
    continue;
  }

  const sql = readFileSync(join(migrationsDir, file), "utf8");
  process.stdout.write(`→ applying ${file} … `);

  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query(
      "INSERT INTO public._migrations (name) VALUES ($1)",
      [file],
    );
    await client.query("COMMIT");
    console.log("✓");
    appliedCount++;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.log("✗");
    console.error(`\n  ${file} failed — rolled back.`);
    console.error(`  ${err.message}`);
    if (err.detail) console.error(`  detail: ${err.detail}`);
    if (err.hint) console.error(`  hint:   ${err.hint}`);
    await client.end();
    process.exit(1);
  }
}

await client.end();

console.log(
  `\nDone. ${appliedCount} applied, ${skippedCount} already up to date.`,
);
