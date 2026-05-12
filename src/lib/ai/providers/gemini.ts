import { LLMProvider, Message } from "../types";

export class GeminiProvider implements LLMProvider {
  name = "gemini";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gemini-1.5-flash") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateStream(messages: Message[]): Promise<ReadableStream<string>> {
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Gemini API error");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(text);
                }
              } catch (e) {
                console.error("Error parsing Gemini stream", e);
              }
            }
          }
        }
        controller.close();
      },
    });
  }
}
