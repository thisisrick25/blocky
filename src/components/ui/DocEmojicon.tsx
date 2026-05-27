import React from "react";
import * as LuIcons from "react-icons/lu";
import * as PiIcons from "react-icons/pi";
import * as RiIcons from "react-icons/ri";
import { cn } from "@/lib/utils";

const ICON_LIBRARIES: Record<string, any> = {
  lu: LuIcons,
  pi: PiIcons,
  ri: RiIcons,
};

interface DocEmojiconProps {
  emojicon: string;
  className?: string;
}

export function DocEmojicon({ emojicon, className }: DocEmojiconProps) {
  if (!emojicon) return null;

  const parts = emojicon.split(":");
  if (parts.length >= 2) {
    const prefix = parts[0];
    const iconName = parts[1];
    const color = parts[2]; // May be undefined

    const library = ICON_LIBRARIES[prefix];
    if (library) {
      const IconComponent = library[iconName];
      if (IconComponent) {
        return (
          <IconComponent
            className={cn("w-full h-full transition-colors duration-300", className)}
            style={color ? { color } : undefined}
          />
        );
      }
    }

    return <LuIcons.LuFileText className={cn("w-full h-full", className)} />;
  }

  // Treat as emoji
  return <span className={className}>{emojicon}</span>;
}
