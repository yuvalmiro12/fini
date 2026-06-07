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
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<PublicConnection[]> => {
    const rows = await ctx.db
      .query("bankConnections")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    return rows.map(({ credentialsCipher, ...rest }) => rest);
  },
});

/** Internal: insert a new connection (called by the bank.create action). */
export const _insert = internalMutation({
  args: {
    userId: v.id("users"),
    provider: v.string(),
    label: v.optional(v.string()),
    credentialsCipher: v.string(),
    startDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bankConnections", {
      userId: args.userId,
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
  args: { connectionId: v.id("bankConnections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.connectionId);
  },
});

/** Internal: update sync status / metadata after a sync attempt. */
export const _setStatus = internalMutation({
  args: {
    connectionId: v.id("bankConnections"),
    status: statusLiteral,
    lastSyncAt: v.optional(v.number()),
    lastError: v.optional(v.union(v.string(), v.null())),
    accountNumbers: v.optional(v.array(v.string())),
    balance: v.optional(v.union(v.number(), v.null())),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = { status: args.status };
    if (args.lastSyncAt !== undefined) patch.lastSyncAt = args.lastSyncAt;
    if (args.lastError !== undefined) patch.lastError = args.lastError ?? undefined;
    if (args.accountNumbers !== undefined) patch.accountNumbers = args.accountNumbers;
    if (args.balance !== undefined && args.balance !== null) patch.balance = args.balance;
    await ctx.db.patch(args.connectionId, patch);
  },
});

/** Remove a linked account. Verifies ownership before deleting. */
export const remove = mutation({
  args: { userId: v.id("users"), connectionId: v.id("bankConnections") },
  handler: async (ctx, args) => {
    const conn = await ctx.db.get(args.connectionId);
    if (!conn || conn.userId !== args.userId) {
      throw new Error("Connection not found");
    }
    await ctx.db.delete(args.connectionId);
  },
});
