import type { ChatMessage, ChatResponse, ToolDef } from "./types.js";

/**
 * Any LLM backend פיני talks to must implement this interface.
 *
 * Per STRATEGY.md §8 (sovereignty risk mitigation), application code NEVER
 * imports a vendor SDK directly — it always goes through LLMProvider. Swapping
 * Claude → DictaLM when Open Banking launches should mean editing one file.
 */
export interface LLMProvider {
  /** Short identifier: "anthropic", "dicta", "openai". */
  readonly name: string;

  /** The model version this provider is pinned to. */
  readonly model: string;

  chat(params: {
    messages: ChatMessage[];
    /** System prompt (פיני persona, instructions). */
    system?: string;
    /** Tool definitions the model may call. */
    tools?: ToolDef[];
    /** Hard cap on output tokens. Default 1024. */
    maxTokens?: number;
    /** 0-1. Default 0.3 — financial Q&A should be precise, not creative. */
    temperature?: number;
  }): Promise<ChatResponse>;
}
