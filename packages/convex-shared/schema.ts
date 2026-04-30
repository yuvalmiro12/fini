import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    createdAt: v.number(),
    currency: v.string(), // "ILS" by default
    subscriptionTier: v.union(
      v.literal("free"),
      v.literal("pro"),
      v.literal("pro_plus")
    ),
    trialEndsAt: v.optional(v.number()),
  }).index("by_clerk_id", ["clerkId"]),

  couples: defineTable({
    memberIds: v.array(v.id("users")),
    inviteCode: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("active"), v.literal("ended")),
    createdAt: v.number(),
  }),

  transactions: defineTable({
    userId: v.id("users"),
    coupleId: v.optional(v.id("couples")),
    amount: v.number(),
    currency: v.string(),
    merchant: v.string(),
    category: v.string(),
    txDate: v.number(), // Unix timestamp
    source: v.union(v.literal("csv"), v.literal("manual")),
    rawRow: v.optional(v.string()),
    createdAt: v.number(),
  }),

  savingsGoals: defineTable({
    ownerId: v.string(), // could be user ID or couple ID, string for flexibility or union
    title: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    targetDate: v.optional(v.number()),
    createdAt: v.number(),
  }),

  messages: defineTable({
    userId: v.id("users"),
    coupleId: v.optional(v.id("couples")),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("tool")),
    content: v.string(),
    toolCalls: v.optional(v.any()), // Can be refined later
    createdAt: v.number(),
  }),

  evalRuns: defineTable({
    questionId: v.string(),
    model: v.string(),
    response: v.string(),
    latencyMs: v.number(),
    cost: v.number(),
    rating: v.optional(v.number()),
    createdAt: v.number(),
  }),
});
