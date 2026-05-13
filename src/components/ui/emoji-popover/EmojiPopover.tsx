"use client";

import React, { useState } from "react";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const RANDOM_EMOJIS = ["😀", "😂", "🥰", "😎", "🤔", "🌈", "🔥", "✨", "🍀", "🍎", "🚀", "🎸", "🏀", "🌍", "🎉"];

interface EmojiPopoverProps {
  children: React.ReactNode;
  onEmojiSelect: (emoji: string) => void;
  onRemove?: () => void;
}

export function EmojiPopover({
  children,
  onEmojiSelect,
  onRemove
}: EmojiPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"emoji" | "icons" | "upload">("emoji");

  const handleRandom = () => {
    const randomEmoji = RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)];
    onEmojiSelect(randomEmoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={React.isValidElement(children) ? children : <button>{children}</button>} />
      <PopoverContent className="w-[460px] p-0 shadow-xl rounded-lg overflow-hidden flex flex-col bg-white" align="start" sideOffset={8}>

        {/* Notion-style Tabs Header */}
        <div className="flex items-center justify-between px-4 pt-3 border-b border-border">
          <div className="flex gap-4">
            <button
              className={`text-sm font-medium pb-2 -mb-[1px] border-b-2 transition-colors ${activeTab === 'emoji' ? 'text-foreground border-foreground' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
              onClick={() => setActiveTab("emoji")}
            >
              Emoji
            </button>
            <button
              className={`text-sm font-medium pb-2 -mb-[1px] border-b-2 transition-colors ${activeTab === 'icons' ? 'text-foreground border-foreground' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
              onClick={() => setActiveTab("icons")}
            >
              Icons
            </button>
            <button
              className={`text-sm font-medium pb-2 -mb-[1px] border-b-2 transition-colors ${activeTab === 'upload' ? 'text-foreground border-foreground' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload
            </button>
          </div>
          {onRemove && (
            <button
              onClick={() => { onRemove(); setIsOpen(false); }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-2"
            >
              Remove
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="h-[380px] w-full">
            {activeTab === "emoji" && (
                <EmojiPicker 
                    onEmojiSelect={(emoji) => {
                        onEmojiSelect(emoji.emoji);
                        setIsOpen(false);
                    }}
                    className="w-full h-full border-none shadow-none rounded-none bg-transparent"
                >
                    <EmojiPickerSearch onRandom={handleRandom} />
                    <EmojiPickerContent className="overflow-y-auto" />
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
