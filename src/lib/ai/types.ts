export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export interface LLMProvider {
  name: string;
  generateStream(messages: Message[]): Promise<ReadableStream<string>>;
}

export type AIConfig = {
  provider: 'openai' | 'gemini' | 'ollama';
  apiKey?: string;
  baseUrl?: string;
  model: string;
};
