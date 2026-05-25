"use client";

import type * as React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export const emojiStyles = cn(
  "isolate relative flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-md text-lg transition-colors hover:text-foreground data-[active]:text-foreground cursor-pointer disabled:opacity-50",
  "before:absolute before:inset-0 before:-z-10 before:hidden before:items-center before:justify-center before:text-[2.5em] before:blur-lg before:saturate-200 before:content-(--emoji) data-[active]:before:flex hover:before:flex"
);

export const SKIN_TONES = [
  { label: "Default", emoji: "✋" },
  { label: "Light", emoji: "✋🏻", tone: 1 },
  { label: "Medium-Light", emoji: "✋🏼", tone: 2 },
  { label: "Medium", emoji: "✋🏽", tone: 3 },
  { label: "Medium-Dark", emoji: "✋🏾", tone: 4 },
  { label: "Dark", emoji: "✋🏿", tone: 5 },
];

export interface EmojiPickerSkinTonePopupProps {
  currentTone: number | null;
  onToneSelect: (tone: number | null) => void;
}

export function EmojiPickerSkinTonePopup({
  currentTone,
  onToneSelect
}: EmojiPickerSkinTonePopupProps) {
  const [open, setOpen] = useState(false);
  const currentEmoji = SKIN_TONES.find(s => s.tone === (currentTone || undefined))?.emoji || "✋";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        style={{ "--emoji": `"${currentEmoji}"` } as React.CSSProperties}
        className={cn(emojiStyles)}
        title="Skin Tone"
      >
        {currentEmoji}
      </PopoverTrigger>
      <PopoverContent className="bg-popover flex flex-row w-auto items-center gap-0.5 rounded-lg border p-0.5 shadow-md bg-white" sideOffset={8} align="end">
        {SKIN_TONES.map((s) => (
          <button
            key={s.label}
            onClick={() => {
              onToneSelect(s.tone || null);
              setOpen(false);
            }}
            data-active={currentTone === (s.tone || null) ? "" : undefined}
            style={{ "--emoji": `"${s.emoji}"` } as React.CSSProperties}
            className={emojiStyles}
            title={s.label}
          >
            {s.emoji}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export interface EmojiPickerRowProps extends React.ComponentProps<"div"> { }

export function EmojiPickerRow({ children, className, ...props }: EmojiPickerRowProps) {
  return (
    <div
      {...props}
      className={cn("group flex flex-row scroll-my-1 px-1", className)}
      data-slot="emoji-picker-row"
    >
      {children}
    </div>
  );
}

export interface EmojiPickerCategoryHeaderProps extends React.ComponentProps<"div"> {
  category: { label: string };
}

export function EmojiPickerCategoryHeader({
  category,
  className,
  children,
  ...props
}: EmojiPickerCategoryHeaderProps) {
  return (
    <div
      {...props}
      className={cn(
        "bg-white text-muted-foreground px-3 pb-2 pt-3 text-[13px] font-medium leading-none sticky top-0 z-10 flex items-center justify-between",
        className
      )}
      data-slot="emoji-picker-category-header"
    >
      <span>{category.label}</span>
      {children}
    </div>
  );
}

export interface EmojiPickerFooterProps extends React.ComponentProps<"div"> {
  hoveredEmoji: { emoji: string; label: string } | null;
}

export function EmojiPickerFooter({
  hoveredEmoji,
  className,
  ...props
}: EmojiPickerFooterProps) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 items-center gap-1 border-t p-2 bg-white",
        className
      )}
      data-slot="emoji-picker-footer"
      {...props}
    >
      {hoveredEmoji ? (
        <>
          <div className="flex size-7 flex-none items-center justify-center text-lg">
            {hoveredEmoji.emoji}
          </div>
          <span className="text-secondary-foreground truncate text-xs font-medium">
            {hoveredEmoji.label}
          </span>
        </>
      ) : (
        <span className="text-muted-foreground ml-1.5 flex h-7 items-center truncate text-xs font-medium">
          Select an emoji…
        </span>
      )}
    </div>
  );
}
