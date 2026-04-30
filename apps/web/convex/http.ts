import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

/**
 * Clerk Webhook Handler
 *
 * Receives user lifecycle events from Clerk and keeps Convex DB in sync.
 * Register this URL in Clerk Dashboard → Webhooks:
 *   https://<your-deployment>.convex.site/webhooks/clerk
 *
 * Required events to subscribe to:
 *   - user.created
 *   - user.updated
 *   - user.deleted
 */
http.route({
  path: "/webhooks/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    // 1. Verify Svix signature
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const body = await req.text();

    // Verify using svix — import dynamically since it's a Node.js library
    let event: { type: string; data: Record<string, unknown> };
    try {
      const { Webhook } = await import("svix");
      const wh = new Webhook(webhookSecret);
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as { type: string; data: Record<string, unknown> };
    } catch {
      return new Response("Invalid signature", { status: 401 });
    }

    const { type, data } = event;

    // 2. Handle event types
    if (type === "user.created" || type === "user.updated") {
      const clerkId = data.id as string;
      const firstName = (data.first_name as string) ?? "";
      const lastName = (data.last_name as string) ?? "";
      const name = [firstName, lastName].filter(Boolean).join(" ") || "משתמש";
      const emailObj = (data.email_addresses as Array<{ email_address: string }>)?.[0];
      const email = emailObj?.email_address;
      const avatarUrl = data.image_url as string | undefined;

      await ctx.runMutation(api.users.upsertFromWebhook, {
        clerkId,
        name,
        email,
        avatarUrl,
      });
    }

    if (type === "user.deleted") {
      const clerkId = data.id as string;
      await ctx.runMutation(api.users.deleteByClerkId, { clerkId });
    }

    return new Response("OK", { status: 200 });
  }),
});

export default http;
