import {
  GoogleGenerativeAI,
  type Content,
  type FunctionDeclaration,
} from "@google/generative-ai";
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
  private client: GoogleGenerativeAI;

  constructor(opts: { apiKey?: string; model?: string } = {}) {
    const apiKey = opts.apiKey ?? process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GeminiProvider: GEMINI_API_KEY is not set. " +
          "Add it to your Convex deployment env (dashboard)."
      );
    }
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = opts.model ?? "gemini-2.5-flash-latest";
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

    const functionDeclarations: FunctionDeclaration[] = (tools ?? []).map((t) => ({
      name: t.name,
      description: t.description,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parameters: t.inputSchema as any,
    }));

    const genModel = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: system,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
      },
      ...(functionDeclarations.length > 0
        ? { tools: [{ functionDeclarations }] }
        : {}),
    });

    // Convert history (all messages except the last user message) to Gemini Content[]
    const history: Content[] = [];
    const nonSystemMessages = messages.filter((m) => m.role !== "system");

    for (const m of nonSystemMessages) {
      if (m.role === "user") {
        history.push({ role: "user", parts: [{ text: m.content }] });
      } else if (m.role === "assistant") {
        if (m.toolCalls && m.toolCalls.length > 0) {
          history.push({
            role: "model",
            parts: m.toolCalls.map((tc) => ({
              functionCall: { name: tc.name, args: tc.input },
            })),
          });
        } else {
          history.push({ role: "model", parts: [{ text: m.content }] });
        }
      } else if (m.role === "tool") {
        history.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name: m.toolName ?? "unknown",
                response: { result: m.content },
              },
            },
          ],
        });
      }
    }

    // Gemini requires history to start with 'user' — strip leading model turns
    while (history.length > 0 && history[0].role === "model") {
      history.shift();
    }

    // Last message must be the most recent user turn
    const lastUserMsg = history.pop();
    const lastText =
      lastUserMsg?.parts[0] && "text" in lastUserMsg.parts[0]
        ? (lastUserMsg.parts[0].text as string)
        : "";

    const chat = genModel.startChat({ history });
    const result = await chat.sendMessage(lastText);
    const responseData = result.response;

    const latencyMs = Date.now() - start;

    const textParts: string[] = [];
    const toolCalls: ToolCall[] = [];

    for (const candidate of responseData.candidates ?? []) {
      for (const part of candidate.content.parts) {
        if ("text" in part && part.text) {
          textParts.push(part.text);
        } else if ("functionCall" in part && part.functionCall) {
          toolCalls.push({
            id: `${part.functionCall.name}-${Date.now()}`,
            name: part.functionCall.name,
            input: part.functionCall.args as Record<string, unknown>,
          });
        }
      }
    }

    const usage = responseData.usageMetadata;
    const inputTokens = usage?.promptTokenCount ?? 0;
    const outputTokens = usage?.candidatesTokenCount ?? 0;

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
