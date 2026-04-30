/**
 * Core types shared by all LLMProvider implementations.
 *
 * We deliberately keep these independent of any vendor SDK so that swapping
 * providers (Anthropic → Dicta → OpenAI, per STRATEGY.md §8) is one-file change.
 */

export type Role = "user" | "assistant" | "system" | "tool";

export interface ChatMessage {
  role: Role;
  content: string;
  /** For tool results — the tool_use id the result corresponds to. */
  toolCallId?: string;
  /** For tool results — the tool that produced this result. */
  toolName?: string;
  /** For assistant messages — the tools the model decided to call. */
  toolCalls?: ToolCall[];
}

export interface ToolDef {
  name: string;
  description: string;
  /** JSON Schema object describing the tool's input. */
  inputSchema: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export type StopReason = "end_turn" | "tool_use" | "max_tokens" | "stop_sequence";

export interface ChatResponse {
  content: string;
  toolCalls?: ToolCall[];
  stopReason: StopReason;
  usage: {
    inputTokens: number;
    outputTokens: number;
    /** USD cost at the provider's current rates. Bookkeeping only — don't bill on this. */
    estimatedCostUsd: number;
  };
  latencyMs: number;
}
