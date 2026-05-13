"use client";

import {
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
  EmojiPicker as EmojiPickerPrimitive,
} from "frimousse";
import { LoaderIcon, SearchIcon, Shuffle, Hand } from "lucide-react";
import type * as React from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

function EmojiPicker({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  return (
    <EmojiPickerPrimitive.Root
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
      <button
        type="button"
        className="flex items-center justify-center size-8 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors shrink-0 border-none"
        title="Skin Tone"
      >
        <span className="text-base leading-none">✋</span>
      </button>
    </div>
  );
}

function EmojiPickerRow({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div {...props} className="scroll-my-1 px-1" data-slot="emoji-picker-row">
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
      className={cn(
        "data-[active]:bg-accent flex size-8 hover:bg-accent items-center justify-center rounded-[6px] text-xl disabled:opacity-50",
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