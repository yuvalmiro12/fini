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
    // Issuer / data origin. "csv" kept for backward compat with existing rows.
    source: v.union(
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
      // Additional issuers supported by the bank-sync scraper
      v.literal("mercantile"),
      v.literal("otsarHahayal"),
      v.literal("union"),
      v.literal("beinleumi"),
      v.literal("massad"),
      v.literal("yahav"),
      v.literal("beyahadBishvilha"),
      v.literal("behatsdaa"),
      v.literal("oneZero"),
      v.literal("pagi"),
    ),
    // Free-text account tag, e.g. "כרטיס אישי", "עו״ש משותף"
    accountLabel: v.optional(v.string()),
    // Direction of money flow — bank statements have both, CC statements are usually all expenses
    txType: v.optional(v.union(v.literal("expense"), v.literal("income"))),
    rawRow: v.optional(v.string()),
    // Stable cross-sync identifier for bank-sync rows — `${provider}:${accountNumber}:${identifier}`
    // (or a hash when the issuer provides no identifier). Used to dedupe repeated syncs.
    externalId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user_external", ["userId", "externalId"]),

  // Linked bank / credit-card accounts for automated transaction sync ("Open Banking").
  // Credentials are stored encrypted (AES-256-GCM); the plaintext never lands in the DB.
  bankConnections: defineTable({
    userId: v.id("users"),
    provider: v.string(), // israeli-bank-scrapers CompanyTypes id, e.g. "leumi"
    label: v.optional(v.string()), // display tag, e.g. "עו״ש לאומי"
    credentialsCipher: v.string(), // base64(iv).base64(authTag).base64(ciphertext)
    status: v.union(
      v.literal("connected"),
      v.literal("syncing"),
      v.literal("error"),
      v.literal("needs_action"), // e.g. wrong password / must change password / 2FA
    ),
    lastSyncAt: v.optional(v.number()),
    lastError: v.optional(v.string()),
    accountNumbers: v.optional(v.array(v.string())),
    balance: v.optional(v.number()),
    startDate: v.optional(v.number()), // earliest tx date to fetch
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

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
