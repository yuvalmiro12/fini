import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const sourceLiteral = v.union(
  v.literal("manual"),
  v.literal("csv"),
  v.literal("cal"),
  v.literal("max"),
  v.literal("isracard"),
  v.literal("amex"),
  v.literal("hapoalim"),
  v.literal("leumi"),
  v.literal("discount"),
  v.literal("mizrahi"),
  v.literal("fibi"),
  v.literal("other"),
);

type SourceLiteral =
  | "manual" | "csv" | "cal" | "max" | "isracard" | "amex"
  | "hapoalim" | "leumi" | "discount" | "mizrahi" | "fibi" | "other";

type ParsedRow = {
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  txDate: number;
  source: SourceLiteral;
  accountLabel?: string;
  txType?: "expense" | "income";
  rawRow?: string;
};

function guessCategory(merchant: string): string {
  const m = merchant.toLowerCase();
  if (m.includes("פז") || m.includes("סונול") || m.includes("דלק") || m.includes("דור אלון") || m.includes("ten") || m.includes("paz")) return "תחבורה";
  if (m.includes("שופרסל") || m.includes("רמי לוי") || m.includes("טיב טעם") || m.includes("מגה") || m.includes("סופר") || m.includes("ויקטורי") || m.includes("יוחננוף")) return "אוכל הביתה";
  if (m.includes("חשמל") || m.includes("מים") || m.includes("ארנונה") || m.includes("הוט") || m.includes("yes") || m.includes("בזק") || m.includes("פרטנר") || m.includes("סלקום")) return "חשבונות";
  if (m.includes("זארה") || m.includes("קסטרו") || m.includes("h&m") || m.includes("ksp") || m.includes("ikea") || m.includes("אייקאה")) return "קניות";
  if (m.includes("וולט") || m.includes("wolt") || m.includes("מסעד") || m.includes("קפה") || m.includes("תן ביס") || m.includes("10bis") || m.includes("מקדונלד")) return "אוכל בחוץ";
  if (m.includes("סופר-פארם") || m.includes("be") || m.includes("בית מרקחת") || m.includes("ניו פארם")) return "פארם ובריאות";
  return "כללי";
}

// ────────────────────────────────────────────────────────────────
// CSV parsing — handles quoted fields, commas inside quotes, BOM.
// Returns array of string arrays (rows × cells).
// ────────────────────────────────────────────────────────────────
function parseCsv(text: string): string[][] {
  // Strip UTF-8 BOM that Excel/Israeli bank exports often include
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(cell); cell = ""; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += c;
    }
  }
  if (cell.length > 0 || row.length > 0) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim().length > 0));
}

// ────────────────────────────────────────────────────────────────
// Column auto-detection from header row.
// Returns indices for date/merchant/amount/debit/credit/currency.
// ────────────────────────────────────────────────────────────────
type ColumnMap = {
  date: number;
  merchant: number;       // primary merchant/operation column
  merchantExtra: number;  // secondary detail column to append (e.g. "פרטים", "לטובת", "עבור")
  beneficiary: number;    // "לטובת" — for bank transfers
  reason: number;         // "עבור" — for bank transfers
  amount: number;
  debit: number;
  credit: number;
  currency: number;
  txDate2: number;
};

function detectColumns(headers: string[]): ColumnMap {
  const map: ColumnMap = { date: -1, merchant: -1, merchantExtra: -1, beneficiary: -1, reason: -1, amount: -1, debit: -1, credit: -1, currency: -1, txDate2: -1 };
  headers.forEach((raw, i) => {
    const h = (raw || "").trim().toLowerCase();
    if (!h) return;
    // Date — prefer transaction/purchase date over charge/value date
    if (map.date === -1 && (h.includes("תאריך עסקה") || h.includes("תאריך רכישה") || h === "תאריך" || h === "date" || h.includes("transaction date") || h.includes("purchase date"))) {
      map.date = i; return;
    }
    if (map.txDate2 === -1 && (h.includes("תאריך חיוב") || h.includes("charge date") || h.includes("posting date") || h.includes("value date") || h.includes("תאריך ערך"))) {
      map.txDate2 = i; return;
    }
    // Hapoalim-style: "הפעולה" = primary merchant/operation name
    if (map.merchant === -1 && (h === "הפעולה" || h.includes("פעולה") || h.includes("שם בית") || h.includes("בית עסק") || h.includes("שם העסק") || h.includes("merchant") || h.includes("description") || h.includes("תיאור") || h.includes("name") || h.includes("payee") || h.includes("נמען"))) {
      map.merchant = i; return;
    }
    // Secondary detail (always appended if non-empty)
    if (map.merchantExtra === -1 && (h.includes("פרטים") || h.includes("פירוט") || h.includes("details") || h.includes("memo") || h.includes("note"))) {
      map.merchantExtra = i; return;
    }
    if (map.beneficiary === -1 && (h.includes("לטובת") || h.includes("נמען") || h.includes("beneficiary") || h.includes("recipient"))) {
      map.beneficiary = i; return;
    }
    if (map.reason === -1 && (h === "עבור" || h.includes("עבור") || h.includes("purpose") || h.includes("reason"))) {
      map.reason = i; return;
    }
    if (map.debit === -1 && (h === "חובה" || h.includes("debit") || h.includes("withdrawal") || h.includes("משיכה"))) {
      map.debit = i; return;
    }
    if (map.credit === -1 && (h === "זכות" || h.includes("credit") || h.includes("deposit") || h.includes("הפקדה") || h.includes("זיכוי"))) {
      map.credit = i; return;
    }
    if (map.amount === -1 && (h.includes("סכום חיוב") || h.includes("סכום עסקה") || h === "סכום" || h.includes("amount") || h.includes("סך"))) {
      map.amount = i; return;
    }
    if (map.currency === -1 && (h === "מטבע" || h.includes("currency") || h === "ccy")) {
      map.currency = i; return;
    }
  });
  return map;
}

