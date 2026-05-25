"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Clock, Smile, User, Leaf, Coffee, Activity, Plane, Lightbulb, Hash, Flag, LayoutGrid, Plus, SearchIcon, Shuffle } from "lucide-react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import * as LuIcons from "react-icons/lu";
import * as PiIcons from "react-icons/pi";
import * as RiIcons from "react-icons/ri";
import emojiData from "emojibase-data/en/compact.json";
import {
  EmojiPickerRow,
  EmojiPickerCategoryHeader,
  EmojiPickerSkinTonePopup,
  EmojiPickerFooter,
  emojiStyles
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const RANDOM_EMOJIS = emojiData.map((e: any) => e.unicode);

const ICON_LIBS = {
  lu: { label: "Lucide", icons: LuIcons },
  pi: { label: "Phosphor", icons: PiIcons },
  ri: { label: "Remix", icons: RiIcons },
} as const;

type IconLibKey = keyof typeof ICON_LIBS;

const ICON_COLORS = [
  { name: "Default", color: "#54524d" },
  { name: "Light Gray", color: "#a6a299" },
  { name: "Brown", color: "#9f6b53" },
  { name: "Yellow", color: "#cb912f" },
  { name: "Orange", color: "#d9730d" },
  { name: "Green", color: "#448361" },
  { name: "Blue", color: "#337ea9" },
  { name: "Purple", color: "#9065b0" },
  { name: "Pink", color: "#c14c8a" },
  { name: "Red", color: "#d44c47" },
];

const EMOJI_CATEGORY_MAP = [
  { label: "Recents", icon: Clock, groupId: -1 },
  { label: "Smileys", icon: Smile, groupId: 0 },
  { label: "People", icon: User, groupId: 1 },
  { label: "Nature", icon: Leaf, groupId: 3 },
  { label: "Food & Drink", icon: Coffee, groupId: 4 },
  { label: "Activity", icon: Activity, groupId: 6 },
  { label: "Travel & Places", icon: Plane, groupId: 5 },
  { label: "Objects", icon: Lightbulb, groupId: 7 },
  { label: "Symbols", icon: Hash, groupId: 8 },
  { label: "Flags", icon: Flag, groupId: 9 },
];

const ICON_CATEGORY_MAP = [
  { label: "Recents", icon: Clock },
  { label: "Icons", icon: LayoutGrid },
];

interface EmojiconPopoverProps {
  children: React.ReactNode;
  onEmojiconSelect: (emojicon: string) => void;
  onRemove?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EmojiconPopover({
  children,
  onEmojiconSelect,
  onRemove,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange
}: EmojiconPopoverProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

  const [activeTab, setActiveTab] = useState<"emoji" | "icons" | "upload">("emoji");
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
  const [activeIconCategory, setActiveIconCategory] = useState(0);

  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [recentIcons, setRecentIcons] = useState<string[]>([]);

  const emojiVirtuosoRef = useRef<VirtuosoHandle>(null);
  const iconVirtuosoRef = useRef<VirtuosoHandle>(null);

  const [emojiSearch, setEmojiSearch] = useState("");
  const [iconSearch, setIconSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState(ICON_COLORS[0].color);
  const [askEveryTime, setAskEveryTime] = useState(true);

  const [currentTone, setCurrentTone] = useState<number | null>(null);
  const [hoveredEmoji, setHoveredEmoji] = useState<{ emoji: string, label: string } | null>(null);

  // --- Emoji Logic ---

  const emojiLookup = useMemo(() => {
    const map: Record<string, { label: string, skins?: any[] }> = {};
    emojiData.forEach((e: any) => {
      map[e.unicode] = { label: e.label, skins: e.skins };
      if (e.skins) {
        e.skins.forEach((v: any) => {
          map[v.unicode] = { label: e.label };
        });
      }
    });
    return map;
  }, []);

  const getEmojiWithTone = (unicode: string) => {
    if (!currentTone) return unicode;
    const info = emojiLookup[unicode];
    if (!info || !info.skins) return unicode;

    const modifier = (0x1F3FB + (currentTone - 1)).toString(16).toUpperCase();
    const variation = info.skins.find((v: any) => v.hexcode.includes(modifier));
    return variation ? variation.unicode : unicode;
  };

  const filteredEmojis = useMemo(() => {
    const searchLower = emojiSearch.toLowerCase();
    if (!searchLower) return emojiData;
    return emojiData.filter((emoji: any) =>
      emoji.label.toLowerCase().includes(searchLower) ||
      (emoji.tags && emoji.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
    );
  }, [emojiSearch]);

  const virtualizedEmojis = useMemo(() => {
    const items: any[] = [];

    // Add Recents if they exist
    if (recentEmojis.length > 0 && emojiSearch === "") {
      items.push({ type: 'header', label: 'Recents', isRecents: true });
      for (let i = 0; i < recentEmojis.length; i += 12) {
        items.push({ type: 'row', emojis: recentEmojis.slice(i, i + 12), isRecents: true });
      }
    }

    // Group filtered emojis by category
    const grouped: Record<number, any[]> = {};
    filteredEmojis.forEach((emoji: any) => {
      if (emoji.group === undefined) return;
      const group = emoji.group;
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(emoji.unicode);
    });

    // Add sections in order of EMOJI_CATEGORY_MAP
    EMOJI_CATEGORY_MAP.forEach(cat => {
      if (cat.groupId === -1) return;
      const emojis = grouped[cat.groupId];
      if (emojis && emojis.length > 0) {
        items.push({ type: 'header', label: cat.label, groupId: cat.groupId });
        for (let i = 0; i < emojis.length; i += 12) {
          items.push({ type: 'row', emojis: emojis.slice(i, i + 12) });
        }
      }
    });

    return items;
  }, [filteredEmojis, recentEmojis, emojiSearch]);

  const emojiCategoryIndices = useMemo(() => {
    const indices: number[] = [];
    virtualizedEmojis.forEach((item, index) => {
      if (item.type === 'header') {
        indices.push(index);
      }
    });
    return indices;
  }, [virtualizedEmojis]);

  const displayEmojiCategories = useMemo(() => {
    return EMOJI_CATEGORY_MAP.filter(cat => {
      if (cat.label === "Recents") return recentEmojis.length > 0 && emojiSearch === "";
      const hasEmojis = filteredEmojis.some((e: any) => e.group === cat.groupId);
      return hasEmojis;
    });
  }, [recentEmojis, emojiSearch, filteredEmojis]);

  // --- Icon Logic ---

  const allIconsByLib = useMemo(() => {
    const libs: Record<string, { prefix: IconLibKey; names: string[] }> = {};
    (Object.keys(ICON_LIBS) as IconLibKey[]).forEach(libKey => {
      const libIcons = ICON_LIBS[libKey].icons as Record<string, any>;
      libs[libKey] = {
        prefix: libKey,
        names: Object.keys(libIcons).filter(name => typeof libIcons[name] === "function")
      };
    });
    return libs;
  }, []);

  const filteredIconsByLib = useMemo(() => {
    const filtered: Record<string, string[]> = {};
    const searchLower = iconSearch.toLowerCase();

    (Object.keys(allIconsByLib) as IconLibKey[]).forEach(libKey => {
      filtered[libKey] = allIconsByLib[libKey].names.filter(name =>
        name.toLowerCase().includes(searchLower)
      );
    });
    return filtered;
  }, [allIconsByLib, iconSearch]);

  const hasAnyIcons = useMemo(() =>
    Object.values(filteredIconsByLib).some(icons => icons.length > 0),
    [filteredIconsByLib]
  );

  const virtualizedIcons = useMemo(() => {
    const items: any[] = [];

    if (recentIcons.length > 0 && iconSearch === "") {
      items.push({ type: 'header', label: 'Recents', isRecents: true });
      for (let i = 0; i < recentIcons.length; i += 12) {
        items.push({ type: 'row', icons: recentIcons.slice(i, i + 12), isRecents: true });
      }
    }

    (Object.keys(ICON_LIBS) as IconLibKey[]).forEach(libKey => {
      const icons = filteredIconsByLib[libKey];
      if (icons.length > 0) {
        items.push({ type: 'header', label: ICON_LIBS[libKey].label, libKey });
        for (let i = 0; i < icons.length; i += 12) {
          items.push({ type: 'row', icons: icons.slice(i, i + 12), libKey });
        }
      }
    });

    return items;
  }, [filteredIconsByLib, recentIcons, iconSearch]);

  const iconCategoryIndices = useMemo(() => {
    const indices: number[] = [];
    virtualizedIcons.forEach((item, index) => {
      if (item.type === 'header') {
        indices.push(index);
      }
    });
    return indices;
  }, [virtualizedIcons]);

  const displayIconCategories = useMemo(() => {
    const cats = recentIcons.length > 0 && iconSearch === "" ? [{ label: "Recents", icon: Clock }] : [];
    (Object.keys(ICON_LIBS) as IconLibKey[]).forEach(libKey => {
      if (filteredIconsByLib[libKey].length > 0) {
        cats.push({ label: ICON_LIBS[libKey].label, icon: LayoutGrid });
      }
    });
    return cats;
  }, [recentIcons, iconSearch, filteredIconsByLib]);

  // --- Shared Logic ---

  useEffect(() => {
    setActiveEmojiCategory(0);
    setActiveIconCategory(0);
  }, [activeTab]);

  useEffect(() => {
    const savedEmojis = localStorage.getItem("recentEmojis");
    if (savedEmojis) {
      try {
        const parsed = JSON.parse(savedEmojis);
        if (Array.isArray(parsed)) setRecentEmojis(parsed.slice(0, 24));
      } catch { }
    }

    const savedIcons = localStorage.getItem("recentIcons");
    if (savedIcons) {
      try {
        const parsed = JSON.parse(savedIcons);
        if (Array.isArray(parsed)) setRecentIcons(parsed.slice(0, 24));
      } catch { }
    }

    const savedColor = localStorage.getItem("selectedIconColor");
    if (savedColor) setSelectedColor(savedColor);

    const savedAsk = localStorage.getItem("askEveryTime");
    if (savedAsk) setAskEveryTime(savedAsk === "true");

    const savedTone = localStorage.getItem("selectedEmojiTone");
    if (savedTone) setCurrentTone(savedTone === "null" ? null : parseInt(savedTone));
  }, []);

  const addRecentEmoji = (emoji: string) => {
    setRecentEmojis((prev) => {
      const updated = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 24);
      localStorage.setItem("recentEmojis", JSON.stringify(updated));
      return updated;
    });
  };

  const addRecentIcon = (iconName: string, prefix: string) => {
    const fullIconName = `${prefix}:${iconName}`;
    setRecentIcons((prev) => {
      const updated = [fullIconName, ...prev.filter((i) => i !== fullIconName)].slice(0, 24);
      localStorage.setItem("recentIcons", JSON.stringify(updated));
      return updated;
    });
  };

  const handleToneSelect = (tone: number | null) => {
    setCurrentTone(tone);
    localStorage.setItem("selectedEmojiTone", String(tone));
  };

  const clearRecentEmojis = () => {
    setRecentEmojis([]);
    localStorage.removeItem("recentEmojis");
    setActiveEmojiCategory(0);
  };

  const clearRecentIcons = () => {
    setRecentIcons([]);
    localStorage.removeItem("recentIcons");
    setActiveIconCategory(0);
  };

  const handleRandomEmoji = () => {
    const randomEmoji = RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)];
    onEmojiconSelect(randomEmoji);
    setIsOpen(false);
  };

  const handleRandomIcon = () => {
    const libKeys = Object.keys(ICON_LIBS) as IconLibKey[];
    const randomLibKey = libKeys[Math.floor(Math.random() * libKeys.length)];
    const libNames = allIconsByLib[randomLibKey].names;
    const randomIconName = libNames[Math.floor(Math.random() * libNames.length)];
    addRecentIcon(randomIconName, randomLibKey);
    onEmojiconSelect(`${randomLibKey}:${randomIconName}:${selectedColor}`);
    setIsOpen(false);
  };

  const scrollToEmojiCategory = (index: number) => {
    setActiveEmojiCategory(index);
    const targetIndex = emojiCategoryIndices[index];
    if (targetIndex !== undefined) {
      emojiVirtuosoRef.current?.scrollToIndex({ index: targetIndex, align: 'start', behavior: 'smooth' });
    }
  };

  const scrollToIconCategory = (index: number) => {
    setActiveIconCategory(index);
    const targetIndex = iconCategoryIndices[index];
    if (targetIndex !== undefined) {
      iconVirtuosoRef.current?.scrollToIndex({ index: targetIndex, align: 'start', behavior: 'smooth' });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={React.isValidElement(children) ? children : <button>{children}</button>} />
      <PopoverContent className="w-[400px] p-0 shadow-xl rounded-lg overflow-hidden flex flex-col bg-white" align="start" sideOffset={8}>

        {/* Tabs Header */}
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
            <button onClick={onRemove} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors pb-1.5">
              Remove
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="h-[380px] w-full flex flex-col">
          {activeTab === "emoji" && (
            <div className="w-full h-full flex flex-col bg-transparent">
              <div className="flex h-12 items-center gap-2 px-3 pt-2 pb-2">
                <div className="relative flex-1 flex items-center">
                  <SearchIcon className="absolute left-2.5 size-4 opacity-50 text-muted-foreground" />
                  <input
                    type="text"
                    value={emojiSearch}
                    onChange={(e) => setEmojiSearch(e.target.value)}
                    className="outline-hidden placeholder:text-muted-foreground flex h-9 w-full rounded-[6px] border-[1.5px] border-[#3b82f6] bg-transparent pl-8 pr-3 text-sm focus-visible:outline-none focus:border-[#3b82f6] transition-colors"
                    placeholder="Search emojis..."
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRandomEmoji}
                  className="flex items-center justify-center size-8 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors shrink-0 border border-border"
                  title="Random Emoji"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <EmojiPickerSkinTonePopup currentTone={currentTone} onToneSelect={handleToneSelect} />
              </div>

              <div className="flex-1 min-h-0 flex flex-col relative" onMouseLeave={() => setHoveredEmoji(null)}>
                {filteredEmojis.length === 0 && emojiSearch !== "" ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No emoji found.
                  </div>
                ) : (
                  <Virtuoso
                    ref={emojiVirtuosoRef}
                    data={virtualizedEmojis}
                    className="flex-1"
                    itemContent={(index, item) => {
                      if (item.type === 'header') {
                        return (
                          <EmojiPickerCategoryHeader category={{ label: item.label }}>
                            {item.isRecents && (
                              <button onClick={clearRecentEmojis} className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-colors">
                                Clear
                              </button>
                            )}
                          </EmojiPickerCategoryHeader>
                        );
                      }

                      return (
                        <EmojiPickerRow className="flex-wrap w-full pb-2">
                          {item.emojis.map((unicode: string, idx: number) => {
                            const displayEmoji = item.isRecents ? unicode : getEmojiWithTone(unicode);
                            const info = emojiLookup[displayEmoji] || emojiLookup[unicode];

                            return (
                              <button
                                key={`${index}-${idx}`}
                                onMouseEnter={() => setHoveredEmoji({ emoji: displayEmoji, label: info?.label || "" })}
                                onClick={() => {
                                  addRecentEmoji(displayEmoji);
                                  onEmojiconSelect(displayEmoji);
                                  setIsOpen(false);
                                }}
                                style={{ "--emoji": `"${displayEmoji}"` } as React.CSSProperties}
                                className={emojiStyles}
                              >
                                {displayEmoji}
                              </button>
                            );
                          })}
                        </EmojiPickerRow>
                      );
                    }}
                  />
                )}
              </div>

              <EmojiPickerFooter hoveredEmoji={hoveredEmoji} />

              <div className="flex items-center justify-between px-3 py-[6px] border-t border-border bg-white mt-auto overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {displayEmojiCategories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => scrollToEmojiCategory(index)}
                        className={`p-1.5 rounded-md transition-colors shrink-0 ${activeEmojiCategory === index ? 'bg-accent/50 text-foreground' : 'hover:bg-accent hover:text-foreground'}`}
                        title={category.label}
                      >
                        <IconComponent className="w-4 h-4" />
                      </button>
                    );
                  })}
                  <button className="p-[5px] hover:bg-black/10 bg-black/5 text-muted-foreground rounded-full transition-colors ml-1 shrink-0"><Plus className="w-[18px] h-[18px]" /></button>
                </div>
              </div>
            </div>
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
                    className="outline-hidden placeholder:text-muted-foreground flex h-9 w-full rounded-[6px] border-[1.5px] border-[#3b82f6] bg-transparent pl-8 pr-3 text-sm focus-visible:outline-none focus:border-[#3b82f6] transition-colors"
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
                    <PopoverTrigger
                      render={
                        <button className="flex items-center justify-center size-8 hover:bg-accent rounded-md shrink-0 border border-border transition-colors" title="Change Color">
                          <div className="size-3.5 rounded-full ring-1 ring-border" style={{ backgroundColor: selectedColor }} />
                        </button>
                      }
                    />
                    <PopoverContent className="w-auto p-0.5 flex flex-col items-center gap-0.5 bg-white shadow-md border rounded-lg" sideOffset={8} align="end">
                      <div className="grid grid-cols-5 gap-0.5">
                        {ICON_COLORS.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => { setSelectedColor(c.color); localStorage.setItem("selectedIconColor", c.color); }}
                            className={`flex items-center justify-center size-8 hover:bg-accent rounded-md shrink-0 transition-colors cursor-pointer ${selectedColor === c.color ? 'bg-accent' : ''}`}
                            title={c.name}
                          >
                            <div className="size-3.5 rounded-full ring-1 ring-border" style={{ backgroundColor: c.color }} />
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between p-1 border-t border-border">
                        <span className="text-[13px] pr-2 text-[#37352f]/70 font-medium">Ask every time</span>
                        <button
                          onClick={() => { const newVal = !askEveryTime; setAskEveryTime(newVal); localStorage.setItem("askEveryTime", String(newVal)); }}
                          className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${askEveryTime ? 'bg-blue-500' : 'bg-[#efefed]'}`}
                        >
                          <div className={`absolute top-0.5 size-3 bg-white rounded-full shadow-sm transition-all ${askEveryTime ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col relative">
                {!hasAnyIcons ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No icon found.
                  </div>
                ) : (
                  <Virtuoso
                    ref={iconVirtuosoRef}
                    data={virtualizedIcons}
                    className="flex-1"
                    itemContent={(index, item) => {
                      if (item.type === 'header') {
                        return (
                          <EmojiPickerCategoryHeader category={{ label: item.label }}>
                            {item.isRecents && (
                              <button onClick={clearRecentIcons} className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-colors">
                                Clear
                              </button>
                            )}
                          </EmojiPickerCategoryHeader>
                        );
                      }

                      return (
                        <div className="grid grid-cols-12 gap-0 px-1">
                          {item.icons.map((fullIconNameOrName: string) => {
                            let prefix: IconLibKey;
                            let iconName: string;

                            if (item.isRecents) {
                              const parts = fullIconNameOrName.split(":");
                              prefix = parts.length > 1 ? parts[0] as IconLibKey : "lu";
                              iconName = parts.length > 1 ? parts[1] : parts[0];
                            } else {
                              prefix = item.libKey;
                              iconName = fullIconNameOrName;
                            }

                            const lib = ICON_LIBS[prefix] || ICON_LIBS.lu;
                            const libIcons = lib.icons as Record<string, any>;
                            const IconComponent = libIcons[iconName] as React.ComponentType<any>;
                            if (!IconComponent) return null;

                            return (
                              <button
                                key={`${prefix}:${iconName}`}
                                onClick={() => {
                                  addRecentIcon(iconName, prefix);
                                  onEmojiconSelect(`${prefix}:${iconName}:${selectedColor}`);
                                  setIsOpen(false);
                                }}
                                className="flex size-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground shrink-0"
                                title={iconName}
                              >
                                <IconComponent className="w-4.5 h-4.5 transition-colors duration-300" style={{ color: selectedColor }} />
                              </button>
                            );
                          })}
                        </div>
                      );
                    }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between px-3 py-[6px] border-t border-border bg-white mt-auto overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {displayIconCategories.map((category, index) => {
                    const isRecents = category.label === "Recents";
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => scrollToIconCategory(index)}
                        className={`rounded-md transition-colors shrink-0 font-medium ${activeIconCategory === index ? 'bg-accent/50 text-foreground' : 'hover:bg-accent hover:text-foreground'} ${isRecents ? 'p-1.5' : 'px-2 py-1 text-[11px]'}`}
                        title={category.label}
                      >
                        {isRecents ? <IconComponent className="w-4 h-4" /> : category.label}
                      </button>
                    );
                  })}
                  <button className="p-[5px] hover:bg-black/10 bg-black/5 text-muted-foreground rounded-full transition-colors ml-1 shrink-0"><Plus className="w-[18px] h-[18px]" /></button>
                </div>
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
