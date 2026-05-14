"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, Smile, Leaf, Carrot, Activity, Plane, Lightbulb, CheckCircle2, Flag, LayoutGrid, Plus } from "lucide-react";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  emojiStyles
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const RANDOM_EMOJIS = ["😀", "😂", "🥰", "😎", "🤔", "🌈", "🔥", "✨", "🍀", "🍎", "🚀", "🎸", "🏀", "🌍", "🎉"];

const CATEGORY_MAP = [
  { label: "Recents", icon: Clock },
  { label: "Smileys", icon: Smile },
  { label: "People", icon: Leaf },
  { label: "Nature", icon: Carrot },
  { label: "Food & Drink", icon: Activity },
  { label: "Activity", icon: Plane },
  { label: "Travel & Places", icon: Lightbulb },
  { label: "Objects", icon: CheckCircle2 },
  { label: "Symbols", icon: Flag },
];

interface EmojiPopoverProps {
  children: React.ReactNode;
  onEmojiSelect: (emoji: string) => void;
  onRemove?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EmojiPopover({
  children,
  onEmojiSelect,
  onRemove,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange
}: EmojiPopoverProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

  const [activeTab, setActiveTab] = useState<"emoji" | "icons" | "upload">("emoji");
  const [activeCategory, setActiveCategory] = useState(0);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Load recently used emojis from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentEmojis");
    if (saved) {
      try {
        setRecentEmojis(JSON.parse(saved));
      } catch { }
    }
  }, []);

  // Save recently used emojis to localStorage
  const addRecentEmoji = (emoji: string) => {
    setRecentEmojis((prev) => {
      const updated = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 24);
      localStorage.setItem("recentEmojis", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRandom = () => {
    const randomEmoji = RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)];
    onEmojiSelect(randomEmoji);
    setIsOpen(false);
  };

  const displayCategories = recentEmojis.length > 0
    ? CATEGORY_MAP
    : CATEGORY_MAP.filter(c => c.label !== "Recents");

  const scrollToCategory = (categoryIndex: number) => {
    setActiveCategory(categoryIndex);
    if (!viewportRef.current) return;

    const headers = viewportRef.current.querySelectorAll('[data-slot="emoji-picker-category-header"]');
    if (headers[categoryIndex]) {
      headers[categoryIndex].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={React.isValidElement(children) ? children : <button>{children}</button>} />
      <PopoverContent className="w-[360px] p-0 shadow-xl rounded-lg overflow-hidden flex flex-col bg-white" align="start" sideOffset={8}>

        {/* Notion-style Tabs Header */}
        <div className="flex items-center justify-between px-3 pt-3 border-b border-border bg-white">
          <div className="flex gap-4 px-1">
            <button
              className={`text-[13px] font-medium pb-1.5 -mb-[1px] border-b-[2px] transition-colors ${activeTab === 'emoji' ? 'text-foreground border-foreground' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
              onClick={() => setActiveTab("emoji")}
            >
              Emoji
            </button>
            <button
              className={`text-[13px] font-medium pb-1.5 -mb-[1px] border-b-[2px] transition-colors ${activeTab === 'icons' ? 'text-foreground border-foreground' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
              onClick={() => setActiveTab("icons")}
            >
              Icons
            </button>
            <button
              className={`text-[13px] font-medium pb-1.5 -mb-[1px] border-b-[2px] transition-colors ${activeTab === 'upload' ? 'text-foreground border-foreground' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload
            </button>
          </div>
          {onRemove && (
            <button
              onClick={() => { onRemove(); }}
              className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors pb-1.5"
            >
              Remove
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="h-[380px] w-full flex flex-col">
          {activeTab === "emoji" && (
            <EmojiPicker
              onEmojiSelect={(emoji) => {
                addRecentEmoji(emoji.emoji);
                onEmojiSelect(emoji.emoji);
                setIsOpen(false);
              }}
              className="w-full h-full border-none shadow-none rounded-none bg-transparent"
            >
              <EmojiPickerSearch onRandom={handleRandom} />
              <EmojiPickerContent ref={viewportRef} className="overflow-y-auto w-full">
                {recentEmojis.length > 0 && (
                  <div className="w-full pb-1">
                    <div
                      className="bg-popover text-muted-foreground px-3 pb-2 pt-3 text-[13px] font-medium leading-none sticky top-0 z-10"
                      data-slot="emoji-picker-category-header"
                    >
                      Recents
                    </div>
                    <div className="grid grid-cols-12 gap-0 p-[4px] px-1 w-full justify-items-center">
                      {recentEmojis.map((emoji, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            addRecentEmoji(emoji);
                            onEmojiSelect(emoji);
                            setIsOpen(false);
                          }}
                          style={{ "--emoji": `"${emoji}"` } as React.CSSProperties}
                          className={emojiStyles}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </EmojiPickerContent>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between px-3 py-[6px] border-t border-border bg-white mt-auto overflow-x-auto">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {displayCategories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => scrollToCategory(index)}
                        className={`p-1.5 rounded-md transition-colors shrink-0 ${activeCategory === index
                          ? 'bg-accent/50 text-foreground'
                          : 'hover:bg-accent hover:text-foreground'
                          }`}
                        title={category.label}
                      >
                        <IconComponent className="w-4 h-4" />
                      </button>
                    );
                  })}
                  <button className="p-[5px] hover:bg-black/10 bg-black/5 text-muted-foreground rounded-full transition-colors ml-1 shrink-0"><Plus className="w-[18px] h-[18px]" /></button>
                </div>
              </div>
            </EmojiPicker>
          )}

          {activeTab === "icons" && (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Icons coming soon...
            </div>
          )}

          {activeTab === "upload" && (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm px-8 text-center">
              Upload a custom image coming soon...
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
