"use client";

import React, { useState } from "react";
import EmojiPicker, { Theme, EmojiStyle, Categories } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

interface IconPickerProps {
    icon?: string;
    onChange: (icon: string) => void;
    onRemove?: () => void;
    children: React.ReactNode;
}

export function IconPicker({ icon, onChange, onRemove, children }: IconPickerProps) {
    const [activeTab, setActiveTab] = useState<"emoji" | "icons" | "upload">("emoji");
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger render={<div className="inline-block cursor-pointer" />}>
                {children}
            </PopoverTrigger>
            <PopoverContent
                className="w-[320px] p-0 bg-[#252525] border-[#3f3f3f] shadow-xl rounded-lg overflow-hidden flex flex-col"
                align="start"
            >
                {/* Custom Notion-like Tabs Header */}
                <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-[#3f3f3f]">
                    <div className="flex gap-4">
                        <button
                            className={`text-sm font-medium pb-2 -mb-2 border-b-2 transition-colors ${activeTab === 'emoji' ? 'text-white border-white' : 'text-[#a0a0a0] border-transparent hover:text-white'}`}
                            onClick={() => setActiveTab("emoji")}
                        >
                            Emoji
                        </button>
                        <button
                            className={`text-sm font-medium pb-2 -mb-2 border-b-2 transition-colors ${activeTab === 'icons' ? 'text-white border-white' : 'text-[#a0a0a0] border-transparent hover:text-white'}`}
                            onClick={() => setActiveTab("icons")}
                        >
                            Icons
                        </button>
                        <button
                            className={`text-sm font-medium pb-2 -mb-2 border-b-2 transition-colors ${activeTab === 'upload' ? 'text-white border-white' : 'text-[#a0a0a0] border-transparent hover:text-white'}`}
                            onClick={() => setActiveTab("upload")}
                        >
                            Upload
                        </button>
                    </div>
                    <button
                        onClick={onRemove}
                        className="text-sm text-[#a0a0a0] hover:text-white transition-colors"
                    >
                        Remove
                    </button>
                </div>

                {/* Picker Content */}
                <div className="bg-[#252525] w-full notion-emoji-wrapper">
                    {activeTab === "emoji" && (
                        <EmojiPicker
                            onEmojiClick={(emojiData) => {
                                onChange(emojiData.emoji);
                                setIsOpen(false);
                            }}
                            theme={Theme.DARK}
                            emojiStyle={EmojiStyle.APPLE}
                            lazyLoadEmojis={true}
                            searchPlaceHolder="Filter..."
                            width="100%"
                            height={400}
                            previewConfig={{
                                showPreview: false
                            }}
                            skinTonesDisabled
                        />
                    )}

                    {activeTab === "icons" && (
                        <div className="h-[400px] flex items-center justify-center text-[#a0a0a0] text-sm">
                            Icons coming soon...
                        </div>
                    )}

                    {activeTab === "upload" && (
                        <div className="h-[400px] flex items-center justify-center text-[#a0a0a0] text-sm px-8 text-center">
                            Upload a custom image coming soon...
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
