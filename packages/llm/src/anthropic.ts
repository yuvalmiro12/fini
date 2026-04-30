import Anthropic from "@anthropic-ai/sdk";
import type { LLMProvider } from "./provider.js";
import type {
  ChatMessage,
  ChatResponse,
  StopReason,
  ToolCall,
  ToolDef,
} from "./types.js";

/**
 * Claude Sonnet 4.6 pricing (USD per 1M tokens) — STRATEGY.md §4.
 * Used for bookkeeping only. Keep in sync with Anthropic's public pricing page.
 */
const INPUT_COST_PER_MTOK = 3.0;
const OUTPUT_COST_PER_MTOK = 15.0;

export class AnthropicProvider implements LLMProvider {
  readonly name = "anthropic";
  readonly model: string;
  private client: Anthropic;

  constructor(opts: { apiKey?: string; model?: string } = {}) {
    const apiKey = opts.apiKey ?? process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "AnthropicProvider: ANTHROPIC_API_KEY is not set. " +
          "Add it to your Convex deployment env (dashboard) or local .env.local for eval runs."
      );
    }
    this.client = new Anthropic({ apiKey });
    this.model = opts.model ?? "claude-sonnet-4-6";
  }

  async chat(params: {
    messages: ChatMessage[];
    system?: string;
    tools?: ToolDef[];
    maxTokens?: number;
    temperature?: number;
  }): Promise<ChatResponse> {
    const start = Date.now();
    const { messages, system, tools, maxTokens = 1024, temperature = 0.3 } = params;

    // Map fini ChatMessage -> Anthropic message blocks.
    const anthropicMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => {
        if (m.role === "tool" && m.toolCallId) {
          return {
            role: "user" as const,
            content: [
              {
                type: "tool_result" as const,
                tool_use_id: m.toolCallId,
                content: m.content,
              },
            ],
          };
        }
        if (m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0) {
          return {
            role: "assistant" as const,
            content: [
              ...(m.content ? [{ type: "text" as const, text: m.content }] : []),
              ...m.toolCalls.map(tc => ({
                type: "tool_use" as const,
                id: tc.id,
                name: tc.name,
                input: tc.input
              }))
            ]
          };
        }
        return {
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: m.content,
        };
      });

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: anthropicMessages,
      tools: tools?.map((t) => ({
        name: t.name,
        description: t.description,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input_schema: t.inputSchema as any,
      })),
    });

    const latencyMs = Date.now() - start;

    const textParts: string[] = [];
    const toolCalls: ToolCall[] = [];
    for (const block of response.content) {
      if (block.type === "text") {
        textParts.push(block.text);
      } else if (block.type === "tool_use") {
        toolCalls.push({
          id: block.id,
          name: block.name,
          input: block.input as Record<string, unknown>,
        });
      }
    }

    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const estimatedCostUsd =
      (inputTokens * INPUT_COST_PER_MTOK + outputTokens * OUTPUT_COST_PER_MTOK) /
      1_000_000;

    return {
      content: textParts.join("\n"),
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      stopReason: response.stop_reason as StopReason,
      usage: {
        inputTokens,
        outputTokens,
        estimatedCostUsd,
      },
      latencyMs,
    };
  }
}
