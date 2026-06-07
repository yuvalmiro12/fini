import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

const statusLiteral = v.union(
  v.literal("connected"),
  v.literal("syncing"),
  v.literal("error"),
  v.literal("needs_action"),
);

// Public-facing connection record — never includes the encrypted credentials.
type PublicConnection = Omit<Doc<"bankConnections">, "credentialsCipher">;

/**
 * List the current user's linked accounts. Strips `credentialsCipher` so the
 * encrypted secret never reaches the client.
 */
export const list = query({
  // Accept a plain string and normalize it: a stale userId left over from a
  // previous deployment (e.g. after switching Convex projects) must not crash
  // the dashboard — we just show no linked accounts until a fresh user resolves.
  args: { userId: v.string() },
  handler: async (ctx, args): Promise<PublicConnection[]> => {
    const userId = ctx.db.normalizeId("users", args.userId);
    if (!userId) return [];
    const rows = await ctx.db
      .query("bankConnections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return rows.map(({ credentialsCipher, ...rest }) => rest);
  },
});

/**
 * Internal: insert a new connection (called by the bank.create action).
 * userId arrives as a string from the Node action; normalize it here (actions
 * have no ctx.db.normalizeId).
 */
export const _insert = internalMutation({
  args: {
    userId: v.string(),
    provider: v.string(),
    label: v.optional(v.string()),
    credentialsCipher: v.string(),
    startDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = ctx.db.normalizeId("users", args.userId);
    if (!userId) throw new Error("User not found");
    return await ctx.db.insert("bankConnections", {
      userId,
      provider: args.provider,
      label: args.label,
      credentialsCipher: args.credentialsCipher,
      status: "connected",
      startDate: args.startDate,
      createdAt: Date.now(),
    });
  },
});

/** Internal: read a connection including its cipher (used only by bank.sync). */
export const _getWithCipher = internalQuery({
  args: { connectionId: v.string() },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("bankConnections", args.connectionId);
    if (!id) return null;
    return await ctx.db.get(id);
  },
});

/** Internal: update sync status / metadata after a sync attempt. */
export const _setStatus = internalMutation({
  args: {
    connectionId: v.string(),
    status: statusLiteral,
    lastSyncAt: v.optional(v.number()),
    lastError: v.optional(v.union(v.string(), v.null())),
    accountNumbers: v.optional(v.array(v.string())),
    balance: v.optional(v.union(v.number(), v.null())),
  },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("bankConnections", args.connectionId);
    if (!id) return;
    const patch: Record<string, unknown> = { status: args.status };
    if (args.lastSyncAt !== undefined) patch.lastSyncAt = args.lastSyncAt;
    if (args.lastError !== undefined) patch.lastError = args.lastError ?? undefined;
    if (args.accountNumbers !== undefined) patch.accountNumbers = args.accountNumbers;
    if (args.balance !== undefined && args.balance !== null) patch.balance = args.balance;
    await ctx.db.patch(id, patch);
  },
});

/**
 * Remove a linked account. Verifies ownership before deleting.
 * Accepts ids as strings and normalizes them so a stale id is a safe no-op
 * (consistent with `list`) rather than an uncaught ArgumentValidationError.
 *
 * NOTE: ownership is checked against the userId argument, matching the app-wide
 * mock-user pattern (transactions/import do the same). Once real auth is wired
 * app-wide, this should derive identity from ctx.auth.getUserIdentity() instead.
 */
export const remove = mutation({
  args: { userId: v.string(), connectionId: v.string() },
  handler: async (ctx, args) => {
    const userId = ctx.db.normalizeId("users", args.userId);
    const connectionId = ctx.db.normalizeId("bankConnections", args.connectionId);
    if (!userId || !connectionId) return;
    const conn = await ctx.db.get(connectionId);
    if (!conn || conn.userId !== userId) {
      throw new Error("Connection not found");
    }
    await ctx.db.delete(connectionId);
  },
});
