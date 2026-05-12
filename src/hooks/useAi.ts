"use client";

import { useState, useCallback } from "react";
import { Message, AIConfig } from "@/lib/ai/types";
import { AIClient } from "@/lib/ai/client";

export function useAi() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const sendMessage = useCallback(async (content: string, config: AIConfig) => {
    if (!content.trim() || isGenerating) return;

    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsGenerating(true);

    try {
      const client = new AIClient(config);
      const assistantMessage: Message = { role: 'assistant', content: '' };
      setMessages([...newMessages, assistantMessage]);

      let accumulatedContent = '';
      for await (const chunk of client.stream(newMessages)) {
        accumulatedContent += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...assistantMessage, content: accumulatedContent };
          return updated;
        });
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: " + (error instanceof Error ? error.message : "Something went wrong") }]);
    } finally {
      setIsGenerating(false);
    }
  }, [messages, isGenerating]);

  return { messages, sendMessage, isGenerating };
}
