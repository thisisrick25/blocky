"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, Smile, Leaf, Carrot, Activity, Plane, Lightbulb, CheckCircle2, Flag, LayoutGrid, Plus, SearchIcon, Shuffle, icons } from "lucide-react";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerRow,
  EmojiPickerCategoryHeader,
  emojiStyles
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const RANDOM_EMOJIS = ["😀", "😂", "🥰", "😎", "🤔", "🌈", "🔥", "✨", "🍀", "🍎", "🚀", "🎸", "🏀", "🌍", "🎉"];

const ICON_COLORS = [
  { name: "Default", color: "#dfdfde" },
  { name: "Gray", color: "#9b9a97" },
  { name: "Brown", color: "#64473a" },
  { name: "Orange", color: "#d9730d" },
  { name: "Yellow", color: "#dfab01" },
  { name: "Green", color: "#0f7b6c" },
  { name: "Blue", color: "#0b6e99" },
  { name: "Purple", color: "#6940a5" },
  { name: "Pink", color: "#ad1a72" },
  { name: "Red", color: "#e03e3e" },
];

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
  const [recentIcons, setRecentIcons] = useState<string[]>([]);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [iconSearch, setIconSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState(ICON_COLORS[0].color);
  const [askEveryTime, setAskEveryTime] = useState(true);

  const allIconNames = Object.keys(icons);
  const filteredIcons = allIconNames.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase()));

  // Load recently used emojis and icons from localStorage
  useEffect(() => {
    const savedEmojis = localStorage.getItem("recentEmojis");
    if (savedEmojis) {
      try {
        const parsed = JSON.parse(savedEmojis);
        if (Array.isArray(parsed)) {
          setRecentEmojis(parsed.slice(0, 24));
        }
      } catch { }
    }

    const savedIcons = localStorage.getItem("recentIcons");
    if (savedIcons) {
      try {
        const parsed = JSON.parse(savedIcons);
        if (Array.isArray(parsed)) {
          setRecentIcons(parsed.slice(0, 24));
        }
      } catch { }
    }

    const savedColor = localStorage.getItem("selectedIconColor");
    if (savedColor) setSelectedColor(savedColor);

    const savedAsk = localStorage.getItem("askEveryTime");
    if (savedAsk) setAskEveryTime(savedAsk === "true");
  }, []);

  // Save recently used emojis to localStorage
  const addRecentEmoji = (emoji: string) => {
    setRecentEmojis((prev) => {
      const updated = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 24);
      localStorage.setItem("recentEmojis", JSON.stringify(updated));
      return updated;
    });
  };

  // Save recently used icons to localStorage
  const addRecentIcon = (iconName: string) => {
    setRecentIcons((prev) => {
      const updated = [iconName, ...prev.filter((i) => i !== iconName)].slice(0, 24);
      localStorage.setItem("recentIcons", JSON.stringify(updated));
      return updated;
    });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    localStorage.setItem("selectedIconColor", color);
  };

  const handleAskToggle = () => {
    const newVal = !askEveryTime;
    setAskEveryTime(newVal);
    localStorage.setItem("askEveryTime", String(newVal));
  };

  const clearRecents = () => {
    setRecentEmojis([]);
    localStorage.removeItem("recentEmojis");
    setActiveCategory(0);
  };

  const clearRecentIcons = () => {
    setRecentIcons([]);
    localStorage.removeItem("recentIcons");
  };

  const handleRandom = () => {
    const randomEmoji = RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)];
    onEmojiSelect(randomEmoji);
    setIsOpen(false);
  };

  const handleRandomIcon = () => {
    const randomIconName = allIconNames[Math.floor(Math.random() * allIconNames.length)];
    addRecentIcon(randomIconName);
    onEmojiSelect(`lucide:${randomIconName}:${selectedColor}`);
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
      <PopoverContent className="w-[400px] p-0 shadow-xl rounded-lg overflow-hidden flex flex-col bg-white" align="start" sideOffset={8}>

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
                  <div id="recents-section" className="w-full shrink-0">
                    <EmojiPickerCategoryHeader
                      category={{ label: "Recents" }}
                    >
                      <button
                        onClick={clearRecents}
                        className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-colors"
                      >
                        Clear
                      </button>
                    </EmojiPickerCategoryHeader>
                    <EmojiPickerRow className="flex-wrap w-full pb-2">
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
                    </EmojiPickerRow>
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
            <div className="w-full h-full flex flex-col bg-transparent">
              <div className="flex h-12 items-center gap-2 px-3 pt-2 pb-2">
                <div className="relative flex-1 flex items-center">
                  <SearchIcon className="absolute left-2.5 size-4 opacity-50 text-muted-foreground" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    className="outline-hidden placeholder:text-muted-foreground flex h-9 w-full rounded-[6px] border-[1.5px] border-[#3b82f6] bg-transparent pl-8 pr-3 text-sm focus-visible:outline-none focus:border-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    placeholder="Filter icons..."
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleRandomIcon}
                    className="flex items-center justify-center size-8 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors shrink-0 border border-border"
                    title="Random Icon"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>

                  <Popover>
                    <PopoverTrigger>
                      <button 
                        className="flex items-center justify-center size-8 hover:bg-accent rounded-md shrink-0 border border-border transition-colors"
                        title="Change Color"
                      >
                        <div 
                          className="size-3.5 rounded-full ring-1 ring-border" 
                          style={{ backgroundColor: selectedColor }} 
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0.5 flex flex-col items-center gap-0.5 bg-white shadow-md border rounded-lg" sideOffset={8} align="end">
                      <div className="grid grid-cols-5 gap-0.5">
                        {ICON_COLORS.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => handleColorChange(c.color)}
                            className={`flex items-center justify-center size-8 hover:bg-accent rounded-md shrink-0 transition-colors cursor-pointer ${selectedColor === c.color ? 'bg-accent' : ''}`}
                            title={c.name}
                          >
                            <div 
                              className="size-3.5 rounded-full ring-1 ring-border" 
                              style={{ backgroundColor: c.color }} 
                            />
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between p-1 border-t border-border">
                        <span className="text-[13px] text-[#37352f]/70 font-medium">Ask every time</span>
                        <button
                          onClick={handleAskToggle}
                          className={`w-8 h-4.5 rounded-full relative transition-colors cursor-pointer ${askEveryTime ? 'bg-blue-500' : 'bg-[#efefed]'}`}
                        >
                          <div className={`absolute top-0.5 size-3.5 bg-white rounded-full shadow-sm transition-all ${askEveryTime ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="overflow-y-auto w-full flex-1 pb-2">
                {filteredIcons.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No icon found.
                  </div>
                ) : (
                  <>
                    {recentIcons.length > 0 && iconSearch === "" && (
                      <div className="w-full shrink-0">
                        <EmojiPickerCategoryHeader category={{ label: "Recents" }}>
                          <button
                            onClick={clearRecentIcons}
                            className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-colors"
                          >
                            Clear
                          </button>
                        </EmojiPickerCategoryHeader>
                        <div className="grid grid-cols-12 gap-0 px-1 pb-2">
                          {recentIcons.map((iconName) => {
                            const IconComponent = icons[iconName as keyof typeof icons];
                            if (!IconComponent) return null;
                            return (
                              <button
                                key={`recent-${iconName}`}
                                onClick={() => {
                                  addRecentIcon(iconName);
                                  onEmojiSelect(`lucide:${iconName}:${selectedColor}`);
                                  setIsOpen(false);
                                }}
                                className="flex size-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground shrink-0"
                                title={iconName}
                              >
                                <IconComponent className="w-4.5 h-4.5" style={{ color: selectedColor }} />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    <EmojiPickerCategoryHeader category={{ label: "Icons" }} />
                    <div className="grid grid-cols-12 gap-0 px-1">
                      {filteredIcons.map((iconName) => {
                        const IconComponent = icons[iconName as keyof typeof icons];
                        if (!IconComponent) return null;
                        return (
                          <button
                            key={iconName}
                            onClick={() => {
                              addRecentIcon(iconName);
                              onEmojiSelect(`lucide:${iconName}:${selectedColor}`);
                              setIsOpen(false);
                            }}
                            className="flex size-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground shrink-0"
                            title={iconName}
                          >
                            <IconComponent className="w-4.5 h-4.5" style={{ color: selectedColor }} />
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
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
