"use client";

import {
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
  EmojiPicker as EmojiPickerPrimitive,
  useSkinTone,
} from "frimousse";
import { LoaderIcon, SearchIcon, Shuffle, Hand } from "lucide-react";
import type * as React from "react";
import { forwardRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

function EmojiPickerSkinTonePopup({ emoji = "✋", className, ...props }: React.ComponentProps<"button"> & { emoji?: string }) {
  const [open, setOpen] = useState(false);
  const [skinTone, setSkinTone, variations] = useSkinTone(emoji);

  const selectedEmoji = variations.find(v => v.skinTone === skinTone)?.emoji || emoji;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        style={{ "--emoji": `"${selectedEmoji}"` } as React.CSSProperties}
        className={cn(
          "relative flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md text-lg transition-colors shrink-0 border border-border cursor-pointer hover:bg-accent/60",
          "before:absolute before:inset-0 before:-z-10 before:hidden before:items-center before:justify-center before:text-[2.5em] before:blur-lg before:saturate-200 before:content-(--emoji) hover:before:flex",
          className
        )}
        title="Skin Tone"
        {...props}
      >
        {selectedEmoji}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1 flex flex-row gap-0.5 items-center rounded-md bg-popover shadow-md border" sideOffset={8} align="end">
        {variations.map((variation) => (
          <button
            key={variation.skinTone}
            onClick={() => {
              setSkinTone(variation.skinTone);
              setOpen(false);
            }}
            style={{ "--emoji": `"${variation.emoji}"` } as React.CSSProperties}
            className={cn(
              "relative flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md text-lg transition-colors hover:bg-accent/60",
              "before:absolute before:inset-0 before:-z-10 before:hidden before:items-center before:justify-center before:text-[2.5em] before:blur-lg before:saturate-200 before:content-(--emoji) hover:before:flex cursor-pointer",
              skinTone === variation.skinTone && "bg-muted/80 text-foreground before:flex"
            )}
            title={variation.skinTone}
          >
            {variation.emoji}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function EmojiPicker({
  className,
  columns = 12,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  return (
    <EmojiPickerPrimitive.Root
      columns={columns}
      className={cn(
        "bg-popover text-popover-foreground isolate flex h-full w-fit flex-col overflow-hidden rounded-md",
        className
      )}
      data-slot="emoji-picker"
      {...props}
    />
  );
}

function EmojiPickerSearch({
  className,
  onRandom,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Search> & { onRandom?: () => void }) {
  return (
    <div
      className={cn("flex h-12 items-center gap-2 px-3 pt-2 pb-2", className)}
      data-slot="emoji-picker-search-wrapper"
    >
      <div className="relative flex-1 flex items-center">
        <SearchIcon className="absolute left-2.5 size-4 opacity-50 text-muted-foreground" />
        <EmojiPickerPrimitive.Search
          className="outline-hidden placeholder:text-muted-foreground flex h-9 w-full rounded-[6px] border-[1.5px] border-[#3b82f6] bg-transparent pl-8 pr-3 text-sm focus-visible:outline-none focus:border-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          data-slot="emoji-picker-search"
          placeholder="Filter..."
          autoFocus
          {...props}
        />
      </div>
      {onRandom && (
        <button
          type="button"
          onClick={onRandom}
          className="flex items-center justify-center size-8 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors shrink-0 border border-border"
          title="Random Emoji"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      )}
      <EmojiPickerSkinTonePopup emoji="✋" />
    </div>
  );
}

function EmojiPickerRow({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div {...props} className="group scroll-my-1 px-1" data-slot="emoji-picker-row">
      {children}
    </div>
  );
}

function EmojiPickerEmoji({
  emoji,
  className,
  ...props
}: EmojiPickerListEmojiProps) {
  return (
    <button
      {...props}
      style={{ "--emoji": `"${emoji.emoji}"` } as React.CSSProperties}
      className={cn(
        "relative flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md text-lg transition-colors disabled:opacity-50 hover:bg-accent/60 data-[active]:text-foreground",
        "data-[active]:bg-muted/80 before:absolute before:inset-0 before:-z-10 before:hidden before:items-center before:justify-center before:text-[2.5em] before:blur-lg before:saturate-200 before:content-(--emoji) data-[active]:before:flex",
        className
      )}
      data-slot="emoji-picker-emoji"
    >
      {emoji.emoji}
    </button>
  );
}

function EmojiPickerCategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...props}
      className="bg-popover text-muted-foreground px-3 pb-2 pt-3 text-[13px] font-medium leading-none sticky top-0 z-10"
      data-slot="emoji-picker-category-header"
    >
      {category.label}
    </div>
  );
}

function EmojiPickerContent(
  { className, children, ...props }: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <EmojiPickerPrimitive.Viewport
      ref={ref}
      className={cn("outline-hidden relative flex-1 overflow-y-auto", className)}
      data-slot="emoji-picker-viewport"
      {...props}
    >
      <EmojiPickerPrimitive.Loading
        className="absolute inset-0 flex items-center justify-center text-muted-foreground"
        data-slot="emoji-picker-loading"
      >
        <LoaderIcon className="size-4 animate-spin" />
      </EmojiPickerPrimitive.Loading>
      <EmojiPickerPrimitive.Empty
        className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm"
        data-slot="emoji-picker-empty"
      >
        No emoji found.
      </EmojiPickerPrimitive.Empty>
      {children}
      <EmojiPickerPrimitive.List
        className="select-none pb-1"
        components={{
          Row: EmojiPickerRow,
          Emoji: EmojiPickerEmoji,
          CategoryHeader: EmojiPickerCategoryHeader,
        }}
        data-slot="emoji-picker-list"
      />
    </EmojiPickerPrimitive.Viewport>
  );
}

const EmojiPickerContentForwarded = forwardRef(EmojiPickerContent);

function EmojiPickerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-(--frimousse-viewport-width) flex w-full min-w-0 items-center gap-1 border-t p-2",
        className
      )}
      data-slot="emoji-picker-footer"
      {...props}
    >
      <EmojiPickerPrimitive.ActiveEmoji>
        {({ emoji }) =>
          emoji ? (
            <>
              <div className="flex size-7 flex-none items-center justify-center text-lg">
                {emoji.emoji}
              </div>
              <span className="text-secondary-foreground truncate text-xs">
                {emoji.label}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground ml-1.5 flex h-7 items-center truncate text-xs">
              Select an emoji…
            </span>
          )
        }
      </EmojiPickerPrimitive.ActiveEmoji>
    </div>
  );
}

export {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContentForwarded as EmojiPickerContent,
  EmojiPickerFooter,
};