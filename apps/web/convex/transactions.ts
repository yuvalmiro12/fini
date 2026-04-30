import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insertMany = mutation({
  args: {
    userId: v.id("users"),
    transactions: v.array(v.object({
      amount: v.number(),
      currency: v.string(),
      merchant: v.string(),
      category: v.string(),
      txDate: v.number(),
      source: v.union(v.literal("csv"), v.literal("manual")),
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
