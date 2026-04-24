import * as XLSX from "xlsx";

/**
 * Tiny wrapper around SheetJS for the admin XLSX sync flow.
 *
 *  1. `downloadSheet(filename, rows, columns)` — writes an .xlsx where the
 *     header row is `columns[*].header`. `rows` become spreadsheet rows in
 *     the same column order. Used for both the "blank sample" download and
 *     the "export current data" download.
 *  2. `parseSheetFile(file, columns)` — reads an uploaded .xlsx/.csv and
 *     returns each row as a plain object keyed by `columns[*].key`. Values
 *     are trimmed strings (or booleans/numbers where the caller has typed
 *     the column, via `parse`).
 *
 * Intentionally schema-light: the caller owns validation + upsert logic.
 */

export type SheetColumn<K extends string = string> = {
  /** Object key the parsed row will use. */
  key: K;
  /** Header text shown in the .xlsx file. Humans see this — keep it readable. */
  header: string;
  /** Optional example value written into the sample download. */
  sample?: string | number | boolean;
  /** Optional custom parser (e.g. "yes"/"no" → boolean). Default: string. */
  parse?: (raw: unknown) => unknown;
};

const toCellValue = (v: unknown): string | number | boolean | null => {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean" || typeof v === "number") return v;
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
};

/**
 * Generate and download an .xlsx file.
 * @param filename e.g. "products.xlsx"
 * @param rows     data rows as objects keyed by column `key`.
 * @param columns  column definitions in display order.
 */
export function downloadSheet<K extends string>(
  filename: string,
  rows: Record<K, unknown>[],
  columns: SheetColumn<K>[],
): void {
  const aoa: (string | number | boolean | null)[][] = [
    columns.map((c) => c.header),
    ...rows.map((r) => columns.map((c) => toCellValue(r[c.key]))),
  ];
  // If no rows, still emit a one-row template with sample values (when
  // provided) so admins see what goes where.
  if (rows.length === 0) {
    aoa.push(columns.map((c) => (c.sample === undefined ? "" : toCellValue(c.sample))));
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  // Auto-fit-ish: widen columns based on header + first row length.
  ws["!cols"] = columns.map((c, i) => {
    const headerLen = c.header.length;
    const firstRow = aoa[1]?.[i];
    const sampleLen = firstRow ? String(firstRow).length : 0;
    return { wch: Math.min(48, Math.max(12, headerLen + 2, sampleLen + 2)) };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, filename);
}

/**
 * Parse an uploaded xlsx/csv file into objects keyed by column `key`.
 * Unknown columns in the file are ignored. Missing columns produce
 * `undefined` values, letting the caller decide what's required.
 */
export async function parseSheetFile<K extends string>(
  file: File,
  columns: SheetColumn<K>[],
): Promise<Record<K, unknown>[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error("The uploaded file has no sheets.");
  const ws = wb.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: "",
    raw: true,
  });

  // Map uploaded column headers (case-insensitive) to our keys.
  const headerToKey = new Map<string, K>();
  columns.forEach((c) => headerToKey.set(c.header.trim().toLowerCase(), c.key));

  return raw.map((row) => {
    const out: Partial<Record<K, unknown>> = {};
    for (const [rawHeader, rawValue] of Object.entries(row)) {
      const key = headerToKey.get(rawHeader.trim().toLowerCase());
      if (!key) continue;
      const col = columns.find((c) => c.key === key)!;
      const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
      out[key] = col.parse ? col.parse(value) : value === "" ? null : value;
    }
    return out as Record<K, unknown>;
  });
}

// ─── Common parsers ───

export const parseBool = (raw: unknown): boolean => {
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "number") return raw !== 0;
  const s = String(raw ?? "").trim().toLowerCase();
  return ["yes", "y", "true", "1", "t"].includes(s);
};

export const parseCommaList = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw.map((x) => String(x).trim()).filter(Boolean);
  return String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};