// ────────────────────────────────────────────────────────────────
// Date parsing — handles DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, ISO,
// and Excel serial dates. Returns Unix ms timestamp or null.
// ────────────────────────────────────────────────────────────────
function parseDate(raw: string): number | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;

  // DD/MM/YYYY or DD-MM-YYYY (Israeli default)
  const dmY = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
  if (dmY) {
    let [, d, m, y] = dmY;
    if (y.length === 2) y = (parseInt(y, 10) > 50 ? "19" : "20") + y;
    const t = Date.UTC(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    if (!isNaN(t)) return t;
  }
  // YYYY-MM-DD / YYYY/MM/DD
  const yMd = s.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
  if (yMd) {
    const [, y, m, d] = yMd;
    const t = Date.UTC(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    if (!isNaN(t)) return t;
  }
  // Excel serial date (rare in CSV exports but happens)
  const num = parseFloat(s);
  if (!isNaN(num) && num > 25569 && num < 60000) {
    // Excel epoch = 1899-12-30; multiply by ms/day
    return Math.round((num - 25569) * 86400 * 1000);
  }
  // Last resort: native parser
  const parsed = Date.parse(s);
  return isNaN(parsed) ? null : parsed;
}

// ────────────────────────────────────────────────────────────────
// Amount parsing — strips currency symbols (₪, $, ‏), thousand
// separators, handles negative sign and parens.
// ────────────────────────────────────────────────────────────────
function parseAmount(raw: string): number | null {
  if (!raw) return null;
  let s = raw.trim();
  if (!s) return null;
  // Parenthesized negatives: (123.45)
  let negative = false;
  if (s.startsWith("(") && s.endsWith(")")) { negative = true; s = s.slice(1, -1); }
  // Strip currency symbols, RTL marks, spaces
  s = s.replace(/[₪$€£¥]/g, "").replace(/[‎‏‪-‮]/g, "").replace(/[\s,]/g, "");
  if (s.startsWith("-")) { negative = true; s = s.slice(1); }
  if (s.startsWith("+")) s = s.slice(1);
  const n = parseFloat(s);
  if (isNaN(n)) return null;
  return negative ? -n : n;
}

// ────────────────────────────────────────────────────────────────
// Header-row detection: looks for a row where at least 2 of
// date/merchant/amount can be identified. Skips bank export
// preamble rows (account number, date range, etc.).
// ────────────────────────────────────────────────────────────────
function findHeaderRow(rows: string[][]): { headerIdx: number; cols: ColumnMap } {
  for (let i = 0; i < Math.min(rows.length, 15); i++) {
    const cols = detectColumns(rows[i]);
    const hits = [cols.date, cols.merchant, cols.amount, cols.debit, cols.credit].filter(x => x !== -1).length;
    if (hits >= 2) return { headerIdx: i, cols };
  }
  // No headers detected — assume positional: date, merchant, amount
  return { headerIdx: -1, cols: { date: 0, merchant: 1, merchantExtra: -1, beneficiary: -1, reason: -1, amount: 2, debit: -1, credit: -1, currency: -1, txDate2: -1 } };
}

// ────────────────────────────────────────────────────────────────
// Main parser — pure function, used by importCsv and previewCsv.
// ────────────────────────────────────────────────────────────────
function parseTransactions(
  fileContent: string,
  source: SourceLiteral,
  accountLabel?: string,
): { rows: ParsedRow[]; skipped: number; detectedColumns: ColumnMap; headerRow: string[] | null } {
  const rows = parseCsv(fileContent);
  if (rows.length === 0) return { rows: [], skipped: 0, detectedColumns: { date: -1, merchant: -1, merchantExtra: -1, beneficiary: -1, reason: -1, amount: -1, debit: -1, credit: -1, currency: -1, txDate2: -1 }, headerRow: null };

  const { headerIdx, cols } = findHeaderRow(rows);
  const headerRow = headerIdx >= 0 ? rows[headerIdx] : null;
  const dataStart = headerIdx + 1;
  const parsed: ParsedRow[] = [];
  let skipped = 0;

  for (let i = dataStart; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.every(c => !c || !c.trim())) { continue; }

    // Pick date column — fall back to second date column if primary empty
    const dateRaw = (cols.date >= 0 ? r[cols.date] : "") || (cols.txDate2 >= 0 ? r[cols.txDate2] : "");
    const ts = parseDate(dateRaw);
    if (ts === null) { skipped++; continue; }

    let merchant = (cols.merchant >= 0 ? r[cols.merchant] : "").trim();
    // Enrich merchant for bank transfers: "העברה — לטובת X · עבור Y"
    const beneficiary = cols.beneficiary >= 0 ? (r[cols.beneficiary] || "").trim() : "";
    const reason = cols.reason >= 0 ? (r[cols.reason] || "").trim() : "";
    const extra = cols.merchantExtra >= 0 ? (r[cols.merchantExtra] || "").trim() : "";
    const suffixParts: string[] = [];
    if (beneficiary) suffixParts.push(beneficiary);
    if (reason && reason !== beneficiary) suffixParts.push(reason);
    if (!suffixParts.length && extra) suffixParts.push(extra);
    if (suffixParts.length && merchant) merchant = `${merchant} — ${suffixParts.join(" · ")}`;
    else if (!merchant && suffixParts.length) merchant = suffixParts.join(" · ");
    if (!merchant) { skipped++; continue; }

    // Amount: prefer single-amount column; else debit/credit (bank statement)
    let amount: number | null = null;
    let txType: "expense" | "income" = "expense";

    if (cols.amount >= 0) {
      amount = parseAmount(r[cols.amount]);
      if (amount !== null && amount < 0) { txType = "expense"; amount = Math.abs(amount); }
      else if (amount !== null && amount > 0) {
        // Credit card statements: positive = expense. Bank single-column rare.
        txType = source === "manual" ? "expense" : "expense";
      }
    } else if (cols.debit >= 0 || cols.credit >= 0) {
      const debit = cols.debit >= 0 ? parseAmount(r[cols.debit]) : null;
      const credit = cols.credit >= 0 ? parseAmount(r[cols.credit]) : null;
      if (debit && debit > 0) { amount = debit; txType = "expense"; }
      else if (credit && credit > 0) { amount = credit; txType = "income"; }
    }

    if (amount === null || amount === 0 || isNaN(amount)) { skipped++; continue; }

    const currency = cols.currency >= 0 ? (r[cols.currency] || "ILS").trim().toUpperCase() : "ILS";
    parsed.push({
      amount,
      currency: currency === "₪" || currency === "NIS" ? "ILS" : currency,
      merchant,
      category: guessCategory(merchant),
      txDate: ts,
      source,
      accountLabel: accountLabel?.trim() || undefined,
      txType,
      rawRow: r.join(","),
    });
  }

  return { rows: parsed, skipped, detectedColumns: cols, headerRow };
}

// ────────────────────────────────────────────────────────────────
// Public actions
// ────────────────────────────────────────────────────────────────

// Preview — returns first N parsed rows + column detection,
// without writing to DB. Lets the UI show a confirmation step.
export const previewCsv = action({
  args: {
    fileContent: v.string(),
    source: sourceLiteral,
    accountLabel: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const { rows, skipped, detectedColumns, headerRow } = parseTransactions(
      args.fileContent,
      args.source,
      args.accountLabel,
    );
    return {
      totalParsed: rows.length,
      skipped,
      detectedColumns,
      headerRow,
      sample: rows.slice(0, 5),
    };
  },
});

export const importCsv = action({
  args: {
    fileContent: v.string(),
    userId: v.id("users"),
    source: v.optional(sourceLiteral),
    accountLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const source: SourceLiteral = args.source ?? "csv";
    const { rows, skipped } = parseTransactions(args.fileContent, source, args.accountLabel);

    if (rows.length > 0) {
      await ctx.runMutation(api.transactions.insertMany, {
        userId: args.userId,
        transactions: rows,
      });
    }

    return { importedCount: rows.length, skippedCount: skipped };
  },
});
