import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
      rawRow: v.optional(v.string())
    }))
  },
  handler: async (ctx, args) => {
    const insertedIds = [];
    for (const tx of args.transactions) {
      const id = await ctx.db.insert("transactions", {
        userId: args.userId,
        createdAt: Date.now(),
        ...tx,
      });
      insertedIds.push(id);
    }
    return insertedIds;
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
