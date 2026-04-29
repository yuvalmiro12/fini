import { action } from "./_generated/server";
import { v } from "convex/values";
import { getProvider } from "@fini/llm";

export const ping = action({
  args: { message: v.string() },
  handler: async (ctx, args) => {
    const provider = getProvider("anthropic");
    
    const response = await provider.chat({
      messages: [{ role: "user", content: args.message }],
      system: "You are Fini, a helpful financial assistant speaking Hebrew.",
    });

    return response.message.content;
  },
});
