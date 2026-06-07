// Shared, rule-based merchant → category guesser.
// Used by both the CSV importer (import.ts) and the bank-sync mapper (bank.ts)
// so the two ingestion paths stay consistent. Runtime-agnostic (no Node/V8 deps).

export function guessCategory(merchant: string): string {
  const m = (merchant || "").toLowerCase();
  if (m.includes("פז") || m.includes("סונול") || m.includes("דלק") || m.includes("דור אלון") || m.includes("ten") || m.includes("paz")) return "תחבורה";
  if (m.includes("שופרסל") || m.includes("רמי לוי") || m.includes("טיב טעם") || m.includes("מגה") || m.includes("סופר") || m.includes("ויקטורי") || m.includes("יוחננוף")) return "אוכל הביתה";
  if (m.includes("חשמל") || m.includes("מים") || m.includes("ארנונה") || m.includes("הוט") || m.includes("yes") || m.includes("בזק") || m.includes("פרטנר") || m.includes("סלקום")) return "חשבונות";
  if (m.includes("זארה") || m.includes("קסטרו") || m.includes("h&m") || m.includes("ksp") || m.includes("ikea") || m.includes("אייקאה")) return "קניות";
  if (m.includes("וולט") || m.includes("wolt") || m.includes("מסעד") || m.includes("קפה") || m.includes("תן ביס") || m.includes("10bis") || m.includes("מקדונלד")) return "אוכל בחוץ";
  if (m.includes("סופר-פארם") || m.includes("be") || m.includes("בית מרקחת") || m.includes("ניו פארם")) return "פארם ובריאות";
  return "כללי";
}
