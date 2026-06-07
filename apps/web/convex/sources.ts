import { v } from "convex/values";

// Single source of truth for the `transactions.source` union, shared across
// the importer, the transactions table helpers, and the bank-sync mapper.
export const sourceLiteral = v.union(
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
);

export type SourceLiteral =
  | "manual" | "csv" | "cal" | "max" | "isracard" | "amex"
  | "hapoalim" | "leumi" | "discount" | "mizrahi" | "fibi" | "other"
  | "mercantile" | "otsarHahayal" | "union" | "beinleumi" | "massad"
  | "yahav" | "beyahadBishvilha" | "behatsdaa" | "oneZero" | "pagi";

const SOURCES: ReadonlySet<string> = new Set<SourceLiteral>([
  "manual", "csv", "cal", "max", "isracard", "amex",
  "hapoalim", "leumi", "discount", "mizrahi", "fibi", "other",
  "mercantile", "otsarHahayal", "union", "beinleumi", "massad",
  "yahav", "beyahadBishvilha", "behatsdaa", "oneZero", "pagi",
]);

/**
 * Map an israeli-bank-scrapers CompanyTypes id to a transactions.source literal.
 * The scraper uses "visaCal"; we store it as the pre-existing "cal" source.
 * Unknown providers fall back to "other".
 */
export function providerToSource(provider: string): SourceLiteral {
  if (provider === "visaCal") return "cal";
  return (SOURCES.has(provider) ? provider : "other") as SourceLiteral;
}
