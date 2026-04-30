import type { LLMProvider } from "./provider.js";
import { AnthropicProvider } from "./anthropic.js";

export type ProviderName = "anthropic" | "dicta" | "openai";

/**
 * Factory for LLMProvider instances. Application code should only call this —
 * never `new AnthropicProvider()` directly.
 *
 * When STRATEGY.md §8 "Phase 2" triggers (Open Banking → data sovereignty),
 * flip `primary` from "anthropic" to "dicta" and re-run the eval suite.
 */
export function getProvider(
  name: ProviderName,
  opts?: { apiKey?: string; model?: string }
): LLMProvider {
  switch (name) {
    case "anthropic":
      return new AnthropicProvider(opts);
    case "dicta":
      throw new Error(
        "DictaProvider not implemented yet — Phase 2 track per STRATEGY.md §8/§1.5."
      );
    case "openai":
      throw new Error(
        "OpenAIProvider not implemented. Add only when vendor-lock-in risk actually triggers migration."
      );
    default: {
      // Exhaustiveness check.
      const _exhaustive: never = name;
      throw new Error(`Unknown provider: ${_exhaustive}`);
    }
  }
}
