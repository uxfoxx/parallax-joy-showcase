// Tiny JSON-file cache. Every source writes its last good result here, so a
// restart (every deploy) serves the previous data instantly instead of
// spending another call against Clarity's 10-a-day limit.
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

let dir = "";

export function openStore(path) {
  dir = path;
  mkdirSync(dir, { recursive: true });
}

export function read(name) {
  try {
    return JSON.parse(readFileSync(join(dir, `${name}.json`), "utf8"));
  } catch {
    return null;
  }
}

export function write(name, value) {
  const file = join(dir, `${name}.json`);
  writeFileSync(`${file}.tmp`, JSON.stringify(value));
  renameSync(`${file}.tmp`, file); // atomic: a crash never leaves half a file
}

/** A source's last result, or why it failed. */
export function save(name, data, error = null) {
  const prev = read(name);
  write(name, {
    updatedAt: error ? prev?.updatedAt ?? null : new Date().toISOString(),
    checkedAt: new Date().toISOString(),
    data: error ? prev?.data ?? null : data,
    error: error ? String(error.message || error) : null,
  });
}
