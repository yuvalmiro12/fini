import { action } from "./_generated/server";
import { v } from "convex/values";
import { getProvider } from "@fini/llm";
import { api } from "./_generated/api";
import type { ChatMessage } from "@fini/llm/src/types";

const SYSTEM_PROMPT = `
אתה "פיני", יועץ כלכלי חכם וחברי של זוגות צעירים בישראל.
מטרתך: לעזור למשתמשים לעקוב אחרי הכסף שלהם, להבין איפה הם מבזבזים, ולתת טיפים לחיסכון.
טון הדיבור: קליל, טבעי, חם, בגובה העיניים (כמו חבר טוב). השתמש באימוג'ים בטעם.

השתמש בכלי get_transactions כדי לשלוף נתונים כלכליים של המשתמש. 
לעולם אל תמציא מספרים או עסקאות שלא קיימים בדאטה בייס!
אם אין מספיק מידע, תגיד שאין לך עדיין נתונים על זה ושווה להוסיף אותם.
`;

export const ping = action({
  args: { 
    message: v.string(),
    userId: v.optional(v.id("users")), // Made optional temporarily to not break UI if they haven't uploaded CSV yet
    history: v.optional(v.array(v.any())) // Workaround because v.object is strict and we have complex union in ChatMessage
  },
  handler: async (ctx, args) => {
    const provider = getProvider("anthropic");
    
    // Map history to our ChatMessage type
    const messages: ChatMessage[] = args.history ? (args.history as ChatMessage[]) : [];
    messages.push({ role: "user", content: args.message });

    const tools = [
      {
        name: "get_transactions",
        description: "Returns the user's recent bank transactions. Use this whenever the user asks about their spending, income, or specific categories.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      }
    ];

    let response = await provider.chat({
      messages,
      system: SYSTEM_PROMPT,
      tools
    });

    // If the model decides to use a tool:
    if (response.toolCalls && response.toolCalls.length > 0) {
      for (const toolCall of response.toolCalls) {
        if (toolCall.name === "get_transactions") {
          let targetUserId = args.userId;
          if (!targetUserId) {
            targetUserId = await ctx.runQuery(api.users.getMockUser) || undefined;
          }

          let txsStr = "אין נתונים על הוצאות למשתמש זה כרגע.";
          if (targetUserId) {
            const txs = await ctx.runQuery(api.transactions.getByUser, { userId: targetUserId });
            const formattedTxs = txs.map(t => ({
              date: new Date(t.txDate).toLocaleDateString('he-IL'),
              merchant: t.merchant,
              amount: t.amount,
              category: t.category
            }));
            txsStr = JSON.stringify(formattedTxs);
          }
          
          // Add the model's tool_use message to history
          messages.push({
            role: "assistant",
            content: response.content || "",
            toolCalls: [toolCall]
          });

          // Add the tool result to history
          messages.push({
            role: "tool",
            content: txsStr,
            toolCallId: toolCall.id,
            toolName: toolCall.name
          });
        }
      }

      // Call LLM again with the new context
      response = await provider.chat({
        messages,
        system: SYSTEM_PROMPT,
        tools
      });
    }

    return response.content;
  },
});
