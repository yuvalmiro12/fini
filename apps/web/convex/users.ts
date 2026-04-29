import { mutation } from "./_generated/server";

export const getOrCreateMockUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if mock user "נועה" exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), "נועה"))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create if not exists
    const newUserId = await ctx.db.insert("users", {
      name: "נועה",
      createdAt: Date.now(),
      currency: "ILS",
    });

    return newUserId;
  },
});
