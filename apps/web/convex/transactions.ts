import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { sourceLiteral } from "./sources";

export const insertMany = mutation({
  args: {
    userId: v.id("users"),
    transactions: v.array(v.object({
      amount: v.number(),
      currency: v.string(),
      merchant: v.string(),
      category: v.string(),
      txDate: v.number(),
      source: sourceLiteral,
      accountLabel: v.optional(v.string()),
      txType: v.optional(v.union(v.literal("expense"), v.literal("income"))),
      rawRow: v.optional(v.string()),
      externalId: v.optional(v.string()),
    }))
  },
  handler: async (ctx, args) => {
    const insertedIds = [];
    let skipped = 0;
    for (const tx of args.transactions) {
      // Dedupe bank-sync rows: if a row carries an externalId we've already
      // stored for this user, skip it. CSV/manual rows have no externalId and
      // are always inserted (matching the prior behaviour).
      if (tx.externalId) {
        const existing = await ctx.db
          .query("transactions")
          .withIndex("by_user_external", (q) =>
            q.eq("userId", args.userId).eq("externalId", tx.externalId)
          )
          .first();
        if (existing) { skipped++; continue; }
      }
      const id = await ctx.db.insert("transactions", {
        userId: args.userId,
        createdAt: Date.now(),
        ...tx,
      });
      insertedIds.push(id);
    }
    return { insertedIds, skipped };
  }
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  }
});
