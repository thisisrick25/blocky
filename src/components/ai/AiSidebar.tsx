"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Sparkles, Send, Bot, Settings2, X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useAi } from "@/hooks/useAi";
import { AIConfig } from "@/lib/ai/types";

interface AiSidebarProps {
  initialContext?: string | null;
  onContextClear?: () => void;
  onInsertBlocks?: (blocks: any[]) => void;
}

export function AiSidebar({ initialContext, onContextClear, onInsertBlocks }: AiSidebarProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isGenerating } = useAi();
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    if (initialContext) {
      setInput(`Explain this block: ${initialContext}`);
    }
  }, [initialContext]);

  const handleSaveKey = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    setShowSettings(false);
  };

  const handleSend = () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    const config: AIConfig = {
      provider: 'gemini',
      apiKey: apiKey,
      model: 'gemini-1.5-flash'
    };
    sendMessage(input, config);
    setInput("");
    if (onContextClear) onContextClear();
  };

  const parseAndInsert = (content: string) => {
    if (!onInsertBlocks) return;

    const match = content.match(/\[INSERT_BLOCKS\]([\s\S]*?)\[\/INSERT_BLOCKS\]/);
    if (match && match[1]) {
      try {
        const blocks = JSON.parse(match[1]);
        onInsertBlocks(blocks);
      } catch (e) {
        console.error("Failed to parse AI blocks", e);
      }
    }
  };

  return (
    <Sidebar side="right" variant="sidebar" className="border-l border-[#f1f1ef] bg-[#fbfbfa]">
      <SidebarHeader className="p-4 flex flex-row items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="font-medium text-sm text-[#37352f]">Ask AI</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#efefed]" onClick={() => setShowSettings(!showSettings)}>
            <Settings2 className="w-4 h-4 text-[#37352f]/60" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full overflow-hidden bg-[#fbfbfa]">
        {showSettings ? (
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#37352f]">Settings</h3>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#37352f]/40 tracking-wider">Gemini API Key</label>
                <Input
                  type="password"
                  placeholder="Paste your key here..."
                  className="bg-white border-[#f1f1ef] focus:border-purple-300 transition-all text-sm rounded-[4px]"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full bg-[#2383e2] hover:bg-[#1a65b0] text-white shadow-none rounded-[4px] h-8 text-sm font-medium" onClick={handleSaveKey}>
              Save
            </Button>
            <div className="p-3 bg-[#f1f1ef]/50 rounded-[4px]">
              <p className="text-[11px] leading-relaxed text-[#37352f]/60">
                Your API key is never sent to our servers. It is used directly to call Google's Generative AI API from your device.
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {messages.map((msg, i) => {
                  const hasBlocks = msg.content.includes("[INSERT_BLOCKS]");
                  const cleanContent = msg.content.replace(/\[INSERT_BLOCKS\][\s\S]*?\[\/INSERT_BLOCKS\]/g, "");

                  return (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-[3px] flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-[#fbfbfa] text-[#37352f]/80' : 'bg-[#e1e1e1] text-[#37352f]'}`}>
                        {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5" /> : <div className="text-[10px] font-bold">ME</div>}
                      </div>
                      <div className="flex flex-col gap-1 max-w-[85%] mt-0.5">
                        <div className={`text-[14px] leading-relaxed ${msg.role === 'assistant' ? 'text-[#37352f]' : 'text-[#37352f]'}`}>
                          {cleanContent || (isGenerating && i === messages.length - 1 ? <div className="flex gap-1.5 py-1 animate-pulse"><div className="w-1.5 h-1.5 bg-[#37352f]/40 rounded-full"></div><div className="w-1.5 h-1.5 bg-[#37352f]/40 rounded-full"></div><div className="w-1.5 h-1.5 bg-[#37352f]/40 rounded-full"></div></div> : '')}
                        </div>
                        {hasBlocks && !isGenerating && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-fit flex items-center gap-2 bg-[#f1f1ef] text-[#37352f] hover:bg-[#efefed] rounded-[4px] h-7 text-xs shadow-none border-none mt-1"
                            onClick={() => parseAndInsert(msg.content)}
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            Insert into Page
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="p-3 bg-[#fbfbfa] border-t border-[#f1f1ef] space-y-2 z-10 relative">
              {initialContext && (
                <div className="flex items-center justify-between p-2 bg-[#f1f1ef] rounded-[4px] border border-[#e1e1e1] text-[11px] text-[#37352f]/60">
                  <span className="truncate flex-1 font-medium">Context: Block data attached</span>
                  <Button variant="ghost" size="icon" className="h-4 w-4 hover:bg-[#e1e1e1]" onClick={onContextClear}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2 bg-white p-1 rounded-[4px] border border-[#e1e1e1] focus-within:border-[#2383e2] shadow-sm transition-all">
                <Input
                  placeholder="Ask AI..."
                  className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-[13px] h-7 px-2"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isGenerating}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  className={`shrink-0 rounded-[3px] h-7 w-7 shadow-none transition-all ${input.trim() ? 'bg-[#2383e2] hover:bg-[#1a65b0] text-white scale-100 opacity-100' : 'bg-[#f1f1ef] text-[#37352f]/30 hover:bg-[#f1f1ef]'}`}
                  disabled={isGenerating || !input.trim()}
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
