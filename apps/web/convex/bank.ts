"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { encryptCreds, decryptCreds } from "./crypto";
import { guessCategory } from "./categorize";
import { providerToSource, type SourceLiteral } from "./sources";

// ── Types mirroring the scraper-worker /scrape response ──────────────────────
type WorkerTxn = {
  type?: string;
  identifier?: string | number;
  date: string; // ISO 8601
  processedDate?: string;
  originalAmount?: number;
  originalCurrency?: string;
  chargedAmount: number;
  chargedCurrency?: string;
  description: string;
  memo?: string;
  status?: "completed" | "pending";
};
type WorkerAccount = { accountNumber: string; balance?: number; txns: WorkerTxn[] };
type WorkerResponse = {
  success: boolean;
  accounts?: WorkerAccount[];
  errorType?: string;
  errorMessage?: string;
};

type InsertRow = {
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  txDate: number;
  source: SourceLiteral;
  accountLabel?: string;
  txType?: "expense" | "income";
  externalId?: string;
};

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// errorType → (status, Hebrew message)
function mapError(errorType?: string, errorMessage?: string): {
  status: "error" | "needs_action";
  message: string;
} {
  switch (errorType) {
    case "INVALID_PASSWORD":
      return { status: "needs_action", message: "שם המשתמש או הסיסמה שגויים. עדכן את פרטי ההתחברות." };
    case "CHANGE_PASSWORD":
      return { status: "needs_action", message: "הבנק דורש החלפת סיסמה. התחבר לאתר הבנק, עדכן סיסמה ונסה שוב." };
    case "ACCOUNT_BLOCKED":
      return { status: "needs_action", message: "החשבון חסום אצל הבנק. פנה לבנק לשחרור החסימה." };
    case "TIMEOUT":
      return { status: "error", message: "תם הזמן הקצוב לסנכרון. נסה שוב מאוחר יותר." };
    default:
      return { status: "error", message: errorMessage || "הסנכרון נכשל. נסה שוב מאוחר יותר." };
  }
}

function normalizeCurrency(raw?: string): string {
  const c = (raw || "ILS").trim().toUpperCase();
  return c === "₪" || c === "NIS" || c === "" ? "ILS" : c;
}

function buildExternalId(provider: string, account: string, t: WorkerTxn, txDate: number): string {
  const idPart =
    t.identifier !== undefined && t.identifier !== null && `${t.identifier}` !== ""
      ? `${t.identifier}`
      : `${txDate}:${t.chargedAmount}:${(t.description || "").slice(0, 40)}`;
  return `${provider}:${account}:${idPart}`;
}

/**
 * Create a linked bank account. Encrypts credentials with AES-256-GCM (node:crypto)
 * before they ever touch the database.
 */
export const create = action({
  args: {
    userId: v.string(),
    provider: v.string(),
    label: v.optional(v.string()),
    credentials: v.record(v.string(), v.string()),
    startDate: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ connectionId: string }> => {
    const cipher = encryptCreds(JSON.stringify(args.credentials));
    const connectionId = await ctx.runMutation(internal.bankConnections._insert, {
      userId: args.userId,
      provider: args.provider,
      label: args.label,
      credentialsCipher: cipher,
      startDate: args.startDate,
    });
    return { connectionId };
  },
});

/**
 * Sync transactions for one linked account: decrypt creds → call the scraper
 * worker → map + dedupe → insert. Updates the connection status throughout.
 */
