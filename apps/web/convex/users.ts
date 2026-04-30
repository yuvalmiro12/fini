import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Called from Clerk webhook — upserts user record without needing an active session.
 */
export const upsertFromWebhook = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        avatarUrl: args.avatarUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      avatarUrl: args.avatarUrl,
      createdAt: Date.now(),
      currency: "ILS",
      subscriptionTier: "free",
      trialEndsAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
  },
});

/**
 * Called from Clerk webhook on user.deleted — removes user data (GDPR).
 */
export const deleteByClerkId = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (user) await ctx.db.delete(user._id);
  },
});

/**
 * Called once on every login — finds or creates the user's Convex record.
 * The Clerk identity is passed automatically via JWT; we never store raw tokens here.
 */
export const getOrCreate = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Check for existing user by Clerk ID
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (existing) {
      // Update name/avatar if they changed in Clerk
      const updates: Record<string, unknown> = {};
      if (identity.name && identity.name !== existing.name) updates.name = identity.name;
      if (identity.pictureUrl && identity.pictureUrl !== existing.avatarUrl)
        updates.avatarUrl = identity.pictureUrl;
      if (Object.keys(updates).length > 0) await ctx.db.patch(existing._id, updates);
      return existing._id;
    }

    // First login — create new user with 7-day free trial
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: identity.name ?? "משתמש",
      email: identity.email,
      avatarUrl: identity.pictureUrl,
      createdAt: Date.now(),
      currency: "ILS",
      subscriptionTier: "free",
      trialEndsAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return userId;
  },
});

/**
 * Returns the current user's full record, or null if not logged in.
 */
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

/**
 * Returns a user by their Convex ID.
 */
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

/**
 * Mock user for development — kept for local testing without Convex server.
 * Will be removed in v1.1 after Auth is fully live.
 */
export const getMockUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), "נועה"))
      .first();
    return user ? user._id : null;
  },
});

/**
 * @deprecated — use getOrCreate instead.
 */
export const getOrCreateMockUser = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), "נועה"))
      .first();
    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      clerkId: "mock_noaa",
      name: "נועה",
      createdAt: Date.now(),
      currency: "ILS",
      subscriptionTier: "free",
    });
  },
});
