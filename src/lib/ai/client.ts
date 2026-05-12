import { GeminiProvider } from "./providers/gemini";
import { AIConfig, LLMProvider, Message } from "./types";

const SYSTEM_PROMPT = `You are a helpful AI assistant for a block-based editor. 
You can help the user write, explain content, and create blocks in the page.

If the user asks you to create, write, or add something to the page, you should include a JSON block in your response using this format:
[INSERT_BLOCKS]
[
  {"type": "heading", "content": "Title"},
  {"type": "paragraph", "content": "Your generated text here"}
]
[/INSERT_BLOCKS]

Available block types: heading, paragraph, bulletListItem, numberedListItem, codeBlock, image.
For codeBlock, use {"type": "codeBlock", "content": "your code"}.
Always provide helpful text before or after the JSON.`;

export class AIClient {
  private provider: LLMProvider;

  constructor(config: AIConfig) {
    switch (config.provider) {
      case "gemini":
        this.provider = new GeminiProvider(config.apiKey!, config.model);
        break;
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  async *stream(messages: Message[]) {
    // Inject system prompt
    const messagesWithSystem = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages
    ];

    const stream = await this.provider.generateStream(messagesWithSystem);
    const reader = stream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }
}