export const sync = action({
  args: { userId: v.string(), connectionId: v.string() },
  handler: async (
    ctx,
    args,
  ): Promise<{ imported: number; skipped: number; accounts: number; error?: string }> => {
    const conn = await ctx.runQuery(internal.bankConnections._getWithCipher, {
      connectionId: args.connectionId,
    });
    if (!conn || conn.userId !== args.userId) {
      throw new Error("Connection not found");
    }

    // OneZero needs interactive OTP (2FA) — out of scope for the headless worker.
    if (conn.provider === "oneZero") {
      await ctx.runMutation(internal.bankConnections._setStatus, {
        connectionId: args.connectionId,
        status: "needs_action",
        lastError: "OneZero דורש אימות דו-שלבי (OTP) ואינו נתמך בסנכרון אוטומטי כרגע.",
      });
      return { imported: 0, skipped: 0, accounts: 0, error: "oneZero_unsupported" };
    }

    await ctx.runMutation(internal.bankConnections._setStatus, {
      connectionId: args.connectionId,
      status: "syncing",
      lastError: null,
    });

    const workerUrl = process.env.WORKER_URL;
    const workerSecret = process.env.WORKER_SHARED_SECRET;
    if (!workerUrl || !workerSecret) {
      await ctx.runMutation(internal.bankConnections._setStatus, {
        connectionId: args.connectionId,
        status: "error",
        lastError: "השרת לא מוגדר (WORKER_URL / WORKER_SHARED_SECRET חסרים).",
      });
      return { imported: 0, skipped: 0, accounts: 0, error: "worker_not_configured" };
    }

    const credentials = JSON.parse(decryptCreds(conn.credentialsCipher));
    const startDate = conn.startDate ?? Date.now() - ONE_YEAR_MS;

    let data: WorkerResponse;
    try {
      const res = await fetch(`${workerUrl.replace(/\/$/, "")}/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${workerSecret}`,
        },
        body: JSON.stringify({ provider: conn.provider, credentials, startDate }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`worker ${res.status}: ${text.slice(0, 200)}`);
      }
      data = (await res.json()) as WorkerResponse;
    } catch (err) {
      await ctx.runMutation(internal.bankConnections._setStatus, {
        connectionId: args.connectionId,
        status: "error",
        lastError: "החיבור לשרת הסנכרון נכשל. ודא שהשרת פעיל ונסה שוב.",
      });
      console.error("bank.sync worker call failed", String(err));
      return { imported: 0, skipped: 0, accounts: 0, error: "worker_unreachable" };
    }

    if (!data.success) {
      const { status, message } = mapError(data.errorType, data.errorMessage);
      await ctx.runMutation(internal.bankConnections._setStatus, {
        connectionId: args.connectionId,
        status,
        lastError: message,
      });
      return { imported: 0, skipped: 0, accounts: 0, error: data.errorType || "scrape_failed" };
    }

    const source = providerToSource(conn.provider);
    const accounts = data.accounts ?? [];
    const rows: InsertRow[] = [];
    const accountNumbers: string[] = [];
    let balance: number | undefined;

    for (const account of accounts) {
      if (account.accountNumber) accountNumbers.push(account.accountNumber);
      if (typeof account.balance === "number") balance = (balance ?? 0) + account.balance;
      for (const t of account.txns || []) {
        const txDate = Date.parse(t.date);
        if (isNaN(txDate)) continue;
        const amountRaw = typeof t.chargedAmount === "number" ? t.chargedAmount : t.originalAmount;
        if (typeof amountRaw !== "number" || amountRaw === 0) continue;
        const merchant =
          t.memo && t.memo.trim() && t.memo.trim() !== t.description?.trim()
            ? `${t.description} — ${t.memo.trim()}`
            : t.description || "ללא תיאור";
        rows.push({
          amount: Math.abs(amountRaw),
          currency: normalizeCurrency(t.chargedCurrency || t.originalCurrency),
          merchant,
          category: guessCategory(merchant),
          txDate,
          source,
          accountLabel: conn.label || account.accountNumber || undefined,
          txType: amountRaw < 0 ? "expense" : "income",
          externalId: buildExternalId(conn.provider, account.accountNumber || "?", t, txDate),
        });
      }
    }

    let imported = 0;
    let skipped = 0;
    if (rows.length > 0) {
      const result = await ctx.runMutation(api.transactions.insertMany, {
        // Use the connection's stored (DB-validated) userId, never the raw
        // string arg — guarantees insertMany gets a real Id<"users">.
        userId: conn.userId,
        transactions: rows,
      });
      imported = result.insertedIds.length;
      skipped = result.skipped;
    }

    await ctx.runMutation(internal.bankConnections._setStatus, {
      connectionId: args.connectionId,
      status: "connected",
      lastSyncAt: Date.now(),
      lastError: null,
      accountNumbers: accountNumbers.length ? accountNumbers : undefined,
      balance: balance ?? null,
    });

    return { imported, skipped, accounts: accounts.length };
  },
});
