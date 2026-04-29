import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

function guessCategory(merchant: string) {
  const m = merchant.toLowerCase();
  if (m.includes("פז") || m.includes("סונול") || m.includes("דלק") || m.includes("דור אלון")) return "תחבורה";
  if (m.includes("שופרסל") || m.includes("רמי לוי") || m.includes("טיב טעם") || m.includes("מגה") || m.includes("סופר")) return "אוכל הביתה";
  if (m.includes("חשמל") || m.includes("מים") || m.includes("ארנונה") || m.includes("הוט") || m.includes("yes")) return "חשבונות";
  if (m.includes("זארה") || m.includes("קסטרו") || m.includes("h&m") || m.includes("ksp")) return "קניות";
  if (m.includes("וולט") || m.includes("wolt") || m.includes("מסעד") || m.includes("קפה") || m.includes("תן ביס")) return "אוכל בחוץ";
  if (m.includes("סופר-פארם") || m.includes("be") || m.includes("בית מרקחת")) return "פארם ובריאות";
  return "כללי";
}

export const importCsv = action({
  args: { 
    fileContent: v.string(),
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    // Simple spike: split by newline, assume format "date,merchant,amount"
    const lines = args.fileContent.split('\n').filter(l => l.trim().length > 0);
    const parsedTransactions = [];

    for (const line of lines) {
      const parts = line.split(',');
      // Basic heuristic: CSV has at least 3 parts.
      if (parts.length >= 3) {
        const [dateStr, merchantStr, amountStr] = parts;
        const amount = parseFloat(amountStr);
        if (isNaN(amount)) continue; // skip header lines
        
        // Very naive date parsing for spike purposes
        const txDate = Date.parse(dateStr) || Date.now();
        const merchant = merchantStr.trim();
        const category = guessCategory(merchant);

        parsedTransactions.push({
          amount,
          currency: "ILS",
          merchant,
          category,
          txDate,
          source: "csv" as const,
          rawRow: line
        });
      }
    }

    if (parsedTransactions.length > 0) {
      await ctx.runMutation(api.transactions.insertMany, {
        userId: args.userId,
        transactions: parsedTransactions
      });
    }

    return { importedCount: parsedTransactions.length };
  }
});
