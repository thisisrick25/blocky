import React from "react";
import { LuSmilePlus, LuImage, LuMessageSquare } from "react-icons/lu";
import {
    EmojiconPopover,
    RANDOM_EMOJIS,
} from "@/components/ui/emojicon-popover/EmojiconPopover";
import { DocEmojicon } from "@/components/ui/DocEmojicon";
import { DocHeaderButton } from "./DocHeaderButton";

interface DocHeaderProps {
    docTitle: string;
    setDocTitle: (title: string) => void;
    emojicon: string;
    setEmojicon: (emojicon: string) => void;
    isEmojiconPickerOpen: boolean;
    setIsEmojiconPickerOpen: (isOpen: boolean) => void;
}

export function DocHeader({
    setDocTitle,
    emojicon,
    setEmojicon,
    isEmojiconPickerOpen,
    setIsEmojiconPickerOpen,
}: DocHeaderProps) {
    const handleAddEmoji = () => {
        const randomEmoji =
            RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)];
        setEmojicon(randomEmoji);
        setIsEmojiconPickerOpen(true);
    };

    return (
        <div className="w-full max-w-[800px] mx-auto px-4 sm:px-24 pt-16 pb-4">
            {/* Action Buttons (visible on hover) */}
            <div className="flex items-center gap-4 mb-4 opacity-0 group-hover/page:opacity-100 transition-opacity duration-200">
                {!emojicon && (
                    <DocHeaderButton icon={LuSmilePlus} onClick={handleAddEmoji}>
                        Add emojicon
                    </DocHeaderButton>
                )}

                <DocHeaderButton icon={LuImage}>Add cover</DocHeaderButton>
                <DocHeaderButton icon={LuMessageSquare}>Add comment</DocHeaderButton>
            </div>

            {/* Emoji Icon */}
            {emojicon && (
                <EmojiconPopover
                    onEmojiconSelect={setEmojicon}
                    onRemove={() => setEmojicon("")}
                    isOpen={isEmojiconPickerOpen}
                    onOpenChange={setIsEmojiconPickerOpen}
                >
                    <button
                        className="size-20 flex items-center justify-center text-[78px] leading-none mb-6 hover:bg-[#efefed] rounded-lg transition-colors p-2 -ml-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#37352f]/20 text-left"
                        aria-label="Edit page icon"
                    >
                        <DocEmojicon emojicon={emojicon} />
                    </button>
                </EmojiconPopover>
            )}

            <h1
                className="text-[40px] font-bold text-[#37352f] leading-tight outline-none empty:before:content-['Untitled'] empty:before:text-[#37352f]/20 cursor-text"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setDocTitle(e.currentTarget.textContent || "")}
            >
                {/* Empty initial state lets the placeholder show, or you could seed it with "Getting Started" */}
            </h1>
        </div>
    );
}
