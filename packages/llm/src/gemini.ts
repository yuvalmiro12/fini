import { GoogleGenAI } from "@google/genai";
import type { LLMProvider } from "./provider.js";
import type {
  ChatMessage,
  ChatResponse,
  ToolCall,
  ToolDef,
} from "./types.js";

export class GeminiProvider implements LLMProvider {
  readonly name = "gemini";
  readonly model: string;
  private client: GoogleGenAI;

  constructor(opts: { apiKey?: string; model?: string } = {}) {
    const apiKey = opts.apiKey ?? process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GeminiProvider: GEMINI_API_KEY is not set. " +
          "Add it to your Convex deployment env (dashboard)."
      );
    }
    this.client = new GoogleGenAI({ apiKey });
    this.model = opts.model ?? "gemini-2.5-flash-lite";
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

    // Build contents array — filter system messages, map roles
    const nonSystem = messages.filter((m) => m.role !== "system");

    const contents = nonSystem.map((m) => {
      if (m.role === "user") {
        return { role: "user" as const, parts: [{ text: m.content }] };
      }
      if (m.role === "assistant") {
        if (m.toolCalls && m.toolCalls.length > 0) {
          return {
            role: "model" as const,
            parts: m.toolCalls.map((tc) => ({
              functionCall: { name: tc.name, args: tc.input },
            })),
          };
        }
        return { role: "model" as const, parts: [{ text: m.content }] };
      }
      if (m.role === "tool") {
        return {
          role: "user" as const,
          parts: [
            {
              functionResponse: {
                name: m.toolName ?? "unknown",
                response: { result: m.content },
              },
            },
          ],
        };
      }
      return { role: "user" as const, parts: [{ text: m.content }] };
    });

    // Gemini requires contents to start with 'user'
    while (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    const functionDeclarations = (tools ?? []).map((t) => ({
      name: t.name,
      description: t.description,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parameters: t.inputSchema as any,
    }));

    const response = await this.client.models.generateContent({
      model: this.model,
      contents,
      config: {
        systemInstruction: system,
        maxOutputTokens: maxTokens,
        temperature,
        ...(functionDeclarations.length > 0
          ? { tools: [{ functionDeclarations }] }
          : {}),
      },
    });

    const latencyMs = Date.now() - start;

    const textParts: string[] = [];
    const toolCalls: ToolCall[] = [];

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.text) {
        textParts.push(part.text);
      } else if (part.functionCall) {
        toolCalls.push({
          id: `${part.functionCall.name}-${Date.now()}`,
          name: part.functionCall.name ?? "unknown",
          input: (part.functionCall.args ?? {}) as Record<string, unknown>,
        });
      }
    }

    const inputTokens = response.usageMetadata?.promptTokenCount ?? 0;
    const outputTokens = response.usageMetadata?.candidatesTokenCount ?? 0;

    return {
      content: textParts.join("\n"),
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      stopReason: toolCalls.length > 0 ? "tool_use" : "end_turn",
      usage: {
        inputTokens,
        outputTokens,
        estimatedCostUsd: 0,
      },
      latencyMs,
    };
  }
}
