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

  const handleRandom = () => {
    const randomEmoji = RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)];
    onEmojiSelect(randomEmoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={React.isValidElement(children) ? children : <button>{children}</button>} />
      <PopoverContent className="w-[320px] p-0 shadow-xl rounded-lg overflow-hidden flex flex-col" align="start">
        {onRemove && (
           <div className="flex justify-end p-2 border-b bg-zinc-50">
             <button onClick={() => { onRemove(); setIsOpen(false); }} className="text-xs text-muted-foreground hover:text-foreground">Remove</button>
           </div>
        )}
        <div className="h-[320px] bg-white w-full">
          <EmojiPicker 
            onEmojiSelect={(emoji) => {
                onEmojiSelect(emoji.emoji);
                setIsOpen(false);
            }}
            className="w-full h-full border-none shadow-none rounded-none"
          >
            <EmojiPickerSearch onRandom={handleRandom} />
            <EmojiPickerContent />
          </EmojiPicker>
        </div>
      </PopoverContent>
    </Popover>
  );
}
